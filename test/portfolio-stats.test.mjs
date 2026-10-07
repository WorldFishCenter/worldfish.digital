import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { reuseEvidence, sharedLayer, toolsByInitiative } from '../lib/portfolio-stats.mjs';

/**
 * These figures are printed on the homepage as claims about the portfolio, so the thing
 * worth pinning is not the arithmetic but the honesty: never print a count that is wrong,
 * never print one that is zero, and read correctly at every stage between an empty
 * database and a full one.
 */
const themes = [
    { slug: 'fisheries', name: 'Fisheries' },
    { slug: 'shared', name: 'Shared Infrastructure', crossCutting: true },
];

const products = [
    {
        slug: 'pipe',
        themeSlugs: ['fisheries'],
        openSource: true,
        repoUrl: 'https://example.test/pipe',
        dataAvailability: 'Open / Public',
    },
    {
        slug: 'lib',
        themeSlugs: ['shared'],
        openSource: true,
        repoUrl: 'https://example.test/lib',
        dataAvailability: 'Not applicable',
    },
    { slug: 'closed', themeSlugs: ['fisheries'], openSource: false, dataAvailability: 'Internal only' },
];

const relationships = [
    { from: 'pipe', type: 'depends on', to: 'lib' }, // crosses: fisheries → shared
    { from: 'closed', type: 'feeds into', to: 'pipe' }, // same area
];

test('counts are reported against the whole catalogue, not just the qualifying rows', () => {
    const { openCode } = reuseEvidence({ products, relationships, themes });
    assert.match(openCode.label, /^2 of 3 tools/);
});

test('a tool needs both the open-source flag and a repository to count', () => {
    const { openCode } = reuseEvidence({
        products: [{ slug: 'x', openSource: true, repoUrl: null }, ...products],
        relationships,
        themes,
    });
    assert.match(openCode.label, /^2 of 4 tools/, 'the flag alone must not count');
});

test('cross-area connections are counted, and a link to shared infrastructure is found by flag', () => {
    const { connections } = reuseEvidence({ products, relationships, themes });
    assert.match(connections.label, /2 recorded dependencies between tools, 1 crossing/);
    assert.equal(connections.href, '/our-work/shared');
});

test('a link to a tool with no impact area always crosses — that is what shared means', () => {
    const { connections } = reuseEvidence({
        products: [{ slug: 'pipe', themeSlugs: ['fisheries'] }, { slug: 'bare', themeSlugs: [] }],
        relationships: [{ from: 'pipe', to: 'bare' }],
        themes,
    });
    assert.match(connections.label, /1 crossing impact areas/);
});

test('singular reads as singular', () => {
    const { connections } = reuseEvidence({
        products,
        relationships: [relationships[1]],
        themes,
    });
    assert.match(connections.label, /^1 recorded dependency between tools$/);
});

test('an empty database prints nothing at all rather than zeros', () => {
    const evidence = reuseEvidence({ products: [], relationships: [], themes });
    assert.deepEqual(
        Object.values(evidence).filter(Boolean),
        [],
        'every figure must be null so its pillar renders as copy alone'
    );
});

test('no open-source tools yet means no link, not "0 of 3"', () => {
    const { openCode } = reuseEvidence({
        products: products.map((p) => ({ ...p, openSource: false })),
        relationships,
        themes,
    });
    assert.equal(openCode, null);
});

test('the data claim holds even before any dataset is open', () => {
    const { openData } = reuseEvidence({
        products: products.map((p) => ({ ...p, dataAvailability: 'Internal only' })),
        relationships,
        themes,
    });
    assert.equal(openData.label, 'Every tool states what its data allows');
});

test('every figure that is printed carries a link to the records behind it', () => {
    const evidence = reuseEvidence({ products, relationships, themes });
    for (const [key, figure] of Object.entries(evidence)) {
        if (!figure) continue;
        assert.ok(figure.href?.startsWith('/'), `${key} must link somewhere on this site`);
        assert.ok(figure.label?.length > 0, `${key} must say what it counted`);
    }
});

test('the figures the tools catalogue reads are the ones this module returns', async () => {
    // Read by name, so a rename would silently print nothing rather than fail. They live on
    // /products — the page whose list they count — not on the homepage, which now leads with
    // initiatives.
    const source = await readFile(new URL('../app/products/page.js', import.meta.url), 'utf8');
    const produced = Object.keys(reuseEvidence({ products, relationships, themes }));
    for (const key of ['openCode', 'openData']) {
        assert.ok(produced.includes(key), `reuseEvidence no longer returns "${key}"`);
        assert.ok(
            source.includes(`evidence.${key}`),
            `app/page.js no longer reads "${key}" — is the facts line still wired up?`
        );
    }
});

test('the shared layer ranks by what builds on a tool, not by raw edge direction', () => {
    // "lib" is depended ON by two tools, so it must outrank the hub that merely consumes
    // them. Counting from/to naively would invert this and rank the graph backwards.
    const ranked = sharedLayer({
        products: [{ slug: 'lib', name: 'Lib' }, { slug: 'a', name: 'A' }, { slug: 'b', name: 'B' }],
        relationships: [
            { from: 'a', type: 'depends on', to: 'lib' },
            { from: 'b', type: 'depends on', to: 'lib' },
        ],
    });
    assert.equal(ranked[0].product.slug, 'lib');
    assert.equal(ranked[0].dependants, 2);
});

test('a tool nothing builds on is left out, and no connections means no list at all', () => {
    assert.deepEqual(sharedLayer({ products: [{ slug: 'alone' }], relationships: [] }), []);
});

test('the shared layer is capped and ordered deterministically', () => {
    const products = ['a', 'b', 'c'].map((slug) => ({ slug, name: slug.toUpperCase() }));
    const relationships = [
        { from: 'x', type: 'depends on', to: 'a' },
        { from: 'y', type: 'depends on', to: 'b' },
        { from: 'z', type: 'depends on', to: 'c' },
    ];
    const ranked = sharedLayer({ products, relationships, limit: 2 });
    assert.equal(ranked.length, 2);
    // Equal counts fall back to name order, so the list never reshuffles between builds.
    assert.deepEqual(ranked.map((r) => r.product.slug), ['a', 'b']);
});


/* --- toolsByInitiative: the containment axis the site is organised on --- */

const initiative = (slug) => ({ slug, name: slug.toUpperCase() });
const tool = (slug, ...projectSlugs) => ({ slug, projectSlugs });

test('each initiative carries the tools that name it, in the order given', () => {
    const groups = toolsByInitiative({
        projects: [initiative('alpha'), initiative('beta')],
        products: [tool('a1', 'alpha'), tool('b1', 'beta'), tool('a2', 'alpha')],
    });
    assert.deepEqual(
        groups.map((g) => [g.initiative.slug, g.tools.map((t) => t.slug)]),
        [
            ['alpha', ['a1', 'a2']],
            ['beta', ['b1']],
        ]
    );
});

test('a tool with no initiative is shown, not dropped', () => {
    // `Part of initiative` is optional in the schema, so this is a real record. A tool the
    // site does not show is a tool somebody rebuilds.
    const groups = toolsByInitiative({
        projects: [initiative('alpha')],
        products: [tool('a1', 'alpha'), tool('loner')],
    });
    assert.equal(groups.at(-1).initiative, null);
    assert.deepEqual(groups.at(-1).tools.map((t) => t.slug), ['loner']);
});

test('there is no standalone group when every tool has an initiative', () => {
    const groups = toolsByInitiative({
        projects: [initiative('alpha')],
        products: [tool('a1', 'alpha')],
    });
    assert.equal(groups.length, 1);
    assert.ok(groups.every((g) => g.initiative));
});

test('an initiative with nothing Live under it is left out', () => {
    const groups = toolsByInitiative({
        projects: [initiative('alpha'), initiative('empty')],
        products: [tool('a1', 'alpha')],
    });
    assert.deepEqual(groups.map((g) => g.initiative.slug), ['alpha']);
});

test('a tool belonging to two initiatives appears under both', () => {
    const groups = toolsByInitiative({
        projects: [initiative('alpha'), initiative('beta')],
        products: [tool('shared', 'alpha', 'beta')],
    });
    assert.deepEqual(groups.map((g) => g.tools.map((t) => t.slug)), [['shared'], ['shared']]);
});

test('every Live tool reaches the homepage through exactly one group, or a shared one', async () => {
    const read = (f) =>
        JSON.parse(readFileSync(new URL(`../content/data/${f}`, import.meta.url), 'utf8'));
    const products = read('products.json').products;
    const groups = toolsByInitiative({ products, projects: read('projects.json').projects });
    const shown = new Set(groups.flatMap((g) => g.tools.map((t) => t.slug)));
    assert.deepEqual(
        products.filter((p) => !shown.has(p.slug)).map((p) => p.slug),
        [],
        'a tool missing from the homepage is a tool somebody rebuilds'
    );
});

test('a tool whose initiative is not in the list given still appears', () => {
    // Every filtered page — one impact area, one country — passes only the initiatives
    // relevant there. Matching on "has no projectSlugs" would drop this tool from a list
    // whose own heading counts it.
    const groups = toolsByInitiative({
        projects: [initiative('alpha')],
        products: [tool('a1', 'alpha'), tool('elsewhere', 'beta-not-passed')],
    });
    const shown = groups.flatMap((g) => g.tools.map((t) => t.slug));
    assert.deepEqual(shown.sort(), ['a1', 'elsewhere']);
    assert.equal(groups.at(-1).initiative, null);
});
