'use client'

import EcosystemHeroSection from '../sections/EcosystemHeroSection';
import ImpactStatsSection from '../sections/ImpactStatsSection';
import PlatformsSection from '../sections/PlatformsSection';
import PersonaRouter from '../sections/PersonaRouter';
import BlogSection from '../sections/BlogSection';
import Layout from '../layout/Layout';
import ThemeIndexList from '../detail/ThemeIndexList';
import { getPersonas, getThemes } from '@/lib/portfolio';

export default function HomePageClient({ latestPosts, homepage }) {
    return (
        <Layout>
            <EcosystemHeroSection data={homepage.hero} />
            <section className="section-box wfSectionDark wfPadSection">
                <div className="container">
                    <p className="wfSectionKicker">Our work</p>
                    <h2 className="wfSectionTitle">Five areas we build across</h2>
                    <ThemeIndexList themes={getThemes()} />
                </div>
            </section>
            <PlatformsSection data={homepage.about} />
            <ImpactStatsSection stats={homepage.stats} />
            <PersonaRouter personas={getPersonas()} />
            <BlogSection latestPosts={latestPosts} data={homepage.blogSection} viewAllHref="/blog" />
        </Layout>
    );
}
