import Link from 'next/link';
import Layout from '../layout/Layout';
import ThemeIndexList from '../detail/ThemeIndexList';

export default function ForPartnersClient({ themes, donors, contactEmails }) {
    return (
        <Layout>
            <section className="section-box wfSectionDark wfPadHeroSm">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <h1 className="display-3 wfTitleHero">For Partners</h1>
                            <p className="wfLead wfLeadMt">
                                A portfolio overview for donors, investors, and strategic partners — the themes we
                                work across, the tools that come out of that work, and who currently funds it.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-box wfSectionDark wfPadSection">
                <div className="container">
                    <h3 className="display-4 wfTitleHeroTight wfTitleHeroMb">Portfolio by theme</h3>
                    <ThemeIndexList themes={themes} showStats />
                </div>
            </section>

            <section className="section-box wfSectionDark wfPadSection">
                <div className="container">
                    <h3 className="display-4 wfTitleHeroTight wfTitleHeroMb">Current & pipeline donors</h3>
                    <ul className="wfChipList">
                        {donors.map((donor) => (
                            <li key={donor.slug}>
                                <span className="wfChip">
                                    {donor.name}
                                    {donor.pipeline ? ' (pipeline)' : ''}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="section-box wfSectionDark wfPadSection">
                <div className="wfCtaPanel container">
                    <div className="wfCtaMax">
                        <h3 className="display-4 wfTitleHeroTight wfTitleHeroMb">Explore the data</h3>
                        <p className="wfLeadMdStatic">
                            Publications, datasets, and licensing details for every product in the portfolio.
                        </p>
                    </div>
                    <div className="d-flex flex-wrap gap-3">
                        <Link href="/data-resources" className="wfCtaBtnLg">
                            Publications &amp; data ↗
                        </Link>
                        {contactEmails[0] && (
                            <a href={`mailto:${contactEmails[0]}`} className="wfBtnGhost">
                                Get in touch ↗
                            </a>
                        )}
                    </div>
                </div>
            </section>
        </Layout>
    );
}
