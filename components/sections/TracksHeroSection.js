function TracksHeroSection({ data }) {
    const { title, subtitle, col1Title, col1Items, col2Title, col2Items, ctaLabel, ctaHref } = data;

    return (
        <section className="section-box mt-70">
            <div className="container">
                <div className="tracks-hero">
                    <div className="tracks-hero__bg" aria-hidden="true" />
                    <div className="tracks-hero__content">
                        <div className="tracks-hero__text">
                            <h3 className="text-heading-2 color-white">{title}</h3>
                            <p className="text-body-lead color-white mt-15 tracks-hero__lede">
                                {subtitle}
                            </p>
                            <div className="tracks-grid mt-20">
                                <div>
                                    <h4 className="text-heading-5 color-white">{col1Title}</h4>
                                    <ul className="list-checked mt-12 tracks-list">
                                        {col1Items.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-heading-5 color-white">{col2Title}</h4>
                                    <ul className="list-checked mt-12 tracks-list">
                                        {col2Items.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="d-flex flex-wrap gap-3 mt-25">
                                <a
                                    href={ctaHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-black icon-arrow-right-white"
                                >
                                    {ctaLabel}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .tracks-hero {
                    position: relative;
                    border-radius: 18px;
                    overflow: hidden;
                    min-height: 520px;
                    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.15);
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .tracks-hero__bg {
                    position: absolute;
                    inset: 0;
                    background-image: linear-gradient(90deg, rgba(4, 7, 15, 0.78) 0%, rgba(4, 7, 15, 0.5) 45%, rgba(4, 7, 15, 0.2) 70%), url('/assets/imgs/page/homepage1/tracksapp-map-screenshot.png');
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position: center;
                    filter: saturate(1.05) brightness(0.95);
                    opacity: 0.9;
                }
                .tracks-hero__content {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    align-items: center;
                    height: 100%;
                    padding: 32px;
                }
                .tracks-hero__text {
                    max-width: 760px;
                    position: relative;
                    padding: 16px;
                    border-radius: 14px;
                    background: linear-gradient(135deg, rgba(8, 11, 18, 0.65), rgba(8, 11, 18, 0.35));
                    line-height: 1.6;
                }
                .tracks-hero__lede {
                    max-width: 720px;
                    line-height: 1.6;
                }
                .tracks-hero__text p {
                    line-height: 1.6;
                }
                .tracks-grid {
                    display: grid;
                    gap: 14px;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                }
                .tracks-list li {
                    color: #f5f5f5;
                }
                .tracks-list li::before {
                    background: #d1fae5;
                }
                .tracks-hero__text .btn.btn-black {
                    background: #ffffff;
                    color: #0f172a;
                    border: 1px solid rgba(255, 255, 255, 0.7);
                }
                .tracks-hero__text .btn.btn-black:hover {
                    background: #f3f4f6;
                }
                @media (max-width: 991px) {
                    .tracks-hero {
                        min-height: 0;
                    }
                    .tracks-hero__content {
                        padding: 24px;
                    }
                    .tracks-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </section>
    );
}

export default TracksHeroSection;
