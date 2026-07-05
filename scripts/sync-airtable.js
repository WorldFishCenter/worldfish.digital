#!/usr/bin/env node
/**
 * Sync the Airtable "Products" base -> content/data/*.json (the site's data layer).
 *
 * Airtable is the source of truth; this script regenerates the committed JSON
 * snapshot the site builds from. Run it after editing Airtable, review the diff,
 * and commit the result.
 *
 *   AIRTABLE_TOKEN=pat_xxx node scripts/sync-airtable.js
 *
 * Env:
 *   AIRTABLE_TOKEN    Personal Access Token with data.records:read + schema.bases:read
 *                     on the Products base. REQUIRED to run; if absent the script
 *                     no-ops (exit 0) so local/offline builds use the committed JSON.
 *   AIRTABLE_BASE_ID  Optional; defaults to the WorldFish "Products" base.
 *
 * Content that is NOT in Airtable is preserved by slug from the existing JSON:
 *   - products[].rich              (the Peskas microsite block)
 *   - themes[].featuredProductSlugs
 *   - team[].bio, team[].initials
 *
 * The script builds everything in memory and only writes files if the whole run
 * succeeds, so a transient Airtable/network error never leaves partial data.
 */
const fs = require('fs');
const path = require('path');

// Load a local, untracked .env if present, so `npm run sync` picks up the token
// without passing it inline. Real environment variables always take precedence.
(function loadDotEnv() {
    const envPath = path.join(__dirname, '..', '.env');
    if (!fs.existsSync(envPath)) return;
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
        const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
        if (!m) continue;
        const [, key, rawVal] = m;
        const val = rawVal.replace(/^["']|["']$/g, '');
        if (!(key in process.env)) process.env[key] = val;
    }
})();

const BASE_ID = process.env.AIRTABLE_BASE_ID || 'appwOB0tczOVKXuQL';
const TOKEN = process.env.AIRTABLE_TOKEN;
const DIR = path.join(__dirname, '..', 'content', 'data');

if (!TOKEN) {
    console.log('[sync-airtable] AIRTABLE_TOKEN not set — skipping sync; using committed JSON.');
    process.exit(0);
}

// Logical name -> Airtable table name.
const TABLES = {
    themes: 'Themes',
    products: 'PRODUCTS',
    projects: 'Projects',
    countries: 'Countries',
    donors: 'Donors',
    personas: 'Personas',
    team: 'Team',
    partners: 'Partners',
    initiatives: 'Initiatives',
    relationships: 'Relationships',
};

async function fetchTable(name) {
    const records = [];
    let offset;
    do {
        const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(name)}`);
        url.searchParams.set('pageSize', '100');
        if (offset) url.searchParams.set('offset', offset);
        const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
        if (!res.ok) throw new Error(`Airtable ${name} → ${res.status}: ${await res.text()}`);
        const data = await res.json();
        records.push(...data.records);
        offset = data.offset;
    } while (offset);
    return records;
}

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8'));
const writeJson = (file, obj) =>
    fs.writeFileSync(path.join(DIR, file), JSON.stringify(obj, null, 2) + '\n');

const uniq = (arr) => [...new Set(arr)];
const lines = (text) =>
    (text || '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

async function main() {
    // 1. Fetch every table.
    const raw = {};
    for (const [key, table] of Object.entries(TABLES)) raw[key] = await fetchTable(table);

    // 2. Build record-id → slug maps for link resolution.
    const slugOf = {};
    for (const key of ['themes', 'products', 'projects', 'countries', 'donors', 'personas', 'team', 'partners', 'initiatives']) {
        slugOf[key] = new Map(raw[key].map((r) => [r.id, r.fields.Slug]).filter(([, s]) => s));
    }
    const link = (kind, ids) => (ids || []).map((id) => slugOf[kind].get(id)).filter(Boolean);

    // Guard: every record must carry a Slug (the site's URL key).
    for (const key of Object.keys(slugOf)) {
        const missing = raw[key].filter((r) => !r.fields.Slug);
        if (missing.length) {
            throw new Error(
                `${missing.length} ${key} record(s) missing Slug — add one in Airtable before syncing.`
            );
        }
    }

    // Repo overlays (content not modelled in Airtable).
    const prevProducts = new Map(readJson('products.json').products.map((p) => [p.slug, p]));
    const prevThemes = new Map(readJson('themes.json').themes.map((t) => [t.slug, t]));
    const prevTeam = new Map(readJson('team.json').team.map((m) => [m.slug, m]));

    // 3. Base entities.
    const products = raw.products.map((r) => {
        const f = r.fields;
        const out = {
            slug: f.Slug,
            name: f.Name,
            type: f.Type || null,
            status: f.Status || null,
            leadDev: f['Lead Dev'] || null,
            url: f.URL || null,
            countrySlugs: link('countries', f.Countries),
            projectSlugs: link('projects', f.Project),
            themeSlugs: link('themes', f.Themes),
            description: f.Description || null,
            thematicAreas: f['Thematic areas'] || [],
            impactAreas: f['Impact areas'] || [],
            initiative: link('initiatives', f.Initiative)[0] || null,
        };
        if (f.Flagship) out.flagship = true;
        const prev = prevProducts.get(f.Slug);
        if (prev && prev.rich) out.rich = prev.rich; // preserve the Peskas microsite
        return out;
    });

    const projects = raw.projects.map((r) => {
        const f = r.fields;
        const out = {
            slug: f.Slug,
            name: f.Name,
            status: f.STATUS || null,
            lead: f['Project Lead - Owner'] || null,
            countrySlugs: link('countries', f.Countries),
            leadProductSlugs: link('products', f['Lead product']),
            themeSlugs: link('themes', f.Themes),
            donorSlugs: link('donors', f.Donors),
            partnerSlugs: link('partners', f.Partners),
            archived: !!f.Archived,
            fullName: f['Full name'] || null,
            programme: f.Programme || null,
            thematicAreas: f['Thematic areas'] || [],
            impactAreas: f['Impact areas'] || [],
            initiative: link('initiatives', f.Initiative)[0] || null,
        };
        if (f['Background note']) out.whatItWas = f['Background note'];
        if (f['Products created']) out.productsCreated = lines(f['Products created']);
        return out;
    });

    const donors = raw.donors.map((r) => {
        const f = r.fields;
        const out = {
            slug: f.Slug,
            name: f.Name,
            projectSlugs: projects.filter((p) => p.donorSlugs.includes(f.Slug)).map((p) => p.slug),
        };
        if (f.Pipeline) out.pipeline = true;
        return out;
    });

    const partners = raw.partners.map((r) => {
        const f = r.fields;
        return {
            slug: f.Slug,
            name: f.Name,
            type: f.Type || null,
            projectSlugs: projects.filter((p) => p.partnerSlugs.includes(f.Slug)).map((p) => p.slug),
        };
    });

    const personas = raw.personas.map((r) => {
        const f = r.fields;
        return {
            slug: f.Slug,
            name: f.Name,
            tagline: f.Tagline || null,
            themeSlugs: link('themes', f.Themes),
            keyProductSlugs: link('products', f['Key products']),
            needs: lines(f.Needs),
        };
    });

    const team = raw.team.map((r) => {
        const f = r.fields;
        const prev = prevTeam.get(f.Slug) || {};
        return {
            slug: f.Slug,
            name: f.Name,
            role: f.Role || null,
            email: f.Email || null,
            bio: prev.bio || null,
            initials: prev.initials || null,
        };
    });

    const countries = raw.countries.map((r) => {
        const f = r.fields;
        const slug = f.Slug;
        const inCountry = (x) => x.countrySlugs.includes(slug);
        const productSlugs = products.filter(inCountry).map((p) => p.slug);
        const projectSlugs = projects.filter(inCountry).map((p) => p.slug);
        const themeSlugs = uniq([
            ...products.filter(inCountry).flatMap((p) => p.themeSlugs),
            ...projects.filter(inCountry).flatMap((p) => p.themeSlugs),
        ]);
        const out = {
            slug,
            name: f.Name,
            flagSrc: f['Flag URL'] || null,
            image: f['Image path'] || null,
            description: f.Description || null,
            ctaLabel: f['CTA label'] || '',
            ctaHref: f['CTA href'] || '',
            themeSlugs,
            productSlugs,
            projectSlugs,
            airtableCountry: f['Airtable country'] || null,
        };
        if (f.Pipeline) out.pipeline = true;
        return out;
    });

    const themes = raw.themes.map((r) => {
        const f = r.fields;
        const slug = f.Slug;
        const inTheme = (x) => x.themeSlugs.includes(slug);
        const themeProjects = projects.filter(inTheme);
        const themeProducts = products.filter(inTheme);
        const out = {
            slug,
            name: f.Name,
            tagline: f.Tagline || '',
            description: f.Description || '',
            projectSlugs: themeProjects.map((p) => p.slug),
            productSlugs: themeProducts.map((p) => p.slug),
            countrySlugs: uniq([
                ...themeProjects.flatMap((p) => p.countrySlugs),
                ...themeProducts.flatMap((p) => p.countrySlugs),
            ]),
            donorSlugs: uniq(themeProjects.flatMap((p) => p.donorSlugs)),
            personaSlugs: personas.filter((p) => p.themeSlugs.includes(slug)).map((p) => p.slug),
            thematicAreas: f['Thematic areas'] || [],
            impactAreas: f['Impact areas'] || [],
        };
        const prev = prevThemes.get(slug);
        if (prev && prev.featuredProductSlugs) out.featuredProductSlugs = prev.featuredProductSlugs;
        return out;
    });

    const seenEdge = new Set();
    const relationships = raw.relationships
        .map((r) => ({
            from: slugOf.products.get((r.fields.From || [])[0]),
            type: r.fields['Relationship type'] || null,
            to: slugOf.products.get((r.fields.To || [])[0]),
        }))
        .filter((e) => e.from && e.to && e.type)
        .filter((e) => {
            // Drop duplicate rows (same from→type→to) so a stray edit can't double-render.
            const k = `${e.from}|${e.type}|${e.to}`;
            if (seenEdge.has(k)) return false;
            seenEdge.add(k);
            return true;
        });

    const initiatives = raw.initiatives.map((r) => {
        const f = r.fields;
        return {
            slug: f.Slug,
            name: f.Name,
            description: f.Description || null,
            productSlugs: products.filter((p) => p.initiative === f.Slug).map((p) => p.slug),
            projectSlugs: projects.filter((p) => p.initiative === f.Slug).map((p) => p.slug),
        };
    });

    // 4. Write everything (only reached if no error above).
    writeJson('themes.json', { themes });
    writeJson('products.json', { products });
    writeJson('projects.json', { projects });
    writeJson('countries.json', { countries });
    writeJson('donors.json', { donors });
    writeJson('personas.json', { personas });
    writeJson('team.json', { team });
    writeJson('partners.json', { partners });
    writeJson('initiatives.json', { initiatives });
    writeJson('relationships.json', {
        _comment:
            'Generated from the Airtable Relationships table by scripts/sync-airtable.js. Edit in Airtable, not here.',
        relationships,
    });

    console.log(
        `[sync-airtable] wrote ${themes.length} themes, ${products.length} products, ${projects.length} projects, ` +
            `${countries.length} countries, ${donors.length} donors, ${partners.length} partners, ` +
            `${personas.length} personas, ${team.length} team, ${relationships.length} relationships.`
    );
}

main().catch((err) => {
    console.error('[sync-airtable] FAILED — no files written.');
    console.error(err.message);
    process.exit(1);
});
