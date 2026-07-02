import themesData from '@/content/data/themes.json';
import projectsData from '@/content/data/projects.json';
import productsData from '@/content/data/products.json';
import countriesData from '@/content/data/countries.json';
import donorsData from '@/content/data/donors.json';
import personasData from '@/content/data/personas.json';
import teamData from '@/content/data/team.json';

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
