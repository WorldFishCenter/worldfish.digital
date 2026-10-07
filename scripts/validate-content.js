#!/usr/bin/env node
/* The build gate (runs in `prebuild`): checks content/data/*.json and exits non-zero if
 * the snapshot is not publishable. The rules themselves are in lib/snapshot-check.mjs,
 * which the sync also runs before it writes anything. Run with: npm run validate
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const read = (f) => require(path.join(ROOT, 'content', 'data', f));

import('../lib/snapshot-check.mjs').then(({ checkSnapshot }) => {
    const data = {
        products: read('products.json').products,
        projects: read('projects.json').projects,
        outcomes: read('outcomes.json').outcomes,
        relationships: read('relationships.json').relationships,
        themes: read('themes.json').themes,
        countries: read('countries.json').countries,
    };
    const { errors, warnings } = checkSnapshot(data, read('taxonomy.json'), (src) =>
        fs.existsSync(path.join(ROOT, 'public', src))
    );

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
    console.log('✓ content valid: references, vocabularies, evidence status and media files OK');
    console.log(
        `  ${data.products.length} tools, ${data.projects.length} initiatives, ${data.outcomes.length} outcomes, ` +
            `${data.relationships.length} connections`
    );
});
