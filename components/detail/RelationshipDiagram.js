'use client'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { typeColor } from './meta';
import { productHref } from '@/lib/routes.mjs';

// Edge types that flow "forward" (source produces/enables target). The others
// ('depends on', 'pilot of') are reversed for layout so the prerequisite/parent
// sits upstream — every edge then runs left → right.
const FORWARD = new Set(['feeds into', 'enables']);

/** Normalize edges to a left→right flow and assign each node a column (layer)
 *  via longest-path from the sources. Cycle-safe (capped at node count). */
function buildLayout(graph) {
    const { nodes } = graph;
    const dEdges = graph.edges.map((e) => {
        const forward = FORWARD.has(e.type);
        return { source: forward ? e.from : e.to, target: forward ? e.to : e.from, type: e.type };
    });

    const layer = new Map(nodes.map((n) => [n.slug, 0]));
    for (let i = 0; i < nodes.length; i++) {
        let changed = false;
        for (const e of dEdges) {
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
    return { dEdges, columns };
}

const Arrow = ({ id, color }) => (
    <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill={color} />
    </marker>
);

/**
 * "How this connects" — the whole connected slice of the product graph, laid out
 * left → right by flow and coloured by component type.
 *
 * - Nodes sharing an initiative (e.g. the Peskas ecosystem) are wrapped in a soft
 *   labelled container behind the graph — a compound-graph grouping, separate from
 *   the flow arrows.
 * - Focus + context: the active node (default: the current product) highlights its
 *   whole upstream→downstream PATH — every ancestor and descendant — while parallel
 *   branches fade. Hovering any node re-focuses on it.
 */
export default function RelationshipDiagram({ graph }) {
    const containerRef = useRef(null);
    const nodeRefs = useRef(new Map());
    const [paths, setPaths] = useState([]);
    const [groups, setGroups] = useState([]);
    const [dims, setDims] = useState({ w: 0, h: 0 });
    const [active, setActive] = useState(graph?.focus);

    const hasGraph = Boolean(graph && graph.edges && graph.edges.length);

    const { dEdges, columns } = useMemo(
        () => (hasGraph ? buildLayout(graph) : { dEdges: [], columns: [] }),
        [graph, hasGraph]
    );

    // Directed adjacency, both directions, for path (ancestor/descendant) highlighting.
    const flow = useMemo(() => {
        const down = new Map();
        const up = new Map();
        const push = (m, a, b) => {
            if (!m.has(a)) m.set(a, []);
            m.get(a).push(b);
        };
        dEdges.forEach((e) => {
            push(down, e.source, e.target);
            push(up, e.target, e.source);
        });
        return { down, up };
    }, [dEdges]);

    // Active node + all nodes on a directed path through it (ancestors + descendants),
    // scoped by country: when a path runs through a shared hub (e.g. one API fed by many
    // country pipelines), only follow the branch that shares the focused node's country,
    // so a country app traces back to its OWN pipeline, not its siblings'.
    const highlighted = useMemo(() => {
        const countryOf = new Map(graph.nodes.map((n) => [n.slug, n.countrySlugs || []]));
        const activeCountries = countryOf.get(active) || [];
        const sharesCountry = (slug) => {
            if (!activeCountries.length) return true; // focused node is global/untagged
            const c = countryOf.get(slug) || [];
            if (!c.length) return true; // shared/global node — always part of the flow
            return c.some((x) => activeCountries.includes(x));
        };
        const set = new Set([active]);
        const walk = (m, start) => {
            const q = [[start, 0]];
            while (q.length) {
                const [n, depth] = q.shift();
                (m.get(n) || []).forEach((x) => {
                    // Always keep the focused node's DIRECT neighbours (a real 1-hop
                    // dependency, even cross-country); only country-scope deeper hops,
                    // which are the ones that fan out through a shared hub.
                    if (!set.has(x) && (depth === 0 || sharesCountry(x))) {
                        set.add(x);
                        q.push([x, depth + 1]);
                    }
                });
            }
        };
        walk(flow.down, active);
        walk(flow.up, active);
        return set;
    }, [active, flow, graph]);

    const setRef = useCallback(
        (slug) => (el) => {
            if (el) nodeRefs.current.set(slug, el);
            else nodeRefs.current.delete(slug);
        },
        []
    );

    const measure = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;
        const box = container.getBoundingClientRect();
        setDims({ w: box.width, h: box.height });

        const rel = (el) => {
            const r = el.getBoundingClientRect();
            return {
                left: r.left - box.left,
                right: r.right - box.left,
                top: r.top - box.top,
                bottom: r.bottom - box.top,
                cy: r.top - box.top + r.height / 2,
            };
        };

        const rects = new Map();
        nodeRefs.current.forEach((el, slug) => {
            if (el) rects.set(slug, rel(el));
        });

        const nextPaths = [];
        dEdges.forEach((e, i) => {
            const a = rects.get(e.source);
            const b = rects.get(e.target);
            if (!a || !b) return;
            const dx = Math.max(28, (b.left - a.right) * 0.5);
            nextPaths.push({
                key: `${e.source}~${e.type}~${e.target}~${i}`,
                source: e.source,
                target: e.target,
                d: `M${a.right},${a.cy} C${a.right + dx},${a.cy} ${b.left - dx},${b.cy} ${b.left},${b.cy}`,
            });
        });

        // Container box per initiative (drawn behind the graph).
        const nodeRectList = graph.nodes
            .map((n) => ({ initiative: n.initiative ? n.initiative.slug : null, r: rects.get(n.slug) }))
            .filter((x) => x.r);
        const initName = new Map(
            graph.nodes.filter((n) => n.initiative).map((n) => [n.initiative.slug, n.initiative.name])
        );
        const byInitiative = new Map();
        nodeRectList.forEach(({ initiative, r }) => {
            if (!initiative) return;
            if (!byInitiative.has(initiative)) byInitiative.set(initiative, []);
            byInitiative.get(initiative).push(r);
        });
        const padX = 16;
        const padTop = 34;
        const padBottom = 16;
        const centerInside = (r, box) => {
            const cx = (r.left + r.right) / 2;
            const cy = (r.top + r.bottom) / 2;
            return cx >= box.x && cx <= box.x + box.w && cy >= box.y && cy <= box.y + box.h;
        };
        const nextGroups = [...byInitiative.entries()]
            .filter(([, rs]) => rs.length >= 2)
            .map(([slug, rs]) => {
                const left = Math.min(...rs.map((r) => r.left)) - padX;
                const right = Math.max(...rs.map((r) => r.right)) + padX;
                const top = Math.min(...rs.map((r) => r.top)) - padTop;
                const bottom = Math.max(...rs.map((r) => r.bottom)) + padBottom;
                return { slug, name: initName.get(slug), x: left, y: top, w: right - left, h: bottom - top };
            })
            // Don't draw a container that would visually swallow a node from another
            // (or no) initiative — better to omit the box than to mislabel a stranger.
            .filter((box) => !nodeRectList.some((n) => n.initiative !== box.slug && centerInside(n.r, box)));

        setPaths(nextPaths);
        setGroups(nextGroups);
    }, [dEdges, graph]);

    useLayoutEffect(() => {
        measure();
        const container = containerRef.current;
        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
        if (ro && container) ro.observe(container);
        window.addEventListener('resize', measure);
        return () => {
            if (ro) ro.disconnect();
            window.removeEventListener('resize', measure);
        };
    }, [measure]);

    if (!hasGraph) return null;

    const typesPresent = [...new Set(graph.nodes.map((n) => n.type).filter(Boolean))];

    return (
        <>
            <div className="wfRelWrap">
                <div className="wfRelGraph" ref={containerRef}>
                    <svg
                        className="wfRelSvg"
                        width={dims.w}
                        height={dims.h}
                        viewBox={`0 0 ${dims.w} ${dims.h}`}
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <defs>
                            <Arrow id="wfRelArrowOn" color="var(--wf-color-accent)" />
                            <Arrow id="wfRelArrowOff" color="rgba(148, 163, 184, 0.5)" />
                        </defs>
                        {groups.map((g) => (
                            <g key={g.slug}>
                                <rect
                                    className="wfRelGroupBox"
                                    x={g.x}
                                    y={g.y}
                                    width={g.w}
                                    height={g.h}
                                    rx="16"
                                />
                                <text className="wfRelGroupLabel" x={g.x + 16} y={g.y + 21}>
                                    {g.name.toUpperCase()}
                                </text>
                            </g>
                        ))}
                        {paths.map((p) => {
                            // An edge is on the highlighted flow when BOTH its endpoints are
                            // on the active node's path (matches the node highlighting).
                            const on = highlighted.has(p.source) && highlighted.has(p.target);
                            return (
                                <path
                                    key={p.key}
                                    d={p.d}
                                    className={`wfRelPath ${on ? 'wfRelPath--on' : 'wfRelPath--off'}`}
                                    markerEnd={`url(#${on ? 'wfRelArrowOn' : 'wfRelArrowOff'})`}
                                />
                            );
                        })}
                    </svg>

                    {columns.map((col, ci) => (
                        <div className="wfRelColumn" key={ci}>
                            {col.map((node) => {
                                const color = typeColor(node.type);
                                const isFocus = node.slug === graph.focus;
                                const dim = !highlighted.has(node.slug);
                                return (
                                    <Link
                                        key={node.slug}
                                        href={productHref(node.slug)}
                                        ref={setRef(node.slug)}
                                        className={`wfRelNode${isFocus ? ' wfRelNode--focus' : ''}${dim ? ' wfRelNode--dim' : ''}`}
                                        style={{ borderLeftColor: color }}
                                        onMouseEnter={() => setActive(node.slug)}
                                        onMouseLeave={() => setActive(graph.focus)}
                                    >
                                        <span className="wfRelNodeName">{node.name}</span>
                                        {node.type && (
                                            <span className="wfRelNodeType">
                                                <span className="wfRelDot" style={{ background: color }} />
                                                {node.type}
                                            </span>
                                        )}
                                        {isFocus && <span className="wfRelHere">You are here</span>}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {typesPresent.length > 0 && (
                <div className="wfRelLegend">
                    {typesPresent.map((t) => (
                        <span key={t} className="wfRelLegendItem">
                            <span className="wfRelLegendSwatch" style={{ background: typeColor(t) }} />
                            {t}
                        </span>
                    ))}
                </div>
            )}
        </>
    );
}
