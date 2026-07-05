#!/usr/bin/env node
/* Validates content/data/*.json:
 *  1. Referential integrity — every *Slugs cross-reference resolves to a real entity.
 *  2. Vocabulary conformance — every tag value is a member of the canonical option set in
 *     taxonomy.json (so a future Airtable sync is a straight, typo-free value mapping).
 * Exits non-zero if any problem is found. Run with: node scripts/validate-content.js
 */
const path = require('path');
const DIR = path.join(__dirname, '..', 'content', 'data');
const read = (f) => require(path.join(DIR, f));

const projects = read('projects.json').projects;
const products = read('products.json').products;
const themes = read('themes.json').themes;
const countries = read('countries.json').countries;
const donors = read('donors.json').donors;
const personas = read('personas.json').personas;
const relationships = read('relationships.json').relationships;
const partners = read('partners.json').partners;
const initiatives = read('initiatives.json').initiatives;
const tax = read('taxonomy.json');

const errors = [];
const setOf = (list) => new Set(list.map((x) => x.slug));
const S = {
    project: setOf(projects),
    product: setOf(products),
    theme: setOf(themes),
    country: setOf(countries),
    donor: setOf(donors),
    persona: setOf(personas),
    partner: setOf(partners),
    initiative: setOf(initiatives),
};

// --- referential integrity ---
const refs = (where, kind, arr) =>
    (arr || []).forEach((slug) => {
        if (!S[kind].has(slug)) errors.push(`REF  ${where}: ${kind} "${slug}" not found`);
    });

projects.forEach((p) => {
    refs(`project/${p.slug}`, 'country', p.countrySlugs);
    refs(`project/${p.slug}`, 'product', p.leadProductSlugs);
    refs(`project/${p.slug}`, 'theme', p.themeSlugs);
    refs(`project/${p.slug}`, 'donor', p.donorSlugs);
    refs(`project/${p.slug}`, 'partner', p.partnerSlugs);
    refs(`project/${p.slug}`, 'initiative', p.initiative ? [p.initiative] : []);
});
products.forEach((p) => {
    refs(`product/${p.slug}`, 'country', p.countrySlugs);
    refs(`product/${p.slug}`, 'project', p.projectSlugs);
    refs(`product/${p.slug}`, 'theme', p.themeSlugs);
    refs(`product/${p.slug}`, 'initiative', p.initiative ? [p.initiative] : []);
});
themes.forEach((t) => {
    refs(`theme/${t.slug}`, 'project', t.projectSlugs);
    refs(`theme/${t.slug}`, 'product', t.productSlugs);
    refs(`theme/${t.slug}`, 'product', t.featuredProductSlugs);
    refs(`theme/${t.slug}`, 'country', t.countrySlugs);
    refs(`theme/${t.slug}`, 'donor', t.donorSlugs);
    refs(`theme/${t.slug}`, 'persona', t.personaSlugs);
});
countries.forEach((c) => {
    refs(`country/${c.slug}`, 'theme', c.themeSlugs);
    refs(`country/${c.slug}`, 'product', c.productSlugs);
    refs(`country/${c.slug}`, 'project', c.projectSlugs);
});
donors.forEach((d) => refs(`donor/${d.slug}`, 'project', d.projectSlugs));
personas.forEach((p) => {
    refs(`persona/${p.slug}`, 'theme', p.themeSlugs);
    refs(`persona/${p.slug}`, 'product', p.keyProductSlugs);
});
initiatives.forEach((i) => {
    refs(`initiative/${i.slug}`, 'product', i.productSlugs);
    refs(`initiative/${i.slug}`, 'project', i.projectSlugs);
});
partners.forEach((p) => refs(`partner/${p.slug}`, 'project', p.projectSlugs));
relationships.forEach((r, i) => {
    refs(`relationship[${i}]`, 'product', [r.from, r.to]);
    if (!tax.relationshipTypes.includes(r.type))
        errors.push(`VOCAB relationship[${i}]: type "${r.type}" not in taxonomy.relationshipTypes`);
});

// --- vocabulary conformance ---
const inSet = (where, field, values, allowed) =>
    (values || []).forEach((v) => {
        if (!allowed.includes(v)) errors.push(`VOCAB ${where}: ${field} "${v}" not in taxonomy`);
    });

projects.forEach((p) => {
    inSet(`project/${p.slug}`, 'thematicAreas', p.thematicAreas, tax.thematicAreas);
    inSet(`project/${p.slug}`, 'impactAreas', p.impactAreas, tax.impactAreas);
    inSet(`project/${p.slug}`, 'programme', [p.programme], tax.programmes);
    inSet(`project/${p.slug}`, 'status', [p.status], tax.projectStatuses);
});
products.forEach((p) => {
    inSet(`product/${p.slug}`, 'thematicAreas', p.thematicAreas, tax.thematicAreas);
    inSet(`product/${p.slug}`, 'impactAreas', p.impactAreas, tax.impactAreas);
    inSet(`product/${p.slug}`, 'type', [p.type], tax.componentTypes);
    inSet(`product/${p.slug}`, 'status', [p.status], tax.productStatuses);
});
themes.forEach((t) => {
    inSet(`theme/${t.slug}`, 'thematicAreas', t.thematicAreas, tax.thematicAreas);
    inSet(`theme/${t.slug}`, 'impactAreas', t.impactAreas, tax.impactAreas);
});
countries.forEach((c) => {
    inSet(`country/${c.slug}`, 'airtableCountry', [c.airtableCountry], tax.countries);
});

// --- transitive-reduction warnings (non-fatal) ---
// A relationship should be DIRECT. Flag any edge A→C already implied by a longer
// path A→…→C (e.g. "App depends on Pipeline" when App→API→Pipeline exists), so it
// can be removed in Airtable. Non-fatal; does not affect the exit code.
const FLOW_FORWARD = new Set(['feeds into', 'enables']);
const flow = relationships.map((r) => ({
    s: FLOW_FORWARD.has(r.type) ? r.from : r.to,
    t: FLOW_FORWARD.has(r.type) ? r.to : r.from,
    orig: r,
}));
const flowAdj = new Map();
flow.forEach(({ s, t }) => {
    if (!flowAdj.has(s)) flowAdj.set(s, []);
    flowAdj.get(s).push(t);
});
const reachableViaLongerPath = (s, t) => {
    const seen = new Set([s]);
    const queue = [s];
    while (queue.length) {
        const n = queue.shift();
        for (const m of flowAdj.get(n) || []) {
            if (n === s && m === t) continue; // ignore the direct edge under test
            if (m === t) return true;
            if (!seen.has(m)) {
                seen.add(m);
                queue.push(m);
            }
        }
    }
    return false;
};
const warnings = [
    ...new Set(
        flow
            .filter(({ s, t }) => reachableViaLongerPath(s, t))
            .map(({ orig }) => `"${orig.from}" ${orig.type} "${orig.to}"`)
    ),
];
if (warnings.length) {
    console.warn(
        `⚠ ${warnings.length} redundant "shortcut" relationship(s) — implied by a longer path, consider removing in Airtable:`
    );
    warnings.forEach((w) => console.warn('  ' + w));
}

if (errors.length) {
    console.error(`✗ content validation failed (${errors.length}):`);
    errors.forEach((e) => console.error('  ' + e));
    process.exit(1);
}
console.log('✓ content valid: referential integrity + taxonomy conformance OK');
console.log(
    `  ${projects.length} projects, ${products.length} products, ${themes.length} themes, ` +
        `${countries.length} countries, ${relationships.length} relationships`
);
