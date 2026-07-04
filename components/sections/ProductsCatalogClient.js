'use client'
import { useMemo, useState } from 'react';
import Layout from '../layout/Layout';
import EntityLinkList from '../detail/EntityLinkList';
import { groupProductsByType } from '../detail/meta';

const ALL = 'All';

function FilterGroup({ label, options, active, onChange }) {
    return (
        <div className="mb-30">
            <p className="wfMuted mb-10">{label}</p>
            <ul className="wfChipList">
                {[ALL, ...options].map((option) => (
                    <li key={option}>
                        <button
                            type="button"
                            className={`wfChip ${active === option ? 'wfChipActive' : ''}`}
                            onClick={() => onChange(option)}
                        >
                            {option}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const productItem = (product) => ({
    href: `/products/${product.slug}`,
    name: product.name,
    sub: product.description || null,
    status: product.status,
});

export default function ProductsCatalogClient({ products, themes }) {
    const [type, setType] = useState(ALL);
    const [theme, setTheme] = useState(ALL);

    const types = useMemo(
        () => [...new Set(products.map((p) => p.type).filter(Boolean))].sort(),
        [products]
    );
    const themeOptions = useMemo(() => themes.map((t) => t.name), [themes]);
    const themeBySlug = useMemo(() => new Map(themes.map((t) => [t.slug, t.name])), [themes]);

    const filtered = products.filter((product) => {
        if (type !== ALL && product.type !== type) return false;
        if (theme !== ALL) {
            const productThemeNames = product.themeSlugs.map((slug) => themeBySlug.get(slug));
            if (!productThemeNames.includes(theme)) return false;
        }
        return true;
    });

    // Group by component type when the type facet is open; a single flat list once
    // the user has already narrowed to one type.
    const groups =
        type === ALL
            ? groupProductsByType(filtered).map((group) => ({
                  title: group.title,
                  items: group.items.map(productItem),
              }))
            : null;

    return (
        <Layout>
            <section className="section-box wfSectionDark wfPadHeroSm">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <h1 className="display-3 wfTitleHero">Tools &amp; Products</h1>
                            <p className="wfLead wfLeadMt">
                                Every digital tool, platform, and data asset built across WorldFish Digital&apos;s
                                portfolio — filter by type or theme to find what fits your work.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section-box wfSectionDark wfPadSection">
                <div className="container">
                    <FilterGroup label="Type" options={types} active={type} onChange={setType} />
                    <FilterGroup label="Theme" options={themeOptions} active={theme} onChange={setTheme} />

                    <p className="wfMuted mt-30 mb-30">{filtered.length} products</p>

                    {groups ? (
                        <EntityLinkList groups={groups} />
                    ) : (
                        <EntityLinkList items={filtered.map(productItem)} />
                    )}
                </div>
            </section>
        </Layout>
    );
}
