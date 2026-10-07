'use client'
import { useMemo, useState } from 'react';
import Layout from '../layout/Layout';
import EntityLinkList from '../detail/EntityLinkList';
import AreaTags from '../detail/AreaTags';
import { groupProductsByType, countLabel } from '../detail/meta';
import { productHref } from '@/lib/routes.mjs';

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
    href: productHref(product.slug),
    name: product.name,
    sub: product.summary,
    // Where it runs and what produced it — the same meta line every other tool list on the
    // site carries. Without it the catalogue is the one place a tool row says less.
    meta:
        [product.initiatives.join(' · '), product.countries.join(' · ')]
            .filter(Boolean)
            .join(' — ') || null,
    tags: <AreaTags areas={product.areas} className="wfAreaTagsRow" />,
    status: product.status,
});

export default function ProductsCatalogClient({ products, themes, initiatives = [], facts = [] }) {
    const [type, setType] = useState(ALL);
    const [theme, setTheme] = useState(ALL);
    // The initiative facet matters most as the portfolio grows: it is the axis the work is
    // actually organised on, and the homepage leads with it.
    const [initiative, setInitiative] = useState(ALL);

    const types = useMemo(
        () => [...new Set(products.map((p) => p.type).filter(Boolean))].sort(),
        [products]
    );

    const filtered = products.filter((product) => {
        if (type !== ALL && product.type !== type) return false;
        if (theme !== ALL && !product.themes.includes(theme)) return false;
        if (initiative !== ALL && !(product.initiatives || []).includes(initiative)) return false;
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
                            <h1 className="display-3 wfTitleHero">Tools</h1>
                            <p className="wfLead wfLeadMt">
                                Every tool in the portfolio, filterable by the initiative that
                                produced it, by what kind of component it is, and by impact area.
                                Work that is archived or still at concept stage is listed too, with
                                its status, so this reads as a record rather than a shop window.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section-box wfSectionDark wfPadSectionMd">
                <div className="container">
                    {products.length === 0 ? (
                        <p className="wfMutedLg">
                            No tools are published yet. Each one appears here once its record
                            in the portfolio database has been reviewed and marked Live.
                        </p>
                    ) : (
                        <>
                            {facts.length > 0 && (
                                <ul className="wfFactLine wfFactLineDark mb-40">
                                    {facts.map((fact) => (
                                        <li key={fact.label}>
                                            <span className="wfFactStatic">{fact.label}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {initiatives.length > 0 && (
                                <FilterGroup
                                    label="Initiative"
                                    options={initiatives}
                                    active={initiative}
                                    onChange={setInitiative}
                                />
                            )}
                            <FilterGroup label="Type" options={types} active={type} onChange={setType} />
                            <FilterGroup
                                label="Impact area"
                                options={themes}
                                active={theme}
                                onChange={setTheme}
                            />

                            <p className="wfMuted mt-30 mb-30">
                                {countLabel(filtered.length, 'tool')}
                            </p>

                            {groups ? (
                                <EntityLinkList groups={groups} />
                            ) : (
                                <EntityLinkList items={filtered.map(productItem)} />
                            )}
                        </>
                    )}
                </div>
            </section>
        </Layout>
    );
}
