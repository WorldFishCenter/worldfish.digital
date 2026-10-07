import themesData from '@/content/data/themes.json';
import countriesData from '@/content/data/countries.json';
import teamData from '@/content/data/team.json';
import productsData from '@/content/data/products.json';
import projectsData from '@/content/data/projects.json';
import outcomesData from '@/content/data/outcomes.json';
import relationshipsData from '@/content/data/relationships.json';
import { buildPortfolio } from './portfolio-resolve.mjs';

/**
 * The portfolio — the linked graph of entities the site browses.
 *
 * products, projects, outcomes and relationships are the committed snapshot of the Live
 * records in the Airtable intake base (WFD Tools, Initiatives, Outcomes, Connections),
 * written by scripts/sync-airtable.js. themes, countries and team are hand-maintained
 * reference lists. While nothing is Live the snapshot is empty and so is the site.
 *
 * getProduct / getProject / getCountry / getTheme each return the entity's own record
 * spread, plus its neighbours and outcomes already resolved, so a route page never walks
 * a slug array itself. A missing slug returns null.
 *
 * The resolution logic lives in ./portfolio-resolve.mjs so it can be tested against
 * fixtures; see test/portfolio.test.mjs.
 */
const portfolio = buildPortfolio({
    themes: themesData.themes,
    countries: countriesData.countries,
    team: teamData.team,
    products: productsData.products,
    projects: projectsData.projects,
    outcomes: outcomesData.outcomes,
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
    getOutcomes,
    getTeam,
} = portfolio;
