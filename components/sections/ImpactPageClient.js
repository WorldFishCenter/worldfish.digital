import Layout from '../layout/Layout';
import ResultsSection from './ResultsSection';

/**
 * The second level of Alex's progressive-depth pattern: high-level story on the
 * homepage, the evidence itself here, the data behind it a click further on.
 *
 * The methodology note is the reason this page is more than a table that got evicted
 * from the homepage. A row that reads "No assessment yet" looks like an apology until
 * the standard being applied is stated; once it is, the same label reads as a policy.
 * That was the original objection — "if I read that, would I really believe it?" —
 * answered directly. It stays up when there are no outcomes yet, for the same reason.
 */
export default function ImpactPageClient({ copy, outcomes }) {
    const { results, methodology } = copy;

    return (
        <Layout>
            <section className="section-box wfSectionDark wfPadHeroSm">
                <div className="container">
                    <div className="wfHeroSplit">
                        <h1 className="wfDisplay2 wfHeroStatement">Impact</h1>
                        <div className="wfHeroAside">
                            <p className="wfSubtitleWide">
                                What the portfolio has changed, where, and with whom — each
                                claim carrying its evidence status, whether that is a published
                                study or an explicit statement that no assessment exists yet.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <ResultsSection heading={results} outcomes={outcomes} />
            {outcomes.length === 0 && (
                <section className="section-box wfSectionPaper">
                    <div className="container">
                        <p className="wfPaperKicker">{results.kicker}</p>
                        <div className="wfPaperHead">
                            <h2 className="wfPaperTitle">{results.title}</h2>
                            <p className="wfPaperLead">{results.empty}</p>
                        </div>
                    </div>
                </section>
            )}

            <section className="section-box wfSectionPaper wfSectionPaperAlt">
                <div className="container">
                    <p className="wfPaperKicker">{methodology.kicker}</p>
                    <div className="wfPaperHead">
                        <h2 className="wfPaperTitle">{methodology.title}</h2>
                        <p className="wfPaperLead">{methodology.lead}</p>
                    </div>
                    <ul className="wfUnlockList">
                        {methodology.notes.map((note) => (
                            <li key={note.term} className="wfUnlockItem">
                                <div className="wfUnlockHorizon">{note.term}</div>
                                <div>
                                    <p className="wfUnlockBody">{note.body}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </Layout>
    );
}
