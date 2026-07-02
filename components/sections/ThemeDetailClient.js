import Link from 'next/link';
import Layout from '../layout/Layout';
import EntityCard from '../elements/EntityCard';

function ProductGrid({ products }) {
    return (
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
    );
}

export default function ThemeDetailClient({ theme, projects, products, countries, personas }) {
    const featuredSlugs = theme.featuredProductSlugs;
    const featuredProducts = featuredSlugs
        ? products.filter((product) => featuredSlugs.includes(product.slug))
        : [];
    const otherProducts = featuredSlugs
        ? products.filter((product) => !featuredSlugs.includes(product.slug))
        : products;

    return (
        <Layout>
            <section className="section-box wfSectionDark wfPadHeroSm">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <p className="wfMuted mb-10">{theme.tagline}</p>
                            <h1 className="display-3 wfTitleHero">{theme.name}</h1>
                            <p className="wfLead wfLeadMt">{theme.description}</p>
                        </div>
                    </div>
                </div>
            </section>

            {featuredSlugs ? (
                <section className="section-box wfSectionDark wfPadSection">
                    <div className="container">
                        {featuredProducts.length > 0 && (
                            <div className="wfGroupPanel mb-40">
                                <h2 className="text-heading-3 wfGroupPanelTitle">Featured Products</h2>
                                <ProductGrid products={featuredProducts} />
                            </div>
                        )}
                        {otherProducts.length > 0 && (
                            <div className="wfGroupPanel">
                                <h2 className="text-heading-3 wfGroupPanelTitle">Related Products</h2>
                                <ProductGrid products={otherProducts} />
                            </div>
                        )}
                    </div>
                </section>
            ) : (
                products.length > 0 && (
                    <section className="section-box wfSectionDark wfPadSection">
                        <div className="container">
                            <h3 className="display-4 wfTitleHeroTight wfTitleHeroMb">Products</h3>
                            <ProductGrid products={products} />
                        </div>
                    </section>
                )
            )}

            {projects.length > 0 && (
                <section className="section-box wfSectionDark wfPadSection">
                    <div className="container">
                        <h3 className="display-4 wfTitleHeroTight wfTitleHeroMb">Projects</h3>
                        <div className="row">
                            {projects.map((project) => (
                                <div key={project.slug} className="col-lg-6 mb-20">
                                    <div className="wfFeatureCard">
                                        <div className="wfFlexBetween">
                                            <h4 className="wfHeadingFeature">{project.name}</h4>
                                            <p className="wfMuted">{project.status}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {countries.length > 0 && (
                <section className="section-box wfSectionDark wfPadSection">
                    <div className="container">
                        <h3 className="display-4 wfTitleHeroTight wfTitleHeroMb">Countries active</h3>
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

            {personas.length > 0 && (
                <section className="section-box wfSectionDark wfPadSection">
                    <div className="container">
                        <h3 className="display-4 wfTitleHeroTight wfTitleHeroMb">Who this serves</h3>
                        <ul className="wfChipList">
                            {personas.map((persona) => (
                                <li key={persona.slug}>
                                    <span className="wfChip">{persona.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}
        </Layout>
    );
}
