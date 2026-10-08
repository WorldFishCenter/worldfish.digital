'use client';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { areaColor } from '../detail/meta';

/**
 * Browse the portfolio by impact area — a tab bar, pinned.
 *
 * These were filter chips. They are tabs: one selection at a time, revealing one panel.
 * Chips are the pattern for *refining* a list and usually multi-select, which is not what
 * this does, and the mismatch cost real accessibility — the chips announced themselves as
 * seven independent toggles, and a keyboard had to step through every one. As tabs they are a
 * `tablist` with roving focus, so arrow keys move between areas, Home and End jump to the
 * ends, and the panel is announced as belonging to the selected tab.
 *
 * **Hover selects, and the selection stays** until another tab is hovered, focused or tapped.
 * Moving the pointer away changes nothing — the point is to leave the bar and read the result.
 * Focus selects too, which is the standard "automatic activation" tab behaviour, so hover,
 * keyboard and tap all do the same thing.
 *
 * The bridge between the bar and the panel is a **sliding indicator** in the selected area's
 * colour, with a caret rising out of it. It animates its position and width rather than
 * fading, measured from the live tab rect, so it reads as one object travelling between tabs
 * rather than seven that light up. Measuring beats CSS anchor positioning here: it behaves
 * the same in every browser, and the bar is sticky, so the indicator has to stay glued to the
 * bar rather than to a page position.
 */
const ALL = '__all__';

export default function AreaTabs({ areas, active, panelId, onSelect, onClear, stuck }) {
    const listRef = useRef(null);
    const tabRefs = useRef(new Map());
    const [marker, setMarker] = useState(null);

    // "Shared Infrastructure" is not an impact area. It is the cross-cutting entry the sync
    // files a record under when its Airtable `Impact area(s)` is blank, so putting it here
    // advertises a data gap as a domain — and it is the tab that pushes the row to wrap.
    // Its one tool still appears under "All" and on its own page.
    const tabs = areas.filter((area) => !area.crossCutting);

    const current = active ?? ALL;
    const order = [ALL, ...tabs.map((area) => area.slug)];

    const setRef = useCallback(
        (key) => (el) => {
            if (el) tabRefs.current.set(key, el);
            else tabRefs.current.delete(key);
        },
        []
    );

    // The indicator follows the selected tab's real box, so it stays correct when the labels
    // wrap, the bar tightens on pinning, or the font loads late.
    const measure = useCallback(() => {
        const list = listRef.current;
        const tab = tabRefs.current.get(current);
        if (!list || !tab) return;
        const a = list.getBoundingClientRect();
        const b = tab.getBoundingClientRect();
        setMarker({ x: b.left - a.left, w: b.width });
    }, [current]);

    useLayoutEffect(() => {
        measure();
        const list = listRef.current;
        if (!list || typeof ResizeObserver === 'undefined') {
            window.addEventListener('resize', measure);
            return () => window.removeEventListener('resize', measure);
        }
        const observer = new ResizeObserver(measure);
        observer.observe(list);
        tabRefs.current.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [measure, stuck]);

    const choose = (key, options) => (key === ALL ? onClear() : onSelect(key, options));

    const onKeyDown = (event) => {
        const i = order.indexOf(current);
        const to =
            { ArrowLeft: i - 1, ArrowRight: i + 1, Home: 0, End: order.length - 1 }[event.key] ??
            null;
        if (to === null) return;
        event.preventDefault();
        const next = order[(to + order.length) % order.length];
        choose(next);
        tabRefs.current.get(next)?.focus();
    };

    const tabProps = (key) => ({
        role: 'tab',
        id: `${panelId}-tab-${key}`,
        'aria-selected': current === key,
        'aria-controls': panelId,
        tabIndex: current === key ? 0 : -1,
        ref: setRef(key),
        onMouseEnter: () => choose(key),
        onFocus: () => choose(key),
        onClick: () => choose(key, { scroll: true }),
    });

    const accent = active ? areaColor(active) : 'var(--wf-text-slate-200)';

    return (
        <nav className={`wfAreaTabs${stuck ? ' wfAreaTabsStuck' : ''}`}>
            <div className="container">
                {/* No visible heading: it cost a row and the tabs say what they are. The
                    accessible name lives on the tablist instead. */}
                <div
                    className="wfTabList"
                    role="tablist"
                    aria-label="Browse the portfolio by impact area"
                    ref={listRef}
                    onKeyDown={onKeyDown}
                >
                    <button type="button" className="wfTab wfTabAll" {...tabProps(ALL)}>
                        <span className="wfTabName">All</span>
                    </button>

                    {tabs.map((area) => (
                        <button
                            key={area.slug}
                            type="button"
                            className="wfTab"
                            style={{ '--wf-area-accent': areaColor(area.slug) }}
                            {...tabProps(area.slug)}
                        >
                            <span
                                className="wfTabDot"
                                style={{ backgroundColor: areaColor(area.slug) }}
                                aria-hidden="true"
                            />
                            <span className="wfTabName">{area.name}</span>
                            {area.productSlugs.length > 0 && (
                                <span className="wfTabCount">
                                    {area.productSlugs.length}
                                    <span className="wfSrOnly"> tools</span>
                                </span>
                            )}
                        </button>
                    ))}

                    {/* The bridge: one object that travels, with a caret pointing into the
                        panel it governs. Hidden until measured so it never flashes at 0,0. */}
                    {marker && (
                        <span
                            className="wfTabMarker"
                            aria-hidden="true"
                            style={{
                                transform: `translateX(${marker.x}px)`,
                                width: `${marker.w}px`,
                                '--wf-area-accent': accent,
                            }}
                        >
                            <span className="wfTabCaret" />
                        </span>
                    )}
                </div>
            </div>
        </nav>
    );
}
