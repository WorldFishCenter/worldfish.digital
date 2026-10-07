import Link from 'next/link';
import Layout from '../layout/Layout';
import ThemeIndexList from '../detail/ThemeIndexList';
import DetailFacts from '../detail/DetailFacts';

/**
 * Order: what this is → the areas → who already uses it → who already funds it → what more
 * funding would change → how to start a conversation. The ask comes after the track record
 * it rests on, not before it; it used to sit directly under the portfolio, which asked for
 * money before showing anyone was served by the work.
 *
 * The funding and partnership page — written for the third audience (funders and
 * prospective partners), so it carries the same two commitments as the rest of the site:
 * state what the work changes before what it is made of, and be explicit about the
 * limits of the evidence rather than papering over them.
 *
 * `audiences` and `funders` are read off the Live tools and initiatives. Both sections
 * drop out while there is nothing published to derive them from.
 */
export default function ForPartnersClient({ themes, funders, audiences, contactEmails, unlocks }) {
    return (
        <Layout>
            <section className="section-box wfSectionDark wfPadHeroSm">
                <div className="container">
                    <div className="wfHeroSplit">
                        <h1 className="wfDisplay2 wfHeroStatement">Funding &amp; partnership</h1>
                        <div className="wfHeroAside">
                            <p className="wfSubtitleWide">
                                What this portfolio is, who pays for it today, and where additional
                                investment would go. Written for funders, prospective partners and
                                research collaborators deciding whether there is something here to
                                build on.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-box wfSectionPaper">
                <div className="container">
                    <p className="wfPaperKicker">What you are looking at</p>
                    <div className="wfPaperHead">
                        <h2 className="wfPaperTitle">A working portfolio, not a prospectus</h2>
                        <p className="wfPaperLead">
                            Most of what follows is already running in partner institutions. Some of it
                            is early, and marked as such. We publish the tools that are live, the
                            initiatives funding them and the countries they run in, so the state of the
                            work can be judged directly rather than taken on description.
                        </p>
                    </div>
                    <div className="d-flex flex-wrap gap-3 mt-50">
                        <Link href="/countries" className="wfBtnInk">
                            Where it runs
                        </Link>
                        <Link href="/products" className="wfBtnInkGhost">
                            Browse the tools
                        </Link>
                    </div>
                </div>
            </section>

            <section className="section-box wfSectionDark wfPadSection">
                <div className="container">
                    <p className="wfSectionKicker">Portfolio</p>
                    <h2 className="wfSectionTitle">The areas we build across</h2>
                    <ThemeIndexList themes={themes} showStats />
                </div>
            </section>

            <DetailFacts
                kicker="Who uses this"
                title="The tools, by who opens them"
                lead="Each tool records the people who actually use it or consume its output. These are the shortest routes in."
                rows={audiences}
            />

            {funders.length > 0 && (
                <section className="section-box wfSectionDark wfPadSection">
                    <div className="container">
                        <p className="wfSectionKicker">Support</p>
                        <h2 className="wfSectionTitle">Who funds this work</h2>
                        <p className="wfLeadMdStatic mb-30">
                            Funders of the initiatives in the portfolio, as each initiative names
                            them. Individual initiative pages say who is behind each piece of work.
                        </p>
                        <ul className="wfChipList">
                            {funders.map((funder) => (
                                <li key={funder}>
                                    <span className="wfChip">{funder}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {unlocks && (
                <section className="section-box wfSectionPaper wfSectionPaperAlt">
                    <div className="container">
                        <p className="wfPaperKicker">{unlocks.kicker}</p>
                        <div className="wfPaperHead">
                            <h2 className="wfPaperTitle">{unlocks.title}</h2>
                            <p className="wfPaperLead">{unlocks.lead}</p>
                        </div>
                        <ul className="wfUnlockList">
                            {unlocks.items.map((item) => (
                                <li key={item.title} className="wfUnlockItem">
                                    <div className="wfUnlockHorizon">{item.horizon}</div>
                                    <div>
                                        <h3 className="wfUnlockTitle">{item.title}</h3>
                                        <p className="wfUnlockBody">{item.body}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            <section className="section-box wfSectionPaper">
                <div className="container">
                    <p className="wfPaperKicker">Get in touch</p>
                    <div className="wfPaperHead">
                        <h2 className="wfPaperTitle">Start a conversation</h2>
                        <p className="wfPaperLead">
                            For funding discussions, research collaboration, or a request to deploy
                            part of the portfolio with a fisheries administration.
                        </p>
                    </div>
                    <div className="d-flex flex-wrap gap-3 mt-50">
                        {contactEmails.map((email, i) => (
                            <a
                                key={email}
                                href={`mailto:${email}`}
                                className={i === 0 ? 'wfBtnInk' : 'wfBtnInkGhost'}
                            >
                                {email}
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
}
