import HomePageClient from '@/components/sections/HomePageClient';
import { getLatestPosts } from '@/lib/posts';
import { DEFAULT_METADATA, BLOG_WORLD_FISH } from '@/lib/constants';
import homepageData from '@/content/pages/homepage.json';

export const metadata = {
    ...DEFAULT_METADATA,
};

export default async function Home() {
    const latestPosts = getLatestPosts(BLOG_WORLD_FISH.latestPostsCount);

    return (
        <HomePageClient
            latestPosts={latestPosts}
            homepage={homepageData}
        />
    );
}
