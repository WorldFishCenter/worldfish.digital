import Layout from '../layout/Layout';
import DetailBlock from '../detail/DetailBlock';
import EntityLinkList from '../detail/EntityLinkList';
import FactSheet from '../detail/FactSheet';
import { TagList, LinkTagList } from '../detail/Pills';
import { groupProductsByType, countLabel } from '../detail/meta';

const productItem = (product) => ({
    href: `/products/${product.slug}`,
    name: product.name,
    sub: product.description || null,
    status: product.status,
});

export default function ThemeDetailClient({ theme, projects, products, countries, personas, donors = [] }) {
    // Climate theme flags a handful of products as featured; lead with those,
    // then group the remainder by component type.
    const featuredSlugs = theme.featuredProductSlugs;
    const featured = featuredSlugs
        ? featuredSlugs.map((slug) => products.find((p) => p.slug === slug)).filter(Boolean)
        : [];
    const rest = featuredSlugs ? products.filter((p) => !featuredSlugs.includes(p.slug)) : products;

    const productGroups = [
        ...(featured.length > 0 ? [{ title: 'Featured', items: featured.map(productItem) }] : []),
        ...groupProductsByType(rest).map((group) => ({
            title: group.title,
            items: group.items.map(productItem),
        })),
    ];

    const projectItems = projects.map((project) => ({
        href: `/projects/${project.slug}`,
        name: project.name,
        sub: project.fullName || project.programme || null,
        status: project.status,
    }));

    const factRows = [
        { label: 'Covers', value: theme.tagline },
        {
            label: 'Countries',
            value: countries.length ? (
                <LinkTagList
                    items={countries.map((c) => ({ href: `/countries/${c.slug}`, label: c.name }))}
                />
            ) : null,
        },
        { label: 'Audience', value: personas.length ? <TagList items={personas.map((p) => p.name)} /> : null },
        { label: 'Thematic', value: theme.thematicAreas?.length ? <TagList items={theme.thematicAreas} /> : null },
        { label: 'Impact', value: theme.impactAreas?.length ? <TagList items={theme.impactAreas} /> : null },
        { label: 'Funded by', value: donors.length ? <TagList items={donors.map((d) => d.name)} /> : null },
    ];

    return (
        <Layout>
            <section className="section-box wfSectionDark wfPadHeroSm">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-9">
                            <p className="wfSectionKicker">Work area</p>
                            <h1 className="display-3 wfTitleHero">{theme.name}</h1>
                            <p className="wfLead wfLeadMt">{theme.description}</p>
                            <div className="wfInlineStats">
                                <div className="wfInlineStat">
                                    <span className="wfInlineStatValue">{products.length}</span>
                                    <span className="wfInlineStatLabel">Tools</span>
                                </div>
                                <div className="wfInlineStat">
                                    <span className="wfInlineStatValue">{projects.length}</span>
                                    <span className="wfInlineStatLabel">Projects</span>
                                </div>
                                <div className="wfInlineStat">
                                    <span className="wfInlineStatValue">{countries.length}</span>
                                    <span className="wfInlineStatLabel">Countries</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-box wfSectionDark wfPadSection">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            {productGroups.length > 0 && (
                                <DetailBlock
                                    kicker={countLabel(products.length, 'tool')}
                                    title="Tools & products"
                                >
                                    <EntityLinkList groups={productGroups} />
                                </DetailBlock>
                            )}
                            {projectItems.length > 0 && (
                                <DetailBlock
                                    kicker={countLabel(projects.length, 'project')}
                                    title="Projects"
                                >
                                    <EntityLinkList items={projectItems} />
                                </DetailBlock>
                            )}
                        </div>
                        <div className="col-lg-4">
                            <div className="wfDetailAside">
                                <FactSheet rows={factRows} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
