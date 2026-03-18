import { SITE_CONFIG } from '@/lib/constants';

/**
 * Generate robots.txt
 * Next.js 13+ automatically handles robots.txt generation from this file
 */
export default function robots() {
    const baseUrl = SITE_CONFIG.url;

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/_next/', '/under-costruction/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
