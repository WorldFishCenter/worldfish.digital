/**
 * Portfolio resolution — pure. No data imports, no I/O.
 *
 * This is the module's internal seam: `lib/portfolio.js` binds it once to the committed
 * JSON snapshot, and the tests bind it to small fixtures. Application code should import
 * from `@/lib/portfolio`, never from here.
 *
 * See CONTEXT.md for the domain terms (entity, impact area, relationship, outcome).
 */
import { component } from './relationships.mjs';

export const COLLECTIONS = ['themes', 'projects', 'products', 'countries'];

/**
 * Link relations, declared once.
 *
 * Each entry is [field on the record, collection it points at, key on the resolved entity].
 * To ADD A RELATION, add a line — nothing else changes. New *scalar* fields need no entry
 * at all: a resolved entity spreads its raw record, so they appear as soon as
 * scripts/sync-airtable.js writes them.
 *
 * Only the forward links are stored in the JSON (a tool's areas, countries and
 * initiatives; an initiative's areas and countries). The reverse arrays read here —
 * `productSlugs` on an initiative, everything on a theme or country — are derived by
 * `buildPortfolio` below, in collection order, so they can never drift from the records.
 */
export const LINKS = {
    products: [
        ['themeSlugs', 'themes', 'themes'],
        ['countrySlugs', 'countries', 'countries'],
        ['projectSlugs', 'projects', 'projects'],
    ],
    projects: [
        ['themeSlugs', 'themes', 'themes'],
        ['countrySlugs', 'countries', 'countries'],
        ['productSlugs', 'products', 'products'],
    ],
    countries: [
        ['themeSlugs', 'themes', 'themes'],
        ['productSlugs', 'products', 'products'],
        ['projectSlugs', 'projects', 'projects'],
    ],
    themes: [
        ['projectSlugs', 'projects', 'projects'],
        ['productSlugs', 'products', 'products'],
        ['countrySlugs', 'countries', 'countries'],
    ],
};

/** Where an outcome names each kind of entity. */
export const OUTCOME_FIELD = {
    products: 'productSlugs',
    projects: 'projectSlugs',
    countries: 'countrySlugs',
    themes: 'themeSlugs',
};

const has = (record, field, slug) => (record[field] || []).includes(slug);
const slugs = (list) => list.map((item) => item.slug);

/**
 * Build the portfolio over a dataset.
 *
 * @param {Record<string, object[]>} input products, projects, outcomes and relationships
 *   as the sync writes them, plus the hand-maintained `themes` and `countries` reference
 *   lists and `team`.
 * @returns the four resolvers and the collection accessors.
 */
export function buildPortfolio(input) {
    const products = input.products || [];
    const outcomes = input.outcomes || [];
    const projects = (input.projects || []).map((project) => ({
        ...project,
        productSlugs: slugs(products.filter((p) => has(p, 'projectSlugs', project.slug))),
    }));

    // The reference list, in its own order, restricted to the slugs something points at.
    const referenced = (reference, records, field) => {
        const wanted = new Set(records.flatMap((record) => record[field] || []));
        return slugs(reference.filter((item) => wanted.has(item.slug)));
    };

    // Every impact area is always present — an empty one is shown as empty, not hidden.
    const themes = (input.themes || []).map((theme) => {
        const mine = [...products, ...projects].filter((x) => has(x, 'themeSlugs', theme.slug));
        return {
            ...theme,
            productSlugs: slugs(products.filter((p) => has(p, 'themeSlugs', theme.slug))),
            projectSlugs: slugs(projects.filter((p) => has(p, 'themeSlugs', theme.slug))),
            countrySlugs: referenced(input.countries || [], mine, 'countrySlugs'),
        };
    });

    // A country is in the portfolio only while something Live is tagged to it. The
    // reference list holds more countries than that; the rest have no page.
    const countries = (input.countries || [])
        .map((country) => {
            const here = [...products, ...projects].filter((x) =>
                has(x, 'countrySlugs', country.slug)
            );
            return {
                ...country,
                productSlugs: slugs(products.filter((p) => has(p, 'countrySlugs', country.slug))),
                projectSlugs: slugs(projects.filter((p) => has(p, 'countrySlugs', country.slug))),
                themeSlugs: referenced(input.themes || [], here, 'themeSlugs'),
            };
        })
        .filter(
            (country) =>
                country.productSlugs.length > 0 ||
                country.projectSlugs.length > 0 ||
                outcomes.some((outcome) => has(outcome, 'countrySlugs', country.slug))
        );

    const data = { themes, projects, products, countries };
    const index = {};
    COLLECTIONS.forEach((name) => {
        index[name] = new Map(data[name].map((item) => [item.slug, item]));
    });

    const record = (collection, slug) => (slug ? index[collection].get(slug) || null : null);

    /**
     * A record plus every relation declared for its collection, looked up in `from`.
     * A slug with no record behind it is dropped rather than rendered as a hole.
     */
    const link = (collection, source, from) => {
        const out = { ...source };
        LINKS[collection].forEach(([field, target, key]) => {
            out[key] = (source[field] || []).map((s) => from[target].get(s)).filter(Boolean);
        });
        return out;
    };

    // Every record with its own neighbours. This is what an index page lists and what a
    // neighbour arrives as, so a tool on an initiative's page already knows its countries.
    const linked = {};
    COLLECTIONS.forEach((name) => {
        linked[name] = new Map(data[name].map((item) => [item.slug, link(name, item, index)]));
    });
    const list = (name) => [...linked[name].values()];

    // An outcome arrives with its countries: the place is the first thing its row prints.
    const placed = outcomes.map((outcome) => ({
        ...outcome,
        countries: (outcome.countrySlugs || []).map((s) => index.countries.get(s)).filter(Boolean),
    }));

    /** The record, its neighbours (each with neighbours of its own), and its outcomes. */
    const resolve = (collection, slug) => {
        const source = record(collection, slug);
        if (!source) return null;
        const out = link(collection, source, linked);
        out.outcomes = placed.filter((o) => has(o, OUTCOME_FIELD[collection], slug));
        return out;
    };

    /**
     * The connected component of the tool↔tool relationship graph containing
     * `productSlug`, as { focus, nodes, edges }; null when the tool has no edges.
     * Lets the UI show the whole local ecosystem (multi-hop), not just direct neighbours.
     */
    const relationshipGraph = (productSlug) => {
        const edges = input.relationships || [];
        const found = component(edges, productSlug);
        if (!found) return null;

        const nodes = [...found].map(graphNode).filter(Boolean);
        const componentEdges = edges.filter((e) => found.has(e.from) && found.has(e.to));
        return { focus: productSlug, nodes, edges: componentEdges };
    };

    /** The node shape the diagram reads, for one tool slug. */
    const graphNode = (slug) => {
        const product = record('products', slug);
        if (!product) return null;
        // The diagram draws one labelled container per initiative; a tool in several is
        // grouped under the first.
        const initiative = record('projects', (product.projectSlugs || [])[0]);
        return {
            slug,
            name: product.name,
            type: product.type || null,
            initiative: initiative ? { slug: initiative.slug, name: initiative.name } : null,
            countrySlugs: product.countrySlugs || [],
        };
    };

    /**
     * The lineage *inside* one initiative: its own tools and the connections between them,
     * as { focus, nodes, edges }; null when fewer than two of them are connected.
     *
     * Deliberately not the connected component used for a tool page. An initiative page
     * answers "how do the pieces this programme built fit together", so an edge reaching
     * out to another initiative's tool would pull in work this initiative did not do. The
     * crossings are the shared layer's job, on the homepage and on each tool's own page.
     */
    const initiativeGraph = (projectSlug) => {
        const mine = new Set(
            (input.products || [])
                .filter((p) => (p.projectSlugs || []).includes(projectSlug))
                .map((p) => p.slug)
        );
        const edges = (input.relationships || []).filter(
            (e) => mine.has(e.from) && mine.has(e.to)
        );
        if (edges.length === 0) return null;

        const connected = new Set(edges.flatMap((e) => [e.from, e.to]));
        const nodes = [...connected].map(graphNode).filter(Boolean);
        // No focus: the subject of this graph is the initiative, not any one of its tools,
        // so nothing is marked "you are here" and nothing is faded out.
        return { focus: null, nodes, edges };
    };

    const getProduct = (slug) => {
        const product = resolve('products', slug);
        if (product) product.graph = relationshipGraph(slug);
        return product;
    };

    const getProject = (slug) => {
        const project = resolve('projects', slug);
        if (project) project.graph = initiativeGraph(slug);
        return project;
    };

    return {
        getProduct,
        getProject,
        getCountry: (slug) => resolve('countries', slug),
        getTheme: (slug) => resolve('themes', slug),
        getProducts: () => list('products'),
        getProjects: () => list('projects'),
        getThemes: () => list('themes'),
        getCountries: () => list('countries'),
        getOutcomes: () => placed,
        getTeam: () => input.team || [],
    };
}
