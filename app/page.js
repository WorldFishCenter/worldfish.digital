import HomePageClient from '@/components/sections/HomePageClient';
import { getLatestPosts } from '@/lib/posts';
import {
    getThemes,
    getCountries,
    getProducts,
    getProjects,
    getOutcomes,
} from '@/lib/portfolio';
import { sharedLayer, toolsByInitiative } from '@/lib/portfolio-stats.mjs';
import { portfolioRoutes } from '@/lib/routes.mjs';
import { DEFAULT_METADATA, BLOG_WORLD_FISH } from '@/lib/constants';
import homepageData from '@/content/pages/homepage.json';
import relationshipsData from '@/content/data/relationships.json';

export const metadata = {
    ...DEFAULT_METADATA,
};

/** Most dashboards the showcase can hold before the row stops reading as one system. */
const SHOWCASE_LIMIT = 6;

export default async function Home() {
    const latestPosts = getLatestPosts(BLOG_WORLD_FISH.latestPostsCount);
    const themes = getThemes();
    const countries = getCountries();
    const products = getProducts();
    const projects = getProjects();
    const outcomes = getOutcomes();
    const relationships = relationshipsData.relationships;

    // The tabs carry only areas with work tagged to them — see AreaTabs.
    const withWork = themes.filter((t) => t.productSlugs.length > 0 || t.projectSlugs.length > 0);

    // Deployments shown as screenshots. Derived, not listed: a country joins the row when
    // it has both a dashboard image and a Live tool, and leaves when it has neither, so
    // the section cannot drift from the claim above it ("the same shared pipeline, run
    // with a different national institution"). Busiest first.
    const deployments = countries
        .filter((country) => country.image && country.products.length > 0)
        .sort((a, b) => b.products.length - a.products.length)
        .slice(0, SHOWCASE_LIMIT)
        .map((country) => ({ slug: country.slug, name: country.name, image: country.image }));

    // A featured card points at wherever the story actually lives, which may be a record
    // that is not Live yet, or a page with nothing on it yet. Rather than let a card go
    // to a 404 or an empty page, it falls back — and goes back to its real target on its
    // own the moment that target has something to show.
    const live = new Set(portfolioRoutes({ products, projects, countries, themes }));
    const reachable = (href) => {
        if (href === '/impact') return outcomes.length > 0;
        if (/^\/(products|projects|countries|our-work)\/[^/]+$/.test(href)) return live.has(href);
        return true;
    };
    const featured = homepageData.featured.map(({ fallback, ...item }) =>
        reachable(item.href) ? item : { ...item, ...(fallback || {}) }
    );

    return (
        <HomePageClient
            latestPosts={latestPosts}
            homepage={{ ...homepageData, featured }}
            stripAreas={withWork.length > 0 ? withWork : themes}
            initiativeGroups={toolsByInitiative({ products, projects })}
            countryName={new Map(countries.map((c) => [c.slug, c.name]))}
            deployments={deployments}
            sharedLayer={sharedLayer({ products, relationships })}
            crossCutting={themes.find((theme) => theme.crossCutting) || null}
            connectionCount={relationships.length}
            outcomes={outcomes}
        />
    );
}
