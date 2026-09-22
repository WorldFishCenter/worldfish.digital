import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    PORTFOLIO_PATHS,
    productHref,
    projectHref,
    countryHref,
    themeHref,
    postHref,
    portfolioRoutes,
} from '../lib/routes.mjs';

const DATA = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'content', 'data');
const read = (file) => JSON.parse(fs.readFileSync(path.join(DATA, file), 'utf8'));

test('entity hrefs match the App Router directory names', () => {
    assert.equal(productHref('peskas'), '/products/peskas');
    assert.equal(projectHref('fssp2'), '/projects/fssp2');
    assert.equal(countryHref('kenya'), '/countries/kenya');
    assert.equal(postHref('nutrients'), '/blog/nutrients');
});

test('a work area lives at /our-work, not /themes', () => {
    // The URL and the domain term disagree here; that is the point of centralising it.
    assert.equal(themeHref('climate-adaptation'), '/our-work/climate-adaptation');
    assert.equal(PORTFOLIO_PATHS.themes, '/our-work');
});

test('portfolioRoutes enumerates every index page and every entity', () => {
    const routes = portfolioRoutes({
        products: [{ slug: 'a' }, { slug: 'b' }],
        projects: [{ slug: 'c' }],
        countries: [{ slug: 'd' }],
        themes: [{ slug: 'e' }],
    });
    assert.deepEqual(routes, [
        '/products',
        '/projects',
        '/countries',
        '/our-work',
        '/products/a',
        '/products/b',
        '/projects/c',
        '/countries/d',
        '/our-work/e',
    ]);
});

test('portfolioRoutes tolerates missing collections', () => {
    assert.deepEqual(portfolioRoutes({}), ['/products', '/projects', '/countries', '/our-work']);
});

test('portfolioRoutes over the real content yields no duplicates', () => {
    // The sitemap previously hardcoded /products/peskas alongside its generated URLs; a
    // duplicate <loc> would be a regression, so pin the invariant.
    const routes = portfolioRoutes({
        products: read('products.json').products,
        projects: read('projects.json').projects,
        countries: read('countries.json').countries,
        themes: read('themes.json').themes,
    });
    assert.equal(new Set(routes).size, routes.length, 'duplicate route in portfolioRoutes');
});

test('every portfolio route resolves to a real App Router page directory', () => {
    // Guards the rename risk: if a route directory moves, PORTFOLIO_PATHS must move with it.
    const app = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'app');
    for (const [kind, route] of Object.entries(PORTFOLIO_PATHS)) {
        const dir = path.join(app, route.replace(/^\//, ''));
        assert.ok(fs.existsSync(dir), `${kind} → ${route} has no directory at app${route}`);
        const dynamic = fs
            .readdirSync(dir, { withFileTypes: true })
            .some((e) => e.isDirectory() && /^\[.+\]$/.test(e.name));
        assert.ok(dynamic, `${route} has no dynamic segment for detail pages`);
    }
});
