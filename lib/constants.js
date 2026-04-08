/**
 * Application-wide constants
 * Centralized configuration for easy maintenance
 */

/** Parent brand (WorldFish Digital site) */
export const WORLD_FISH_SITE = {
    name: 'WorldFish Digital',
    shortName: 'WorldFish Digital',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://peskas.show',
    description:
        'Digital tools and open platforms from WorldFish for aquatic food systems—data infrastructure, fisheries monitoring, and partner-ready solutions.',
};

/** Product: Peskas™ (child site section) */
export const PESKAS_PRODUCT = {
    name: 'Peskas™',
    description:
        'Peskas is an open-source, modular platform that turns fisheries data into decision-ready insights.',
    productPath: '/products/peskas',
};

// Legacy: some code still references SITE_CONFIG — parent-focused
export const SITE_CONFIG = {
    name: WORLD_FISH_SITE.name,
    url: WORLD_FISH_SITE.url,
    description: WORLD_FISH_SITE.description,
};

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-QXS96EEDWG';
export const GA_ENABLED = process.env.NODE_ENV === 'production' && Boolean(GA_ID);

export const EXTERNAL_LINKS = {
    timor: 'https://timor.peskas.org/',
    kenya: 'https://digitalfisheries.kenya.peskas.org/en',
    zanzibar: 'https://zanzibar.peskas.org',
    mozambique: 'https://mozambique-cabo-delgado-portal.vercel.app/',
    malawi: 'https://malawi.peskas.org/',
    blog: 'https://blog.peskas.org',
    tracksExp: 'https://tracks.peskas.org/',
};

/** Blog: full-site digest at /blog (all channels, newest first) */
export const BLOG_WORLD_FISH = {
    title: 'News',
    description:
        'Updates from WorldFish Digital and the wider program—including Peskas product news, releases, partnerships, and aquatic food systems work.',
    postsPerPage: 10,
    latestPostsCount: 3,
    path: '/blog',
};

/** Blog: Peskas product updates at /blog/peskas */
export const BLOG_PESKAS = {
    title: 'Peskas news',
    description: 'Product updates, pilots, and technical notes from the Peskas™ platform.',
    postsPerPage: 10,
    latestPostsCount: 3,
    path: '/blog/peskas',
};

/** @deprecated Use BLOG_WORLD_FISH or BLOG_PESKAS */
export const BLOG_CONFIG = BLOG_WORLD_FISH;

export const POST_CHANNELS = /** @type {const} */ ({
    worldfish: 'worldfish',
    peskas: 'peskas',
});

export const DEFAULT_METADATA = {
    title: `${WORLD_FISH_SITE.name} — ${WORLD_FISH_SITE.description.split('.')[0]}.`,
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
