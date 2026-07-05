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

/** Pluralize a label by count: (2, 'tool') -> '2 tools'. */
export function countLabel(n, singular, plural) {
    return `${n} ${n === 1 ? singular : plural || `${singular}s`}`;
}

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
