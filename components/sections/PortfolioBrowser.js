'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import AreaTabs from './AreaTabs';
import InitiativeList from './InitiativeList';
import { areaColor, countLabel } from '../detail/meta';
import { themeHref } from '@/lib/routes.mjs';

/**
 * The portfolio, browsed by impact area.
 *
 * Two parts, nothing between them: the chip bar, and the list it governs. An earlier version
 * put a kicker, a display heading and a lead in between — about four hundred pixels — so
 * pointing at a chip changed something below the fold and the control looked broken. The
 * explanation is gone entirely; the bar's own label says what it is, and the hero above
 * already says what the portfolio is.
 *
 * Selecting an area **shows that area's work**. Dimming everything else was the first attempt
 * and was wrong twice over: with three initiatives it left a mostly-grey page, and the match
 * was not necessarily first, so choosing Productive Aquaculture put a muted Peskas at the top.
 * The panel now contains exactly what was asked for and its heading says so.
 *
 * Colour carries the connection: the chip, the rule across the top of the panel and the dot
 * beside the panel's heading are all the area's own colour.
 *
 * One selection, set by hovering, focusing or tapping a tab — and it **stays** until another
 * is chosen or "All" clears it, so you can leave the bar and go read the result. See AreaTabs.
 *
 * The selected area's colour runs the whole way through: the tab, the sliding indicator and
 * its caret, the rule along the top of the panel, a wash that fades out of that rule, the
 * heading dot and the link out. One colour, one thing being looked at.
 *
 * Only a tap scrolls the panel under the pinned bar. Hover must not move the page: it would
 * slide the chip out from under the pointer, and it is what WCAG 2.2.2 and the
 * scroll-hijacking literature warn against. The scroll honours a reduced-motion preference.
 */

/** The tools in `group` that belong to `slug`, or all of them when the initiative itself does. */
function scope(group, slug) {
    if (!slug) return group.tools;
    const matching = group.tools.filter((tool) => (tool.themeSlugs || []).includes(slug));
    if (matching.length > 0) return matching;
    // An initiative tagged to the area whose tools are not individually tagged: show its
    // work rather than an empty block.
    return (group.initiative?.themeSlugs || []).includes(slug) ? group.tools : [];
}

/** Ties each tab to the panel it controls, for `aria-controls` / `aria-labelledby`. */
const PANEL_ID = 'wf-portfolio-panel';

export default function PortfolioBrowser({ areas, groups, data, countryName }) {
    const [active, setActive] = useState(null);
    const [stuck, setStuck] = useState(false);
    const sentinelRef = useRef(null);
    const panelRef = useRef(null);

    // A sentinel above the bar tells us when the bar has pinned, so it can gain a shadow and
    // tighten up. Cheaper and smoother than listening to scroll.
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || typeof IntersectionObserver === 'undefined') return undefined;
        const observer = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting), {
            threshold: 0,
        });
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, []);

    const area = areas.find((a) => a.slug === active) || null;

    // Only on click: the reader asked for it, so moving the page is answering them rather
    // than hijacking. Honours a reduced-motion preference.
    const revealPanel = useCallback(() => {
        const panel = panelRef.current;
        if (!panel) return;
        const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (panel.getBoundingClientRect().top < 0 || !reduced) {
            panel.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        }
    }, []);

    const select = useCallback(
        (slug, options) => {
            setActive(slug);
            if (options?.scroll) revealPanel();
        },
        [revealPanel]
    );

    const visible = groups
        .map((group) => ({ ...group, tools: scope(group, active) }))
        .filter((group) => group.tools.length > 0);

    const toolCount = visible.reduce((n, group) => n + group.tools.length, 0);
    const initiativeCount = visible.filter((group) => group.initiative).length;

    return (
        <>
            <div ref={sentinelRef} aria-hidden="true" className="wfStickySentinel" />

            <AreaTabs
                areas={areas}
                active={active}
                stuck={stuck}
                panelId={PANEL_ID}
                onSelect={select}
                onClear={() => setActive(null)}
            />

            <section
                ref={panelRef}
                id={PANEL_ID}
                role="tabpanel"
                aria-labelledby={`${PANEL_ID}-tab-${active ?? '__all__'}`}
                tabIndex={-1}
                className={`section-box wfSectionPaper wfPortfolioPanel${
                    area ? ' wfPortfolioPanelTinted' : ''
                }`}
                style={area ? { '--wf-area-accent': areaColor(area.slug) } : undefined}
            >
                <div className="container">
                    <div className="wfPanelHead">
                        <h2 className="wfPanelTitle">
                            {area ? (
                                <>
                                    <span
                                        className="wfPanelDot"
                                        style={{ backgroundColor: areaColor(area.slug) }}
                                        aria-hidden="true"
                                    />
                                    {area.name}
                                </>
                            ) : (
                                data.allLabel
                            )}
                        </h2>
                        <p className="wfPanelCount">
                            {[
                                initiativeCount > 0 && countLabel(initiativeCount, 'initiative'),
                                countLabel(toolCount, 'tool'),
                            ]
                                .filter(Boolean)
                                .join(' · ')}
                        </p>
                        {area && (
                            <Link href={themeHref(area.slug)} className="wfPanelLink">
                                Open {area.name} <span aria-hidden="true">→</span>
                            </Link>
                        )}
                    </div>

                    <InitiativeList
                        groups={visible}
                        countryName={countryName}
                        standalone={{ title: data.standaloneTitle, lead: data.standaloneLead }}
                    />
                </div>
            </section>
        </>
    );
}
