import Image from 'next/image';
import Layout from '../layout/Layout';
import EntityLinkList from '../detail/EntityLinkList';

function toItems(countries, themeBySlug) {
    return countries.map((country) => ({
        href: `/countries/${country.slug}`,
        name: country.name,
        sub:
            country.themeSlugs.map((slug) => themeBySlug.get(slug)).filter(Boolean).join(' · ') || null,
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

export default function CountriesIndexClient({ countries, themeBySlug }) {
    // A country is an active engagement once it has tools deployed; everything else
    // is a pilot, assessment, or emerging geography.
    const active = countries.filter((c) => (c.productSlugs || []).length > 0);
    const emerging = countries.filter((c) => (c.productSlugs || []).length === 0);

    const groups = [
        { title: 'Active engagements', items: toItems(active, themeBySlug) },
        { title: 'Pilot & emerging', items: toItems(emerging, themeBySlug) },
    ].filter((group) => group.items.length > 0);

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
                    <div className="row">
                        <div className="col-lg-9">
                            <EntityLinkList groups={groups} />
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
