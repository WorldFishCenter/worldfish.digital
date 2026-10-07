import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

/**
 * @param {string} fileName
 * @param {string} fileContents
 */
function parsePostFile(fileName, fileContents) {
    const { data, content } = matter(fileContents);
    const slug = fileName.replace(/\.md$/, '');

    let dateString = '';
    if (data.date) {
        if (data.date instanceof Date) {
            dateString = data.date.toISOString();
        } else {
            dateString = String(data.date);
        }
    }

    let coverImage = data.coverImage || data.cover || `/assets/imgs/page/blog/default.jpg`;
    if (coverImage.startsWith('/img/')) {
        coverImage = coverImage.replace('/img/', '/assets/imgs/page/blog/');
    }

    const draft = data.draft === true || data.draft === 'true';

    return {
        slug,
        title: data.title || 'Untitled',
        date: dateString,
        author: data.author || '',
        description: data.description || '',
        tags: Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [],
        draft,
        coverImage,
        content,
    };
}

/**
 * Every published post, newest first.
 *
 * There is one feed. Posts carry a `channel:` key in their frontmatter from when Peskas
 * had a second route here; it is read by nothing — Peskas is an initiative in the
 * portfolio like any other, and its own site is linked from /projects/peskas.
 * @returns {import('@/lib/posts').Post[]}
 */
export function getAllPosts() {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    return fs
        .readdirSync(postsDirectory)
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            const fullPath = path.join(postsDirectory, fileName);
            return parsePostFile(fileName, fs.readFileSync(fullPath, 'utf8'));
        })
        .filter((post) => !post.draft)
        .sort((a, b) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return dateB - dateA;
        });
}

/**
 * Newest posts, for /blog and the homepage "Latest" band.
 * @param {number} limit
 */
export function getLatestPosts(limit) {
    return getAllPosts().slice(0, limit);
}

/**
 * @param {string} slug
 * @returns {import('@/lib/posts').Post | null}
 */
export function getPostBySlug(slug) {
    const fullPath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    return parsePostFile(`${slug}.md`, fs.readFileSync(fullPath, 'utf8'));
}

export function getAllPostSlugs() {
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    return fs
        .readdirSync(postsDirectory)
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            const fullPath = path.join(postsDirectory, fileName);
            return parsePostFile(fileName, fs.readFileSync(fullPath, 'utf8'));
        })
        .filter((post) => !post.draft)
        .map((post) => ({
            params: {
                slug: post.slug,
            },
        }));
}
