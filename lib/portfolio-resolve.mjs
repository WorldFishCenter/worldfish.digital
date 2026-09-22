/**
 * Portfolio resolution — pure. No imports, no I/O.
 *
 * This is the module's internal seam: `lib/portfolio.js` binds it once to the committed
 * JSON snapshot, and the tests bind it to small fixtures. Application code should import
 * from `@/lib/portfolio`, never from here.
 *
 * See CONTEXT.md for the domain terms (entity, work area, initiative, relationship).
 */

export const COLLECTIONS = [
    'themes',
    'projects',
    'products',
    'countries',
    'donors',
    'personas',
    'initiatives',
];

/**
 * Link relations, declared once.
 *
 * Each entry is [field on the record, collection it points at, key on the resolved entity,
 * order]. To ADD A RELATION, add a line — nothing else changes. New *scalar* fields need no
 * entry at all: a resolved entity spreads its raw record, so they appear as soon as
 * scripts/sync-airtable.js writes them.
 *
 * Only one direction is ever read. Airtable's links are all symmetric and the sync derives
 * both sides into the JSON, so the stored array is always complete — scanning the far
 * collection would only repeat work the sync already did.
 *
 * `order` sequences the resolved array:
 *   'stored'     — the order the slugs sit in on the record (an Airtable link order).
 *   'collection' — the order of the target collection itself, so the list is stable however
 *                  the sync happened to discover it. Used where the slug array is derived
 *                  by the sync and its order is therefore incidental.
 */
export const LINKS = {
    products: [
        ['themeSlugs', 'themes', 'themes', 'stored'],
        ['countrySlugs', 'countries', 'countries', 'stored'],
        ['projectSlugs', 'projects', 'projects', 'stored'],
    ],
    projects: [
        ['themeSlugs', 'themes', 'themes', 'stored'],
        ['countrySlugs', 'countries', 'countries', 'stored'],
        // "Lead product" in Airtable is a plain symmetric link, not a lead/primary
        // distinction — the same relation as products[].projectSlugs seen from the other
        // side. The JSON key keeps Airtable's wording; callers just see `.products`.
        ['leadProductSlugs', 'products', 'products', 'stored'],
        ['donorSlugs', 'donors', 'donors', 'stored'],
    ],
    countries: [
        ['themeSlugs', 'themes', 'themes', 'stored'],
        ['productSlugs', 'products', 'products', 'stored'],
        ['projectSlugs', 'projects', 'projects', 'stored'],
    ],
    themes: [
        ['projectSlugs', 'projects', 'projects', 'collection'],
        ['productSlugs', 'products', 'products', 'collection'],
        ['countrySlugs', 'countries', 'countries', 'collection'],
        ['personaSlugs', 'personas', 'personas', 'collection'],
        ['donorSlugs', 'donors', 'donors', 'collection'],
    ],
};

/**
 * Build the portfolio over a dataset.
 *
 * @param {Record<string, object[]>} data keyed by collection name, plus `relationships`.
 * @returns the four resolvers and the collection accessors.
 */
export function buildPortfolio(data) {
    const index = {};
    const rank = {};
    COLLECTIONS.forEach((name) => {
        const list = data[name] || [];
        index[name] = new Map(list.map((item) => [item.slug, item]));
        rank[name] = new Map(list.map((item, i) => [item.slug, i]));
    });

    const record = (collection, slug) => (slug ? index[collection].get(slug) || null : null);

    const resolveMany = (collection, slugs, order) => {
        const found = (slugs || []).map((slug) => index[collection].get(slug)).filter(Boolean);
        if (order === 'collection') {
            found.sort((a, b) => rank[collection].get(a.slug) - rank[collection].get(b.slug));
        }
        return found;
    };

    /** Spread the record, then attach every relation declared for its collection. */
    const withLinks = (collection, source) => {
        const out = { ...source };
        (LINKS[collection] || []).forEach(([field, target, key, order]) => {
            out[key] = resolveMany(target, source[field], order);
        });
        return out;
    };

    /**
     * The connected component of the product↔product relationship graph containing
     * `productSlug`, as { focus, nodes, edges }; null when the product has no edges.
     * Lets the UI show the whole local ecosystem (multi-hop), not just direct neighbours.
     */
    const relationshipGraph = (productSlug) => {
        const edges = data.relationships || [];
        const adj = new Map();
        const connect = (a, b) => {
            if (!adj.has(a)) adj.set(a, new Set());
            adj.get(a).add(b);
        };
        edges.forEach((edge) => {
            connect(edge.from, edge.to);
            connect(edge.to, edge.from);
        });
        if (!adj.has(productSlug)) return null;

        const component = new Set([productSlug]);
        const queue = [productSlug];
        while (queue.length) {
            const node = queue.shift();
            (adj.get(node) || []).forEach((next) => {
                if (!component.has(next)) {
                    component.add(next);
                    queue.push(next);
                }
            });
        }

        const nodes = [...component]
            .map((slug) => {
                const product = record('products', slug);
                if (!product) return null;
                const initiative = record('initiatives', product.initiative);
                return {
                    slug,
                    name: product.name,
                    type: product.type || null,
                    initiative: initiative
                        ? { slug: initiative.slug, name: initiative.name }
                        : null,
                    countrySlugs: product.countrySlugs || [],
                };
            })
            .filter(Boolean);
        const componentEdges = edges.filter((e) => component.has(e.from) && component.has(e.to));
        return { focus: productSlug, nodes, edges: componentEdges };
    };

    // `initiative` is deliberately NOT resolved onto the entity. It is a single slug rather
    // than a *Slugs array, nothing renders it, and the initiative record carries its own
    // product/project lists — resolving it shipped ~400 bytes of unread data per product
    // page. It passes through as a scalar; the graph resolves initiative names itself,
    // trimmed to { slug, name }, which is the only place they are actually displayed.
    const getProduct = (slug) => {
        const source = record('products', slug);
        if (!source) return null;
        const product = withLinks('products', source);
        product.graph = relationshipGraph(source.slug);
        return product;
    };

    const getProject = (slug) => {
        const source = record('projects', slug);
        return source ? withLinks('projects', source) : null;
    };

    const getCountry = (slug) => {
        const source = record('countries', slug);
        return source ? withLinks('countries', source) : null;
    };

    const getTheme = (slug) => {
        const source = record('themes', slug);
        if (!source) return null;
        const theme = withLinks('themes', source);
        // A theme may flag some of its products as featured; the view leads with those and
        // groups the rest. Featured slugs are scoped to the theme's own products, and keep
        // the order they are listed in — featuredProductSlugs is a hand-maintained repo
        // overlay (preserved across syncs), so that order is an editorial choice.
        const featured = source.featuredProductSlugs;
        const inTheme = new Set(theme.products.map((product) => product.slug));
        theme.featuredProducts = featured
            ? featured.filter((slug) => inTheme.has(slug)).map((slug) => record('products', slug))
            : [];
        theme.otherProducts = featured
            ? theme.products.filter((product) => !featured.includes(product.slug))
            : theme.products;
        return theme;
    };

    return {
        getProduct,
        getProject,
        getCountry,
        getTheme,
        getProducts: () => data.products || [],
        getProjects: () => data.projects || [],
        getThemes: () => data.themes || [],
        getCountries: () => data.countries || [],
        getDonors: () => data.donors || [],
        getPersonas: () => data.personas || [],
        getTeam: () => data.team || [],
    };
}
