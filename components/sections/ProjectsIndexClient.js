import Layout from '../layout/Layout';
import EntityLinkList from '../detail/EntityLinkList';
import { groupProjectsByStatus } from '../detail/meta';

export default function ProjectsIndexClient({ projects }) {
    const groups = groupProjectsByStatus(projects).map((group) => ({
        title: group.title,
        items: group.items.map((project) => ({
            href: `/projects/${project.slug}`,
            name: project.name,
            sub: project.fullName || project.programme || null,
            status: null, // status is the group header — no need to repeat it per row
        })),
    }));

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
                        <div className="col-lg-9">
                            <EntityLinkList groups={groups} />
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
