import Link from 'next/link';
import { productHref, themeHref } from '@/lib/routes.mjs';

export default function PersonaRouter({ personas }) {
    return (
        <section className="section-box wfSectionDark wfPadSection">
            <div className="container">
                <div className="row justify-content-center mb-50">
                    <div className="col-lg-8 text-center">
                        <h2 className="display-4 wfTitleWhiteMb">I am a...</h2>
                        <p className="wfLeadMdStatic">
                            Find the tools and evidence built for how you work.
                        </p>
                    </div>
                </div>
                <div className="row">
                    {personas.map((persona) => {
                        const href = persona.keyProductSlugs[0]
                            ? productHref(persona.keyProductSlugs[0])
                            : themeHref(persona.themeSlugs[0]);

                        return (
                            <div key={persona.slug} className="col-lg-3 col-md-4 col-sm-6 mb-30 d-flex">
                                <Link href={href} className="wfBlockFull">
                                    <div className="wfFeatureCard wfFeatureCardInteractive">
                                        <h4 className="wfHeadingFeature">{persona.name}</h4>
                                        <p className="wfFeatureBody">{persona.tagline}</p>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
