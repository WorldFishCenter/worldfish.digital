import Link from 'next/link';

/**
 * "Where additional funding would go."
 *
 * The meeting was explicit that the forward ask should be central to the design
 * rather than a footnote — funders are reading for what their money changes,
 * not only for the back catalogue. Kept on the light editorial surface directly
 * after the results so the ask sits next to the track record it rests on.
 */
export default function UnlocksSection({ unlocks, contactEmail }) {
    const { kicker, title, lead, items } = unlocks;

    return (
        <section className="section-box wfSectionPaper wfSectionPaperAlt">
            <div className="container">
                <p className="wfPaperKicker">{kicker}</p>
                <div className="wfPaperHead">
                    <h2 className="wfPaperTitle">{title}</h2>
                    <p className="wfPaperLead">{lead}</p>
                </div>

                <ul className="wfUnlockList">
                    {items.map((item) => (
                        <li key={item.title} className="wfUnlockItem">
                            <div className="wfUnlockHorizon">{item.horizon}</div>
                            <div>
                                <h3 className="wfUnlockTitle">{item.title}</h3>
                                <p className="wfUnlockBody">{item.body}</p>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="d-flex flex-wrap gap-3 mt-50">
                    <Link href="/for-partners" className="wfBtnInk">
                        Portfolio for partners
                    </Link>
                    {contactEmail && (
                        <a href={`mailto:${contactEmail}`} className="wfBtnInkGhost">
                            Start a conversation
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}
