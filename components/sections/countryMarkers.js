import { getCountryCoordinates } from '@/lib/countryCoordinates';

/**
 * View-model for the countries globe — one marker per country that resolves to a
 * geographic point. Cross-cutting entries like "Global" have no coordinates and are
 * omitted; they appear in the list below the map instead.
 *
 * This lives beside the globe rather than in lib/portfolio because the shape is the
 * widget's, not the portfolio's: lat/lon come from lib/countryCoordinates (see the note
 * there on why the points are an app-layer concern), and `tools`/`projects`/`active` are
 * display counts rather than entity relations.
 */
export function buildCountryMarkers(countries, themes) {
    const themeName = new Map(themes.map((theme) => [theme.slug, theme.name]));

    return countries
        .map((country) => {
            const coords = getCountryCoordinates(country.slug);
            if (!coords) return null;
            const productSlugs = country.productSlugs || [];
            return {
                slug: country.slug,
                name: country.name,
                flagSrc: country.flagSrc || null,
                lat: coords.lat,
                lon: coords.lon,
                active: productSlugs.length > 0,
                themes: (country.themeSlugs || [])
                    .map((slug) => themeName.get(slug))
                    .filter(Boolean),
                tools: productSlugs.length,
                projects: (country.projectSlugs || []).length,
            };
        })
        .filter(Boolean);
}
