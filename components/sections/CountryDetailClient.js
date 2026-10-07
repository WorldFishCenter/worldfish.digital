import Image from 'next/image';
import Layout from '../layout/Layout';
import DetailHero from '../detail/DetailHero';
import InitiativeGroups from '../detail/InitiativeGroups';
import DetailFacts from '../detail/DetailFacts';
import ResultsSection from './ResultsSection';
import { countLabel } from '../detail/meta';
import { toolsByInitiative } from '@/lib/portfolio-stats.mjs';
import { publicAssetUrl } from '@/lib/publicAssetUrl';
import { productHref, projectHref, themeHref } from '@/lib/routes.mjs';

/**
 * A country. It only has a page while something Live is tagged to it, so there is no
 * empty state to design here — see buildPortfolio.
 *
 * Same order and the same shared hero as every other entity page (docs/IA.md). It used to
 * build its own hero because it has a flag and a photograph; DetailHero now takes both, so
 * the four entity types open identically instead of one of them being subtly different.
 * "What is in it" means the initiatives operating here, each with the tools it runs in this
 * country — the same shape as the impact-area page and the homepage. Tools and initiatives
 * used to be two headings crammed into one section, with the initiatives reduced to names.
 */
export default function CountryDetailClient({ country }) {
    const { themes, products, projects, outcomes } = country;
    const hasProducts = products.length > 0;
    const groups = toolsByInitiative({ products, projects });
    const hasProjects = projects.length > 0;

    return (
        <Layout>
            <DetailHero
                kicker="Country"
                title={country.name}
                lead={country.description}
                facts={[
                    { label: 'Initiatives', value: projects.length || null },
                    { label: 'Tools', value: products.length || null },
                    {
                        label: 'Impact areas',
                        value: themes.map((t) => t.name).join(', ') || null,
                    },
                ]}
                leading={
                    country.flagSrc && (
                        <Image
                            src={country.flagSrc}
                            alt={`${country.name} flag`}
                            width={48}
                            height={32}
                            unoptimized
                            className="mb-20"
                        />
                    )
                }
                media={
                    country.image && (
                        <Image
                            src={publicAssetUrl(country.image)}
                            alt={country.name}
                            width={640}
                            height={420}
                            className="wfImageRounded"
                        />
                    )
                }
            >
                {country.ctaLabel && country.ctaHref && (
                    <div className="mt-30">
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
            </DetailHero>

            {groups.length > 0 && (
                <section className="section-box wfSectionPaper wfPadSection">
                    <div className="container">
                        <p className="wfPaperKicker">
                            {[
                                hasProjects && countLabel(projects.length, 'initiative'),
                                countLabel(products.length, 'tool'),
                            ]
                                .filter(Boolean)
                                .join(' · ')}
                        </p>
                        <div className="wfPaperHead">
                            <h2 className="wfPaperTitle">The work in {country.name}</h2>
                            <p className="wfPaperLead">
                                Each initiative operating here, with the tools it runs in this
                                country. Most are shared portfolio components configured for
                                {' '}
                                {country.name} rather than anything built only for it.
                            </p>
                        </div>
                        <div className="wfPortfolioList">
                            <InitiativeGroups
                                groups={groups}
                                showCountries={false}
                                standalone={{
                                    title: 'Standalone tools',
                                    lead: 'Built outside a single funded initiative, or carried across several.',
                                }}
                            />
                        </div>
                    </div>
                </section>
            )}

            <ResultsSection
                heading={{ kicker: 'Outcomes', title: `What has changed in ${country.name}` }}
                outcomes={outcomes}
            />

            <DetailFacts
                rows={[
                    {
                        label: 'Impact areas',
                        value: themes.map((t) => ({ href: themeHref(t.slug), label: t.name })),
                    },
                    {
                        label: 'Initiatives',
                        value: projects.map((p) => ({ href: projectHref(p.slug), label: p.name })),
                    },
                ]}
            />
        </Layout>
    );
}
