/**
 * Application-wide constants
 * Centralized configuration for easy maintenance
 */

// Site Configuration
export const SITE_CONFIG = {
    name: 'Peskas™',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://peskas.show',
    description: 'Peskas is an open-source, modular platform that turns fisheries data into decision-ready insights.',
};

// Google Analytics
export const GA_ID = 'G-K31B8LMLQZ';
export const GA_ENABLED = process.env.NODE_ENV === 'production';

// External Links
export const EXTERNAL_LINKS = {
    timor: 'https://timor.peskas.org/',
    kenya: 'https://digitalfisheries.kenya.peskas.org/en',
    zanzibar: 'https://zanzibar.peskas.org',
    mozambique: 'https://mozambique-cabo-delgado-portal.vercel.app/',
    malawi: 'https://malawi.peskas.org/',
    blog: 'https://blog.peskas.org',
};

// Blog Configuration
export const BLOG_CONFIG = {
    title: 'Peskas Blog',
    description: 'Technical and not so technical musings about the Peskas platform',
    postsPerPage: 10,
    latestPostsCount: 3,
};

// Metadata Defaults
export const DEFAULT_METADATA = {
    title: `${SITE_CONFIG.name} - Open-source digital platform for small-scale fisheries`,
    description: SITE_CONFIG.description,
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
        siteName: SITE_CONFIG.name,
    },
    twitter: {
        card: 'summary_large_image',
    },
};
