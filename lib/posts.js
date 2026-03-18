import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

/**
 * @typedef {Object} Post
 * @property {string} slug - Post URL slug
 * @property {string} title - Post title
 * @property {string} date - ISO date string
 * @property {string} author - Author name
 * @property {string} description - Post description/excerpt
 * @property {string[]} tags - Array of tag strings
 * @property {boolean} draft - Whether post is a draft
 * @property {string} coverImage - URL to cover image
 * @property {string} content - Markdown content
 */

/**
 * Get all published blog posts, sorted by date (newest first)
 * @returns {Post[]} Array of post objects
 */
export function getAllPosts() {
    // Check if posts directory exists
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);

            // Ensure date is a string, not a Date object
            let dateString = '';
            if (data.date) {
                if (data.date instanceof Date) {
                    dateString = data.date.toISOString();
                } else {
                    dateString = String(data.date);
                }
            }

            // Handle cover image - check for 'cover' field too (Hugo convention)
            // Convert /img/ paths to /assets/imgs/page/blog/
            let coverImage = data.coverImage || data.cover || `/assets/imgs/page/blog/default.jpg`;
            if (coverImage.startsWith('/img/')) {
                coverImage = coverImage.replace('/img/', '/assets/imgs/page/blog/');
            }

            return {
                slug: fileName.replace(/\.md$/, ''),
                title: data.title || 'Untitled',
                date: dateString,
                author: data.author || '',
                description: data.description || '',
                tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
                draft: data.draft === true || data.draft === 'true',
                coverImage: coverImage,
                content,
            };
        })
        .filter((post) => !post.draft)
        .sort((a, b) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return dateB - dateA; // Sort newest first
        });

    return allPostsData;
}

/**
 * Get a single post by its slug
 * @param {string} slug - Post slug (filename without .md extension)
 * @returns {Post|null} Post object or null if not found
 */
export function getPostBySlug(slug) {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Ensure date is a string, not a Date object
    let dateString = '';
    if (data.date) {
        if (data.date instanceof Date) {
            dateString = data.date.toISOString();
        } else {
            dateString = String(data.date);
        }
    }

    // Handle cover image - check for 'cover' field too (Hugo convention)
    // Convert /img/ paths to /assets/imgs/page/blog/
    let coverImage = data.coverImage || data.cover || `/assets/imgs/page/blog/default.jpg`;
    if (coverImage.startsWith('/img/')) {
        coverImage = coverImage.replace('/img/', '/assets/imgs/page/blog/');
    }

    return {
        slug,
        title: data.title || 'Untitled',
        date: dateString,
        author: data.author || '',
        description: data.description || '',
        tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
        coverImage: coverImage,
        content,
    };
}

/**
 * Get all post slugs for static generation
 * @returns {Array<{params: {slug: string}}>} Array of slug params objects
 */
export function getAllPostSlugs() {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => ({
            params: {
                slug: fileName.replace(/\.md$/, ''),
            },
        }));
}

