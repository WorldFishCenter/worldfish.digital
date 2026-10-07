import Image from 'next/image';
import Layout from '../layout/Layout';
import EntityLinkList from '../detail/EntityLinkList';
import CountriesGlobe from './CountriesGlobe';
import { countLabel } from '../detail/meta';
import { countryHref } from '@/lib/routes.mjs';

/** Every index row on the site states the same three things: what it is called, what it is,
 *  and how much of it there is. Without the last, a row is a name. */
function toItems(countries) {
    return countries.map((country) => ({
        href: countryHref(country.slug),
        name: country.name,
        sub: country.themes.map((theme) => theme.name).join(' · ') || null,
        meta:
            [
                country.projectSlugs.length &&
                    countLabel(country.projectSlugs.length, 'initiative'),
                country.productSlugs.length && countLabel(country.productSlugs.length, 'tool'),
            ]
                .filter(Boolean)
                .join(' · ') || null,
        leading: country.flagSrc ? (
            <Image
                src={country.flagSrc}
                alt=""
                width={30}
                height={20}
                unoptimized
            />
        ) : null,
    }));
}

export default function CountriesIndexClient({ countries, markers }) {

    return (
        <Layout>
            <section className="section-box wfSectionDark wfPadHeroSm">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <h1 className="display-3 wfTitleHero">Where we work</h1>
                            <p className="wfLead wfLeadMt">
                                Countries where a published tool or initiative in the portfolio runs,
                                with the impact areas that work contributes to.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {markers.length > 0 && (
                <section className="section-box wfSectionDark wfPadSection">
                    <div className="container">
                        <CountriesGlobe markers={markers} />
                    </div>
                </section>
            )}
            <section className="section-box wfSectionDark wfPadSection">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-9">
                            {countries.length === 0 ? (
                                <p className="wfMutedLg">
                                    No countries are listed yet. A country appears here once a
                                    tool, initiative or outcome tagged to it has been reviewed and
                                    marked Live.
                                </p>
                            ) : (
                                <EntityLinkList items={toItems(countries)} />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
