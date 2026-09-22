import { getAllPosts } from '@/lib/posts';
import { getProducts, getProjects, getCountries, getThemes } from '@/lib/portfolio';
import { portfolioRoutes, postHref } from '@/lib/routes.mjs';
import { SITE_CONFIG } from '@/lib/constants';

/**
 * Generate sitemap.xml for SEO
 * Next.js 13+ automatically handles sitemap generation from this file
 *
 * Portfolio URLs are enumerated from lib/routes rather than listed here, so a new product,
 * project, country or work area is in the sitemap as soon as it is in the data.
 */
export default function sitemap() {
    const baseUrl = SITE_CONFIG.url;
    const posts = getAllPosts();

    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog/peskas`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.75,
        },
        {
            url: `${baseUrl}/products/peskas`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.85,
        },
        {
            url: `${baseUrl}/how-it-works`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/data-resources`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ];

    // Portfolio pages — the four index pages plus every entity detail page.
    // Anything already given an explicit entry above (e.g. the Peskas hub) is skipped
    // rather than listed twice.
    const listed = new Set(staticPages.map((page) => page.url));
    const portfolioPages = portfolioRoutes({
        products: getProducts(),
        projects: getProjects(),
        countries: getCountries(),
        themes: getThemes(),
    })
        .map((route) => `${baseUrl}${route}`)
        .filter((url) => !listed.has(url))
        .map((url) => ({
            url,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        }));

    // Blog post pages
    const blogPages = posts.map((post) => ({
        url: `${baseUrl}${postHref(post.slug)}`,
        lastModified: post.date ? new Date(post.date) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    return [...staticPages, ...portfolioPages, ...blogPages];
}
