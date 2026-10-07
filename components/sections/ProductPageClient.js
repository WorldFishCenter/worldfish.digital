import Link from 'next/link';
import Layout from '../layout/Layout';
import DetailBlock from '../detail/DetailBlock';
import DetailHero from '../detail/DetailHero';
import DetailFacts from '../detail/DetailFacts';
import EntityMedia from '../detail/EntityMedia';
import Prose from '../detail/Prose';
import RelationshipDiagram from '../detail/RelationshipDiagram';
import ResultsSection from './ResultsSection';
import AreaTags from '../detail/AreaTags';
import { StatusPill, MetaPill } from '../detail/Pills';
import { countryHref, projectHref, themeHref } from '@/lib/routes.mjs';

const External = ({ href, className, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children} ↗
    </a>
);

/**
 * A tool — one WFD Tools record.
 *
 * Same order as every other entity page (see docs/IA.md):
 *
 *   what it is → what is in it → how it connects → what it changed → full reference
 *
 * "What is in it" for a tool is what it does, how to reuse it and what it cannot do. Reuse
 * sits high on purpose: the primary reader is a WorldFish researcher asking "can I build on
 * this", and the reuse note and the known limitations are the two fields written to answer
 * exactly that.
 *
 * The initiative, where it runs and how ready it is go in the hero rather than the fact
 * block at the foot: they are the context for everything below, and a reader should not have
 * to reach the bottom of the page to learn which programme a tool belongs to.
 */
export default function ProductPageClient({ product }) {
    const { themes, countries, projects, graph, outcomes } = product;
    const hasMedia = product.hero || product.video || product.screenshots.length > 0;
    const hasBody = product.description || product.reuse || product.limitations || hasMedia;

    const list = (values) => (values && values.length ? values.join(', ') : null);

    // The hero carries what is needed to read the rest; the rest waits for the full record.
    const heroFacts = [
        { label: 'Part of', value: list(projects.map((p) => p.name)) },
        { label: 'Running in', value: list(countries.map((c) => c.name)) },
        { label: 'Readiness', value: product.readiness },
        { label: 'Code', value: product.openSource ? 'Open source' : null },
    ];

    const factRows = [
        {
            label: 'Part of',
            value: projects.map((p) => ({ href: projectHref(p.slug), label: p.name })),
        },
        {
            label: 'Impact areas',
            value: themes.map((t) => ({ href: themeHref(t.slug), label: t.name })),
        },
        {
            label: 'Countries',
            value: countries.map((c) => ({ href: countryHref(c.slug), label: c.name })),
        },
        { label: 'Who uses it', value: product.audiences.join(', ') },
        { label: 'Lead developer', value: product.leadDev },
        {
            label: 'Contact',
            value: product.contactEmail && [
                { href: `mailto:${product.contactEmail}`, label: product.contactEmail },
            ],
        },
        { label: 'Licence', value: product.licence },
        { label: 'Data', value: product.dataAvailability },
        {
            label: 'Dataset',
            value: product.datasetUrl && [{ href: product.datasetUrl, label: product.datasetUrl }],
        },
        { label: 'Publications', value: product.publications },
        { label: 'SDGs', value: product.sdgs.join(', ') },
        { label: 'Thematic', value: product.thematicAreas.join(', ') },
    ];

    return (
        <Layout>
            <DetailHero
                kicker="Tool"
                title={product.name}
                lead={product.summary}
                facts={heroFacts}
            >
                <div className="wfKickerRow mt-20">
                    <MetaPill>{product.type}</MetaPill>
                    <StatusPill status={product.status} />
                </div>
                <AreaTags areas={themes} className="wfAreaTagsSpaced" />
                <div className="mt-30 d-flex flex-wrap gap-3">
                    {product.url && (
                        <External href={product.url} className="wfBtnPrimary">
                            Open {product.name}
                        </External>
                    )}
                    {product.repoUrl && (
                        <External href={product.repoUrl} className="wfBtnGhost">
                            Code
                        </External>
                    )}
                    {product.docsUrl && (
                        <External href={product.docsUrl} className="wfBtnGhost">
                            Documentation
                        </External>
                    )}
                    <Link href="/products" className="wfBtnGhost">
                        All tools
                    </Link>
                </div>
            </DetailHero>

            {hasBody && (
                <section className="section-box wfSectionPaper wfPadSection">
                    <div className="container">
                        <p className="wfPaperKicker">What it is</p>
                        <EntityMedia
                            name={product.name}
                            hero={product.hero}
                            screenshots={product.screenshots}
                            video={product.video}
                        />
                        <div className="wfProseColumn">
                            {product.description && (
                                <DetailBlock title="What it does">
                                    <Prose text={product.description} />
                                </DetailBlock>
                            )}
                            {product.reuse && (
                                <DetailBlock title="How it can be reused">
                                    <Prose text={product.reuse} />
                                </DetailBlock>
                            )}
                            {product.limitations && (
                                <DetailBlock title="Known limitations">
                                    <Prose text={product.limitations} />
                                </DetailBlock>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {graph && (
                <section className="section-box wfSectionDark wfPadSection">
                    <div className="container">
                        <DetailBlock kicker="Ecosystem" title="How this connects">
                            <RelationshipDiagram key={graph.focus} graph={graph} />
                        </DetailBlock>
                    </div>
                </section>
            )}

            <ResultsSection
                heading={{ kicker: 'Outcomes', title: `What ${product.name} has changed` }}
                outcomes={outcomes}
            />

            <DetailFacts rows={factRows} />
        </Layout>
    );
}
