import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPortfolio } from '../lib/portfolio-resolve.mjs';

/** A small synthetic portfolio. Deliberately not the real content: these tests pin
 *  resolution behaviour, not the current state of Airtable. Only forward links are
 *  stored — everything on a theme or country, and an initiative's tools, is derived. */
const fixture = () => ({
    themes: [
        { slug: 'climate', name: 'Climate' },
        { slug: 'empty-theme', name: 'Empty' },
    ],
    countries: [
        { slug: 'aa', name: 'Aaland' },
        { slug: 'zz', name: 'Zedland' },
        { slug: 'nowhere', name: 'Nothing Live Here' },
    ],
    projects: [{ slug: 'p1', name: 'Project One', themeSlugs: ['climate'], countrySlugs: ['aa'] }],
    products: [
        { slug: 'api', name: 'API', type: 'API', themeSlugs: ['climate'], countrySlugs: ['aa'], projectSlugs: ['p1'] },
        { slug: 'pipe', name: 'Pipeline', type: 'Data Pipeline', themeSlugs: ['climate'], countrySlugs: ['aa'], projectSlugs: ['p1'] },
        { slug: 'app', name: 'App', type: 'Application', themeSlugs: ['climate'], countrySlugs: ['zz'], projectSlugs: [] },
        { slug: 'lonely', name: 'Lonely', type: 'Model', themeSlugs: [], countrySlugs: [], projectSlugs: [] },
    ],
    outcomes: [
        { id: 'o1', claim: 'Something changed', themeSlugs: ['climate'], countrySlugs: ['aa'], productSlugs: ['api'], projectSlugs: ['p1'] },
    ],
    team: [],
    relationships: [
        { from: 'pipe', type: 'feeds into', to: 'api' },
        { from: 'api', type: 'enables', to: 'app' },
    ],
});

const P = () => buildPortfolio(fixture());
const slugs = (list) => list.map((item) => item.slug);

test('a missing slug resolves to null, not a crash', () => {
    const p = P();
    for (const fn of ['getProduct', 'getProject', 'getCountry', 'getTheme']) {
        assert.equal(p[fn]('nope'), null, `${fn} should return null`);
    }
});

test('an entity keeps its own fields and gains its resolved neighbours', () => {
    const product = P().getProduct('api');
    assert.equal(product.name, 'API');
    assert.equal(product.type, 'API');
    assert.deepEqual(slugs(product.themes), ['climate']);
    assert.deepEqual(slugs(product.countries), ['aa']);
    assert.deepEqual(slugs(product.projects), ['p1']);
});

test('scalar fields the resolver has never heard of pass straight through', () => {
    // The flexibility guarantee: a new Airtable column needs no change here once the
    // sync writes it. Only new *link* relations need a line in LINKS.
    const data = fixture();
    data.products[0].somethingBrandNew = { nested: ['value'] };
    const product = buildPortfolio(data).getProduct('api');
    assert.deepEqual(product.somethingBrandNew, { nested: ['value'] });
});

test('a link to a slug that does not exist is dropped, not rendered as a hole', () => {
    const data = fixture();
    data.products[0].themeSlugs = ['climate', 'ghost'];
    const product = buildPortfolio(data).getProduct('api');
    assert.deepEqual(slugs(product.themes), ['climate']);
});

test('reverse links are derived from the forward ones, in collection order', () => {
    const p = P();
    // Nothing stores "the tools of p1" or "the tools in climate" — both are read off the tools.
    assert.deepEqual(slugs(p.getProject('p1').products), ['api', 'pipe']);
    const theme = p.getTheme('climate');
    assert.deepEqual(slugs(theme.products), ['api', 'pipe', 'app']);
    assert.deepEqual(slugs(theme.projects), ['p1']);
    assert.deepEqual(slugs(theme.countries), ['aa', 'zz']);
    const country = p.getCountry('aa');
    assert.deepEqual(slugs(country.products), ['api', 'pipe']);
    assert.deepEqual(slugs(country.projects), ['p1']);
    assert.deepEqual(slugs(country.themes), ['climate']);
});

test('an impact area with nothing tagged is still there, and empty', () => {
    const p = P();
    assert.deepEqual(slugs(p.getThemes()), ['climate', 'empty-theme']);
    const theme = p.getTheme('empty-theme');
    assert.deepEqual(theme.projects, []);
    assert.deepEqual(theme.products, []);
    assert.deepEqual(theme.countries, []);
});

test('a country exists only while something Live is tagged to it', () => {
    const p = P();
    assert.deepEqual(slugs(p.getCountries()), ['aa', 'zz']);
    assert.equal(p.getCountry('nowhere'), null);
});

test('an outcome alone is enough to give a country a page', () => {
    const data = fixture();
    data.outcomes.push({ id: 'o2', claim: 'Elsewhere', countrySlugs: ['nowhere'] });
    const p = buildPortfolio(data);
    assert.deepEqual(slugs(p.getCountries()), ['aa', 'zz', 'nowhere']);
    assert.deepEqual(p.getCountry('nowhere').outcomes.map((o) => o.id), ['o2']);
});

test('outcomes reach every entity they name, and no other', () => {
    const p = P();
    const ids = (entity) => entity.outcomes.map((o) => o.id);
    assert.deepEqual(ids(p.getProduct('api')), ['o1']);
    assert.deepEqual(ids(p.getProject('p1')), ['o1']);
    assert.deepEqual(ids(p.getCountry('aa')), ['o1']);
    assert.deepEqual(ids(p.getTheme('climate')), ['o1']);
    assert.deepEqual(ids(p.getProduct('pipe')), []);
    assert.deepEqual(ids(p.getCountry('zz')), []);
});

test('a neighbour arrives with neighbours of its own, so no caller walks a slug array', () => {
    const p = P();
    // The tools on an initiative's page say where they run; the tool on a country's page
    // says which areas it serves.
    assert.deepEqual(p.getProject('p1').products.map((x) => slugs(x.countries)), [['aa'], ['aa']]);
    assert.deepEqual(slugs(p.getTheme('climate').products[2].countries), ['zz']);
    assert.deepEqual(slugs(p.getCountry('aa').products[0].themes), ['climate']);
});

test('an outcome arrives with its countries', () => {
    const data = fixture();
    data.outcomes[0].countrySlugs = ['aa', 'ghost'];
    const p = buildPortfolio(data);
    assert.deepEqual(slugs(p.getProduct('api').outcomes[0].countries), ['aa']);
    assert.deepEqual(slugs(p.getOutcomes()[0].countries), ['aa']);
});

test('the collections an index page lists carry the same neighbours', () => {
    const p = P();
    assert.deepEqual(p.getProducts().map((x) => slugs(x.themes)), [['climate'], ['climate'], ['climate'], []]);
    assert.deepEqual(p.getCountries().map((x) => slugs(x.themes)), [['climate'], ['climate']]);
    assert.deepEqual(slugs(p.getProjects()[0].products), ['api', 'pipe']);
});

test('the graph reaches the whole connected component, not just direct neighbours', () => {
    // pipe → api → app: from pipe, app is two hops away and must still appear.
    const graph = P().getProduct('pipe').graph;
    assert.equal(graph.focus, 'pipe');
    assert.deepEqual(new Set(slugs(graph.nodes)), new Set(['pipe', 'api', 'app']));
    assert.equal(graph.edges.length, 2);
});

test('graph nodes carry what the diagram needs, including the initiative they sit in', () => {
    const graph = P().getProduct('api').graph;
    assert.deepEqual(
        graph.nodes.find((n) => n.slug === 'api'),
        {
            slug: 'api',
            name: 'API',
            type: 'API',
            initiative: { slug: 'p1', name: 'Project One' },
            countrySlugs: ['aa'],
        }
    );
    assert.equal(graph.nodes.find((n) => n.slug === 'app').initiative, null);
});

test('a product with no relationships has no graph', () => {
    assert.equal(P().getProduct('lonely').graph, null);
});

test('edges outside the component are excluded', () => {
    const data = fixture();
    data.products.push({ slug: 'x', name: 'X', themeSlugs: [], countrySlugs: [], projectSlugs: [] });
    data.products.push({ slug: 'y', name: 'Y', themeSlugs: [], countrySlugs: [], projectSlugs: [] });
    data.relationships.push({ from: 'x', type: 'enables', to: 'y' });
    const graph = buildPortfolio(data).getProduct('api').graph;
    assert.deepEqual(new Set(slugs(graph.nodes)), new Set(['pipe', 'api', 'app']));
    assert.ok(!graph.edges.some((e) => e.from === 'x' || e.to === 'y'));
});

test('an entirely empty dataset resolves to null rather than throwing', () => {
    const p = buildPortfolio({});
    assert.equal(p.getProduct('api'), null);
    assert.deepEqual(p.getProducts(), []);
    assert.deepEqual(p.getThemes(), []);
    assert.deepEqual(p.getCountries(), []);
    assert.deepEqual(p.getOutcomes(), []);
});
