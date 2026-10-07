import { areaColor } from '../detail/meta';

/**
 * Browse the portfolio by impact area — the control, pinned.
 *
 * It sticks below the site header so it stays with the reader all the way down the list it
 * governs.
 *
 * **Hover selects, and the selection stays** until another chip is hovered, focused or tapped,
 * or until "All" clears it. Moving the pointer away changes nothing — the whole point is to
 * leave the bar and go read the result, which a selection that cleared on mouseleave made
 * impossible: the answer vanished the moment you moved toward it.
 *
 * There is exactly one piece of state, so nothing competes. A previous attempt kept a hover
 * *preview* alongside a clicked *pin*, and a drift of the pointer silently replaced a
 * deliberate choice. Hover, keyboard focus and tap all set the same thing, so the control
 * behaves identically under a mouse, a keyboard and a thumb; only tapping also scrolls, since
 * only a tap is unambiguous enough to move the page on.
 *
 * "All" leads the row so there is always a visible way back to the unfiltered list rather
 * than a reset hidden somewhere; counts sit inline because they are the quickest signal of
 * where the work actually is.
 *
 * Chips are buttons, not links: they filter the list beneath them rather than navigate away.
 * The panel head carries a link to the selected area's full page, and /our-work lists them all.
 *
 * Only the real impact areas appear. "Shared Infrastructure" is not one: it is the entry in
 * themes.json flagged `crossCutting`, which the sync files a record under when its Airtable
 * `Impact area(s)` is blank. Exactly one tool is in it today and that tool's impact area is
 * simply unfilled, so showing it here advertised a data gap as a domain and cost a whole row
 * to do it. The bucket is still reachable at /our-work and from the tool's own page; it
 * disappears for good once that record is tagged.
 */
function AreaChip({ area, active, onSelect }) {
    return (
        <button
            type="button"
            className={`wfAreaChip${active ? ' wfAreaChipActive' : ''}`}
            style={{ '--wf-area-accent': areaColor(area.slug) }}
            aria-pressed={active}
            onMouseEnter={() => onSelect(area.slug)}
            onFocus={() => onSelect(area.slug)}
            onClick={() => onSelect(area.slug, { scroll: true })}
        >
            <span
                className="wfAreaChipDot"
                style={{ backgroundColor: areaColor(area.slug) }}
                aria-hidden="true"
            />
            <span className="wfAreaName">{area.name}</span>
            {area.productSlugs.length > 0 && (
                <span className="wfAreaCount">
                    {area.productSlugs.length}
                    <span className="wfSrOnly"> tools</span>
                </span>
            )}
        </button>
    );
}

export default function AreasStrip({ areas, active, onSelect, onClear, stuck }) {
    const impactAreas = areas.filter((area) => !area.crossCutting);

    return (
        <nav
            className={`wfAreasStrip${stuck ? ' wfAreasStripStuck' : ''}`}
            aria-label="Browse the portfolio by impact area"
        >
            <div className="container">
                <p className="wfAreasLabel">Browse by impact area</p>

                <ul className="wfAreasList">
                    <li>
                        <button
                            type="button"
                            className={`wfAreaChip wfAreaChipAll${active ? '' : ' wfAreaChipActive'}`}
                            aria-pressed={!active}
                            onMouseEnter={onClear}
                            onFocus={onClear}
                            onClick={onClear}
                        >
                            All
                        </button>
                    </li>
                    {impactAreas.map((area) => (
                        <li key={area.slug}>
                            <AreaChip
                                area={area}
                                active={active === area.slug}
                                onSelect={onSelect}
                            />
                        </li>
                    ))}
                </ul>

            </div>
        </nav>
    );
}
