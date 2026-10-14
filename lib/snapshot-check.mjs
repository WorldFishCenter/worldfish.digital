/**
 * Is this snapshot publishable? Pure: the dataset comes in, the problems go out.
 *
 * Two callers cross this seam. `npm run sync` runs it on what it is about to write, so a
 * record the build would reject stops the sync before any file changes. `npm run validate`
 * (the build gate, scripts/validate-content.js) runs it on the committed JSON. The tests
 * bind it to fixtures; see test/snapshot-check.test.mjs.
 *
 *  1. Referential integrity — every slug a record points at resolves to a real entity.
 *  2. Vocabulary conformance — every select value is listed in taxonomy.json.
 *  3. Evidence — every outcome carries an evidence status.
 *  4. Media — every synced image, video and document path has a file behind it.
 *
 * Warnings (non-fatal) catch the things the schema cannot stop a submitter doing: a status
 * that contradicts the readiness level, an impact area left blank, an image with no credit,
 * and a relationship that a longer path already implies. Each warning is a complete sentence
 * — both callers print them verbatim.
 */
import { LINKS, OUTCOME_FIELD } from './portfolio-resolve.mjs';
import { FORWARD, shortcuts } from './relationships.mjs';

const ONE = { products: 'product', projects: 'project', themes: 'theme', countries: 'country' };

/** Readiness levels each status is consistent with. Retired can sit at any level. */
const READINESS_BAND = {
    Prototype: [0, 4],
    'Being piloted': [5, 6],
    'Available for use': [7, 9],
};

/**
 * @param data        { products, projects, outcomes, relationships, themes, countries }
 * @param tax         content/data/taxonomy.json
 * @param fileExists  (src) => boolean, given a media path as the JSON stores it
 * @returns           { errors, warnings }. Errors block publication; warnings are complete
 *                    sentences the callers print as they are.
 */
export function checkSnapshot(data, tax, fileExists) {
    const { products, projects, outcomes, relationships } = data;
    const errors = [];
    const known = {};
    Object.keys(ONE).forEach((name) => {
        known[name] = new Set(data[name].map((x) => x.slug));
    });

    // --- referential integrity ---
    const refs = (where, target, slugs) =>
        (slugs || []).forEach((slug) => {
            if (!known[target].has(slug))
                errors.push(`REF  ${where}: ${ONE[target]} "${slug}" not found`);
        });

    // Read off LINKS, so a new relation is checked as soon as it is declared. Only the
    // forward links are stored; a derived reverse field is simply absent from the JSON.
    ['products', 'projects'].forEach((name) =>
        data[name].forEach((record) =>
            LINKS[name].forEach(([field, target]) =>
                refs(`${ONE[name]}/${record.slug}`, target, record[field])
            )
        )
    );
    outcomes.forEach((o) =>
        Object.entries(OUTCOME_FIELD).forEach(([target, field]) =>
            refs(`outcome/${o.id}`, target, o[field])
        )
    );
    relationships.forEach((r, i) => refs(`relationship[${i}]`, 'products', [r.from, r.to]));

    // --- vocabulary conformance ---
    const inSet = (where, field, values, allowed) =>
        (values || []).filter(Boolean).forEach((v) => {
            if (!allowed.includes(v))
                errors.push(`VOCAB ${where}: ${field} "${v}" not in taxonomy.json`);
        });

    products.forEach((p) => {
        inSet(`product/${p.slug}`, 'thematicAreas', p.thematicAreas, tax.thematicAreas);
        inSet(`product/${p.slug}`, 'type', [p.type], tax.componentTypes);
        inSet(`product/${p.slug}`, 'status', [p.status], tax.productStatuses);
        inSet(`product/${p.slug}`, 'audiences', p.audiences, tax.audiences);
    });
    projects.forEach((p) => {
        inSet(`project/${p.slug}`, 'thematicAreas', p.thematicAreas, tax.thematicAreas);
        inSet(`project/${p.slug}`, 'status', [p.status], tax.projectStatuses);
    });
    relationships.forEach((r, i) => {
        inSet(`relationship[${i}]`, 'type', [r.type], tax.relationshipTypes);
        // Without a direction the diagram would draw the edge backwards, silently.
        if (!(r.type in FORWARD))
            errors.push(
                `VOCAB relationship[${i}]: type "${r.type}" has no direction in lib/relationships.mjs`
            );
    });

    // --- evidence: no claim is published without saying how well it is evidenced ---
    outcomes.forEach((o) => {
        if (!o.evidenceStatus) errors.push(`EVIDENCE outcome/${o.id}: no evidence status`);
        inSet(`outcome/${o.id}`, 'evidenceStatus', [o.evidenceStatus], tax.evidenceStatuses);
    });

    // --- media: a path in the JSON with no file behind it renders as a broken image ---
    const media = (where, files) =>
        (files || []).filter(Boolean).forEach((file) => {
            if (!fileExists(file.src))
                errors.push(
                    `MEDIA ${where}: ${file.src} is missing from public/ — re-run npm run sync`
                );
        });
    [
        ...products.map((p) => [`product/${p.slug}`, p]),
        ...projects.map((p) => [`project/${p.slug}`, p]),
    ].forEach(([where, p]) => media(where, [p.hero, p.logo, p.video, ...(p.screenshots || [])]));
    outcomes.forEach((o) => media(`outcome/${o.id}`, [o.document]));

    /* --- warnings: true of the data, but a judgement rather than a breakage --- */
    const warnings = [];

    // Status and Innovation readiness both describe maturity, and nothing in Airtable stops
    // them disagreeing — "Available for use" at readiness 2 would publish happily.
    products.forEach((p) => {
        const band = READINESS_BAND[p.status];
        const level = parseInt(p.readiness, 10);
        if (!band || Number.isNaN(level)) return;
        if (level < band[0] || level > band[1])
            warnings.push(
                `product/${p.slug}: status "${p.status}" expects readiness ${band[0]}–${band[1]}, ` +
                    `but it is ${level}. Change one of them in Airtable.`
            );
    });

    // A blank Impact area is read as cross-cutting infrastructure. That is a real rule, but
    // it is invisible — a submitter who simply did not know which area to pick lands here.
    const crossCutting = new Set(
        (data.themes || []).filter((t) => t.crossCutting).map((t) => t.slug)
    );
    [...products, ...projects].forEach((record) => {
        const kind = products.includes(record) ? 'product' : 'project';
        const slugs = record.themeSlugs || [];
        // Only when it actually landed on the cross-cutting entry *because* the area was
        // blank — not merely because a fixture left impactAreas out.
        const fellBack =
            (record.impactAreas || []).length === 0 &&
            slugs.length > 0 &&
            slugs.every((s) => crossCutting.has(s));
        if (fellBack)
            warnings.push(
                `${kind}/${record.slug}: no impact area set, so it is filed under ` +
                    `${[...crossCutting].join(', ')} by default. ` +
                    `Set one in Airtable if that is not deliberate.`
            );
    });

    // An uncredited photograph is a rights problem, not an aesthetic one: the WorldFish
    // archive names a photographer per image and the credit has to travel with the picture.
    [
        ...products.map((p) => [`product/${p.slug}`, p]),
        ...projects.map((p) => [`project/${p.slug}`, p]),
    ].forEach(([where, p]) => {
        const files = [p.hero, ...(p.screenshots || [])].filter(Boolean);
        if (files.length && files.some((f) => !f.credit))
            warnings.push(`${where}: images published with no Media credit. Set one in Airtable.`);
    });

    // A relationship should be DIRECT; see shortcuts().
    [...new Set(shortcuts(relationships).map((r) => `"${r.from}" ${r.type} "${r.to}"`))].forEach(
        (r) =>
            warnings.push(`redundant "shortcut" relationship, implied by a longer path: ${r}`)
    );

    return { errors, warnings };
}
