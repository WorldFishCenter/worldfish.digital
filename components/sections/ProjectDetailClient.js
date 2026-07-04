import Layout from '../layout/Layout';
import DetailBlock from '../detail/DetailBlock';
import EntityLinkList from '../detail/EntityLinkList';
import FactSheet from '../detail/FactSheet';
import { StatusPill, MetaPill, TagList, LinkTagList } from '../detail/Pills';
import { groupProductsByType, countLabel } from '../detail/meta';

export default function ProjectDetailClient({ project, themes, countries, products, donors }) {
    const background = project.historicalNote || project.whatItWas;
    const hasProducts = products.length > 0;
    const hasBackground = Boolean(
        background || project.note || (project.productsCreated && project.productsCreated.length > 0)
    );
    const hasMain = hasProducts || hasBackground;

    const productGroups = groupProductsByType(products).map((group) => ({
        title: group.title,
        items: group.items.map((product) => ({
            href: `/products/${product.slug}`,
            name: product.name,
            sub: product.description || null,
            status: product.status,
        })),
    }));

    const factRows = [
        {
            label: 'Lead',
            value: project.lead ? <a href={`mailto:${project.lead}`}>{project.lead}</a> : null,
        },
        {
            label: 'Work areas',
            value: themes.length ? (
                <LinkTagList items={themes.map((t) => ({ href: `/our-work/${t.slug}`, label: t.name }))} />
            ) : null,
        },
        {
            label: 'Countries',
            value: countries.length ? (
                <LinkTagList
                    items={countries.map((c) => ({ href: `/countries/${c.slug}`, label: c.name }))}
                />
            ) : null,
        },
        { label: 'Funded by', value: donors.length ? <TagList items={donors.map((d) => d.name)} /> : null },
        {
            label: 'Thematic',
            value: project.thematicAreas?.length ? <TagList items={project.thematicAreas} /> : null,
        },
        {
            label: 'Impact',
            value: project.impactAreas?.length ? <TagList items={project.impactAreas} /> : null,
        },
    ];

    const mainColumn = (
        <>
            {hasProducts && (
                <DetailBlock kicker={countLabel(products.length, 'tool')} title="Tools">
                    <EntityLinkList groups={productGroups} />
                </DetailBlock>
            )}
            {hasBackground && (
                <DetailBlock title="Background">
                    {background && (
                        <div className="wfProse">
                            <p>{background}</p>
                        </div>
                    )}
                    {project.note && <p className="wfMuted mt-10">{project.note}</p>}
                    {project.productsCreated && project.productsCreated.length > 0 && (
                        <div className="mt-30">
                            <p className="wfMuted mb-10">Outputs</p>
                            <TagList items={project.productsCreated} />
                        </div>
                    )}
                </DetailBlock>
            )}
        </>
    );

    return (
        <Layout>
            <section className="section-box wfSectionDark wfPadHeroSm">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-9">
                            <p className="wfSectionKicker">Project</p>
                            <div className="wfKickerRow">
                                <StatusPill status={project.status} />
                                {project.programme && <MetaPill>{project.programme}</MetaPill>}
                            </div>
                            <h1 className="display-3 wfTitleHero">{project.name}</h1>
                            {project.fullName && <p className="wfLead wfLeadMt">{project.fullName}</p>}
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-box wfSectionDark wfPadSection">
                <div className="container">
                    {hasMain ? (
                        <div className="row">
                            <div className="col-lg-8">{mainColumn}</div>
                            <div className="col-lg-4">
                                <div className="wfDetailAside">
                                    <FactSheet rows={factRows} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <FactSheet rows={factRows} variant="strip" />
                    )}
                </div>
            </section>
        </Layout>
    );
}
