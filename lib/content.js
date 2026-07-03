import themesData from '@/content/data/themes.json';
import projectsData from '@/content/data/projects.json';
import productsData from '@/content/data/products.json';
import countriesData from '@/content/data/countries.json';
import donorsData from '@/content/data/donors.json';
import personasData from '@/content/data/personas.json';
import teamData from '@/content/data/team.json';
import taxonomyData from '@/content/data/taxonomy.json';
import relationshipsData from '@/content/data/relationships.json';

const bySlug = (list, slug) => list.find((item) => item.slug === slug) || null;

export function getThemes() {
    return themesData.themes;
}

export function getTheme(slug) {
    return bySlug(themesData.themes, slug);
}

export function getProjects() {
    return projectsData.projects;
}

export function getProject(slug) {
    return bySlug(projectsData.projects, slug);
}

export function getProjectsByTheme(themeSlug) {
    return projectsData.projects.filter((project) => project.themeSlugs.includes(themeSlug));
}

/** Products belonging to a project: union of the project's leadProductSlugs and any product
 * that back-references the project via projectSlugs. Robust to either side being incomplete. */
export function getProductsForProject(projectSlug) {
    const project = getProject(projectSlug);
    const slugs = new Set(project ? project.leadProductSlugs || [] : []);
    productsData.products.forEach((product) => {
        if ((product.projectSlugs || []).includes(projectSlug)) slugs.add(product.slug);
    });
    return [...slugs].map((slug) => getProduct(slug)).filter(Boolean);
}

/** Donors funding a project (resolved from the project's donorSlugs). */
export function getDonorsForProject(projectSlug) {
    const project = getProject(projectSlug);
    if (!project) return [];
    return (project.donorSlugs || []).map((slug) => getDonor(slug)).filter(Boolean);
}

export function getProducts() {
    return productsData.products;
}

export function getProduct(slug) {
    return bySlug(productsData.products, slug);
}

export function getProductsByTheme(themeSlug) {
    return productsData.products.filter((product) => product.themeSlugs.includes(themeSlug));
}

export function getProductsByCountry(countrySlug) {
    return productsData.products.filter((product) => product.countrySlugs.includes(countrySlug));
}

/** Human-readable labels for a product↔product edge, per direction. */
const RELATIONSHIP_LABELS = {
    outgoing: {
        'depends on': 'Depends on',
        'feeds into': 'Feeds into',
        enables: 'Enables',
        'pilot of': 'Pilot of',
    },
    incoming: {
        'depends on': 'Used by',
        'feeds into': 'Fed by',
        enables: 'Enabled by',
        'pilot of': 'Piloted by',
    },
};

/** Resolved product relationships for a product, as a flat list of { label, type, direction, product }.
 * Outgoing = edges where this product is `from`; incoming = edges where it is `to` (inverse label). */
export function getRelatedProducts(productSlug) {
    const edges = relationshipsData.relationships || [];
    const related = [];
    edges.forEach((edge) => {
        if (edge.from === productSlug) {
            const product = getProduct(edge.to);
            if (product)
                related.push({
                    label: RELATIONSHIP_LABELS.outgoing[edge.type] || edge.type,
                    type: edge.type,
                    direction: 'outgoing',
                    product,
                });
        } else if (edge.to === productSlug) {
            const product = getProduct(edge.from);
            if (product)
                related.push({
                    label: RELATIONSHIP_LABELS.incoming[edge.type] || edge.type,
                    type: edge.type,
                    direction: 'incoming',
                    product,
                });
        }
    });
    return related;
}

export function getCountries() {
    return countriesData.countries;
}

export function getCountry(slug) {
    return bySlug(countriesData.countries, slug);
}

export function getCountriesByTheme(themeSlug) {
    return countriesData.countries.filter((country) => country.themeSlugs.includes(themeSlug));
}

export function getDonors() {
    return donorsData.donors;
}

export function getDonor(slug) {
    return bySlug(donorsData.donors, slug);
}

export function getDonorsByTheme(themeSlug) {
    const theme = getTheme(themeSlug);
    if (!theme) return [];
    return donorsData.donors.filter((donor) => theme.donorSlugs.includes(donor.slug));
}

export function getPersonas() {
    return personasData.personas;
}

export function getPersona(slug) {
    return bySlug(personasData.personas, slug);
}

export function getPersonasByTheme(themeSlug) {
    return personasData.personas.filter((persona) => persona.themeSlugs.includes(themeSlug));
}

export function getTeam() {
    return teamData.team;
}

/** Controlled vocabularies (canonical Airtable option sets). */
export function getTaxonomy() {
    return taxonomyData;
}
