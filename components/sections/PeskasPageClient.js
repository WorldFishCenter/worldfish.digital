'use client'
import { useState } from 'react';
import HeroSection from './HeroSection';
import StatsSection from './StatsSection';
import RegionsSection from './RegionsSection';
import CTASection from './CTASection';
import FeaturesSection from './FeaturesSection';
import TracksHeroSection from './TracksHeroSection';
import AboutSection from './AboutSection';
import BlogSection from './BlogSection';
import VideoModal from './VideoModal';
import Layout from '../layout/Layout';

export default function PeskasPageClient({ latestPosts, pageData, regions }) {
    const [modal, setModal] = useState(false);
    const [videoLoading, setVideoLoading] = useState(true);

    const openModal = () => setModal(true);
    const closeModal = () => setModal(false);
    const onVideoLoad = () => setVideoLoading(false);

    return (
        <Layout>
            <HeroSection data={pageData.hero} onWatchVideo={openModal} />
            <StatsSection stats={pageData.stats} />
            <RegionsSection regions={regions} section={pageData.regionsSection} />
            <CTASection data={pageData.cta} />
            <FeaturesSection features={pageData.features} />
            <TracksHeroSection data={pageData.tracks} />
            <AboutSection data={pageData.about} />
            <BlogSection latestPosts={latestPosts} data={pageData.blogSection} viewAllHref="/blog/peskas" />
            <VideoModal
                isOpen={modal}
                onClose={closeModal}
                videoLoading={videoLoading}
                onVideoLoad={onVideoLoad}
                youtubeId={pageData.videoYoutubeId}
            />
        </Layout>
    );
}
