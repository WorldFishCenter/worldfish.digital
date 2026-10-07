/**
 * The top of every entity page — impact area, country, initiative, tool.
 *
 * Carries `facts`: the three or four things a reader needs before anything below makes
 * sense. Where an initiative runs, when, and who funds it is the context for its tool list,
 * not a footnote to it — and that was exactly the bug this fixes. Every entity page used to
 * put all its facts in a block at the very bottom titled "in short", so a reader met a
 * thirteen-item inventory and an architecture diagram before learning the work ran in six
 * countries. The rest of the facts still live at the bottom, in the full record; these are
 * only the ones needed to read the page.
 *
 * `leading` is a flag or logo above the title, `media` an image beside it; both are optional
 * so the country page, which has both, uses this component rather than its own hero.
 * `children` are the actions and pills, under the lead and above the facts.
 */
function Facts({ facts }) {
    // `value == null` rather than falsy: a count of 0 is a value the caller chose to
    // suppress by passing null, but an empty string or undefined is simply absent.
    const visible = facts.filter((fact) => fact && fact.value != null && fact.value !== '');
    if (visible.length === 0) return null;

    return (
        <dl className="wfHeroFacts">
            {visible.map((fact) => (
                <div key={fact.label} className="wfHeroFact">
                    <dt className="wfHeroFactLabel">{fact.label}</dt>
                    <dd className="wfHeroFactValue">{fact.value}</dd>
                </div>
            ))}
        </dl>
    );
}

export default function DetailHero({ kicker, title, lead, facts, leading, media, children }) {
    const body = (
        <>
            {kicker && <p className="wfSectionKicker">{kicker}</p>}
            {leading}
            {/* The two-column head needs the full container. Beside an image it has only
                seven columns to split, which turns the lead into a ladder of three-word
                lines, so it stacks instead. */}
            <div className={media ? 'wfDarkHead wfDarkHeadStacked' : 'wfDarkHead'}>
                <h1 className="wfSectionTitle">{title}</h1>
                {lead && <p className="wfDarkHeadLead">{lead}</p>}
            </div>
            {children}
            {facts && <Facts facts={facts} />}
        </>
    );

    return (
        <section className="section-box wfSectionDark wfPadHeroSm">
            <div className="container">
                {media ? (
                    <div className="row align-items-center">
                        <div className="col-lg-7">{body}</div>
                        <div className="col-lg-5 d-none d-lg-block">{media}</div>
                    </div>
                ) : (
                    body
                )}
            </div>
        </section>
    );
}
