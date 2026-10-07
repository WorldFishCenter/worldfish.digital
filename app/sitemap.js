import { getAllPosts } from '@/lib/posts';
import { getProducts, getProjects, getCountries, getThemes } from '@/lib/portfolio';
import { portfolioRoutes, postHref } from '@/lib/routes.mjs';
import { SITE_CONFIG } from '@/lib/constants';

/**
 * Generate sitemap.xml for SEO
 * Next.js 13+ automatically handles sitemap generation from this file
 *
 * Portfolio URLs are enumerated from lib/routes rather than listed here, so a tool,
 * initiative or country is in the sitemap as soon as its record is Live and synced.
 */
export default function sitemap() {
    const baseUrl = SITE_CONFIG.url;
    const posts = getAllPosts();

    // Static pages. The four portfolio index routes are listed again by
    // portfolioRoutes() below; duplicates are removed before returning.
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
        ...['/our-work', '/countries', '/products', '/projects', '/impact', '/for-partners', '/team'].map(
            (path) => ({
                url: `${baseUrl}${path}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
            })
        ),
    ];

    // Portfolio pages — the four index pages plus every entity detail page.
    const portfolioPages = portfolioRoutes({
        products: getProducts(),
        projects: getProjects(),
        countries: getCountries(),
        themes: getThemes(),
    })
        .map((route) => `${baseUrl}${route}`)
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

    const all = [...staticPages, ...portfolioPages, ...blogPages];
    return [...new Map(all.map((entry) => [entry.url, entry])).values()];
}
