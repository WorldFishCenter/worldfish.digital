import Layout from '../layout/Layout';
import ThemeIndexList from '../detail/ThemeIndexList';

export default function ThemeIndexClient({ themes }) {
    return (
        <Layout>
            <section className="section-box wfSectionDark wfPadHeroSm">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <h1 className="display-3 wfTitleHero">Our work</h1>
                            <p className="wfLead wfLeadMt">
                                Work across aquatic food systems is organised by the impact it
                                contributes to, using the same areas as the portfolio database — plus
                                shared infrastructure, which is listed separately because it serves all
                                of them. Each area lists the initiatives behind it, the tools they
                                produced and the countries they run in. Areas with nothing tagged yet are
                                shown rather than hidden.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section-box wfSectionDark wfPadSection">
                <div className="container">
                    <ThemeIndexList themes={themes} showStats />
                </div>
            </section>
        </Layout>
    );
}
