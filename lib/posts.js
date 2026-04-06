import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { POST_CHANNELS } from '@/lib/constants';

const postsDirectory = path.join(process.cwd(), 'posts');

/** @param {unknown} channel */
function normalizeChannel(channel) {
    if (channel === POST_CHANNELS.peskas) {
        return POST_CHANNELS.peskas;
    }
    return POST_CHANNELS.worldfish;
}

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
    const channel = normalizeChannel(data.channel);

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
        channel,
    };
}

/**
 * Get all published posts (both channels), newest first
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
 * @param {'worldfish' | 'peskas'} channel
 */
export function getPostsByChannel(channel) {
    const ch = normalizeChannel(channel);
    return getAllPosts().filter((p) => p.channel === ch);
}

/**
 * @param {'worldfish' | 'peskas'} channel
 * @param {number} limit
 */
export function getLatestPostsByChannel(channel, limit) {
    return getPostsByChannel(channel).slice(0, limit);
}

/**
 * Newest posts across all channels (for /blog and home “News”).
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
