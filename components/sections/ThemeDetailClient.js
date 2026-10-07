import Layout from '../layout/Layout';
import DetailHero from '../detail/DetailHero';
import DetailFacts from '../detail/DetailFacts';
import InitiativeGroups from '../detail/InitiativeGroups';
import ResultsSection from './ResultsSection';
import { toolsByInitiative } from '@/lib/portfolio-stats.mjs';
import { countryHref } from '@/lib/routes.mjs';

const count = (n, singular, plural = `${singular}s`) => `${n} ${n === 1 ? singular : plural}`;
const unique = (values) => [...new Set(values)];

/**
 * An impact area.
 *
 * Order, the same as every entity page: what it is → what is in it → what it changed →
 * the full record.
 *
 * "What is in it" means the **initiatives working in this area, each with the tools it
 * produced here**. The page used to show a flat list of tools grouped by component type and
 * then, well below it, a thin list of initiatives as names and one-liners — so an area with
 * five tools and one initiative said almost nothing about the initiative that produced all
 * five. The initiative is the container; on a page listing its tools it belongs above them.
 *
 * An area with nothing Live tagged to it still has a page, and says so: an untagged area is
 * a prompt to fill it in, not something to hide.
 */
export default function ThemeDetailClient({ theme }) {
    const { projects, products, countries, outcomes } = theme;
    const empty = products.length === 0 && projects.length === 0 && outcomes.length === 0;

    const groups = toolsByInitiative({ products, projects });

    // An impact area is an aggregate, so its orienting facts are counts and places.
    const heroFacts = empty
        ? [{ label: 'Status', value: 'Nothing tagged to this area yet' }]
        : [
              // `String(0)` is truthy, so a zero would print as a fact. Counts that are
              // zero drop out instead; the area still says it is empty via the lead.
              { label: 'Initiatives', value: projects.length || null },
              { label: 'Tools', value: products.length || null },
              {
                  label: 'Running in',
                  value: countries.map((c) => c.name).join(', ') || null,
              },
          ];

    return (
        <Layout>
            <DetailHero
                kicker={theme.crossCutting ? 'Cross-cutting layer' : 'Impact area'}
                title={theme.name}
                lead={theme.description}
                facts={heroFacts}
            />

            {groups.length > 0 && (
                <section className="section-box wfSectionPaper wfPadSection">
                    <div className="container">
                        {/* A zero count is noise, not information: a cross-cutting area
                            with no initiative of its own should not announce "0 initiatives". */}
                        <p className="wfPaperKicker">
                            {[
                                projects.length && count(projects.length, 'initiative'),
                                products.length && count(products.length, 'tool'),
                            ]
                                .filter(Boolean)
                                .join(' · ')}
                        </p>
                        <div className="wfPaperHead">
                            <h2 className="wfPaperTitle">
                                {projects.length > 0 ? 'The work in this area' : "What's in this area"}
                            </h2>
                            <p className="wfPaperLead">
                                {projects.length > 0
                                    ? 'Each funded initiative contributing here, with the tools it produced. All of it is open to reuse — that is the point of listing it rather than rebuilding it.'
                                    : 'The tools tagged to this area. All of it is open to reuse — that is the point of listing it rather than rebuilding it.'}
                            </p>
                        </div>
                        <div className="wfPortfolioList">
                            <InitiativeGroups
                                groups={groups}
                                excludeArea={theme.slug}
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
                heading={{
                    kicker: 'Where this is working',
                    title: `What ${theme.name.toLowerCase()} work has changed`,
                    lead: 'Outcomes tagged to this area, each with its evidence status.',
                }}
                outcomes={outcomes}
                hideArea
            />

            <DetailFacts
                rows={[
                    { label: 'In scope', value: theme.tagline },
                    {
                        label: 'Where it runs',
                        value: countries.map((c) => ({ href: countryHref(c.slug), label: c.name })),
                    },
                    {
                        label: 'Who uses it',
                        value: unique(products.flatMap((p) => p.audiences)).join(', '),
                    },
                    {
                        label: 'Funded by',
                        value: unique(projects.flatMap((p) => p.funders)).join(', '),
                    },
                ]}
            />
        </Layout>
    );
}
