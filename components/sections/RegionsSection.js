'use client'
import { useMemo, useState } from 'react';
import { publicAssetUrl } from '@/lib/publicAssetUrl';
import RichText from '../content/RichText';

function RegionsSection({ regions, section }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeRegion = regions[activeIndex] || regions[0];

    const regionMapStyle = useMemo(() => {
        const img = publicAssetUrl(activeRegion?.image);
        return {
            backgroundImage: `linear-gradient(120deg, rgba(0, 5, 10, 0.85) 0%, rgba(0, 5, 10, 0.5) 50%, rgba(0, 5, 10, 0.2) 80%), url('${img}')`,
        };
    }, [activeRegion?.image]);

    return (
        <section className="section-box wfSectionDark wfPadSection">
            <div className="container">
                <div className="row">
                    <div className="col-lg-2 col-sm-1 col-12" />
                    <div className="col-lg-8 col-sm-10 col-12 text-center mt-50 mb-30">
                        <h2 className="display-4 wfTitleHeroTight">{section.title}</h2>
                        <RichText
                            content={section.subtitle}
                            className="wfLeadMd"
                        />
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="text-center mt-30">
                    <p className="wfRegionPrompt">{section.wioPrompt}</p>
                    <a
                        href={section.wioHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="wfCtaBtnMd"
                    >
                        {section.wioCta} ↗
                    </a>
                </div>
            </div>
            <div className="container mt-60">
                <div className="text-center mb-30">
                    <ul className="wfChipList">
                        {regions.map((region, index) => (
                            <li key={region.title}>
                                <button
                                    type="button"
                                    className={`wfChip ${activeIndex === index ? 'wfChipActive' : ''}`}
                                    onClick={() => setActiveIndex(index)}
                                >
                                    {region.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="wfRegionMap" style={regionMapStyle}>
                    <div className="wfRegionMapOverlay">
                        <div className="wfRegionGlass">
                            <h3 className="wfHeadingRegion">{activeRegion.title}</h3>
                            <RichText
                                content={activeRegion.desc}
                                className="wfRegionDesc"
                            />
                            {activeRegion.ctaLabel && activeRegion.ctaHref && (
                                <a
                                    href={activeRegion.ctaHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="wfLinkMono"
                                >
                                    {activeRegion.ctaLabel} ↗
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default RegionsSection;
