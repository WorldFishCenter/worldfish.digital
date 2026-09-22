import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPortfolio } from '../lib/portfolio-resolve.mjs';

/** A small synthetic portfolio. Deliberately not the real content: these tests pin
 *  resolution behaviour, not the current state of Airtable. */
const fixture = () => ({
    themes: [
        {
            slug: 'climate',
            name: 'Climate',
            projectSlugs: ['p1'],
            productSlugs: ['api', 'pipe', 'app'],
            countrySlugs: ['zz', 'aa'],
            personaSlugs: [],
            donorSlugs: ['d2', 'd1'],
            featuredProductSlugs: ['app', 'api'],
        },
        { slug: 'empty-theme', name: 'Empty' },
    ],
    projects: [
        {
            slug: 'p1',
            name: 'Project One',
            themeSlugs: ['climate'],
            countrySlugs: ['aa'],
            leadProductSlugs: ['pipe', 'api'],
            donorSlugs: ['d1'],
            initiative: 'eco',
        },
    ],
    products: [
        { slug: 'api', name: 'API', type: 'API', themeSlugs: ['climate'], countrySlugs: ['aa'], projectSlugs: ['p1'], initiative: 'eco' },
        { slug: 'pipe', name: 'Pipeline', type: 'Data Pipeline', themeSlugs: ['climate'], countrySlugs: ['aa'], projectSlugs: ['p1'] },
        { slug: 'app', name: 'App', type: 'Application', themeSlugs: ['climate'], countrySlugs: ['zz'], projectSlugs: [] },
        { slug: 'lonely', name: 'Lonely', type: 'Model', themeSlugs: [], countrySlugs: [], projectSlugs: [] },
    ],
    countries: [
        { slug: 'aa', name: 'Aaland', themeSlugs: ['climate'], productSlugs: ['api', 'pipe'], projectSlugs: ['p1'] },
        { slug: 'zz', name: 'Zedland', themeSlugs: ['climate'], productSlugs: ['app'], projectSlugs: [] },
    ],
    donors: [
        { slug: 'd1', name: 'Donor One' },
        { slug: 'd2', name: 'Donor Two' },
    ],
    personas: [],
    initiatives: [{ slug: 'eco', name: 'Eco' }],
    team: [],
    relationships: [
        { from: 'pipe', type: 'feeds into', to: 'api' },
        { from: 'api', type: 'enables', to: 'app' },
    ],
});

const P = () => buildPortfolio(fixture());

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
    assert.deepEqual(
        product.themes.map((t) => t.slug),
        ['climate']
    );
    assert.deepEqual(
        product.countries.map((c) => c.slug),
        ['aa']
    );
    assert.deepEqual(
        product.projects.map((pr) => pr.slug),
        ['p1']
    );
});

test('initiative stays a scalar slug — resolving it would ship unread data', () => {
    // Only the graph displays initiative names, and it trims them to { slug, name }.
    assert.equal(P().getProduct('api').initiative, 'eco');
    assert.equal(P().getProject('p1').initiative, 'eco');
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
    assert.deepEqual(
        product.themes.map((t) => t.slug),
        ['climate']
    );
});

test('a missing link field resolves to an empty array', () => {
    const theme = P().getTheme('empty-theme');
    assert.deepEqual(theme.projects, []);
    assert.deepEqual(theme.products, []);
    assert.deepEqual(theme.donors, []);
});

test("'stored' relations keep the record's own slug order", () => {
    // p1 lists leadProductSlugs as [pipe, api] — the reverse of collection order.
    const project = P().getProject('p1');
    assert.deepEqual(
        project.products.map((p) => p.slug),
        ['pipe', 'api']
    );
});

test("'collection' relations are ordered by the collection, not by discovery", () => {
    // The theme stores countrySlugs [zz, aa] and donorSlugs [d2, d1]; both are derived by
    // the sync, so their order is incidental and the collection's order wins.
    const theme = P().getTheme('climate');
    assert.deepEqual(
        theme.countries.map((c) => c.slug),
        ['aa', 'zz']
    );
    assert.deepEqual(
        theme.donors.map((d) => d.slug),
        ['d1', 'd2']
    );
});

test('featured products keep their editorial order; the rest keep collection order', () => {
    // featuredProductSlugs is [app, api] — deliberately not collection order.
    const theme = P().getTheme('climate');
    assert.deepEqual(
        theme.featuredProducts.map((p) => p.slug),
        ['app', 'api']
    );
    assert.deepEqual(
        theme.otherProducts.map((p) => p.slug),
        ['pipe']
    );
});

test('a featured slug outside the theme is ignored', () => {
    const data = fixture();
    data.themes[0].featuredProductSlugs = ['app', 'lonely'];
    const theme = buildPortfolio(data).getTheme('climate');
    assert.deepEqual(
        theme.featuredProducts.map((p) => p.slug),
        ['app']
    );
});

test('a theme with no featured list puts every product in otherProducts', () => {
    const data = fixture();
    delete data.themes[0].featuredProductSlugs;
    const theme = buildPortfolio(data).getTheme('climate');
    assert.deepEqual(theme.featuredProducts, []);
    assert.deepEqual(
        theme.otherProducts.map((p) => p.slug),
        ['api', 'pipe', 'app']
    );
});

test('the graph reaches the whole connected component, not just direct neighbours', () => {
    // pipe → api → app: from pipe, app is two hops away and must still appear.
    const graph = P().getProduct('pipe').graph;
    assert.equal(graph.focus, 'pipe');
    assert.deepEqual(new Set(graph.nodes.map((n) => n.slug)), new Set(['pipe', 'api', 'app']));
    assert.equal(graph.edges.length, 2);
});

test('graph nodes carry what the diagram needs, including the resolved initiative', () => {
    const node = P()
        .getProduct('api')
        .graph.nodes.find((n) => n.slug === 'api');
    assert.deepEqual(node, {
        slug: 'api',
        name: 'API',
        type: 'API',
        initiative: { slug: 'eco', name: 'Eco' },
        countrySlugs: ['aa'],
    });
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
    assert.deepEqual(new Set(graph.nodes.map((n) => n.slug)), new Set(['pipe', 'api', 'app']));
    assert.ok(!graph.edges.some((e) => e.from === 'x' || e.to === 'y'));
});

test('an entirely empty dataset resolves to null rather than throwing', () => {
    const p = buildPortfolio({});
    assert.equal(p.getProduct('api'), null);
    assert.deepEqual(p.getProducts(), []);
    assert.deepEqual(p.getThemes(), []);
});
