import { Fragment } from 'react';
import Link from 'next/link';

/**
 * An entity's supporting facts, on the light editorial surface.
 *
 * Replaces the sticky sidebar of pills. On a busy impact area that sidebar ran to about
 * thirty identical chips — countries, audiences and funders all styled the same — which
 * is dense to scan and gives every fact the same weight. Here each fact is a labelled
 * line, in the order a reader wants them, and links stay links instead of becoming
 * tags that happen to be clickable.
 *
 * It closes every entity page, and is deliberately the same on all four: same kicker, same
 * title, same promise. It used to be titled "<name> in short" / "<name> at a glance" / on an
 * impact area the area's own tagline, which made one recurring element read as four
 * different things — and "in short" was a poor name for the longest list on the page. The
 * facts a reader needs in order to read the page at all now sit in the hero; what is left
 * here is the rest of the record, which is what it should have been called all along.
 *
 * rows: [{ label, value }] — value may be a string, a node, or an array of
 * { href, label } which renders as inline comma-separated links. Empty rows drop out.
 */
export default function DetailFacts({
    kicker = 'Reference',
    title = 'The full record',
    lead = 'Everything else this record holds, as the portfolio database stores it.',
    rows,
}) {
    const visible = (rows || []).filter(
        (row) => row && row.value && (!Array.isArray(row.value) || row.value.length > 0)
    );
    if (visible.length === 0) return null;

    return (
        <section className="section-box wfSectionPaper wfSectionPaperAlt">
            <div className="container">
                <p className="wfPaperKicker">{kicker}</p>
                {(title || lead) && (
                    <div className="wfPaperHead">
                        {title && <h2 className="wfPaperTitle">{title}</h2>}
                        {lead && <p className="wfPaperLead">{lead}</p>}
                    </div>
                )}
                <ul className="wfUnlockList">
                    {visible.map((row) => (
                        <li key={row.label} className="wfUnlockItem">
                            <div className="wfUnlockHorizon">{row.label}</div>
                            <p className="wfUnlockBody">
                                {Array.isArray(row.value)
                                    ? row.value.map((item, i) => (
                                          <Fragment key={item.href || item.label}>
                                              {i > 0 && ', '}
                                              {item.href ? (
                                                  <Link href={item.href} className="wfEvidenceLink">
                                                      {item.label}
                                                  </Link>
                                              ) : (
                                                  item.label
                                              )}
                                          </Fragment>
                                      ))
                                    : row.value}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
