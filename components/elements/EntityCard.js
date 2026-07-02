import Link from 'next/link';
import Image from 'next/image';
import RichText from '../content/RichText';

function EntityCard({ href, eyebrow, title, description, meta, backgroundImage }) {
    return (
        <Link href={href} className="wfBlockFull">
            <div className="wfFeatureCard wfFeatureCardInteractive">
                {backgroundImage && (
                    <>
                        <Image src={backgroundImage} alt="" fill unoptimized className="wfCardBgImage" />
                        <div className="wfCardBgOverlay" aria-hidden="true" />
                    </>
                )}
                <div className="wfCardContent">
                    <div className="wfFlexBetween">
                        <h4 className="wfHeadingFeature">{title}</h4>
                        <svg className="wfIconAccent" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </div>
                    {eyebrow && <p className="wfMuted mb-10">{eyebrow}</p>}
                    {description && <RichText content={description} className="wfFeatureBody" />}
                    {meta && <p className="wfMuted mt-10">{meta}</p>}
                </div>
            </div>
        </Link>
    );
}

export default EntityCard;
