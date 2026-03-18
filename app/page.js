import HomePageClient from '@/components/sections/HomePageClient';
import { getAllPosts } from '@/lib/posts';
import { DEFAULT_METADATA, BLOG_CONFIG } from '@/lib/constants';
import homepageData from '@/content/pages/homepage.json';
import regionsData from '@/content/global/regions.json';

export const metadata = {
    ...DEFAULT_METADATA,
};

export default async function Home() {
    const allPosts = getAllPosts();
    const latestPosts = allPosts.slice(0, BLOG_CONFIG.latestPostsCount);

    return (
        <HomePageClient
            latestPosts={latestPosts}
            homepage={homepageData}
            regions={regionsData.regions}
        />
    );
}
