import Layout from '../layout/Layout';
import DetailBlock from '../detail/DetailBlock';
import EntityLinkList from '../detail/EntityLinkList';
import DetailHero from '../detail/DetailHero';
import DetailFacts from '../detail/DetailFacts';
import EntityMedia from '../detail/EntityMedia';
import Prose from '../detail/Prose';
import ResultsSection from './ResultsSection';
import RelationshipDiagram from '../detail/RelationshipDiagram';
import Link from 'next/link';
import AreaTags from '../detail/AreaTags';
import { StatusPill } from '../detail/Pills';
import { groupProductsByType, countLabel } from '../detail/meta';
import { countryHref, productHref, themeHref } from '@/lib/routes.mjs';

const year = (date) => (date ? date.slice(0, 4) : null);
const list = (values) => (values && values.length ? values.join(', ') : null);

/**
 * An initiative — one WFD Initiatives record: the funded body of work that pays for and
 * contains tools. Every initiative renders through this one template; none has a bespoke
 * page.
 *
 * The order is the same on all four entity page types — see docs/IA.md:
 *
 *   what it is → what is in it → how those pieces connect → what changed → full reference
 *
 * which is the order the questions actually arrive in. An earlier version put the tool list
 * first, reasoning that a reader opening an initiative wants to know what came out of it.
 * True — but only once they know what the initiative is. That version read: name, then
 * thirteen tools, then an architecture diagram, then, at position four, an explanation of
 * what Peskas actually does, and finally the fact that it runs in six countries.
 *
 * The lineage is scoped to this initiative's own tools, so it shows how this programme's
 * pieces fit together rather than pulling in work other initiatives did; the crossings
 * between initiatives are the shared layer's job, on the homepage and on each tool page.
 */
export default function ProjectDetailClient({ project }) {
    const { themes, countries, products, outcomes } = project;
    const hasMedia = project.hero || project.screenshots.length > 0;
    const hasAbout = Boolean(project.description) || hasMedia;

    const productGroups = groupProductsByType(products).map((group) => ({
        title: group.title,
        items: group.items.map((product) => ({
            href: productHref(product.slug),
            name: product.name,
            sub: product.summary,
            // Where it runs keeps a row informative when the one-line summary is missing.
            meta: product.countries.map((c) => c.name).join(' · ') || null,
            status: product.status,
        })),
    }));

    const period = year(project.startDate)
        ? `${year(project.startDate)} – ${year(project.endDate) || 'ongoing'}`
        : null;

    // The hero carries what a reader needs before anything below makes sense; everything
    // else waits for the full record at the bottom, so nothing is said twice.
    const heroFacts = [
        { label: 'Running in', value: list(countries.map((c) => c.name)) },
        { label: 'Period', value: period },
        { label: 'Funded by', value: list(project.funders) },
        { label: 'Lead', value: project.lead },
    ];

    const factRows = [
        { label: 'Full title', value: project.fullName },
        {
            label: 'Impact areas',
            value: themes.map((t) => ({ href: themeHref(t.slug), label: t.name })),
        },
        {
            label: 'Countries',
            value: countries.map((c) => ({ href: countryHref(c.slug), label: c.name })),
        },
        { label: 'Partners', value: list(project.partners) },
        {
            label: 'Contact',
            value: project.leadEmail && [
                { href: `mailto:${project.leadEmail}`, label: project.leadEmail },
            ],
        },
        { label: 'Innovation readiness', value: project.readiness },
        { label: 'Publications', value: project.publications },
        { label: 'SDGs', value: list(project.sdgs) },
        { label: 'Thematic', value: list(project.thematicAreas) },
    ];

    return (
        <Layout>
            <DetailHero
                kicker="Initiative"
                title={project.name}
                lead={project.summary}
                facts={heroFacts}
            >
                <div className="wfKickerRow mt-20">
                    <StatusPill status={project.status} />
                </div>
                <AreaTags areas={themes} className="wfAreaTagsSpaced" />
                {/* An initiative with its own website is curated elsewhere; this page is the
                    portfolio record and the way through to it. */}
                <div className="mt-30 d-flex flex-wrap gap-3">
                    {project.url && (
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wfBtnPrimary"
                        >
                            Visit {project.name} ↗
                        </a>
                    )}
                    <Link href="/projects" className="wfBtnGhost">
                        All initiatives
                    </Link>
                </div>
            </DetailHero>

            {hasAbout && (
                <section className="section-box wfSectionPaper wfPadSection">
                    <div className="container">
                        <p className="wfPaperKicker">What it is</p>
                        <div className="wfProseColumn">
                            <EntityMedia
                                name={project.name}
                                hero={project.hero}
                                screenshots={project.screenshots}
                            />
                            {project.description && <Prose text={project.description} />}
                        </div>
                    </div>
                </section>
            )}

            {products.length > 0 && (
                <section className="section-box wfSectionPaper wfPadSection">
                    <div className="container">
                        <p className="wfPaperKicker">{countLabel(products.length, 'tool')}</p>
                        <div className="wfPaperHead">
                            <h2 className="wfPaperTitle">What {project.name} built</h2>
                            <p className="wfPaperLead">
                                Everything this initiative produced, grouped by what each thing
                                is, with where it runs. All of it is open to reuse — that is the
                                point of listing it rather than rebuilding it.
                            </p>
                        </div>
                        <div className="wfPortfolioList">
                            <EntityLinkList groups={productGroups} />
                        </div>
                    </div>
                </section>
            )}

            {project.graph && (
                <section className="section-box wfSectionDark wfPadSection">
                    <div className="container">
                        <DetailBlock kicker="Lineage" title={`How ${project.name} fits together`}>
                            <RelationshipDiagram key={project.slug} graph={project.graph} />
                        </DetailBlock>
                    </div>
                </section>
            )}

            <ResultsSection
                heading={{ kicker: 'Outcomes', title: `What ${project.name} has changed` }}
                outcomes={outcomes}
            />

            <DetailFacts rows={factRows} />
        </Layout>
    );
}
