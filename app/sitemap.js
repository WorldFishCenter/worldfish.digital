import { getAllPosts } from '@/lib/posts';
import { SITE_CONFIG } from '@/lib/constants';

/**
 * Generate sitemap.xml for SEO
 * Next.js 13+ automatically handles sitemap generation from this file
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

    // Blog post pages
    const blogPages = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.date ? new Date(post.date) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    return [...staticPages, ...blogPages];
}
