'use client'
import { useState } from 'react';
import HeroSection from '../sections/HeroSection';
import StatsSection from '../sections/StatsSection';
import RegionsSection from '../sections/RegionsSection';
import CTASection from '../sections/CTASection';
import FeaturesSection from '../sections/FeaturesSection';
import TracksHeroSection from '../sections/TracksHeroSection';
import AboutSection from '../sections/AboutSection';
import BlogSection from '../sections/BlogSection';
import VideoModal from '../sections/VideoModal';
import Layout from '../layout/Layout';

export default function HomePageClient({ latestPosts, homepage, regions }) {
    const [modal, setModal] = useState(false);
    const [videoLoading, setVideoLoading] = useState(true);

    const openModal = () => setModal(true);
    const closeModal = () => setModal(false);
    const onVideoLoad = () => setVideoLoading(false);

    return (
        <Layout>
            <HeroSection data={homepage.hero} onWatchVideo={openModal} />
            <StatsSection stats={homepage.stats} />
            <RegionsSection regions={regions} section={homepage.regionsSection} />
            <CTASection data={homepage.cta} />
            <FeaturesSection features={homepage.features} />
            <TracksHeroSection data={homepage.tracks} />
            <AboutSection data={homepage.about} />
            <BlogSection latestPosts={latestPosts} data={homepage.blogSection} />
            <VideoModal
                isOpen={modal}
                onClose={closeModal}
                videoLoading={videoLoading}
                onVideoLoad={onVideoLoad}
                youtubeId={homepage.videoYoutubeId}
            />
        </Layout>
    );
}
