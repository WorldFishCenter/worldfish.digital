/**
 * Presentational helpers for entity detail pages.
 * Pure functions over the content data model — no side effects.
 */

/** Display order for product component types (mirrors taxonomy.componentTypes,
 *  surfaced most-tangible-first). Unknown types fall to the end. */
export const COMPONENT_TYPE_ORDER = [
    'Platform',
    'Application',
    'Dashboard',
    'API',
    'Data Pipeline',
    'Model',
    'Algorithm',
    'Module',
    'Data Product',
    'Other',
];

/** Collapse the many project/product statuses into three visual buckets. */
export function statusVariant(status) {
    const s = (status || '').toLowerCase();
    if (s === 'active' || s === 'published') return 'live';
    if (s === 'pipeline' || s === 'planned' || s === 'ideation' || s === 'draft') return 'progress';
    return 'muted';
}

/** Display order for project statuses (active work first, closed last). */
export const PROJECT_STATUS_ORDER = ['Active', 'Pipeline', 'Planned', 'Completed', 'Cancelled'];

/** Bucket `items` by a key, ordered by `order` (unknown keys fall to the end);
 *  a missing key collapses to `fallback`. Returns [{ title, items }]. */
function groupOrdered(items, keyOf, order, fallback = 'Other') {
    const byKey = new Map();
    items.forEach((item) => {
        const key = keyOf(item) || fallback;
        if (!byKey.has(key)) byKey.set(key, []);
        byKey.get(key).push(item);
    });
    const rank = (key) => {
        const i = order.indexOf(key);
        return i === -1 ? order.length : i;
    };
    return [...byKey.entries()]
        .sort((a, b) => rank(a[0]) - rank(b[0]))
        .map(([title, groupItems]) => ({ title, items: groupItems }));
}

/** Group products by component type, ordered by COMPONENT_TYPE_ORDER. */
export const groupProductsByType = (products) =>
    groupOrdered(products, (p) => p.type, COMPONENT_TYPE_ORDER);

/** Group projects by status, ordered by PROJECT_STATUS_ORDER. */
export const groupProjectsByStatus = (projects) =>
    groupOrdered(projects, (p) => p.status, PROJECT_STATUS_ORDER);

/**
 * Separators in a row's meta line, used the same way on every index and list:
 *   ' · '  between items of the same kind   — "Kenya · Zanzibar", "1 initiative · 7 tools"
 *   ' — '  between kinds                    — "Peskas — Kenya · Zanzibar"
 * Every index row states three things: what it is called, what it is, and how much of it
 * there is. Without the third a row is a name.
 */
export const SAME_KIND = ' · ';
export const BETWEEN_KINDS = ' — ';

/** Pluralize a label by count: (2, 'tool') -> '2 tools'. */
export function countLabel(n, singular, plural) {
    return `${n} ${n === 1 ? singular : plural || `${singular}s`}`;
}

/**
 * Categorical colours for the impact areas, keyed by theme slug.
 *
 * The colour is a recognition aid, never the message: an area tag always prints its name
 * beside the dot, so the tags work in greyscale, in print and for a colourblind reader. Hues
 * are muted and mid-value so seven of them still read as one family rather than a rainbow
 * against the site's deep navy and paper.
 *
 * Keyed by slug and falling back to neutral, so an impact area added in Airtable renders
 * correctly — in grey — the moment it goes Live, without anyone touching this file.
 */
export const AREA_COLOR = {
    'sustainable-fisheries': '#3e96b0', // water — the house accent
    'productive-aquaculture': '#4f9e6e', // farming
    'nutrition-security': '#c4603a', // food
    'climate-adaptation': '#c9a52b', // heat
    'resilient-livelihoods': '#9079b5', // people
    'better-governance': '#5580c0', // institutions
    'shared-infrastructure': '#8fa0b0', // cross-cutting: deliberately neutral
};

export const areaColor = (slug) => AREA_COLOR[slug] || '#8fa0b0';

/** Categorical colours for the relationship diagram, keyed by product component type.
 *  Distinct hues chosen to read on the dark surface; swap freely. */
export const TYPE_COLOR = {
    Platform: '#57b3d1',
    Application: '#a78bfa',
    Dashboard: '#60a5fa',
    API: '#4ade80',
    'Data Pipeline': '#fbbf24',
    'Data Product': '#f472b6',
    Model: '#fb923c',
    Algorithm: '#22d3ee',
    Module: '#e2e8f0',
    Other: '#94a3b8',
};

export const typeColor = (type) => TYPE_COLOR[type] || TYPE_COLOR.Other;
