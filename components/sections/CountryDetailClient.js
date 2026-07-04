import Image from 'next/image';
import Layout from '../layout/Layout';
import DetailBlock from '../detail/DetailBlock';
import EntityLinkList from '../detail/EntityLinkList';
import FactSheet from '../detail/FactSheet';
import { LinkTagList } from '../detail/Pills';
import { groupProductsByType, countLabel } from '../detail/meta';
import { publicAssetUrl } from '@/lib/publicAssetUrl';

export default function CountryDetailClient({ country, themes, products, projects }) {
    const hasProducts = products.length > 0;
    const hasProjects = projects.length > 0;
    const hasMain = hasProducts || hasProjects;

    const productGroups = groupProductsByType(products).map((group) => ({
        title: group.title,
        items: group.items.map((product) => ({
            href: `/products/${product.slug}`,
            name: product.name,
            sub: product.description || null,
            status: product.status,
        })),
    }));

    const projectItems = projects.map((project) => ({
        href: `/projects/${project.slug}`,
        name: project.name,
        sub: project.fullName || project.programme || null,
        status: project.status,
    }));

    const factRows = [
        { label: 'Engagement', value: country.pipeline ? 'Pipeline geography' : 'Active deployment' },
        {
            label: 'Work areas',
            value: themes.length ? (
                <LinkTagList items={themes.map((t) => ({ href: `/our-work/${t.slug}`, label: t.name }))} />
            ) : null,
        },
    ];

    return (
        <Layout>
            <section className="section-box wfSectionDark wfPadHeroSm">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-7">
                            <p className="wfSectionKicker">Country</p>
                            {country.flagSrc && (
                                <Image
                                    src={country.flagSrc}
                                    alt={`${country.name} flag`}
                                    width={48}
                                    height={32}
                                    unoptimized
                                    className="mb-20"
                                />
                            )}
                            <h1 className="display-3 wfTitleHero">{country.name}</h1>
                            <p className="wfLead wfLeadMt">{country.description}</p>
                            {country.ctaLabel && country.ctaHref && (
                                <div className="mt-40">
                                    <a
                                        href={country.ctaHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="wfBtnPrimary"
                                    >
                                        {country.ctaLabel} ↗
                                    </a>
                                </div>
                            )}
                            {(hasProducts || hasProjects) && (
                                <div className="wfInlineStats">
                                    {hasProducts && (
                                        <div className="wfInlineStat">
                                            <span className="wfInlineStatValue">{products.length}</span>
                                            <span className="wfInlineStatLabel">Tools</span>
                                        </div>
                                    )}
                                    {hasProjects && (
                                        <div className="wfInlineStat">
                                            <span className="wfInlineStatValue">{projects.length}</span>
                                            <span className="wfInlineStatLabel">Projects</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {country.image && (
                            <div className="col-lg-5 d-none d-lg-block">
                                <Image
                                    src={publicAssetUrl(country.image)}
                                    alt={country.name}
                                    width={640}
                                    height={420}
                                    className="wfImageRounded"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="section-box wfSectionDark wfPadSection">
                <div className="container">
                    {hasMain ? (
                        <div className="row">
                            <div className="col-lg-8">
                                {hasProducts && (
                                    <DetailBlock
                                        kicker={countLabel(products.length, 'tool')}
                                        title="Tools deployed"
                                    >
                                        <EntityLinkList groups={productGroups} />
                                    </DetailBlock>
                                )}
                                {hasProjects && (
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
                    ) : (
                        <FactSheet rows={factRows} variant="strip" />
                    )}
                </div>
            </section>
        </Layout>
    );
}
