import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FORWARD, backEdges, layout, pathThrough, shortcuts } from '../lib/relationships.mjs';

/** Pins how the relationship graph is read: which way an edge runs, where each tool sits
 *  in the diagram, and which path lights up. The connected-component search is pinned
 *  through the resolver, in portfolio.test.mjs. */

const node = (slug, ...countrySlugs) => ({ slug, countrySlugs });
const slugs = (list) => list.map((item) => item.slug);

/** The committed snapshot, so the layout is also pinned against whatever is actually Live. */
const read = (file) =>
    JSON.parse(readFileSync(new URL(`../content/data/${file}`, import.meta.url), 'utf8'));
const realNodes = read('products.json').products.map((p) => ({
    slug: p.slug,
    countrySlugs: p.countrySlugs,
}));
const realEdges = read('relationships.json').relationships;

/** Two country pipelines feed one shared API, which enables one app per country. */
const hub = () => ({
    nodes: [
        node('pipe-ke', 'kenya'),
        node('pipe-tl', 'timor-leste'),
        node('api'),
        node('app-ke', 'kenya'),
        node('app-tl', 'timor-leste'),
    ],
    edges: [
        { from: 'pipe-ke', type: 'feeds into', to: 'api' },
        { from: 'pipe-tl', type: 'feeds into', to: 'api' },
        { from: 'api', type: 'enables', to: 'app-ke' },
        { from: 'app-tl', type: 'depends on', to: 'api' },
    ],
});

test('every relationship type in the taxonomy has a direction', () => {
    const { relationshipTypes } = JSON.parse(
        readFileSync(new URL('../content/data/taxonomy.json', import.meta.url), 'utf8')
    );
    assert.deepEqual(Object.keys(FORWARD).sort(), [...relationshipTypes].sort());
});

test('"depends on" and "pilot of" are reversed, so the prerequisite sits upstream', () => {
    const { flow, columns } = layout({
        nodes: [node('app'), node('api'), node('pilot')],
        edges: [
            { from: 'app', type: 'depends on', to: 'api' },
            { from: 'pilot', type: 'pilot of', to: 'app' },
        ],
    });
    assert.deepEqual(flow, [
        { source: 'api', target: 'app', type: 'depends on' },
        { source: 'app', target: 'pilot', type: 'pilot of' },
    ]);
    assert.deepEqual(columns.map(slugs), [['api'], ['app'], ['pilot']]);
});

test('a tool sits one column after its furthest prerequisite', () => {
    const { columns } = layout(hub());
    assert.deepEqual(columns.map(slugs), [['pipe-ke', 'pipe-tl'], ['api'], ['app-ke', 'app-tl']]);
});

/**
 * The portfolio has real feedback loops: a pipeline feeds an API, the API serves a
 * validation app, and the corrections made there flow back into the pipeline. Longest-path
 * layering is undefined on a cycle, so these are the tests that keep it from degrading —
 * asserting the node set alone is what let a 38-column layout ship unnoticed.
 */
const loop = () => ({
    nodes: [node('a'), node('b'), node('c')],
    edges: [
        { from: 'a', type: 'feeds into', to: 'b' },
        { from: 'b', type: 'feeds into', to: 'c' },
        { from: 'c', type: 'feeds into', to: 'a' },
    ],
});

test('a cycle lays out in as many columns as it has nodes, and no more', () => {
    const { columns } = layout(loop());
    assert.equal(columns.length, 3, 'one pass round the loop, not one per relaxation');
    assert.deepEqual(slugs(columns.flat()).sort(), ['a', 'b', 'c']);
});

test('no column is ever empty', () => {
    for (const graph of [loop(), hub()]) {
        const { columns } = layout(graph);
        assert.ok(
            columns.every((column) => column.length > 0),
            'an empty column is a layering that ran away'
        );
    }
});

test('the edge that closes a loop is excluded from layering but still drawn', () => {
    const graph = loop();
    assert.equal(backEdges(graph).size, 1, 'exactly one edge breaks this cycle');
    assert.equal(layout(graph).flow.length, 3, 'every edge is still returned for drawing');
});

test('breaking a cycle is deterministic — the same graph always lays out the same way', () => {
    const first = layout(loop()).columns.map(slugs);
    for (let i = 0; i < 5; i++) assert.deepEqual(layout(loop()).columns.map(slugs), first);
});

test('an acyclic graph has no back-edges', () => {
    assert.equal(backEdges(hub()).size, 0);
});

test('the real portfolio lays out in a handful of columns', () => {
    const { columns } = layout({ nodes: realNodes, edges: realEdges });
    assert.ok(
        columns.length <= realNodes.length,
        `layering ran away: ${columns.length} columns for ${realNodes.length} tools`
    );
    assert.ok(columns.every((column) => column.length > 0), 'no empty columns');
});

test('a country app traces back to its own pipeline, not its siblings', () => {
    const graph = hub();
    const { flow } = layout(graph);
    const path = (active) => [...pathThrough(graph.nodes, flow, active)].sort();

    assert.deepEqual(path('app-ke'), ['api', 'app-ke', 'pipe-ke']);
    assert.deepEqual(path('app-tl'), ['api', 'app-tl', 'pipe-tl']);
    assert.deepEqual(path('pipe-ke'), ['api', 'app-ke', 'pipe-ke']);
    // The shared hub has no country, so every branch runs through it.
    assert.deepEqual(path('api'), ['api', 'app-ke', 'app-tl', 'pipe-ke', 'pipe-tl']);
});

test('a direct neighbour is always on the path, even across countries', () => {
    const nodes = [node('pipe-tl', 'timor-leste'), node('app-ke', 'kenya')];
    const { flow } = layout({ nodes, edges: [{ from: 'pipe-tl', type: 'feeds into', to: 'app-ke' }] });
    assert.deepEqual([...pathThrough(nodes, flow, 'app-ke')].sort(), ['app-ke', 'pipe-tl']);
});

test('an edge implied by a longer path is a shortcut, whichever way it was written', () => {
    const chain = [
        { from: 'pipe', type: 'feeds into', to: 'api' },
        { from: 'api', type: 'enables', to: 'app' },
    ];
    assert.deepEqual(shortcuts(chain), []);

    const forward = { from: 'pipe', type: 'feeds into', to: 'app' };
    assert.deepEqual(shortcuts([...chain, forward]), [forward]);

    const reversed = { from: 'app', type: 'depends on', to: 'pipe' };
    assert.deepEqual(shortcuts([...chain, reversed]), [reversed]);
});
