import RichText from '../content/RichText';

function CTASection({ data }) {
    const { title, subtitle, ctaLabel, ctaHref } = data;

    return (
        <section className="section-box wfSectionDark wfPadSection">
            <div className="container">
                <div className="wfCtaPanel">
                    <div className="wfCtaMax">
                        <h3 className="display-4 wfTitleHeroTight wfTitleHeroMb">{title}</h3>
                        <RichText
                            content={subtitle}
                            className="wfLeadMdStatic"
                        />
                    </div>
                    <div>
                        <a
                            href={ctaHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wfCtaBtnLg"
                        >
                            {ctaLabel} ↗
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CTASection;
