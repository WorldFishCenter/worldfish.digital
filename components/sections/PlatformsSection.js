import RichText from '../content/RichText';
import Link from 'next/link';

function PlatformsSection({ data }) {
    const { title, subtitle, features } = data;

    return (
        <section id="platforms" className="section-box wfSectionDark wfPadPlatforms">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8 text-center mb-60">
                        <div className="wfCenterBlock">
                            <svg className="wfIconAccent" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                        </div>
                        <h2 className="display-4 wfTitleWhiteMb">{title}</h2>
                        <RichText
                            content={subtitle}
                            className="text-body-lead-large wfLeadMdStatic"
                        />
                        <div className="mt-40 wfInlineBlock">
                            <Link href="/under-costruction" className="wfLinkOutline">
                                See architecture details ↗
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {features.map((feature, index) => (
                        <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-30 d-flex">
                            <div className="wfPlatformCard">
                                <div className="mb-20">
                                    <svg className="wfIconAccent" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                                </div>
                                <h4 className="wfHeadingPlatform">{feature.title}</h4>
                                <RichText
                                    content={feature.description}
                                    className="wfPlatformDesc"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default PlatformsSection;
