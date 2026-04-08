import Image from 'next/image';
import RichText from '../content/RichText';
import { publicAssetUrl } from '@/lib/publicAssetUrl';

function AboutSection({ data }) {
    const { title, subtitle, image, features } = data;

    return (
        <section className="section-box wfSectionDark wfPadSection">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6 mb-40">
                        <Image
                            src={publicAssetUrl(image)}
                            alt="Small-scale fisheries"
                            className="wfImageRounded"
                            width={960}
                            height={640}
                        />
                    </div>
                    <div className="col-lg-6 pl-lg-50">
                        <h3 className="display-4 wfTitleHeroTight wfTitleHeroMb">{title}</h3>
                        <RichText
                            content={subtitle}
                            className="wfLeadMdStatic wfMbBottomLg"
                        />
                        <div className="wfDivider" />
                        <div className="row">
                            {features.map((feature, index) => (
                                <div key={index} className="col-lg-6 mb-30 px-3">
                                    <div className="wfAboutCard">
                                        <h4 className="wfHeading5">
                                            <svg className="wfIconInline" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                                            {feature.title}
                                        </h4>
                                        <RichText
                                            content={feature.description}
                                            className="wfAboutBody"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AboutSection;
