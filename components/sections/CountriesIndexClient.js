import Layout from '../layout/Layout';
import EntityCard from '../elements/EntityCard';

const ACTIVE_PROJECT_SLUGS = ['timor-leste', 'kenya', 'zanzibar', 'mozambique', 'nigeria'];

function CountryGrid({ countries, themeBySlug }) {
    return (
        <div className="row">
            {countries.map((country) => (
                <div key={country.slug} className="col-lg-4 col-md-6 col-sm-12 mb-30 d-flex">
                    <EntityCard
                        href={`/countries/${country.slug}`}
                        eyebrow={country.themeSlugs.map((slug) => themeBySlug.get(slug)).filter(Boolean).join(' · ')}
                        title={country.name}
                        description={country.description}
                        backgroundImage={country.flagSrc}
                    />
                </div>
            ))}
        </div>
    );
}

export default function CountriesIndexClient({ countries, themeBySlug }) {
    const activeCountries = countries.filter((country) => ACTIVE_PROJECT_SLUGS.includes(country.slug));
    const otherCountries = countries.filter((country) => !ACTIVE_PROJECT_SLUGS.includes(country.slug));

    return (
        <Layout>
            <section className="section-box wfSectionDark wfPadHeroSm">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <h1 className="display-3 wfTitleHero">Countries</h1>
                            <p className="wfLead wfLeadMt">
                                Where WorldFish Digital tools and projects are deployed, from flagship national
                                platforms to emerging pilot geographies.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section-box wfSectionDark wfPadSection">
                <div className="container">
                    <div className="wfGroupPanel mb-40">
                        <h2 className="text-heading-3 wfGroupPanelTitle">Active Project Countries</h2>
                        <CountryGrid countries={activeCountries} themeBySlug={themeBySlug} />
                    </div>
                    <div className="wfGroupPanel">
                        <h2 className="text-heading-3 wfGroupPanelTitle">Pilot, Scaling &amp; Advisory Engagements</h2>
                        <CountryGrid countries={otherCountries} themeBySlug={themeBySlug} />
                    </div>
                </div>
            </section>
        </Layout>
    );
}
