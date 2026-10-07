import HeroVideo from '../sections/HeroVideo';
import FeaturedCards from '../sections/FeaturedCards';
import PortfolioBrowser from '../sections/PortfolioBrowser';
import SharedLayer from '../sections/SharedLayer';
import ToolsShowcase from '../sections/ToolsShowcase';
import ResultsSection from '../sections/ResultsSection';
import BlogSection from '../sections/BlogSection';
import Layout from '../layout/Layout';

/**
 * The homepage is the front of a register, and reads in that order:
 *
 *   what we do (hero) → which areas (strip, which filters the next section)
 *   → who built what (initiatives, each with its tools) → what that looks like (three
 *   stories) → what the rest is built on (shared layer) → where it runs (deployments)
 *   → what it changed (outcomes) → news
 *
 * Each section answers a question the one above it raises, and every one of them is the
 * database rendered rather than copy about the database.
 *
 * It used to carry a section called "Built once, then reused": three paragraphs arguing
 * that the portfolio gets reused, placed before the reader had seen a single tool in it.
 * That argument is now made by the arrangement instead — the inventory shows what exists,
 * the shared layer shows which parts of it carry the others, and the deployments show the
 * same assembly running in four countries. A section claiming reuse is no longer needed,
 * and an unprovable claim is the one thing this audience discounts fastest.
 *
 * The order follows the schema. Initiatives contain tools, so initiatives come first and
 * each carries its own; the tool↔tool connections cut across them, so the shared layer comes
 * after. Grouping the tools by component type instead — which this page did briefly — reads
 * as a technical taxonomy rather than an organisation, and stops scaling past one screen.
 *
 * The impact-area list that used to sit near the bottom is gone too: it repeated the strip
 * four screens later. The strip links to each area, and /our-work carries the full set.
 *
 * Every section renders nothing when it has no records, so the page stays coherent at any
 * stage between an empty database and a full one.
 */
export default function HomePageClient({
    latestPosts,
    homepage,
    stripAreas,
    initiativeGroups,
    countryName,
    deployments,
    sharedLayer,
    crossCutting,
    connectionCount,
    outcomes,
}) {
    return (
        <Layout>
            <HeroVideo poster={homepage.hero.poster} sources={homepage.hero.sources}>
                <h1 className="wfHeroHeadline">{homepage.hero.headline}</h1>
                <p className="wfHeroSubline">{homepage.hero.subline}</p>
                <p className="wfHeroCredit">{homepage.hero.posterCredit}</p>
            </HeroVideo>

            {/* Explanation, then control, then result — all three adjacent, so pointing at
                an area changes the list directly beneath the chips rather than something
                below the fold. The featured stories moved below for that reason. */}
            <PortfolioBrowser
                areas={stripAreas}
                groups={initiativeGroups}
                data={homepage.portfolio}
                countryName={countryName}
            />

            <FeaturedCards items={homepage.featured} kicker={homepage.featuredKicker} />

            <SharedLayer
                data={homepage.sharedLayer}
                entries={sharedLayer}
                crossCutting={crossCutting}
                connectionCount={connectionCount}
            />

            <ToolsShowcase data={homepage.showcase} deployments={deployments} />

            <ResultsSection heading={homepage.results} outcomes={outcomes} />

            <BlogSection latestPosts={latestPosts} data={homepage.blogSection} viewAllHref="/blog" />
        </Layout>
    );
}
