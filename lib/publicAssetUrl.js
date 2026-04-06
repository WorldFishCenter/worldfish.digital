/**
 * Root-absolute URL for files under /public.
 * Relative paths (e.g. "assets/...") break on nested routes (e.g. /products/peskas → /products/assets/...).
 * @param {string | undefined | null} path
 * @returns {string}
 */
export function publicAssetUrl(path) {
    if (path == null || typeof path !== 'string') return '';
    const t = path.trim();
    if (!t) return '';
    if (/^(https?:|data:|blob:)/i.test(t)) return t;
    return t.startsWith('/') ? t : `/${t}`;
}
