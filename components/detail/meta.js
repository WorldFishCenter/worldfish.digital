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

/** Group products by component type, ordered by COMPONENT_TYPE_ORDER.
 *  Returns [{ title, items }] with empty groups omitted. */
export function groupProductsByType(products) {
    const byType = new Map();
    products.forEach((product) => {
        const type = product.type || 'Other';
        if (!byType.has(type)) byType.set(type, []);
        byType.get(type).push(product);
    });

    const rank = (type) => {
        const i = COMPONENT_TYPE_ORDER.indexOf(type);
        return i === -1 ? COMPONENT_TYPE_ORDER.length : i;
    };

    return [...byType.entries()]
        .sort((a, b) => rank(a[0]) - rank(b[0]))
        .map(([title, items]) => ({ title, items }));
}

/** Display order for project statuses (active work first, closed last). */
export const PROJECT_STATUS_ORDER = ['Active', 'Pipeline', 'Planned', 'Completed', 'Cancelled'];

/** Group projects by status, ordered by PROJECT_STATUS_ORDER. Returns [{ title, items }]. */
export function groupProjectsByStatus(projects) {
    const byStatus = new Map();
    projects.forEach((project) => {
        const status = project.status || 'Other';
        if (!byStatus.has(status)) byStatus.set(status, []);
        byStatus.get(status).push(project);
    });

    const rank = (status) => {
        const i = PROJECT_STATUS_ORDER.indexOf(status);
        return i === -1 ? PROJECT_STATUS_ORDER.length : i;
    };

    return [...byStatus.entries()]
        .sort((a, b) => rank(a[0]) - rank(b[0]))
        .map(([title, items]) => ({ title, items }));
}

/** Pluralize a label by count: (2, 'tool') -> '2 tools'. */
export function countLabel(n, singular, plural) {
    return `${n} ${n === 1 ? singular : plural || `${singular}s`}`;
}
