/**
 * Application-wide constants
 * Centralized configuration for easy maintenance
 */

/** Parent brand (WorldFish Digital site) */
export const WORLD_FISH_SITE = {
    name: 'WorldFish Digital',
    shortName: 'WorldFish Digital',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://peskas.show',
    // Short form for the <title> tag. Kept separate from `description` because
    // the title used to be derived by splitting the description on its first
    // full stop, which broke as soon as the description became a real sentence.
    tagline: 'Data and evidence for aquatic food systems',
    // Reads as the site's meta description and social preview. Framed around
    // what the work is for rather than what it is made of — the audience is
    // funders and research partners before it is engineers.
    description:
        'WorldFish Digital builds the monitoring systems, shared data infrastructure and research behind decisions across aquatic food systems — fisheries, aquaculture, climate adaptation and nutrition — and keeps them connected so work is reused rather than rebuilt.',
};

/** Base URL, for sitemap.js and robots.js. */
export const SITE_CONFIG = {
    name: WORLD_FISH_SITE.name,
    url: WORLD_FISH_SITE.url,
    description: WORLD_FISH_SITE.description,
};

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-QXS96EEDWG';
export const GA_ENABLED = process.env.NODE_ENV === 'production' && Boolean(GA_ID);

/**
 * The one news feed, at /blog.
 *
 * Deployment URLs are not listed here. Every tool and initiative carries its own `url`
 * in the portfolio database, so a new country portal is reachable from the site the
 * moment its record goes Live — not when someone remembers to edit this file.
 */
export const BLOG_WORLD_FISH = {
    title: 'News',
    description:
        'Releases, partnerships, pilots and field notes from across the WorldFish Digital portfolio.',
    postsPerPage: 10,
    latestPostsCount: 3,
    path: '/blog',
};

export const DEFAULT_METADATA = {
    title: `${WORLD_FISH_SITE.name} — ${WORLD_FISH_SITE.tagline}`,
    description: WORLD_FISH_SITE.description,
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        siteName: WORLD_FISH_SITE.name,
    },
    twitter: {
        card: 'summary_large_image',
    },
};
