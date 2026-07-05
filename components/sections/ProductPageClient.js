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
import DetailBlock from '../detail/DetailBlock';
import FactSheet from '../detail/FactSheet';
import RelationshipDiagram from '../detail/RelationshipDiagram';
import { StatusPill, MetaPill, TagList, LinkTagList } from '../detail/Pills';

function ConnectionsBlock({ graph }) {
    if (!graph) return null;
    return (
        <DetailBlock kicker="Ecosystem" title="How this connects">
            <RelationshipDiagram key={graph.focus} graph={graph} />
        </DetailBlock>
    );
}

function ThinProductHero({ product }) {
    return (
        <section className="section-box wfSectionDark wfPadHeroSm">
            <div className="container">
                <div className="row">
                    <div className="col-lg-9">
                        <p className="wfSectionKicker">Product</p>
                        <div className="wfKickerRow">
                            <MetaPill>{product.type}</MetaPill>
                            <StatusPill status={product.status} />
                        </div>
                        <h1 className="display-3 wfTitleHero">{product.name}</h1>
                        {product.description && <p className="wfLead wfLeadMt">{product.description}</p>}
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

function ThinProductBody({ product, themes, countries, projects, graph }) {
    const factRows = [
        { label: 'Lead developer', value: product.leadDev || null },
        {
            label: 'Work areas',
            value: themes?.length ? (
                <LinkTagList items={themes.map((t) => ({ href: `/our-work/${t.slug}`, label: t.name }))} />
            ) : null,
        },
        {
            label: 'Countries',
            value: countries?.length ? (
                <LinkTagList
                    items={countries.map((c) => ({ href: `/countries/${c.slug}`, label: c.name }))}
                />
            ) : null,
        },
        {
            label: 'In projects',
            value: projects?.length ? (
                <LinkTagList items={projects.map((p) => ({ href: `/projects/${p.slug}`, label: p.name }))} />
            ) : null,
        },
        {
            label: 'Thematic',
            value: product.thematicAreas?.length ? <TagList items={product.thematicAreas} /> : null,
        },
        {
            label: 'Impact',
            value: product.impactAreas?.length ? <TagList items={product.impactAreas} /> : null,
        },
    ];

    return (
        <section className="section-box wfSectionDark wfPadSection">
            <div className="container">
                <div className="wfDetailBlock">
                    <FactSheet rows={factRows} variant="strip" />
                </div>
                <ConnectionsBlock graph={graph} />
            </div>
        </section>
    );
}

export default function ProductPageClient({ product, latestPosts, graph, themes, countries, projects }) {
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
                <ThinProductBody
                    product={product}
                    themes={themes}
                    countries={countries}
                    projects={projects}
                    graph={graph}
                />
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
            {graph && (
                <section className="section-box wfSectionDark wfPadSection">
                    <div className="container">
                        <ConnectionsBlock graph={graph} />
                    </div>
                </section>
            )}
        </Layout>
    );
}
