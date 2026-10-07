import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import sync from '../scripts/sync-airtable.js';

const { transform, FIELDS } = sync;

/** Pins what the Airtable sync lets onto the site. Fixtures, not the real base: the rules
 *  here (Live only, links resolve to Live only, evidence status required) must hold
 *  whatever the base contains. Records are written with real column names via FIELDS. */

const ref = {
    themes: [
        { slug: 'sustainable-fisheries', name: 'Sustainable Fisheries' },
        { slug: 'shared-infrastructure', name: 'Shared Infrastructure', crossCutting: true },
    ],
    countries: [
        { slug: 'kenya', name: 'Kenya' },
        { slug: 'timor-leste', name: 'Timor-Leste' },
    ],
};

/** Build an Airtable record from JSON keys, so a renamed column only changes FIELDS. */
const rec = (table, id, values) => ({
    id,
    fields: Object.fromEntries(Object.entries(values).map(([key, v]) => [FIELDS[table][key], v])),
});

const raw = () => ({
    tools: [
        rec('tools', 'recApi', {
            state: 'Live',
            slug: 'peskas-api',
            name: 'Peskas API',
            summary: 'Serves processed catch data.',
            type: 'API',
            status: 'Published',
            countries: ['Kenya', 'Other'],
            initiatives: ['recPeskas', 'recDraftInit'],
            publications: 'Impact assessment, 2021 — https://example.org/study\nhttps://example.org/bare',
            hero: [{ src: '/assets/portfolio/tools/peskas-api-hero.jpg', width: 2400, height: 1600 }],
            mediaCredit: 'Photo: Jane Doe / WorldFish',
        }),
        rec('tools', 'recPipe', {
            state: 'Live',
            slug: 'kenya-pipeline',
            name: 'Kenya pipeline',
            impactAreas: ['Sustainable Fisheries'],
            countries: ['Kenya'],
        }),
        rec('tools', 'recDraft', { state: 'Under review', slug: 'secret-tool', name: 'Secret' }),
    ],
    initiatives: [
        rec('initiatives', 'recPeskas', {
            state: 'Live',
            slug: 'peskas',
            name: 'Peskas',
            impactAreas: ['Sustainable Fisheries'],
            countries: ['Timor-Leste'],
            funders: 'Funder A\n\n  Funder B  ',
        }),
        rec('initiatives', 'recDraftInit', { state: 'Needs more info', slug: 'draft', name: 'Draft' }),
    ],
    outcomes: [
        rec('outcomes', 'recOut', {
            state: 'Live',
            claim: 'Statistics now come from the system fishers report into.',
            countries: ['Timor-Leste'],
            impactAreas: ['Sustainable Fisheries'],
            evidenceStatus: 'No assessment yet',
            tools: ['recApi', 'recDraft'],
            initiatives: ['recPeskas'],
        }),
        rec('outcomes', 'recOutDraft', {
            state: 'Under review',
            claim: 'Unreviewed claim',
            evidenceStatus: 'Internal M&E only',
        }),
    ],
    connections: [
        rec('connections', 'recEdge', { state: 'Live', type: 'feeds into', from: ['recPipe'], to: ['recApi'] }),
        rec('connections', 'recDup', { state: 'Live', type: 'feeds into', from: ['recPipe'], to: ['recApi'] }),
        rec('connections', 'recToDraft', { state: 'Live', label: 'API enables Secret', type: 'enables', from: ['recApi'], to: ['recDraft'] }),
        rec('connections', 'recEdgeDraft', { state: 'Under review', type: 'enables', from: ['recApi'], to: ['recPipe'] }),
    ],
});

test('only Live records reach the site, from every table', () => {
    const out = transform(raw(), ref);
    assert.deepEqual(out.products.map((p) => p.slug), ['peskas-api', 'kenya-pipeline']);
    assert.deepEqual(out.projects.map((p) => p.slug), ['peskas']);
    assert.deepEqual(out.outcomes.map((o) => o.id), ['recOut']);
    assert.deepEqual(out.relationships, [
        { from: 'kenya-pipeline', type: 'feeds into', to: 'peskas-api', note: null },
    ]);
});

test('nothing Live means an empty site, not an error', () => {
    const data = raw();
    Object.values(data).forEach((records) =>
        records.forEach((r) => (r.fields['Publication state'] = 'Under review'))
    );
    assert.deepEqual(transform(data, ref), {
        products: [],
        projects: [],
        outcomes: [],
        relationships: [],
        warnings: [],
    });
    assert.deepEqual(transform({}, ref).products, []);
});

test('a link to a record that is not Live drops out instead of dangling', () => {
    const out = transform(raw(), ref);
    assert.deepEqual(out.products[0].projectSlugs, ['peskas']);
    assert.deepEqual(out.outcomes[0].productSlugs, ['peskas-api']);
    assert.deepEqual(
        out.warnings.filter((w) => w.includes('connection')),
        ['1 Live connection(s) left out — each needs a type and a Live tool at both ends: API enables Secret']
    );
});

test('select values become slugs; no impact area means cross-cutting; "Other" is not a place', () => {
    const [api, pipe] = transform(raw(), ref).products;
    assert.deepEqual(api.themeSlugs, ['shared-infrastructure']);
    assert.deepEqual(api.countrySlugs, ['kenya']);
    assert.deepEqual(pipe.themeSlugs, ['sustainable-fisheries']);
});

test('an unknown country or impact area fails by name rather than vanishing', () => {
    const data = raw();
    data.tools[1].fields[FIELDS.tools.countries] = ['Atlantis'];
    assert.throws(() => transform(data, ref), /country "Atlantis" is not in content\/data\/countries\.json/);

    const other = raw();
    other.tools[1].fields[FIELDS.tools.impactAreas] = ['Made Up Area'];
    assert.throws(() => transform(other, ref), /impact area "Made Up Area"/);
});

test('a Live record without a Slug, or sharing one, stops the sync', () => {
    const data = raw();
    delete data.tools[0].fields[FIELDS.tools.slug];
    assert.throws(() => transform(data, ref), /"Peskas API" has no Slug/);

    const dup = raw();
    dup.tools[1].fields[FIELDS.tools.slug] = 'peskas-api';
    assert.throws(() => transform(dup, ref), /share the Slug "peskas-api"/);
});

test('an outcome cannot go Live without an evidence status', () => {
    const data = raw();
    delete data.outcomes[0].fields[FIELDS.outcomes.evidenceStatus];
    assert.throws(() => transform(data, ref), /Live with no Evidence status/);
});

test('the media credit travels with each image, and its absence is reported', () => {
    const out = transform(raw(), ref);
    assert.deepEqual(out.products[0].hero, {
        src: '/assets/portfolio/tools/peskas-api-hero.jpg',
        width: 2400,
        height: 1600,
        credit: 'Photo: Jane Doe / WorldFish',
    });
    assert.equal(out.products[1].hero, null);

    const data = raw();
    delete data.tools[0].fields[FIELDS.tools.mediaCredit];
    const uncredited = transform(data, ref);
    assert.equal(uncredited.products[0].hero.credit, null);
    assert.ok(uncredited.warnings.some((w) => w.includes('peskas-api') && w.includes('Media credit')));
});

test('one-per-line text fields become lists', () => {
    const out = transform(raw(), ref);
    assert.deepEqual(out.projects[0].funders, ['Funder A', 'Funder B']);
    assert.deepEqual(out.products[0].publications, [
        { label: 'Impact assessment, 2021', href: 'https://example.org/study' },
        { label: 'https://example.org/bare', href: 'https://example.org/bare' },
    ]);
});

test('the field map names only columns the intake schema defines', () => {
    // scripts/create-intake-schema.mjs is the written record of the base. The live check
    // against Airtable itself runs at the start of every sync; this catches a typo offline.
    const schema = readFileSync(new URL('../scripts/create-intake-schema.mjs', import.meta.url), 'utf8');
    for (const [table, fields] of Object.entries(FIELDS)) {
        for (const name of Object.values(fields)) {
            const quoted = [`'${name}'`, `'${name.replace(/'/g, "\\'")}'`, `"${name}"`];
            assert.ok(
                quoted.some((q) => schema.includes(q)),
                `${table}: "${name}" is not a field in create-intake-schema.mjs`
            );
        }
    }
});
