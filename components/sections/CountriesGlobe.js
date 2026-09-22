'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { geoOrthographic, geoPath, geoGraticule, geoDistance } from 'd3-geo';
import { feature } from 'topojson-client';
import { countryHref } from '@/lib/routes.mjs';

// Palette mirrors the SCSS design tokens (canvas can't read CSS custom props).
// Keep in sync with abstracts/_tokens-root.scss if the brand colours change.
// The "R, G, B" strings (for rgba()) are derived from the hex so they can't drift.
const hexToRgb = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
};
const ACCENT = '#57b3d1'; // --wf-color-accent
const ACCENT_RGB = hexToRgb(ACCENT);
const PILOT = '#8ba3ba';
const PILOT_RGB = hexToRgb(PILOT);

const WORLD_URL = '/assets/data/world-110m.json';
const HALF_PI = Math.PI / 2;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/**
 * An interactive orthographic globe of the countries where WorldFish Digital
 * works. Self-contained: land geometry is a bundled TopoJSON, markers come from
 * the content data (via props) — no map tiles, no API keys. Auto-rotates and
 * spins on drag; hovering a marker previews a country and clicking one pins it
 * (a persistent card you can read and follow through to its page). The full
 * country list rendered below this component is the accessible fallback.
 */
export default function CountriesGlobe({ markers }) {
    const canvasRef = useRef(null);
    const stageRef = useRef(null);

    const worldRef = useRef(null); // { land, graticule }
    const projRef = useRef(null);
    const pathRef = useRef(null);
    const sizeRef = useRef(0);
    const gradientsRef = useRef({ size: -1 }); // static sphere gradients, rebuilt on resize
    const projectedRef = useRef(null); // last frame's projected markers, reused for hit-testing
    const rotationRef = useRef({ lambda: -45, phi: 6 }); // centred on E. Africa / Indian Ocean
    const dragRef = useRef({ active: false, moved: 0, x: 0, y: 0 });
    const hoverRef = useRef(-1); // transient hover (mouse preview)
    const selectedRef = useRef(-1); // pinned selection (persists until cleared)
    const autoRotateRef = useRef(true);
    const resumeTimerRef = useRef(null);
    const rafRef = useRef(0);
    const markersRef = useRef(markers);

    const [ready, setReady] = useState(false);
    const [hovered, setHovered] = useState(null); // transient preview
    const [selected, setSelected] = useState(null); // pinned country

    // Keep the ref used by the (non-reactive) draw/hit-test code in sync.
    useEffect(() => {
        markersRef.current = markers;
    }, [markers]);

    const active = markers.filter((m) => m.active);
    const pilot = markers.filter((m) => !m.active);

    // --- projection helpers -------------------------------------------------
    const ensureProjection = useCallback((size) => {
        const radius = size * 0.42;
        let proj = projRef.current;
        if (!proj) {
            proj = geoOrthographic().clipAngle(90).precision(0.4);
            projRef.current = proj;
            pathRef.current = geoPath(proj);
        }
        proj.scale(radius).translate([size / 2, size / 2]);
        return proj;
    }, []);

    // Screen coords for every marker on the visible (front) hemisphere.
    const visibleMarkers = useCallback((proj) => {
        const { lambda, phi } = rotationRef.current;
        const center = [-lambda, -phi];
        const out = [];
        markersRef.current.forEach((m, index) => {
            const dist = geoDistance([m.lon, m.lat], center);
            if (dist >= HALF_PI * 0.995) return;
            const p = proj([m.lon, m.lat]);
            if (!p) return;
            // Fade markers as they approach the limb so the far edge stays calm.
            const edge = clamp((HALF_PI - dist) / (HALF_PI * 0.35), 0.15, 1);
            out.push({ index, marker: m, x: p[0], y: p[1], fade: edge });
        });
        return out;
    }, []);

    // --- drawing (one frame; the loop is driven from the effect below) ------
    const renderFrame = useCallback(
        (time) => {
            const canvas = canvasRef.current;
            const world = worldRef.current;
            if (!canvas || !world) return;
            const size = sizeRef.current;
            const ctx = canvas.getContext('2d');
            const proj = ensureProjection(size);
            const path = pathRef.current;
            path.context(ctx);

            const c = size / 2;
            const radius = size * 0.42;
            const ox = c - radius * 0.32; // light source (upper-left)
            const oy = c - radius * 0.34;

            // The sphere gradients depend only on size, so build them once per
            // resize instead of allocating three gradients + stops every frame.
            let grads = gradientsRef.current;
            if (grads.size !== size) {
                const halo = ctx.createRadialGradient(c, c, radius * 0.86, c, c, radius * 1.18);
                halo.addColorStop(0, `rgba(${ACCENT_RGB}, 0.28)`);
                halo.addColorStop(0.55, `rgba(${ACCENT_RGB}, 0.08)`);
                halo.addColorStop(1, `rgba(${ACCENT_RGB}, 0)`);
                const ocean = ctx.createRadialGradient(ox, oy, radius * 0.1, c, c, radius * 1.05);
                ocean.addColorStop(0, '#123048');
                ocean.addColorStop(0.45, '#08182a');
                ocean.addColorStop(1, '#01060d');
                const shade = ctx.createRadialGradient(ox, oy, radius * 0.1, c, c, radius);
                shade.addColorStop(0, 'rgba(255, 255, 255, 0.10)');
                shade.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
                shade.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
                grads = gradientsRef.current = { size, halo, ocean, shade };
            }

            // advance auto-rotation (paused while dragging, hovering, or a country is pinned)
            if (
                autoRotateRef.current &&
                !dragRef.current.active &&
                hoverRef.current < 0 &&
                selectedRef.current < 0
            ) {
                rotationRef.current.lambda += 0.18;
            }
            proj.rotate([rotationRef.current.lambda, rotationRef.current.phi]);

            ctx.clearRect(0, 0, size, size);

            // 1. atmosphere halo behind the sphere
            ctx.beginPath();
            ctx.arc(c, c, radius * 1.18, 0, 2 * Math.PI);
            ctx.fillStyle = grads.halo;
            ctx.fill();

            // 2. ocean sphere (lit from the upper-left)
            ctx.beginPath();
            ctx.arc(c, c, radius, 0, 2 * Math.PI);
            ctx.fillStyle = grads.ocean;
            ctx.fill();

            // clip everything else to the sphere
            ctx.save();
            ctx.beginPath();
            ctx.arc(c, c, radius, 0, 2 * Math.PI);
            ctx.clip();

            // 3. graticule
            ctx.beginPath();
            path(world.graticule);
            ctx.strokeStyle = 'rgba(130, 160, 180, 0.10)';
            ctx.lineWidth = 0.6;
            ctx.stroke();

            // 4. land
            ctx.beginPath();
            path(world.land);
            ctx.fillStyle = '#22384c';
            ctx.fill();
            ctx.strokeStyle = `rgba(${ACCENT_RGB}, 0.20)`;
            ctx.lineWidth = 0.5;
            ctx.stroke();

            // 5. spherical shading: soft highlight + limb vignette
            ctx.fillStyle = grads.shade;
            ctx.fillRect(0, 0, size, size);
            ctx.restore();

            // sphere rim
            ctx.beginPath();
            ctx.arc(c, c, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = `rgba(${ACCENT_RGB}, 0.35)`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // 6. markers (cache the projected points so hit-testing reuses them)
            const pts = visibleMarkers(proj);
            projectedRef.current = pts;
            const hoveredIdx = hoverRef.current;
            const selectedIdx = selectedRef.current;
            const pulse = 0.5 + 0.5 * Math.sin(time / 480);
            let labelPoint = null;

            pts.forEach(({ index, marker, x, y, fade }) => {
                const isHover = index === hoveredIdx;
                const isSelected = index === selectedIdx;
                const isActive = isHover || isSelected;
                const rgb = marker.active ? ACCENT_RGB : PILOT_RGB;
                const core = marker.active ? ACCENT : PILOT;
                const base = Math.max(3, size * 0.011);
                const r = isActive ? base * 1.7 : base;

                // glow
                const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 4.5);
                glow.addColorStop(0, `rgba(${rgb}, ${(isSelected ? 0.7 : 0.55) * fade})`);
                glow.addColorStop(1, `rgba(${rgb}, 0)`);
                ctx.beginPath();
                ctx.arc(x, y, r * 4.5, 0, 2 * Math.PI);
                ctx.fillStyle = glow;
                ctx.fill();

                // pinned selection: a steady ring; hover: a soft pulsing ring
                if (isSelected) {
                    ctx.beginPath();
                    ctx.arc(x, y, r + 6, 0, 2 * Math.PI);
                    ctx.strokeStyle = `rgba(${rgb}, 0.9)`;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                } else if (isHover) {
                    const ring = r + 5 + pulse * 6;
                    ctx.beginPath();
                    ctx.arc(x, y, ring, 0, 2 * Math.PI);
                    ctx.strokeStyle = `rgba(${rgb}, ${0.5 * (1 - pulse)})`;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }

                // dot
                ctx.beginPath();
                ctx.arc(x, y, r, 0, 2 * Math.PI);
                ctx.fillStyle = core;
                ctx.globalAlpha = isActive ? 1 : 0.55 + 0.45 * fade;
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.lineWidth = 1.5;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
                ctx.stroke();

                // label the hovered marker, or the pinned one when nothing is hovered
                if (isHover || (isSelected && hoveredIdx < 0)) labelPoint = { x, y, marker };
            });

            // 7. label for the active (hovered / pinned) marker
            if (labelPoint) {
                const { x, y, marker } = labelPoint;
                ctx.font =
                    '600 13px ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
                const padX = 9;
                const w = ctx.measureText(marker.name).width + padX * 2;
                const h = 24;
                let lx = x + 16;
                let ly = y - h / 2;
                if (lx + w > size - 4) lx = x - 16 - w; // flip if it would overflow
                ly = clamp(ly, 4, size - h - 4);
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(lx, ly, w, h, 6);
                else ctx.rect(lx, ly, w, h);
                ctx.fillStyle = 'rgba(2, 8, 19, 0.92)';
                ctx.fill();
                ctx.strokeStyle = `rgba(${ACCENT_RGB}, 0.45)`;
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.fillStyle = '#f8fafc';
                ctx.textBaseline = 'middle';
                ctx.fillText(marker.name, lx + padX, ly + h / 2 + 1);
            }
        },
        [ensureProjection, visibleMarkers]
    );

    // --- sizing -------------------------------------------------------------
    useEffect(() => {
        const stage = stageRef.current;
        const canvas = canvasRef.current;
        if (!stage || !canvas) return;

        const resize = () => {
            const size = Math.round(stage.clientWidth);
            if (!size) return;
            sizeRef.current = size;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = size * dpr;
            canvas.height = size * dpr;
            canvas.style.height = `${size}px`;
            const ctx = canvas.getContext('2d');
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ensureProjection(size);
        };

        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(stage);
        return () => ro.disconnect();
    }, [ensureProjection]);

    // --- load world + start loop -------------------------------------------
    useEffect(() => {
        let cancelled = false;
        fetch(WORLD_URL)
            .then((r) => r.json())
            .then((topo) => {
                if (cancelled) return;
                worldRef.current = {
                    land: feature(topo, topo.objects.land),
                    graticule: geoGraticule().step([20, 20])(),
                };
                setReady(true);
            })
            .catch(() => {
                /* leave the list-only fallback in place */
            });

        // Pause the RAF loop when the globe scrolls out of view.
        let observer;
        const stage = stageRef.current;
        const loop = (t) => {
            renderFrame(t);
            rafRef.current = requestAnimationFrame(loop);
        };
        const start = () => {
            if (!rafRef.current) rafRef.current = requestAnimationFrame(loop);
        };
        const stop = () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = 0;
            }
        };
        // Run immediately; the observer only pauses/resumes to save CPU when the
        // globe scrolls out of view (never blocks the initial start).
        start();
        if (stage && 'IntersectionObserver' in window) {
            observer = new IntersectionObserver(
                ([entry]) => (entry.isIntersecting ? start() : stop()),
                { threshold: 0 }
            );
            observer.observe(stage);
        }

        return () => {
            cancelled = true;
            if (observer) observer.disconnect();
            stop();
            clearTimeout(resumeTimerRef.current);
        };
    }, [renderFrame]);

    // --- interaction --------------------------------------------------------
    // Reuses the marker positions the render loop already projected this frame,
    // rather than re-projecting on every pointermove.
    const pickMarker = useCallback((clientX, clientY) => {
        const canvas = canvasRef.current;
        const pts = projectedRef.current;
        if (!canvas || !pts) return -1;
        const rect = canvas.getBoundingClientRect();
        const px = clientX - rect.left;
        const py = clientY - rect.top;
        const threshold = Math.max(16, sizeRef.current * 0.03);
        let best = -1;
        let bestDist = threshold;
        pts.forEach(({ index, x, y }) => {
            const d = Math.hypot(px - x, py - y);
            if (d < bestDist) {
                bestDist = d;
                best = index;
            }
        });
        return best;
    }, []);

    const setHover = useCallback((index) => {
        if (hoverRef.current === index) return;
        hoverRef.current = index;
        setHovered(index >= 0 ? markersRef.current[index] : null);
    }, []);

    const select = useCallback((index) => {
        selectedRef.current = index;
        setSelected(index >= 0 ? markersRef.current[index] : null);
    }, []);

    // Clear the pinned country and let the globe resume spinning.
    const clearSelection = useCallback(() => {
        select(-1);
        setHover(-1);
        autoRotateRef.current = true;
    }, [select, setHover]);

    const onPointerDown = useCallback((e) => {
        const canvas = canvasRef.current;
        dragRef.current = { active: true, moved: 0, x: e.clientX, y: e.clientY };
        autoRotateRef.current = false;
        clearTimeout(resumeTimerRef.current);
        canvas.setPointerCapture?.(e.pointerId);
    }, []);

    const onPointerMove = useCallback(
        (e) => {
            const drag = dragRef.current;
            if (drag.active) {
                const dx = e.clientX - drag.x;
                const dy = e.clientY - drag.y;
                drag.moved += Math.abs(dx) + Math.abs(dy);
                drag.x = e.clientX;
                drag.y = e.clientY;
                const k = 70 / (sizeRef.current * 0.42);
                const rot = rotationRef.current;
                rot.lambda += dx * k;
                rot.phi = clamp(rot.phi - dy * k, -85, 85);
                return;
            }
            const hit = pickMarker(e.clientX, e.clientY);
            setHover(hit);
            const canvas = canvasRef.current;
            if (canvas) canvas.style.cursor = hit >= 0 ? 'pointer' : 'grab';
        },
        [pickMarker, setHover]
    );

    const endDrag = useCallback(() => {
        // resume auto-rotation a moment after the user lets go
        clearTimeout(resumeTimerRef.current);
        resumeTimerRef.current = setTimeout(() => {
            autoRotateRef.current = true;
        }, 2500);
    }, []);

    const onPointerUp = useCallback(
        (e) => {
            const drag = dragRef.current;
            const wasDrag = drag.moved > 8;
            drag.active = false;
            canvasRef.current?.releasePointerCapture?.(e.pointerId);

            if (wasDrag) {
                endDrag();
                return;
            }
            // A click/tap pins the marker under the cursor (a persistent card you
            // can read and follow through). Clicking empty ocean clears it.
            // Navigation happens via the card's explicit "View …" link.
            const hit = pickMarker(e.clientX, e.clientY);
            if (hit >= 0) {
                select(hit);
                setHover(hit);
            } else {
                clearSelection();
                endDrag();
            }
        },
        [clearSelection, endDrag, pickMarker, select, setHover]
    );

    const onPointerLeave = useCallback(() => {
        if (dragRef.current.active) return;
        setHover(-1);
    }, [setHover]);

    // The panel shows the hovered preview if any, otherwise the pinned country,
    // otherwise the intro. The dismiss affordance appears only when we're
    // actually resting on the pinned card (not previewing a different marker).
    const shown = hovered || selected;
    const isPinned = !!selected && (!hovered || hovered.slug === selected.slug);

    return (
        <div className="wfGlobeExplorer">
            <div className="wfGlobeStageWrap">
                <div
                    ref={stageRef}
                    className={`wfGlobeStage${ready ? ' is-ready' : ''}`}
                    aria-hidden="true"
                >
                    <canvas
                        ref={canvasRef}
                        className="wfGlobeCanvas"
                        onPointerDown={onPointerDown}
                        onPointerMove={onPointerMove}
                        onPointerUp={onPointerUp}
                        onPointerLeave={onPointerLeave}
                    />
                </div>
                <p className="wfGlobeHintMobile">Drag to spin · tap a marker to pin its details</p>
            </div>

            <aside className="wfGlobePanel" aria-live="polite">
                {shown ? (
                    <div className={`wfGlobeCard${isPinned ? ' is-pinned' : ''}`}>
                        {isPinned && (
                            <button
                                type="button"
                                className="wfGlobeCardClose"
                                onClick={clearSelection}
                                aria-label={`Clear ${shown.name}`}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        d="M6 6l12 12M18 6L6 18"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </button>
                        )}
                        <div className="wfGlobeCardHead">
                            {shown.flagSrc && (
                                <Image
                                    src={shown.flagSrc}
                                    alt=""
                                    width={34}
                                    height={23}
                                    unoptimized
                                    className="wfGlobeCardFlag"
                                />
                            )}
                            <h3 className="wfGlobeCardName">{shown.name}</h3>
                        </div>
                        <span
                            className={`wfMetaPill wfGlobeBadge${shown.active ? ' is-active' : ''}`}
                        >
                            {shown.active ? 'Active deployment' : 'Pilot & emerging'}
                        </span>
                        {shown.themes.length > 0 && (
                            <div className="wfGlobeTags">
                                {shown.themes.map((t) => (
                                    <span key={t} className="wfMetaPill wfMetaPill--plain">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        )}
                        {(shown.tools > 0 || shown.projects > 0) && (
                            <p className="wfGlobeCardStats">
                                {shown.tools > 0 && (
                                    <span>
                                        <strong>{shown.tools}</strong>{' '}
                                        {shown.tools === 1 ? 'tool' : 'tools'}
                                    </span>
                                )}
                                {shown.tools > 0 && shown.projects > 0 && (
                                    <span className="wfGlobeDot">·</span>
                                )}
                                {shown.projects > 0 && (
                                    <span>
                                        <strong>{shown.projects}</strong>{' '}
                                        {shown.projects === 1 ? 'project' : 'projects'}
                                    </span>
                                )}
                            </p>
                        )}
                        <Link href={countryHref(shown.slug)} className="wfGlobeCardLink">
                            View {shown.name} →
                        </Link>
                    </div>
                ) : (
                    <div className="wfGlobeIntro">
                        <p className="wfSectionKicker">The portfolio, mapped</p>
                        <p className="wfGlobeIntroLead">
                            {markers.length} countries where WorldFish Digital tools and projects
                            reach the water.
                        </p>
                        <ul className="wfGlobeLegend">
                            <li>
                                <span className="wfGlobeSwatch is-active" />
                                Active deployment
                                <span className="wfGlobeLegendCount">{active.length}</span>
                            </li>
                            <li>
                                <span className="wfGlobeSwatch is-pilot" />
                                Pilot &amp; emerging
                                <span className="wfGlobeLegendCount">{pilot.length}</span>
                            </li>
                        </ul>
                        <p className="wfGlobeIntroHint">
                            Drag to spin the globe. Hover a marker to preview a country, then click
                            to pin its details.
                        </p>
                    </div>
                )}
            </aside>
        </div>
    );
}
