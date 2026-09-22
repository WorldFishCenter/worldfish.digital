import themesData from '@/content/data/themes.json';
import projectsData from '@/content/data/projects.json';
import productsData from '@/content/data/products.json';
import countriesData from '@/content/data/countries.json';
import donorsData from '@/content/data/donors.json';
import personasData from '@/content/data/personas.json';
import teamData from '@/content/data/team.json';
import initiativesData from '@/content/data/initiatives.json';
import relationshipsData from '@/content/data/relationships.json';
import { buildPortfolio } from './portfolio-resolve.mjs';

/**
 * The portfolio — the linked graph of entities the site browses, bound to the committed
 * JSON snapshot in content/data (generated from Airtable by scripts/sync-airtable.js).
 *
 * getProduct / getProject / getCountry / getTheme each return the entity's own record
 * spread, plus its neighbours already resolved, so a route page never walks a slug array
 * itself. A missing slug returns null.
 *
 * The resolution logic lives in ./portfolio-resolve.mjs so it can be tested against
 * fixtures; see test/portfolio.test.mjs.
 */
const portfolio = buildPortfolio({
    themes: themesData.themes,
    projects: projectsData.projects,
    products: productsData.products,
    countries: countriesData.countries,
    donors: donorsData.donors,
    personas: personasData.personas,
    initiatives: initiativesData.initiatives,
    team: teamData.team,
    relationships: relationshipsData.relationships,
});

export const {
    getProduct,
    getProject,
    getCountry,
    getTheme,
    getProducts,
    getProjects,
    getThemes,
    getCountries,
    getDonors,
    getPersonas,
    getTeam,
} = portfolio;
