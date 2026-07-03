'use client'
import { useState } from 'react';
import Link from 'next/link';
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
import EntityCard from '../elements/EntityCard';

function FocusAreas({ product }) {
    const thematic = product.thematicAreas || [];
    const impact = product.impactAreas || [];
    if (thematic.length === 0 && impact.length === 0) return null;

    return (
        <section className="section-box wfSectionDark wfPadSection">
            <div className="container">
                <h3 className="display-4 wfTitleHeroTight wfTitleHeroMb">Focus areas</h3>
                {thematic.length > 0 && (
                    <>
                        <p className="wfMuted mb-10">Thematic</p>
                        <ul className="wfChipList mb-30">
                            {thematic.map((area) => (
                                <li key={area}>
                                    <span className="wfChip">{area}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                {impact.length > 0 && (
                    <>
                        <p className="wfMuted mb-10">Impact</p>
                        <ul className="wfChipList">
                            {impact.map((area) => (
                                <li key={area}>
                                    <span className="wfChip">{area}</span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </section>
    );
}

function RelatedTools({ related }) {
    if (!related || related.length === 0) return null;

    return (
        <section className="section-box wfSectionDark wfPadSection">
            <div className="container">
                <h3 className="display-4 wfTitleHeroTight wfTitleHeroMb">Related tools</h3>
                <div className="row">
                    {related.map(({ label, product }) => (
                        <div
                            key={`${label}-${product.slug}`}
                            className="col-lg-4 col-md-6 col-sm-12 mb-30 d-flex"
                        >
                            <EntityCard
                                href={`/products/${product.slug}`}
                                eyebrow={label}
                                title={product.name}
                                description={product.description}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ThinProductHero({ product }) {
    const meta = [product.type, product.status].filter(Boolean).join(' · ');

    return (
        <section className="section-box wfSectionDark wfPadHeroSm">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8">
                        {meta && <p className="wfMuted mb-10">{meta}</p>}
                        <h1 className="display-3 wfTitleHero">{product.name}</h1>
                        {product.description && (
                            <p className="wfLead wfLeadMt">{product.description}</p>
                        )}
                        <div className="mt-40 d-flex flex-wrap gap-3">
                            {product.url && (
                                <a
                                    href={product.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="wfBtnPrimary"
                                >
                                    Visit {product.name} ↗
                                </a>
                            )}
                            <Link href="/products" className="wfBtnGhost">
                                Back to all products ↗
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function ProductPageClient({ product, latestPosts, related }) {
    const [modal, setModal] = useState(false);
    const [videoLoading, setVideoLoading] = useState(true);
    const rich = product.rich;

    const openModal = () => setModal(true);
    const closeModal = () => setModal(false);
    const onVideoLoad = () => setVideoLoading(false);

    if (!rich) {
        return (
            <Layout>
                <ThinProductHero product={product} />
                <FocusAreas product={product} />
                <RelatedTools related={related} />
            </Layout>
        );
    }

    return (
        <Layout>
            <HeroSection data={rich.hero} onWatchVideo={openModal} />
            {rich.stats && <StatsSection stats={rich.stats} />}
            {rich.regions && <RegionsSection regions={rich.regions} section={rich.regionsSection} />}
            {rich.cta && <CTASection data={rich.cta} />}
            {rich.features && <FeaturesSection features={rich.features} />}
            {rich.tracks && <TracksHeroSection data={rich.tracks} />}
            {rich.about && <AboutSection data={rich.about} />}
            {rich.blogSection && (
                <BlogSection
                    latestPosts={latestPosts}
                    data={rich.blogSection}
                    viewAllHref={`/blog/${rich.blogSection.channel}`}
                />
            )}
            {rich.videoYoutubeId && (
                <VideoModal
                    isOpen={modal}
                    onClose={closeModal}
                    videoLoading={videoLoading}
                    onVideoLoad={onVideoLoad}
                    youtubeId={rich.videoYoutubeId}
                />
            )}
            <RelatedTools related={related} />
        </Layout>
    );
}
