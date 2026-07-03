import Layout from '../layout/Layout';
import EntityCard from '../elements/EntityCard';

export default function ProjectsIndexClient({ projects }) {
    return (
        <Layout>
            <section className="section-box wfSectionDark wfPadHeroSm">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <h1 className="display-3 wfTitleHero">Projects</h1>
                            <p className="wfLead wfLeadMt">
                                The funded initiatives behind WorldFish Digital&apos;s tools — spanning
                                fisheries, aquaculture, nutrition, climate adaptation, and data
                                infrastructure across Asia, Africa, and beyond.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section-box wfSectionDark wfPadSection">
                <div className="container">
                    <div className="row">
                        {projects.map((project) => (
                            <div key={project.slug} className="col-lg-4 col-md-6 col-sm-12 mb-30 d-flex">
                                <EntityCard
                                    href={`/projects/${project.slug}`}
                                    eyebrow={project.status}
                                    title={project.name}
                                    description={project.fullName}
                                    meta={project.programme}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
}
