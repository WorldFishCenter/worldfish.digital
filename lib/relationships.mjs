/**
 * Relationships — the tool↔tool graph from WFD Connections. Pure. No imports, no I/O.
 *
 * Everything that walks relationship edges lives here: which way an edge runs, the
 * connected component around a tool, the columns the diagram draws, the path that lights
 * up through a tool, and the "shortcut" edges the build gate warns about. The resolver,
 * the diagram (a client component — keep this file free of data imports) and the snapshot
 * check all read the graph through it; test/relationships.test.mjs pins the rules.
 *
 * See CONTEXT.md (Relationship).
 */

/**
 * Which way work flows along each relationship type: true = from → to. The others are
 * reversed, so the prerequisite/parent sits upstream and every edge runs left → right.
 * The snapshot check rejects a type that is missing here rather than guess its direction.
 */
export const FORWARD = {
    'feeds into': true,
    enables: true,
    'depends on': false,
    'pilot of': false,
};

/** Edges normalised to the direction of flow: [{ source, target, type }]. */
export const flow = (edges) =>
    edges.map((e) =>
        FORWARD[e.type]
            ? { source: e.from, target: e.to, type: e.type }
            : { source: e.to, target: e.from, type: e.type }
    );

/**
 * The slugs in the connected component containing `slug`, direction ignored; null when
 * the tool has no edges. Multi-hop: the whole local ecosystem, not just direct neighbours.
 */
export function component(edges, slug) {
    const adj = new Map();
    const connect = (a, b) => {
        if (!adj.has(a)) adj.set(a, new Set());
        adj.get(a).add(b);
    };
    edges.forEach((edge) => {
        connect(edge.from, edge.to);
        connect(edge.to, edge.from);
    });
    if (!adj.has(slug)) return null;

    const found = new Set([slug]);
    const queue = [slug];
    while (queue.length) {
        const node = queue.shift();
        adj.get(node).forEach((next) => {
            if (!found.has(next)) {
                found.add(next);
                queue.push(next);
            }
        });
    }
    return found;
}

/**
 * Edges that close a cycle, found by depth-first search over the directed flow.
 *
 * The portfolio has genuine feedback loops — a pipeline feeds an API, the API serves a
 * validation app, and the corrections enumerators make there flow back into the pipeline.
 * That is the real process, not a data error, so these edges are kept and drawn. They are
 * only excluded from the layering, which needs an acyclic graph to assign columns.
 *
 * Deterministic: nodes and each node's successors are visited in the order given, so the
 * same graph always yields the same back-edges and therefore the same layout.
 */
export function backEdges({ nodes, edges }) {
    const directed = flow(edges);
    const out = new Map();
    directed.forEach((e, i) => {
        if (!out.has(e.source)) out.set(e.source, []);
        out.get(e.source).push(i);
    });

    const WHITE = 0;
    const GREY = 1;
    const BLACK = 2;
    const colour = new Map(nodes.map((n) => [n.slug, WHITE]));
    const back = new Set();

    const visit = (slug) => {
        colour.set(slug, GREY);
        for (const i of out.get(slug) || []) {
            const next = directed[i].target;
            const c = colour.get(next);
            if (c === GREY) back.add(i);
            else if (c === WHITE || c === undefined) visit(next);
        }
        colour.set(slug, BLACK);
    };

    nodes.forEach((n) => {
        if (colour.get(n.slug) === WHITE) visit(n.slug);
    });
    return back;
}

/**
 * Assign each node a column (layer) by longest path from the sources.
 *
 * Longest-path layering is only defined on an acyclic graph: on a cycle every pass round
 * the loop pushes the layer one further, so the relaxation runs until its iteration cap
 * and leaves a long tail of empty columns. (Before this was fixed, one feedback loop in
 * the Peskas graph produced 38 columns for 12 nodes, 33 of them empty, on every tool page
 * in that component.) So cycles are broken for layering only — `flow` still returns every
 * edge, including the ones that close a loop, and the diagram draws them.
 *
 * Returns { flow, columns }: the directed edges and the nodes per column.
 */
export function layout({ nodes, edges }) {
    const directed = flow(edges);
    const back = backEdges({ nodes, edges });
    const acyclic = directed.filter((_, i) => !back.has(i));

    const layer = new Map(nodes.map((n) => [n.slug, 0]));
    for (let i = 0; i < nodes.length; i++) {
        let changed = false;
        for (const e of acyclic) {
            const cand = (layer.get(e.source) ?? 0) + 1;
            if (cand > (layer.get(e.target) ?? 0)) {
                layer.set(e.target, cand);
                changed = true;
            }
        }
        if (!changed) break;
    }

    const maxLayer = Math.max(0, ...nodes.map((n) => layer.get(n.slug) || 0));
    const columns = [];
    for (let l = 0; l <= maxLayer; l++) {
        columns.push(nodes.filter((n) => (layer.get(n.slug) || 0) === l));
    }
    return { flow: directed, columns };
}

/**
 * The slugs on a directed path through `active`: itself, its ancestors and descendants.
 *
 * Scoped by country: when a path runs through a shared hub (e.g. one API fed by many
 * country pipelines), only the branch that shares the active node's country is followed,
 * so a country app traces back to its OWN pipeline, not its siblings'.
 *
 * @param nodes     graph nodes, each { slug, countrySlugs }
 * @param directed  the `flow` from layout()
 */
export function pathThrough(nodes, directed, active) {
    const down = new Map();
    const up = new Map();
    const push = (m, a, b) => {
        if (!m.has(a)) m.set(a, []);
        m.get(a).push(b);
    };
    directed.forEach((e) => {
        push(down, e.source, e.target);
        push(up, e.target, e.source);
    });

    const countryOf = new Map(nodes.map((n) => [n.slug, n.countrySlugs || []]));
    const activeCountries = countryOf.get(active) || [];
    const sharesCountry = (slug) => {
        if (!activeCountries.length) return true; // focused node is global/untagged
        const c = countryOf.get(slug) || [];
        if (!c.length) return true; // shared/global node — always part of the flow
        return c.some((x) => activeCountries.includes(x));
    };

    const path = new Set([active]);
    const walk = (m) => {
        const q = [[active, 0]];
        while (q.length) {
            const [n, depth] = q.shift();
            (m.get(n) || []).forEach((x) => {
                // Always keep the focused node's DIRECT neighbours (a real 1-hop
                // dependency, even cross-country); only country-scope deeper hops,
                // which are the ones that fan out through a shared hub.
                if (!path.has(x) && (depth === 0 || sharesCountry(x))) {
                    path.add(x);
                    q.push([x, depth + 1]);
                }
            });
        }
    };
    walk(down);
    walk(up);
    return path;
}

/**
 * Relationships that are not direct: an edge A→C already implied by a longer path
 * A→…→C (e.g. "App depends on Pipeline" when App→API→Pipeline exists). Returns the
 * original edges, so each can be named for removal in Airtable.
 */
export function shortcuts(edges) {
    const directed = flow(edges);
    const adj = new Map();
    directed.forEach(({ source, target }) => {
        if (!adj.has(source)) adj.set(source, []);
        adj.get(source).push(target);
    });
    const viaLongerPath = (s, t) => {
        const seen = new Set([s]);
        const queue = [s];
        while (queue.length) {
            const n = queue.shift();
            for (const m of adj.get(n) || []) {
                if (n === s && m === t) continue; // ignore the direct edge under test
                if (m === t) return true;
                if (!seen.has(m)) {
                    seen.add(m);
                    queue.push(m);
                }
            }
        }
        return false;
    };
    return edges.filter((_, i) => viaLongerPath(directed[i].source, directed[i].target));
}
