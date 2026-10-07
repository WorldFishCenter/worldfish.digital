'use client'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { typeColor } from './meta';
import { productHref } from '@/lib/routes.mjs';
import { layout, pathThrough } from '@/lib/relationships.mjs';

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
 * - A graph with no `focus` renders undimmed and unmarked. That is how an initiative page
 *   uses it: the subject is the whole programme, not one tool inside it.
 */
export default function RelationshipDiagram({ graph }) {
    const containerRef = useRef(null);
    const nodeRefs = useRef(new Map());
    const [paths, setPaths] = useState([]);
    const [groups, setGroups] = useState([]);
    const [dims, setDims] = useState({ w: 0, h: 0 });
    // Null when the graph has no focal tool (an initiative's own lineage), which turns off
    // both the "You are here" marker and the dimming of everything off the focal path.
    const [active, setActive] = useState(graph?.focus || null);

    const hasGraph = Boolean(graph && graph.edges && graph.edges.length);

    const { flow, columns } = useMemo(
        () => (hasGraph ? layout(graph) : { flow: [], columns: [] }),
        [graph, hasGraph]
    );

    // Active node + all nodes on a directed path through it (ancestors + descendants),
    // scoped by country — see pathThrough.
    //
    // With no active node nothing is dimmed. That is the initiative view: the graph is the
    // whole of one programme's lineage and no tool in it is "where you are", so singling one
    // out would be a lie and fading the rest would hide the thing the reader came to see.
    // Hovering still focuses a path.
    const highlighted = useMemo(
        () => (active ? pathThrough(graph.nodes, flow, active) : null),
        [active, flow, graph]
    );

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
        flow.forEach((e, i) => {
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
    }, [flow, graph]);

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
                            const on =
                                !highlighted ||
                                (highlighted.has(p.source) && highlighted.has(p.target));
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
                                const isFocus = Boolean(graph.focus) && node.slug === graph.focus;
                                const dim = Boolean(highlighted) && !highlighted.has(node.slug);
                                return (
                                    <Link
                                        key={node.slug}
                                        href={productHref(node.slug)}
                                        ref={setRef(node.slug)}
                                        className={`wfRelNode${isFocus ? ' wfRelNode--focus' : ''}${dim ? ' wfRelNode--dim' : ''}`}
                                        style={{ borderLeftColor: color }}
                                        onMouseEnter={() => setActive(node.slug)}
                                        onMouseLeave={() => setActive(graph.focus || null)}
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
