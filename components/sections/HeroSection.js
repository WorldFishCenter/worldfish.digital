import Link from 'next/link';
import { publicAssetUrl } from '@/lib/publicAssetUrl';
import RichText from '../content/RichText';

function HeroSection({ data, onWatchVideo }) {
    const { headline, headlineHighlight, subtitle, ctaLabel } = data;

    return (
        <section className="section-box wfSectionDark wfPadHero wfEcosystemHero">
            <div className="wfEcosystemGlow" aria-hidden />
            <div className="wfEcosystemGrid" aria-hidden />
            <div className="wfEcosystemNetwork" aria-hidden>
                <div className="wfNetBackbone" />
                <div className="wfNetEdge wfNetEdgeA" />
                <div className="wfNetEdge wfNetEdgeB" />
                <div className="wfNetEdge wfNetEdgeC" />
                <div className="wfNetEdge wfNetEdgeD" />
                <div className="wfNetEdge wfNetEdgeE" />
                <div className="wfNetCurrent wfNetCurrentA" />
                <div className="wfNetCurrent wfNetCurrentB" />
                <div className="wfNetAquaRing wfNetAquaRingA" />
                <div className="wfNetAquaRing wfNetAquaRingB" />
                <div className="wfNetVesselTrack wfNetVesselTrackA" />
                <div className="wfNetVesselTrack wfNetVesselTrackB" />
                <div className="wfNetVesselMark wfNetVesselMarkA" />
                <div className="wfNetVesselMark wfNetVesselMarkB" />
                <div className="wfNetNode wfNetNodeA" />
                <div className="wfNetNode wfNetNodeB" />
                <div className="wfNetNode wfNetNodeC" />
                <div className="wfNetNode wfNetNodeD" />
                <div className="wfNetNode wfNetNodeE" />
                <div className="wfNetNode wfNetNodeF" />
                <div className="wfNetPulse wfNetPulseA" />
                <div className="wfNetPulse wfNetPulseB" />
            </div>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6 mb-50">
                        <h1 className="display-3 wfTitleHero">
                            {headline}
                            <span className="wfAccentLine">{headlineHighlight}</span>
                        </h1>
                        <RichText
                            content={subtitle}
                            className="wfLead wfLeadMt"
                        />
                        <div className="mt-50 d-flex flex-wrap gap-3">
                            <button
                                type="button"
                                className="wfBtnPrimary"
                                onClick={onWatchVideo}
                                aria-label="Open presentation modal"
                            >
                                {ctaLabel} ↗
                            </button>
                            <Link href="/how-it-works" className="wfBtnGhost">
                                How it works ↗
                            </Link>
                        </div>
                    </div>
                    <div className="col-lg-6 d-none d-lg-block">
                        <div className="wfMediaFrame">
                            {data.videoFile ? (
                                <video
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="wfMediaInner"
                                >
                                    <source src={publicAssetUrl(data.videoFile)} type="video/mp4" />
                                    <track kind="captions" srcLang="en" label="English captions" />
                                </video>
                            ) : (
                                <img
                                    src={publicAssetUrl(data.imageFile) || '/assets/imgs/page/homepage1/banner.png'}
                                    alt="Platform demonstration"
                                    className="wfMediaInner"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
