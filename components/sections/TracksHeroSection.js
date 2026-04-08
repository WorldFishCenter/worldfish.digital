function TracksHeroSection({ data }) {
    const { title, subtitle, col1Title, col1Items, col2Title, col2Items, ctaLabel, ctaHref } = data;

    return (
        <section className="section-box wfSectionDark wfPadSection">
            <div className="container">
                <div className="wfTracksBanner">
                    <div className="wfTracksBannerBg" aria-hidden />
                    <div className="wfTracksBannerInner">
                        <div className="wfTracksGlass">
                            <h3 className="wfHeadingTracks">{title}</h3>
                            <p className="wfTracksLead">
                                {subtitle}
                            </p>
                            <div className="row">
                                <div className="col-md-6 mb-20">
                                    <h4 className="wfHeading5">{col1Title}</h4>
                                    <ul className="wfListPlain">
                                        {col1Items.map((item, index) => (
                                            <li key={index} className="wfListItem">
                                                <span className="wfCheck">✓</span> <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="col-md-6 mb-20">
                                    <h4 className="wfHeading5">{col2Title}</h4>
                                    <ul className="wfListPlain">
                                        {col2Items.map((item, index) => (
                                            <li key={index} className="wfListItem">
                                                <span className="wfCheck">✓</span> <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-20">
                                <a
                                    href={ctaHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="wfCtaBtnMd"
                                    data-analytics-event="cta_click"
                                    data-analytics-category="tracks"
                                    data-analytics-label="tracks_exp_open"
                                    data-analytics-location="tracks_hero"
                                >
                                    {ctaLabel} ↗
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TracksHeroSection;
