'use client'
import { useState } from 'react';
import RichText from '../content/RichText';

function RegionsSection({ regions, section }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeRegion = regions[activeIndex] || regions[0];

    return (
        <section className="section-box">
            <div className="container">
                <div className="row">
                    <div className="col-lg-2 col-sm-1 col-12" />
                    <div className="col-lg-8 col-sm-10 col-12 text-center mt-50">
                        <h2 className="text-heading-1 color-gray-900">{section.title}</h2>
                        <RichText
                            content={section.subtitle}
                            className="text-body-lead-large color-gray-600 mt-20"
                        />
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="text-center mt-30">
                    <p className="text-heading-6 color-gray-900 mb-5">{section.wioPrompt}</p>
                    <a
                        href={section.wioHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-black icon-arrow-right-white"
                    >
                        {section.wioCta}
                    </a>
                </div>
            </div>
            <div className="container mt-40">
                <div className="text-center mt-30">
                    <ul className="nav" role="tablist">
                        {regions.map((region, index) => (
                            <li key={index} onClick={() => setActiveIndex(index)}>
                                <a
                                    className={
                                        activeIndex === index
                                            ? 'btn btn-default btn-bd-green-hover btn-select active'
                                            : 'btn btn-default btn-bd-green-hover btn-select'
                                    }
                                >
                                    {region.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div
                    className="region-hero mt-40"
                    style={{
                        backgroundImage: `linear-gradient(120deg, rgba(4, 7, 15, 0.7) 0%, rgba(4, 7, 15, 0.35) 50%, rgba(4, 7, 15, 0.15) 80%), url('${activeRegion.image}')`,
                    }}
                >
                    <div className="region-hero__content">
                        <div className="region-hero__text">
                            <h3 className="text-heading-2 color-white">{activeRegion.title}</h3>
                            <RichText
                                content={activeRegion.desc}
                                className="text-body-lead color-white mt-12"
                            />
                            {activeRegion.ctaLabel && activeRegion.ctaHref ? (
                                <a
                                    href={activeRegion.ctaHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-black icon-arrow-right-white mt-15"
                                >
                                    {activeRegion.ctaLabel}
                                </a>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .region-hero {
                    position: relative;
                    border-radius: 18px;
                    overflow: hidden;
                    min-height: 460px;
                    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.14);
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                }
                .region-hero__content {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    align-items: center;
                    min-height: 460px;
                    padding: 36px;
                }
                .region-hero__text {
                    max-width: 680px;
                    background: linear-gradient(135deg, rgba(8, 11, 18, 0.68), rgba(8, 11, 18, 0.4));
                    padding: 24px;
                    border-radius: 14px;
                    line-height: 1.6;
                }
                @media (max-width: 991px) {
                    .region-hero__content {
                        min-height: 0;
                        padding: 20px;
                    }
                }
            `}</style>
        </section>
    );
}

export default RegionsSection;
