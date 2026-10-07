#!/usr/bin/env node
/**
 * Sync the Airtable intake base -> content/data/*.json + public/assets/portfolio/.
 *
 * Airtable is the source of truth; this regenerates the committed snapshot the site builds
 * from. Run it after records change, review the diff, and commit the result.
 *
 *   npm run sync
 *
 * ONLY records with `Publication state = Live` are pulled, from all four tables. Anything
 * else — Under review, Needs more info, Archived — never reaches the site, so an intake
 * base with nothing Live yet produces an empty site. That is the intended behaviour.
 *
 * Writes (and owns — do not hand-edit):
 *   content/data/products.json       <- WFD Tools
 *   content/data/projects.json       <- WFD Initiatives
 *   content/data/outcomes.json       <- WFD Outcomes
 *   content/data/relationships.json  <- WFD Connections
 *   public/assets/portfolio/         <- every attachment, downloaded and downscaled
 *
 * Reads (hand-maintained): content/data/themes.json and countries.json, to turn the
 * `Impact area(s)` and `Country / region` select values into the site's slugs, and
 * taxonomy.json, to check every other select value before anything is written.
 *
 * Env:
 *   AIRTABLE_TOKEN    Personal Access Token with data.records:read + schema.bases:read on
 *                     the intake base. If absent the script no-ops (exit 0).
 *   AIRTABLE_BASE_ID  Optional; defaults to the intake base.
 *
 * Everything is built in memory and attachments land in a temp folder; files are only
 * swapped in if the whole run succeeds, so a failed sync never leaves partial data.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'content', 'data');
const ASSETS = path.join(ROOT, 'public', 'assets', 'portfolio');
const ASSET_URL = '/assets/portfolio';

const DEFAULT_BASE = 'appjLGt1IWscYAV3i';
// Addressed by id, so renaming a table in Airtable cannot break the sync.
const TABLES = {
    tools: 'tblp4Ai8oed5yd2Rb',
    initiatives: 'tblABqxahuxiiwOfg',
    outcomes: 'tbl33v5VpiYUBKbIj',
    connections: 'tblEABewdz966tkbr',
};

/**
 * JSON key -> Airtable field name, per table. The ONLY place a column name appears.
 *
 * Every name here is checked against the base's schema before any record is read, so a
 * renamed or mistyped column fails the sync by name. That check matters most when nothing
 * is Live: with zero records a wrong name would otherwise go unnoticed until launch.
 */
const FIELDS = {
    tools: {
        state: 'Publication state',
        slug: 'Slug',
        name: 'Name',
        summary: 'What it is',
        description: 'Full description',
        type: 'Type',
        status: 'Status',
        impactAreas: 'Impact area(s)',
        thematicAreas: 'Thematic area(s)',
        countries: 'Country / region',
        audiences: 'Who uses it',
        readiness: 'Innovation readiness level',
        sdgs: 'SDG alignment',
        leadDev: 'Lead developer',
        contactEmail: 'Contact email',
        url: 'Live URL',
        repoUrl: 'Code repository',
        docsUrl: 'Documentation URL',
        openSource: 'Open source?',
        licence: 'Code licence',
        dataAvailability: 'Data availability',
        reuse: 'How it can be reused',
        limitations: 'Known limitations',
        hero: 'Hero image',
        screenshots: 'Screenshots / media',
        logo: 'Logo',
        video: 'Demo video / screen recording',
        mediaCredit: 'Media credit',
        publications: 'Publications & reports',
        datasetUrl: 'Dataset / DOI',
        initiatives: 'Part of initiative',
    },
    initiatives: {
        state: 'Publication state',
        slug: 'Slug',
        name: 'Name',
        fullName: 'Full title',
        summary: 'What it is',
        description: 'Description',
        status: 'Status',
        impactAreas: 'Impact area(s)',
        thematicAreas: 'Thematic area(s)',
        countries: 'Country / region',
        startDate: 'Start date',
        endDate: 'End date',
        lead: 'Lead — name',
        leadEmail: 'Lead — email',
        funders: 'Funder(s)',
        partners: 'Partner organizations',
        readiness: 'Innovation readiness level',
        sdgs: 'SDG alignment',
        url: 'Project page / website',
        hero: 'Hero image',
        screenshots: 'Screenshots / media',
        logo: 'Logo',
        mediaCredit: 'Media credit',
        publications: 'Publications & reports',
    },
    outcomes: {
        state: 'Publication state',
        claim: 'Claim',
        detail: 'Detail',
        countries: 'Country / region',
        impactAreas: 'Impact area',
        partner: 'Counterpart institution',
        since: 'Since',
        evidenceStatus: 'Evidence status',
        evidenceLabel: 'Evidence label',
        evidenceUrl: 'Evidence URL',
        document: 'Supporting document',
        tools: 'Tool',
        initiatives: 'Initiative',
    },
    connections: {
        state: 'Publication state',
        label: 'Label',
        type: 'Relationship',
        note: 'Note',
        from: 'From tool',
        to: 'To tool',
    },
};

/** Attachment fields: table -> JSON key -> how the file is stored. */
const MEDIA = {
    tools: { hero: 'image', screenshots: 'images', logo: 'logo', video: 'video' },
    initiatives: { hero: 'image', screenshots: 'images', logo: 'logo' },
    outcomes: { document: 'document' },
};
const IMAGE_MAX_WIDTH = 2400;
const LOGO_MAX_WIDTH = 800;
const DOCUMENT_TYPES = ['.pdf', '.docx', '.xlsx', '.csv'];

const lines = (text) =>
    (text || '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

/** "Title https://…" or a bare URL, one per line -> [{ label, href }]. */
const references = (text) =>
    lines(text).map((line) => {
        const href = (line.match(/https?:\/\/\S+/) || [])[0] || null;
        const label = line.replace(href || '', '').replace(/[\s\-–—:|]+$/, '').trim();
        return { label: label || href, href };
    });

/**
 * Airtable records -> the site's JSON. Pure: no network, no disk.
 *
 * @param raw  { tools, initiatives, outcomes, connections } — arrays of Airtable records.
 *             Attachment fields must already hold local files ({ src, width, height }).
 * @param ref  { themes, countries } — the hand-maintained reference lists.
 * @returns    { products, projects, outcomes, relationships, warnings }
 */
function transform(raw, ref) {
    const warnings = [];
    // The gate. main() also filters server-side, but this is the rule the site rests on,
    // so it is enforced here too rather than trusted to a query string.
    const live = (table) =>
        (raw[table] || []).filter((r) => r.fields[FIELDS[table].state] === 'Live');

    const areaSlug = new Map(ref.themes.map((t) => [t.name, t.slug]));
    const crossCutting = ref.themes.filter((t) => t.crossCutting).map((t) => t.slug);
    const countrySlug = new Map(ref.countries.map((c) => [c.name, c.slug]));

    const areas = (names, where, blankIsCrossCutting) => {
        if (!names || names.length === 0) return blankIsCrossCutting ? crossCutting : [];
        return names.map((name) => {
            if (!areaSlug.has(name))
                throw new Error(`${where}: impact area "${name}" is not in content/data/themes.json.`);
            return areaSlug.get(name);
        });
    };
    const countries = (names, where) =>
        (names || [])
            .filter((name) => name !== 'Other') // a real option in Airtable, but not a place
            .map((name) => {
                if (!countrySlug.has(name))
                    throw new Error(
                        `${where}: country "${name}" is not in content/data/countries.json — add it there (slug, name, flag) and re-run.`
                    );
                return countrySlug.get(name);
            });

    const slugged = (table) => {
        const records = live(table);
        const seen = new Set();
        records.forEach((r) => {
            const slug = r.fields[FIELDS[table].slug];
            const label = r.fields[FIELDS[table].name] || r.id;
            if (!slug) throw new Error(`${table}: Live record "${label}" has no Slug — set one in Airtable.`);
            if (seen.has(slug)) throw new Error(`${table}: two Live records share the Slug "${slug}".`);
            seen.add(slug);
        });
        return records;
    };
    const tools = slugged('tools');
    const initiatives = slugged('initiatives');

    // Links resolve only to Live records: a link to anything still under review drops out.
    const slugOf = {
        tools: new Map(tools.map((r) => [r.id, r.fields[FIELDS.tools.slug]])),
        initiatives: new Map(initiatives.map((r) => [r.id, r.fields[FIELDS.initiatives.slug]])),
    };
    const link = (table, ids) => (ids || []).map((id) => slugOf[table].get(id)).filter(Boolean);

    const credited = (file, credit) => (file ? { ...file, credit: credit || null } : null);
    const media = (f, F, where) => {
        const credit = f[F.mediaCredit] || null;
        const hero = credited((f[F.hero] || [])[0], credit);
        const screenshots = (f[F.screenshots] || []).map((file) => credited(file, credit));
        if (!credit && (hero || screenshots.length))
            warnings.push(`${where}: has images but no Media credit — they will publish uncredited.`);
        return { hero, screenshots, logo: (f[F.logo] || [])[0] || null };
    };

    const products = tools.map((r) => {
        const f = r.fields;
        const F = FIELDS.tools;
        const where = `tool "${f[F.slug]}"`;
        return {
            slug: f[F.slug],
            name: f[F.name],
            summary: f[F.summary] || null,
            description: f[F.description] || null,
            type: f[F.type] || null,
            status: f[F.status] || null,
            impactAreas: f[F.impactAreas] || [],
            thematicAreas: f[F.thematicAreas] || [],
            // No impact area means cross-cutting infrastructure — the form says so.
            themeSlugs: areas(f[F.impactAreas], where, true),
            countrySlugs: countries(f[F.countries], where),
            projectSlugs: link('initiatives', f[F.initiatives]),
            audiences: f[F.audiences] || [],
            readiness: f[F.readiness] || null,
            sdgs: f[F.sdgs] || [],
            leadDev: f[F.leadDev] || null,
            contactEmail: f[F.contactEmail] || null,
            url: f[F.url] || null,
            repoUrl: f[F.repoUrl] || null,
            docsUrl: f[F.docsUrl] || null,
            openSource: !!f[F.openSource],
            licence: f[F.licence] || null,
            dataAvailability: f[F.dataAvailability] || null,
            reuse: f[F.reuse] || null,
            limitations: f[F.limitations] || null,
            ...media(f, F, where),
            video: (f[F.video] || [])[0] || null,
            publications: references(f[F.publications]),
            datasetUrl: f[F.datasetUrl] || null,
        };
    });

    const projects = initiatives.map((r) => {
        const f = r.fields;
        const F = FIELDS.initiatives;
        const where = `initiative "${f[F.slug]}"`;
        return {
            slug: f[F.slug],
            name: f[F.name],
            fullName: f[F.fullName] || null,
            summary: f[F.summary] || null,
            description: f[F.description] || null,
            status: f[F.status] || null,
            impactAreas: f[F.impactAreas] || [],
            thematicAreas: f[F.thematicAreas] || [],
            themeSlugs: areas(f[F.impactAreas], where, true),
            countrySlugs: countries(f[F.countries], where),
            startDate: f[F.startDate] || null,
            endDate: f[F.endDate] || null,
            lead: f[F.lead] || null,
            leadEmail: f[F.leadEmail] || null,
            funders: lines(f[F.funders]),
            partners: lines(f[F.partners]),
            readiness: f[F.readiness] || null,
            sdgs: f[F.sdgs] || [],
            url: f[F.url] || null,
            ...media(f, F, where),
            publications: references(f[F.publications]),
        };
    });

    const outcomes = live('outcomes').map((r) => {
        const f = r.fields;
        const F = FIELDS.outcomes;
        const where = `outcome "${f[F.claim] || r.id}"`;
        // Standing rule: every published claim carries its evidence status on the page.
        if (!f[F.evidenceStatus])
            throw new Error(`${where}: is Live with no Evidence status — set one, or take it out of Live.`);
        return {
            id: r.id,
            claim: f[F.claim] || null,
            detail: f[F.detail] || null,
            impactAreas: f[F.impactAreas] || [],
            themeSlugs: areas(f[F.impactAreas], where, false),
            countrySlugs: countries(f[F.countries], where),
            partner: f[F.partner] || null,
            since: f[F.since] || null,
            evidenceStatus: f[F.evidenceStatus],
            evidenceLabel: f[F.evidenceLabel] || null,
            evidenceUrl: f[F.evidenceUrl] || null,
            document: (f[F.document] || [])[0] || null,
            productSlugs: link('tools', f[F.tools]),
            projectSlugs: link('initiatives', f[F.initiatives]),
        };
    });

    const seen = new Set();
    const skipped = [];
    const relationships = [];
    live('connections').forEach((r) => {
        const f = r.fields;
        const F = FIELDS.connections;
        const edge = {
            from: slugOf.tools.get((f[F.from] || [])[0]),
            type: f[F.type] || null,
            to: slugOf.tools.get((f[F.to] || [])[0]),
            note: f[F.note] || null,
        };
        if (!edge.from || !edge.to || !edge.type) {
            skipped.push(f[F.label] || r.id);
            return;
        }
        const key = `${edge.from}|${edge.type}|${edge.to}`;
        if (seen.has(key)) return; // a duplicated row must not double-render
        seen.add(key);
        relationships.push(edge);
    });
    // Expected while tools are still under review: an arrow needs both of its ends published.
    if (skipped.length)
        warnings.push(
            `${skipped.length} Live connection(s) left out — each needs a type and a Live tool at both ends: ${skipped.join('; ')}`
        );

    return { products, projects, outcomes, relationships, warnings };
}

/* ------------------------------------------------------------------ I/O below */

// Load a local, untracked .env if present, so `npm run sync` picks up the token
// without passing it inline. Real environment variables always take precedence.
function loadDotEnv() {
    const envPath = path.join(ROOT, '.env');
    if (!fs.existsSync(envPath)) return;
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
        const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
        if (!m) continue;
        const [, key, rawVal] = m;
        const val = rawVal.replace(/^["']|["']$/g, '');
        if (!(key in process.env)) process.env[key] = val;
    }
}

// Set when run as a script (see the bottom of the file); unused when imported by tests.
let BASE_ID;
let TOKEN;

async function airtable(pathname, params = {}) {
    const url = new URL(`https://api.airtable.com/v0/${pathname}`);
    Object.entries(params).forEach(([k, v]) => v && url.searchParams.set(k, v));
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (!res.ok) {
        const hint =
            res.status === 403 || res.status === 404
                ? `\n  Check at https://airtable.com/create/tokens that the token lists base ${BASE_ID} under "Access" and has data.records:read + schema.bases:read.`
                : '';
        throw new Error(`Airtable ${pathname} → ${res.status}: ${await res.text()}${hint}`);
    }
    return res.json();
}

/** Fail by name if any column the sync maps is missing from the base. Returns table names. */
async function checkSchema() {
    const { tables } = await airtable(`meta/bases/${BASE_ID}/tables`);
    const problems = [];
    const names = {};
    for (const [key, id] of Object.entries(TABLES)) {
        const table = tables.find((t) => t.id === id);
        if (!table) {
            problems.push(`table ${id} (${key}) does not exist in base ${BASE_ID}`);
            continue;
        }
        names[key] = table.name;
        const have = new Set(table.fields.map((f) => f.name));
        Object.values(FIELDS[key])
            .filter((name) => !have.has(name))
            .forEach((name) => problems.push(`${table.name}: no field named "${name}"`));
    }
    if (problems.length)
        throw new Error(
            `The base does not match the field map in scripts/sync-airtable.js:\n  ${problems.join('\n  ')}`
        );
    return names;
}

async function fetchAll(table, params) {
    const records = [];
    let offset;
    do {
        const page = await airtable(`${BASE_ID}/${TABLES[table]}`, { pageSize: '100', ...params, offset });
        records.push(...page.records);
        offset = page.offset;
    } while (offset);
    return records;
}

const fetchLive = (table) =>
    fetchAll(table, { filterByFormula: `{${FIELDS[table].state}}='Live'` });

/**
 * How many records sit in each publication state, per table — the answer to "I marked it
 * Live, why is it not on the site?". Reads the state column only: nothing else about a
 * record that is not Live ever leaves Airtable.
 */
async function reportStates(names) {
    console.log('[sync-airtable] Publication state in Airtable:');
    for (const table of Object.keys(TABLES)) {
        const records = await fetchAll(table, { 'fields[]': FIELDS[table].state });
        const counts = {};
        records.forEach((r) => {
            const state = r.fields[FIELDS[table].state] || 'no state set';
            counts[state] = (counts[state] || 0) + 1;
        });
        const summary = Object.entries(counts)
            .sort(([a], [b]) => (a === 'Live' ? -1 : b === 'Live' ? 1 : a.localeCompare(b)))
            .map(([state, n]) => `${n} ${state}`)
            .join(' · ');
        console.log(`  ${names[table].padEnd(16)} ${summary || 'no records'}`);
    }
}

/**
 * Download one attachment into `root/folder` and return { src, width?, height? }, or null
 * if it cannot be used. Airtable attachment URLs expire within hours, so nothing is hotlinked.
 * Names are deterministic (<slug>-hero.jpg), so a re-sync overwrites instead of piling up.
 */
async function localise(attachment, kind, root, folder, stem, warnings) {
    const res = await fetch(attachment.url);
    if (!res.ok) throw new Error(`download failed (${res.status}) for ${attachment.filename}`);
    const bytes = Buffer.from(await res.arrayBuffer());
    const dir = path.join(root, folder);
    fs.mkdirSync(dir, { recursive: true });
    const src = (file) => `${ASSET_URL}/${folder}/${file}`;

    if (kind === 'video') {
        const input = path.join(dir, `${stem}.source`);
        const file = `${stem}.mp4`;
        fs.writeFileSync(input, bytes);
        try {
            // Silent, 720p-capped, web-playable. Raw screen recordings are far too big to commit.
            execFileSync('ffmpeg', [
                '-y', '-loglevel', 'error', '-i', input, '-an',
                '-vf', 'scale=-2:min(720\\,ih)', '-c:v', 'libx264', '-crf', '28',
                '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path.join(dir, file),
            ]);
            return { src: src(file) };
        } catch (err) {
            warnings.push(
                `${stem}: demo video skipped — ${err.code === 'ENOENT' ? 'ffmpeg is not installed' : 'ffmpeg could not read it'}.`
            );
            return null;
        } finally {
            fs.rmSync(input, { force: true });
        }
    }

    if (kind === 'document') {
        const ext = path.extname(attachment.filename || '').toLowerCase();
        if (!DOCUMENT_TYPES.includes(ext)) {
            warnings.push(`${stem}: supporting document skipped — ${ext || 'unknown type'} is not one of ${DOCUMENT_TYPES.join(', ')}.`);
            return null;
        }
        fs.writeFileSync(path.join(dir, `${stem}${ext}`), bytes);
        return { src: src(`${stem}${ext}`) };
    }

    // Images. Re-encoded rather than copied: a 5MB field photo must not land in the repo
    // at full size. Logos keep transparency (PNG); SVGs are rasterised, never served raw.
    const sharp = require('sharp');
    const isLogo = kind === 'logo';
    const file = `${stem}.${isLogo ? 'png' : 'jpg'}`;
    try {
        const pipeline = sharp(bytes)
            .rotate() // bake in EXIF orientation before the metadata is dropped
            .resize({ width: isLogo ? LOGO_MAX_WIDTH : IMAGE_MAX_WIDTH, withoutEnlargement: true });
        const info = await (isLogo ? pipeline.png() : pipeline.flatten({ background: '#ffffff' }).jpeg({ quality: 82, mozjpeg: true })).toFile(path.join(dir, file));
        return { src: src(file), width: info.width, height: info.height };
    } catch {
        warnings.push(`${stem}: "${attachment.filename}" is not a readable image — skipped.`);
        return null;
    }
}

/** Replace every attachment field on the records with its downloaded local files. */
async function localiseAll(raw, warnings) {
    for (const [table, fields] of Object.entries(MEDIA)) {
        for (const record of raw[table]) {
            const base = record.fields[FIELDS[table].slug] || record.id; // outcomes have no slug
            for (const [key, kind] of Object.entries(fields)) {
                const name = FIELDS[table][key];
                // One file per field, except screenshots. "images" is the only plural kind.
                const many = kind === 'images';
                const attachments = (record.fields[name] || []).slice(0, many ? undefined : 1);
                const files = [];
                for (const [i, attachment] of attachments.entries()) {
                    const stem = many ? `${base}-shot-${i + 1}` : `${base}-${key === 'video' ? 'demo' : key}`;
                    const file = await localise(
                        attachment,
                        many ? 'image' : kind,
                        `${ASSETS}.tmp`,
                        table,
                        stem,
                        warnings
                    );
                    if (file) files.push(file);
                }
                record.fields[name] = files;
            }
        }
    }
}

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(DATA, file), 'utf8'));
const writeJson = (file, obj) =>
    fs.writeFileSync(path.join(DATA, file), JSON.stringify(obj, null, 2) + '\n');
const GENERATED = 'Generated from Airtable by scripts/sync-airtable.js. Edit in Airtable, not here.';

async function main() {
    const names = await checkSchema();
    await reportStates(names);

    const raw = {};
    for (const table of Object.keys(TABLES)) raw[table] = await fetchLive(table);

    const warnings = [];
    fs.rmSync(`${ASSETS}.tmp`, { recursive: true, force: true });
    fs.mkdirSync(`${ASSETS}.tmp`, { recursive: true });
    await localiseAll(raw, warnings);

    const ref = {
        themes: readJson('themes.json').themes,
        countries: readJson('countries.json').countries,
    };
    const out = transform(raw, ref);
    warnings.push(...out.warnings);

    // The check the build gate runs, on what is about to be written: a record the build
    // would reject stops the sync here, by name, with nothing changed on disk.
    const { checkSnapshot } = await import('../lib/snapshot-check.mjs');
    const check = checkSnapshot({ ...out, ...ref }, readJson('taxonomy.json'), (src) =>
        fs.existsSync(path.join(`${ASSETS}.tmp`, src.slice(ASSET_URL.length)))
    );
    if (check.errors.length)
        throw new Error(
            `The snapshot would fail \`npm run validate\`:\n  ${check.errors.join('\n  ')}`
        );
    warnings.push(
        ...check.warnings.map((w) => `redundant "shortcut" connection, implied by a longer path: ${w}`)
    );

    // Only reached if nothing above threw: swap the assets in, then write the JSON.
    fs.rmSync(ASSETS, { recursive: true, force: true });
    fs.renameSync(`${ASSETS}.tmp`, ASSETS);
    writeJson('products.json', { _comment: GENERATED, products: out.products });
    writeJson('projects.json', { _comment: GENERATED, projects: out.projects });
    writeJson('outcomes.json', { _comment: GENERATED, outcomes: out.outcomes });
    writeJson('relationships.json', { _comment: GENERATED, relationships: out.relationships });

    warnings.forEach((w) => console.warn(`[sync-airtable] ⚠ ${w}`));
    console.log(
        `[sync-airtable] Live records written: ${out.products.length} tools, ${out.projects.length} initiatives, ` +
            `${out.outcomes.length} outcomes, ${out.relationships.length} connections.`
    );
    if (out.products.length + out.projects.length + out.outcomes.length === 0)
        console.log(
            '[sync-airtable] Nothing is marked Live yet, so the site is empty. Set Publication state = Live in Airtable and re-run.'
        );
}

module.exports = { transform, localise, FIELDS, TABLES };

if (require.main === module) {
    loadDotEnv();
    BASE_ID = process.env.AIRTABLE_BASE_ID || DEFAULT_BASE;
    TOKEN = process.env.AIRTABLE_TOKEN;
    if (!TOKEN) {
        console.log('[sync-airtable] AIRTABLE_TOKEN not set — skipping sync; using committed JSON.');
        process.exit(0);
    }
    main().catch((err) => {
        fs.rmSync(`${ASSETS}.tmp`, { recursive: true, force: true });
        console.error('[sync-airtable] FAILED — no files written.');
        console.error(err.message);
        process.exit(1);
    });
}
