'use client'

import EcosystemHeroSection from '../sections/EcosystemHeroSection';
import ImpactStatsSection from '../sections/ImpactStatsSection';
import FeaturesSection from '../sections/FeaturesSection';
import PlatformsSection from '../sections/PlatformsSection';
import PersonaRouter from '../sections/PersonaRouter';
import BlogSection from '../sections/BlogSection';
import Layout from '../layout/Layout';
import { getPersonas, getThemes } from '@/lib/content';

const themeFeatures = getThemes().map((theme) => ({
    title: theme.name,
    description: theme.tagline,
    ctaHref: `/our-work/${theme.slug}`,
}));

export default function HomePageClient({ latestPosts, homepage }) {
    return (
        <Layout>
            <EcosystemHeroSection data={homepage.hero} />
            <FeaturesSection features={themeFeatures} />
            <PlatformsSection data={homepage.about} />
            <ImpactStatsSection stats={homepage.stats} />
            <PersonaRouter personas={getPersonas()} />
            <BlogSection latestPosts={latestPosts} data={homepage.blogSection} viewAllHref="/blog" />
        </Layout>
    );
}
