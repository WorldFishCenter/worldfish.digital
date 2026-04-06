import PeskasPageClient from '@/components/sections/PeskasPageClient';
import { getLatestPostsByChannel } from '@/lib/posts';
import { DEFAULT_METADATA, BLOG_PESKAS } from '@/lib/constants';
import peskasData from '@/content/pages/peskas.json';
import regionsData from '@/content/global/regions.json';

export const metadata = {
    ...DEFAULT_METADATA,
    title: 'Peskas - WorldFish Digital',
};

export default async function PeskasPage() {
    const latestPosts = getLatestPostsByChannel('peskas', BLOG_PESKAS.latestPostsCount);

    return (
        <PeskasPageClient
            latestPosts={latestPosts}
            pageData={peskasData}
            regions={regionsData.regions}
        />
    );
}
