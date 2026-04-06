import Link from 'next/link';

function EcosystemHeroSection({ data }) {
    const { headline, headlineHighlight, subtitle, ctaLabel } = data;

    return (
        <section className="section-box wfEcosystemHero">
            <div className="wfEcosystemGlow" aria-hidden />
            <div className="wfEcosystemGrid" aria-hidden />
            <div className="container wfEcosystemContent">
                <div className="row align-items-center">
                    <div className="col-lg-7 col-md-11">
                        {/* <div className="d-flex align-items-center gap-3 mb-30">
                            <span className="wfBadgeIcon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                            </span>
                            <span className="wfEcosystemKicker">
                                WorldFish Data Ecosystem
                            </span>
                        </div> */}

                        <h1 className="display-2 mb-30 wfDisplay2">
                            {headline}
                            <span className="wfAccentLineTight">{headlineHighlight}</span>
                        </h1>

                        <p className="mb-40 wfSubtitleWide">
                            {subtitle}
                        </p>

                        <div className="d-flex flex-wrap gap-3">
                            <Link href="#platforms">
                                <button type="button" className="wfBtnPrimary">
                                    Explore Platforms
                                </button>
                            </Link>
                            <Link href="/under-costruction">
                                <button type="button" className="wfBtnGhostAlt">
                                    View Data Standards ↗
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default EcosystemHeroSection;
