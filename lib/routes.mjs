/**
 * Site URLs, in one place.
 *
 * Every link to an entity is built here rather than interpolated at the call site, so a
 * route can be renamed in one edit — and, more importantly, so something can *enumerate*
 * the site's routes. `app/sitemap.js` is the second caller that needs that, which is what
 * makes this a seam rather than a convenience.
 *
 * Note the one place where the URL and the domain term disagree: a **work area** is a
 * `theme` entity, but its route is `/our-work`. See CONTEXT.md.
 */

export const PORTFOLIO_PATHS = {
    products: '/products',
    projects: '/projects',
    countries: '/countries',
    themes: '/our-work',
};

export const productHref = (slug) => `${PORTFOLIO_PATHS.products}/${slug}`;
export const projectHref = (slug) => `${PORTFOLIO_PATHS.projects}/${slug}`;
export const countryHref = (slug) => `${PORTFOLIO_PATHS.countries}/${slug}`;
export const themeHref = (slug) => `${PORTFOLIO_PATHS.themes}/${slug}`;
export const postHref = (slug) => `/blog/${slug}`;

/**
 * Every portfolio route: the four index pages, plus one detail page per entity.
 *
 * Takes the collections rather than importing the portfolio itself, so this module stays
 * pure and the caller decides which dataset it is enumerating.
 */
export function portfolioRoutes({ products = [], projects = [], countries = [], themes = [] }) {
    return [
        PORTFOLIO_PATHS.products,
        PORTFOLIO_PATHS.projects,
        PORTFOLIO_PATHS.countries,
        PORTFOLIO_PATHS.themes,
        ...products.map((product) => productHref(product.slug)),
        ...projects.map((project) => projectHref(project.slug)),
        ...countries.map((country) => countryHref(country.slug)),
        ...themes.map((theme) => themeHref(theme.slug)),
    ];
}
