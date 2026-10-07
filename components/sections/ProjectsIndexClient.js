import Layout from '../layout/Layout';
import EntityLinkList from '../detail/EntityLinkList';
import AreaTags from '../detail/AreaTags';
import { groupProjectsByStatus, countLabel } from '../detail/meta';
import { projectHref } from '@/lib/routes.mjs';

export default function ProjectsIndexClient({ projects }) {
    const groups = groupProjectsByStatus(projects).map((group) => ({
        title: group.title,
        items: group.items.map((project) => ({
            href: projectHref(project.slug),
            name: project.name,
            sub: project.summary || project.fullName,
            // How much came out of it and where — the two things that tell a reader
            // whether this initiative is worth opening. Without them a row is a name.
            meta:
                [
                    countLabel(project.productSlugs.length, 'tool'),
                    project.countries.map((country) => country.name).join(' · '),
                ]
                    .filter(Boolean)
                    .join(' — ') || null,
            tags: <AreaTags areas={project.themes} className="wfAreaTagsRow" />,
            status: null, // status is the group header — no need to repeat it per row
        })),
    }));

    return (
        <Layout>
            <section className="section-box wfSectionDark wfPadHeroSm">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <h1 className="display-3 wfTitleHero">Initiatives</h1>
                            <p className="wfLead wfLeadMt">
                                The funded bodies of work — projects, programmes, centres — that
                                pay for and contain the portfolio. Open one to see what it built,
                                how those pieces fit together, and who funded it.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section-box wfSectionDark wfPadSection">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-9">
                            {projects.length === 0 ? (
                                <p className="wfMutedLg">
                                    No initiatives are published yet. Each one appears here once
                                    its record in the portfolio database has been reviewed and
                                    marked Live.
                                </p>
                            ) : (
                                <EntityLinkList groups={groups} />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
