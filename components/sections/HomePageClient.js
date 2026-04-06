'use client'

import EcosystemHeroSection from '../sections/EcosystemHeroSection';
import ImpactStatsSection from '../sections/ImpactStatsSection';
import FeaturesSection from '../sections/FeaturesSection';
import PlatformsSection from '../sections/PlatformsSection';
import BlogSection from '../sections/BlogSection';
import Layout from '../layout/Layout';

export default function HomePageClient({ latestPosts, homepage }) {
    return (
        <Layout>
            <EcosystemHeroSection data={homepage.hero} />
            <FeaturesSection features={homepage.features} />
            <PlatformsSection data={homepage.about} />
            <ImpactStatsSection stats={homepage.stats} />
            <BlogSection latestPosts={latestPosts} data={homepage.blogSection} viewAllHref="/blog" />
        </Layout>
    );
}
