import Link from 'next/link';
import Image from 'next/image';
import Layout from '../layout/Layout';
import EntityCard from '../elements/EntityCard';
import { publicAssetUrl } from '@/lib/publicAssetUrl';

export default function CountryDetailClient({ country, themes, products, projects }) {
    return (
        <Layout>
            <section className="section-box wfSectionDark wfPadHeroSm">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-7">
                            {country.flagSrc && (
                                <Image
                                    src={country.flagSrc}
                                    alt={`${country.name} flag`}
                                    width={48}
                                    height={32}
                                    unoptimized
                                    className="mb-20"
                                />
                            )}
                            <h1 className="display-3 wfTitleHero">{country.name}</h1>
                            {country.pipeline && <p className="wfMuted mt-10">Pipeline geography</p>}
                            <p className="wfLead wfLeadMt">{country.description}</p>
                            {country.ctaLabel && country.ctaHref && (
                                <div className="mt-40">
                                    <a
                                        href={country.ctaHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="wfBtnPrimary"
                                    >
                                        {country.ctaLabel} ↗
                                    </a>
                                </div>
                            )}
                        </div>
                        {country.image && (
                            <div className="col-lg-5 d-none d-lg-block">
                                <Image
                                    src={publicAssetUrl(country.image)}
                                    alt={country.name}
                                    width={640}
                                    height={420}
                                    className="wfImageRounded"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {themes.length > 0 && (
                <section className="section-box wfSectionDark wfPadSection">
                    <div className="container">
                        <h3 className="display-4 wfTitleHeroTight wfTitleHeroMb">Active themes</h3>
                        <ul className="wfChipList">
                            {themes.map((theme) => (
                                <li key={theme.slug}>
                                    <Link href={`/our-work/${theme.slug}`} className="wfChip">
                                        {theme.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}

            {products.length > 0 && (
                <section className="section-box wfSectionDark wfPadSection">
                    <div className="container">
                        <h3 className="display-4 wfTitleHeroTight wfTitleHeroMb">Products deployed</h3>
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

            {projects.length > 0 && (
                <section className="section-box wfSectionDark wfPadSection">
                    <div className="container">
                        <h3 className="display-4 wfTitleHeroTight wfTitleHeroMb">Related projects</h3>
                        <div className="row">
                            {projects.map((project) => (
                                <div key={project.slug} className="col-lg-6 mb-20">
                                    <Link href={`/projects/${project.slug}`} className="wfBlockFull">
                                        <div className="wfFeatureCard">
                                            <div className="wfFlexBetween">
                                                <h4 className="wfHeadingFeature">{project.name}</h4>
                                                <p className="wfMuted">{project.status}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </Layout>
    );
}
