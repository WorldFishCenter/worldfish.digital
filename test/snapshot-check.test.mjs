import test from 'node:test';
import assert from 'node:assert/strict';
import { checkSnapshot } from '../lib/snapshot-check.mjs';

/** Pins what makes a snapshot publishable. The sync runs this before it writes and the
 *  build gate runs it on the committed JSON, so a rule that slips here slips twice.
 *  Fixtures, not the real content: `npm run validate` covers that. */

const tax = {
    thematicAreas: ['Fisheries'],
    componentTypes: ['API', 'Data Pipeline', 'Application'],
    productStatuses: ['Published'],
    projectStatuses: ['Active'],
    audiences: ['Researcher / Scientist'],
    evidenceStatuses: ['No assessment yet'],
    relationshipTypes: ['feeds into', 'depends on'],
};

const HERO = '/assets/portfolio/initiatives/peskas-hero.jpg';
const SHOT = '/assets/portfolio/tools/api-shot-1.jpg';
const DOC = '/assets/portfolio/outcomes/o1-document.pdf';

const tool = (slug, type, extra = {}) => ({
    slug,
    type,
    status: 'Published',
    thematicAreas: ['Fisheries'],
    audiences: ['Researcher / Scientist'],
    themeSlugs: ['fisheries'],
    countrySlugs: ['kenya'],
    projectSlugs: ['peskas'],
    hero: null,
    logo: null,
    video: null,
    screenshots: [],
    ...extra,
});

const snapshot = () => ({
    themes: [{ slug: 'fisheries' }],
    countries: [{ slug: 'kenya' }],
    projects: [
        {
            slug: 'peskas',
            status: 'Active',
            thematicAreas: ['Fisheries'],
            themeSlugs: ['fisheries'],
            countrySlugs: ['kenya'],
            hero: { src: HERO },
            screenshots: [],
        },
    ],
    products: [tool('api', 'API', { screenshots: [{ src: SHOT }] }), tool('pipe', 'Data Pipeline')],
    outcomes: [
        {
            id: 'o1',
            evidenceStatus: 'No assessment yet',
            themeSlugs: ['fisheries'],
            countrySlugs: ['kenya'],
            productSlugs: ['api'],
            projectSlugs: ['peskas'],
            document: { src: DOC },
        },
    ],
    relationships: [{ from: 'pipe', type: 'feeds into', to: 'api' }],
});

const check = (data, files = [HERO, SHOT, DOC], taxonomy = tax) =>
    checkSnapshot(data, taxonomy, (src) => files.includes(src));

test('a consistent snapshot has nothing to report', () => {
    assert.deepEqual(check(snapshot()), { errors: [], warnings: [] });
});

test('a link to an entity that is not there is named, from every table', () => {
    const data = snapshot();
    data.products[0].countrySlugs = ['atlantis'];
    data.projects[0].themeSlugs = ['ghost'];
    data.outcomes[0].productSlugs = ['gone'];
    data.relationships.push({ from: 'pipe', type: 'feeds into', to: 'nowhere' });
    assert.deepEqual(check(data).errors, [
        'REF  product/api: country "atlantis" not found',
        'REF  project/peskas: theme "ghost" not found',
        'REF  outcome/o1: product "gone" not found',
        'REF  relationship[1]: product "nowhere" not found',
    ]);
});

test('a select value outside the taxonomy is rejected, by field', () => {
    const data = snapshot();
    data.products[0].type = 'Blockchain';
    data.products[0].audiences = ['Researcher / Scientist', 'Everyone'];
    data.projects[0].status = 'Paused';
    assert.deepEqual(check(data).errors, [
        'VOCAB product/api: type "Blockchain" not in taxonomy.json',
        'VOCAB product/api: audiences "Everyone" not in taxonomy.json',
        'VOCAB project/peskas: status "Paused" not in taxonomy.json',
    ]);
});

test('a relationship type the taxonomy allows still needs a direction', () => {
    const data = snapshot();
    data.relationships[0].type = 'replaces';
    const allowed = { ...tax, relationshipTypes: [...tax.relationshipTypes, 'replaces'] };
    assert.deepEqual(check(data, undefined, allowed).errors, [
        'VOCAB relationship[0]: type "replaces" has no direction in lib/relationships.mjs',
    ]);
});

test('an outcome needs an evidence status, and one the taxonomy knows', () => {
    const missing = snapshot();
    delete missing.outcomes[0].evidenceStatus;
    assert.deepEqual(check(missing).errors, ['EVIDENCE outcome/o1: no evidence status']);

    const unknown = snapshot();
    unknown.outcomes[0].evidenceStatus = 'Trust me';
    assert.deepEqual(check(unknown).errors, [
        'VOCAB outcome/o1: evidenceStatus "Trust me" not in taxonomy.json',
    ]);
});

test('every media path needs a file behind it', () => {
    const { errors } = check(snapshot(), []);
    assert.deepEqual(
        errors.map((e) => e.split(' is missing')[0]),
        [`MEDIA product/api: ${SHOT}`, `MEDIA project/peskas: ${HERO}`, `MEDIA outcome/o1: ${DOC}`]
    );
    assert.deepEqual(check(snapshot(), [HERO, DOC]).errors.length, 1);
});

test('a shortcut relationship is a warning, not an error', () => {
    const data = snapshot();
    data.products.push(tool('app', 'Application'));
    data.relationships.push(
        { from: 'api', type: 'feeds into', to: 'app' },
        { from: 'app', type: 'depends on', to: 'pipe' }
    );
    assert.deepEqual(check(data), { errors: [], warnings: ['"app" depends on "pipe"'] });
});
