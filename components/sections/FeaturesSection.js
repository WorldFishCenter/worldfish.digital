import RichText from '../content/RichText';
import Link from 'next/link';

function FeaturesSection({ features }) {
    return (
        <section className="section-box wfSectionDark wfPadTight">
            <div className="container">
                <div className="row">
                    {features.map((feature, index) => {
                        const cardClass = `wfFeatureCard${feature.ctaHref ? ' wfFeatureCardInteractive' : ''}`;

                        const CardContent = (
                            <div className={cardClass}>
                                <div className="wfFlexBetween">
                                    <h4 className="wfHeadingFeature">{feature.title}</h4>
                                    {feature.ctaHref && (
                                        <svg className="wfIconAccent" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                    )}
                                </div>
                                <RichText
                                    content={feature.description}
                                    className="wfFeatureBody"
                                />
                            </div>
                        );

                        const href = feature.ctaHref;
                        const isExternal = typeof href === 'string' && /^https?:\/\//i.test(href);

                        return (
                            <div key={index} className="col-lg-3 col-sm-12 mb-30 d-flex">
                                {href ? (
                                    isExternal ? (
                                        <a href={href} className="wfBlockFull" target="_blank" rel="noopener noreferrer">
                                            {CardContent}
                                        </a>
                                    ) : (
                                        <Link href={href} className="wfBlockFull">
                                            {CardContent}
                                        </Link>
                                    )
                                ) : (
                                    CardContent
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default FeaturesSection;
