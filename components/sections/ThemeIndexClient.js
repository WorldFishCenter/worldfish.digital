import Layout from '../layout/Layout';
import ThemeIndexList from '../detail/ThemeIndexList';

export default function ThemeIndexClient({ themes }) {
    return (
        <Layout>
            <section className="section-box wfSectionDark wfPadHeroSm">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <h1 className="display-3 wfTitleHero">Our Work</h1>
                            <p className="wfLead wfLeadMt">
                                Five themes organize everything WorldFish Digital builds — from small-scale
                                fisheries monitoring to the global data infrastructure underpinning it all.
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
