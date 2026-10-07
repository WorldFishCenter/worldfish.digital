import { Fragment } from 'react';
import Link from 'next/link';
import { countryHref } from '@/lib/routes.mjs';

/**
 * Evidenced outcomes, one editorial row each — the site's answer to "what does this
 * change?". Rows are WFD Outcomes records, shown only once marked Live.
 *
 * Deliberately has no aggregate figure band: unattributed totals are the pattern readers
 * discount, and the team will not publish a number it cannot trace to a source. So each
 * row carries a place, a named counterpart, and its evidence status.
 *
 * The evidence status is printed on every row, whatever it is. A claim with no study
 * behind it publishes labelled as such rather than passing as proven — that label is the
 * whole guard, so it is never conditional.
 *
 * Renders nothing when there are no outcomes; the caller decides whether an empty state
 * is worth saying out loud. `hideArea` drops the impact-area line on a page that already
 * is that impact area.
 */
/** The one status that reads as settled; every other is set in the softer, pending style. */
const PUBLISHED = 'Independent study published';

export default function ResultsSection({ heading, outcomes, hideArea = false }) {
    if (!outcomes || outcomes.length === 0) return null;

    return (
        <section id="results" className="section-box wfSectionPaper">
            <div className="container">
                <p className="wfPaperKicker">{heading.kicker}</p>
                <div className="wfPaperHead">
                    <h2 className="wfPaperTitle">{heading.title}</h2>
                    {heading.lead && <p className="wfPaperLead">{heading.lead}</p>}
                </div>

                <ul className="wfResultList">
                    {outcomes.map((outcome) => {
                        const source = outcome.evidenceUrl || outcome.document?.src || null;

                        return (
                            <li key={outcome.id} className="wfResultRow">
                                <div className="wfResultPlace">
                                    {outcome.countries.map((country, i) => (
                                        <Fragment key={country.slug}>
                                            {i > 0 && ', '}
                                            <Link
                                                href={countryHref(country.slug)}
                                                className="wfEvidenceLink"
                                            >
                                                {country.name}
                                            </Link>
                                        </Fragment>
                                    ))}
                                    {outcome.since && (
                                        <span className="wfResultPlaceSince">
                                            {/* A year takes "Since"; a word like "Ongoing" stands alone. */}
                                            {Number.isNaN(Number(outcome.since))
                                                ? outcome.since
                                                : `Since ${outcome.since}`}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <p className="wfResultClaim">{outcome.claim}</p>
                                    {outcome.detail && (
                                        <p className="wfResultDetail">{outcome.detail}</p>
                                    )}
                                </div>

                                <div className="wfResultMeta">
                                    {!hideArea && outcome.impactAreas.length > 0 && (
                                        <div>
                                            <span className="wfResultMetaLabel">Impact area</span>
                                            <span className="wfResultMetaValue">
                                                {outcome.impactAreas.join(' · ')}
                                            </span>
                                        </div>
                                    )}
                                    {outcome.partner && (
                                        <div>
                                            <span className="wfResultMetaLabel">With</span>
                                            <span className="wfResultMetaValue">{outcome.partner}</span>
                                        </div>
                                    )}
                                    <div>
                                        <span className="wfResultMetaLabel">Evidence</span>
                                        <span
                                            className={
                                                outcome.evidenceStatus === PUBLISHED
                                                    ? 'wfResultMetaValue'
                                                    : 'wfEvidencePending'
                                            }
                                        >
                                            {outcome.evidenceStatus}
                                        </span>
                                        {source ? (
                                            <a
                                                className="wfEvidenceLink d-block"
                                                href={source}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {outcome.evidenceLabel || 'Source'} ↗
                                            </a>
                                        ) : (
                                            outcome.evidenceLabel && (
                                                <span className="wfResultMetaValue d-block">
                                                    {outcome.evidenceLabel}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
