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
 */
import { LINKS, OUTCOME_FIELD } from './portfolio-resolve.mjs';
import { FORWARD, shortcuts } from './relationships.mjs';

const ONE = { products: 'product', projects: 'project', themes: 'theme', countries: 'country' };

/**
 * @param data        { products, projects, outcomes, relationships, themes, countries }
 * @param tax         content/data/taxonomy.json
 * @param fileExists  (src) => boolean, given a media path as the JSON stores it
 * @returns           { errors, warnings }. Errors block publication. Warnings name
 *                    redundant "shortcut" relationships to remove in Airtable.
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

    // --- transitive-reduction warnings (non-fatal) ---
    // A relationship should be DIRECT; see shortcuts().
    const warnings = [
        ...new Set(shortcuts(relationships).map((r) => `"${r.from}" ${r.type} "${r.to}"`)),
    ];

    return { errors, warnings };
}
