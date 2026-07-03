import Link from 'next/link';
import Layout from '../layout/Layout';
import EntityCard from '../elements/EntityCard';

export default function ProjectDetailClient({ project, themes, countries, products, donors }) {
    const meta = [project.status, project.programme].filter(Boolean).join(' · ');
    const background = project.historicalNote || project.whatItWas;

    return (
        <Layout>
            <section className="section-box wfSectionDark wfPadHeroSm">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            {meta && <p className="wfMuted mb-10">{meta}</p>}
                            <h1 className="display-3 wfTitleHero">{project.name}</h1>
                            {project.fullName && <p className="wfLead wfLeadMt">{project.fullName}</p>}
                        </div>
                    </div>
                </div>
            </section>

            {products.length > 0 && (
                <section className="section-box wfSectionDark wfPadSection">
                    <div className="container">
                        <h3 className="display-4 wfTitleHeroTight wfTitleHeroMb">Products</h3>
                        <div className="row">
                            {products.map((product) => (
                                <div key={product.slug} className="col-lg-4 col-md-6 col-sm-12 mb-30 d-flex">
                                    <EntityCard
                                        href={`/products/${product.slug}`}
                                        eyebrow={[product.type, product.status].filter(Boolean).join(' · ')}
                                        title={product.name}
                                        description={product.description}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {(themes.length > 0 ||
                (project.thematicAreas && project.thematicAreas.length > 0) ||
                (project.impactAreas && project.impactAreas.length > 0)) && (
                <section className="section-box wfSectionDark wfPadSection">
                    <div className="container">
                        <h3 className="display-4 wfTitleHeroTight wfTitleHeroMb">Focus areas</h3>
                        {themes.length > 0 && (
                            <>
                                <p className="wfMuted mb-10">Work areas</p>
                                <ul className="wfChipList mb-30">
                                    {themes.map((theme) => (
                                        <li key={theme.slug}>
                                            <Link href={`/our-work/${theme.slug}`} className="wfChip">
                                                {theme.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                        {project.thematicAreas && project.thematicAreas.length > 0 && (
                            <>
                                <p className="wfMuted mb-10">Thematic</p>
                                <ul className="wfChipList mb-30">
                                    {project.thematicAreas.map((area) => (
                                        <li key={area}>
                                            <span className="wfChip">{area}</span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                        {project.impactAreas && project.impactAreas.length > 0 && (
                            <>
                                <p className="wfMuted mb-10">Impact</p>
                                <ul className="wfChipList">
                                    {project.impactAreas.map((area) => (
                                        <li key={area}>
                                            <span className="wfChip">{area}</span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </section>
            )}

            {countries.length > 0 && (
                <section className="section-box wfSectionDark wfPadSection">
                    <div className="container">
                        <h3 className="display-4 wfTitleHeroTight wfTitleHeroMb">Countries</h3>
                        <ul className="wfChipList">
                            {countries.map((country) => (
                                <li key={country.slug}>
                                    <Link href={`/countries/${country.slug}`} className="wfChip">
                                        {country.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {donors.length > 0 && (
                <section className="section-box wfSectionDark wfPadSection">
                    <div className="container">
                        <h3 className="display-4 wfTitleHeroTight wfTitleHeroMb">Funded by</h3>
                        <ul className="wfChipList">
                            {donors.map((donor) => (
                                <li key={donor.slug}>
                                    <span className="wfChip">{donor.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {(background || (project.productsCreated && project.productsCreated.length > 0)) && (
                <section className="section-box wfSectionDark wfPadSection">
                    <div className="container">
                        <h3 className="display-4 wfTitleHeroTight wfTitleHeroMb">Background</h3>
                        <div className="row">
                            <div className="col-lg-8">
                                {background && <p className="wfLead wfLeadMt">{background}</p>}
                                {project.note && <p className="wfMuted mt-10">{project.note}</p>}
                            </div>
                        </div>
                        {project.productsCreated && project.productsCreated.length > 0 && (
                            <ul className="wfChipList mt-30">
                                {project.productsCreated.map((item) => (
                                    <li key={item}>
                                        <span className="wfChip">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            )}
        </Layout>
    );
}
