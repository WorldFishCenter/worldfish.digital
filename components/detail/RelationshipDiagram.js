'use client'
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import Link from 'next/link';

/** Group related edges by their human label, preserving first-seen order. */
function lanesByLabel(list) {
    const byLabel = new Map();
    list.forEach((edge) => {
        if (!byLabel.has(edge.label)) byLabel.set(edge.label, []);
        byLabel.get(edge.label).push(edge);
    });
    return [...byLabel.entries()].map(([label, items]) => ({ label, items }));
}

function Lane({ dir, lane, registerNode }) {
    return (
        <div className="wfRelLane">
            <p className="wfRelLaneLabel">
                {lane.label}
                <span className="wfRelCount">{lane.items.length}</span>
            </p>
            <div className="wfRelNodes">
                {lane.items.map(({ product }) => (
                    <Link
                        key={product.slug}
                        href={`/products/${product.slug}`}
                        className="wfRelNode"
                        ref={registerNode(`${dir}::${lane.label}::${product.slug}`)}
                    >
                        <span className="wfRelNodeName">{product.name}</span>
                        {product.type && <span className="wfRelNodeType">{product.type}</span>}
                    </Link>
                ))}
            </div>
        </div>
    );
}

/**
 * Node-link lineage diagram: sources fan in from the left, consumers fan out to
 * the right, joined to a central hub by curved SVG connectors with directional
 * arrowheads. Connectors are measured from the live layout after mount and
 * recomputed on resize, so they track the DOM in any column count or on mobile
 * (where the layout stacks and the connectors run vertically).
 */
export default function RelationshipDiagram({ product, related }) {
    const containerRef = useRef(null);
    const centerRef = useRef(null);
    const nodeRefs = useRef(new Map());
    const [paths, setPaths] = useState([]);
    const [dims, setDims] = useState({ w: 0, h: 0 });

    const registerNode = useCallback(
        (key) => (el) => {
            if (el) nodeRefs.current.set(key, el);
            else nodeRefs.current.delete(key);
        },
        []
    );

    const measure = useCallback(() => {
        const container = containerRef.current;
        const center = centerRef.current;
        if (!container || !center) return;

        const box = container.getBoundingClientRect();
        setDims({ w: box.width, h: box.height });

        const rel = (r) => ({
            left: r.left - box.left,
            right: r.right - box.left,
            top: r.top - box.top,
            bottom: r.bottom - box.top,
            cx: r.left - box.left + r.width / 2,
            cy: r.top - box.top + r.height / 2,
        });

        const stacked =
            typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches;
        const c = rel(center.getBoundingClientRect());
        const next = [];

        nodeRefs.current.forEach((el, key) => {
            if (!el) return;
            const n = rel(el.getBoundingClientRect());
            const dir = key.split('::')[0];
            let sx, sy, tx, ty, d;

            if (stacked) {
                // Vertical flow: sources drop into the hub, hub drops into consumers.
                if (dir === 'up') {
                    [sx, sy, tx, ty] = [n.cx, n.bottom, c.cx, c.top];
                } else {
                    [sx, sy, tx, ty] = [c.cx, c.bottom, n.cx, n.top];
                }
                const dy = (ty - sy) * 0.5;
                d = `M${sx},${sy} C${sx},${sy + dy} ${tx},${ty - dy} ${tx},${ty}`;
            } else {
                // Horizontal flow: fan in from the left, fan out to the right.
                if (dir === 'up') {
                    [sx, sy, tx, ty] = [n.right, n.cy, c.left, c.cy];
                } else {
                    [sx, sy, tx, ty] = [c.right, c.cy, n.left, n.cy];
                }
                const dx = (tx - sx) * 0.5;
                d = `M${sx},${sy} C${sx + dx},${sy} ${tx - dx},${ty} ${tx},${ty}`;
            }
            next.push({ key, d });
        });

        setPaths(next);
    }, []);

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
    }, [measure, related]);

    if (!related || related.length === 0) return null;

    const upstream = lanesByLabel(related.filter((r) => r.direction === 'incoming'));
    const downstream = lanesByLabel(related.filter((r) => r.direction === 'outgoing'));
    const variant =
        upstream.length && downstream.length ? 'both' : upstream.length ? 'upOnly' : 'downOnly';

    return (
        <div className={`wfRelDiagram wfRelDiagram--${variant}`} ref={containerRef}>
            <svg
                className="wfRelSvg"
                width={dims.w}
                height={dims.h}
                viewBox={`0 0 ${dims.w} ${dims.h}`}
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                <defs>
                    <marker
                        id="wfRelArrow"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="7"
                        markerHeight="7"
                        orient="auto-start-reverse"
                    >
                        <path d="M0,0 L10,5 L0,10 z" fill="var(--wf-color-accent)" />
                    </marker>
                </defs>
                {paths.map((p) => (
                    <path key={p.key} d={p.d} className="wfRelPath" markerEnd="url(#wfRelArrow)" />
                ))}
            </svg>

            {upstream.length > 0 && (
                <div className="wfRelCol wfRelColUp">
                    {upstream.map((lane) => (
                        <Lane key={lane.label} dir="up" lane={lane} registerNode={registerNode} />
                    ))}
                </div>
            )}

            <div className="wfRelCol wfRelColCenter">
                <div className="wfRelHub" ref={centerRef}>
                    <span className="wfRelHubName">{product.name}</span>
                    {product.type && <span className="wfRelHubType">{product.type}</span>}
                </div>
            </div>

            {downstream.length > 0 && (
                <div className="wfRelCol wfRelColDown">
                    {downstream.map((lane) => (
                        <Lane key={lane.label} dir="down" lane={lane} registerNode={registerNode} />
                    ))}
                </div>
            )}
        </div>
    );
}
