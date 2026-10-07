import ProductsCatalogClient from '@/components/sections/ProductsCatalogClient';
import { getProducts, getThemes, getProjects } from '@/lib/portfolio';
import { reuseEvidence } from '@/lib/portfolio-stats.mjs';
import { DEFAULT_METADATA } from '@/lib/constants';
import relationshipsData from '@/content/data/relationships.json';

export const metadata = {
    ...DEFAULT_METADATA,
    title: 'Tools - WorldFish Digital',
};

export default function ProductsPage() {
    // The catalogue filters in the browser, so it is sent only what a row shows and what
    // the two filters read, with impact areas already as names.
    const products = getProducts().map((product) => ({
        slug: product.slug,
        name: product.name,
        summary: product.summary,
        status: product.status,
        type: product.type,
        themes: product.themes.map((theme) => theme.name),
        // The filter reads names; the tags need slugs for their links and colours.
        areas: product.themes.map((theme) => ({ slug: theme.slug, name: theme.name })),
        initiatives: product.projects.map((project) => project.name),
        countries: product.countries.map((country) => country.name),
    }));
    const themes = getThemes().map((theme) => theme.name);
    // One row per initiative, so the catalogue can be narrowed the way the portfolio is
    // actually organised, not only by component type.
    const initiatives = getProjects().map((project) => project.name);

    // Counted off the same records the list below shows; each links to what it counted.
    // Here rather than on the homepage because this is the page they describe.
    const evidence = reuseEvidence({
        products: getProducts(),
        relationships: relationshipsData.relationships,
        themes: getThemes(),
    });

    return (
        <ProductsCatalogClient
            products={products}
            themes={themes}
            initiatives={initiatives}
            facts={[evidence.openCode, evidence.openData].filter(Boolean)}
        />
    );
}
