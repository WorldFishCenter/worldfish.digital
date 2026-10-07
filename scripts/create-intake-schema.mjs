#!/usr/bin/env node
/**
 * Creates the four worldfish.digital intake tables in the Airtable intake base
 * (appjLGt1IWscYAV3i by default — the purpose-made base, not the live Products base).
 *
 *   WFD Tools        — the digital things, one record each
 *   WFD Initiatives  — the funded bodies of work that pay for them
 *   WFD Outcomes     — one evidenced claim each, with provenance
 *   WFD Connections  — typed tool → tool links
 *
 * Existing tables are never touched. Re-running is safe: a table that already exists is
 * skipped, and link fields are only added if missing.
 *
 * Requires an AIRTABLE_TOKEN that (a) lists this base under its access, and
 * (b) carries the **schema.bases:write** scope. The sync token has neither by default,
 * so this 403s until both are granted — see docs/INTAKE_SCHEMA.md.
 *
 *   node scripts/create-intake-schema.mjs             # create
 *   node scripts/create-intake-schema.mjs --dry-run   # print the plan only
 *   node scripts/create-intake-schema.mjs --base=appX # target a different base
 */

import { readFileSync } from 'node:fs';

// The new, purpose-made intake base. Override with --base=appXXXX or AIRTABLE_BASE_ID.
const DEFAULT_BASE = 'appjLGt1IWscYAV3i';
const baseArg = process.argv.find((a) => a.startsWith('--base='));
const BASE = baseArg ? baseArg.slice('--base='.length) : process.env.AIRTABLE_BASE_ID || DEFAULT_BASE;
const DRY = process.argv.includes('--dry-run');

// .env is not auto-loaded; the sync script does the same thing.
if (!process.env.AIRTABLE_TOKEN) {
    try {
        const env = readFileSync(new URL('../.env', import.meta.url), 'utf8');
        const m = env.match(/^AIRTABLE_TOKEN=(.*)$/m);
        if (m) process.env.AIRTABLE_TOKEN = m[1].trim();
    } catch {
        /* no .env — fall through to the check below */
    }
}
const TOKEN = process.env.AIRTABLE_TOKEN;
if (!TOKEN) {
    console.error('AIRTABLE_TOKEN is not set (env or .env).');
    process.exit(1);
}

/* ---------------------------------------------------------------- vocabularies
   These mirror content/data/taxonomy.json so a synced value maps straight across.
   Country list is the 16 actually in use plus Other. */

const COUNTRIES = ['Global', 'Timor-Leste', 'Kenya', 'Zanzibar', 'Mozambique', 'Malawi',
    'Zambia', 'Nigeria', 'Ghana', 'Malaysia', 'Namibia', 'Eritrea', 'Solomon Islands',
    'West Africa / CAOPA', 'Guatemala', 'Colombia', 'Other'];
const IMPACT = ['Sustainable Fisheries', 'Productive Aquaculture', 'Nutrition Security',
    'Climate Adaptation', 'Resilient Livelihoods', 'Better Governance'];
const THEMATIC = ['Climate', 'Fisheries', 'Aquaculture', 'Livestock', 'Nutrition',
    'Biosciences & Genetics', 'Gender & Social Inclusion', 'Policy', 'Digital & AI', 'Other'];
const TOOL_TYPES = ['Platform', 'Application', 'Dashboard', 'API', 'Data Pipeline', 'Model',
    'Algorithm', 'Module', 'Data Product', 'Other'];
const TOOL_STATUS = ['Ideation', 'Draft', 'Published', 'Retired', 'Archived'];
const PROJECT_STATUS = ['Pipeline', 'Planned', 'Active', 'Completed', 'Cancelled'];
const AUDIENCE = ['Government Fisheries Officer', 'Researcher / Scientist',
    'Field Enumerator / Data Collector', 'Extension Officer / NGO', 'Aquaculture Farmer',
    'Private Sector', 'Donor / Investor'];
const PUB_STATE = ['Under review', 'Live', 'Needs more info', 'Archived'];

/** CGIAR innovation readiness, adapted from NASA TRLs. Same scale PRMS reports against. */
const IRL = ['0 — Idea', '1 — Basic principles', '2 — Proof of concept',
    '3 — Validated in lab', '4 — Validated in controlled field conditions',
    '5 — Piloted in a real setting', '6 — Demonstrated at scale in one setting',
    '7 — Proven in several settings', '8 — Fully proven and available',
    '9 — Widely used and sustained'];

const SDG = ['SDG 1 – No Poverty', 'SDG 2 – Zero Hunger', 'SDG 5 – Gender Equality',
    'SDG 8 – Decent Work', 'SDG 10 – Reduced Inequalities',
    'SDG 12 – Responsible Consumption', 'SDG 13 – Climate Action',
    'SDG 14 – Life Below Water', 'SDG 17 – Partnerships'];

const EVIDENCE_STATE = [
    'Independent study published',
    'Independent study in review',
    'Internal M&E only',
    'No assessment yet',
];

/* --------------------------------------------------------------- field helpers */
const sel = (name, choices, description, multi = false) => ({
    name,
    type: multi ? 'multipleSelects' : 'singleSelect',
    description,
    options: { choices: choices.map((c) => ({ name: c })) },
});
const txt = (name, description) => ({ name, type: 'singleLineText', description });
const long = (name, description) => ({ name, type: 'multilineText', description });
const url = (name, description) => ({ name, type: 'url', description });

/** Every table carries the same curation tail: who submitted it, and whether it is live. */
const curationTail = () => [
    sel('Publication state', PUB_STATE,
        'Set by the Digital Team, not the submitter. The website only pulls records marked Live — this is the gate between "someone filled a form" and "it is on the public site".'),
    long('Internal notes (reviewers)', 'Curation notes. Never published.'),
    { name: 'Assigned reviewer', type: 'singleCollaborator', description: 'Who is curating this record.' },
    { name: 'Submitted by', type: 'createdBy' },
    { name: 'Submitted at', type: 'createdTime' },
    { name: 'Last updated', type: 'lastModifiedTime' },
];

/* ----------------------------------------------------------------- the tables */

const TOOLS = {
    name: 'WFD Tools',
    description:
        'Digital tools, platforms, pipelines, models and data products — ONE RECORD EACH. This is the table the website is weakest on today: the old intake collected tool names in a text box, which is why most tools show on the site as a bare name with no description. Only Publication state = Live is pulled onto the site.',
    fields: [
        txt('Name', "The tool's common name, exactly as colleagues say it out loud. Becomes the page title."),
        txt('Slug', 'Lowercase, hyphenated, no spaces — e.g. peskas-api. The stable URL id and the join key with the website. Leave blank and a reviewer will set it.'),
        txt('What it is', 'ONE plain sentence a colleague outside your team would understand: what it does and who for, not what it is built with. THE most important field here — without it the tool appears on the site as a name and nothing else.'),
        long('Full description', 'Two or three sentences of context: the problem it addresses, how it works in practice, and how it differs from similarly-named tools (e.g. how the Mozambique pipeline differs from the Mozambique app).'),
        sel('Type', TOOL_TYPES, 'What kind of thing it is. Groups the tool on the site.'),
        sel('Status', TOOL_STATUS, "Where it is in its life. 'Published' means someone else could use it today."),
        sel('Impact area(s)', IMPACT, 'Which CGIAR impact area(s) it contributes to. Drives where it appears on the site. Leave blank only if it is genuinely cross-cutting infrastructure serving all of them.', true),
        sel('Thematic area(s)', THEMATIC, 'The subject domains it touches.', true),
        sel('Country / region', COUNTRIES, 'Everywhere it actually runs or has run. Global for worldwide public goods.', true),
        sel('Who uses it', AUDIENCE, 'The people who actually open it or consume its output.', true),
        sel('Innovation readiness level', IRL, 'CGIAR / NASA scale 0–9. An honest answer is more useful than a flattering one, and this is the same scale PRMS innovation reporting uses — filling it here saves repeating it there.'),
        sel('SDG alignment', SDG, 'Only those it genuinely contributes to.', true),
        txt('Lead developer', 'Who to ask about it. A name is enough.'),
        { name: 'Contact email', type: 'email', description: 'Where a colleague wanting to reuse this should write.' },
        url('Live URL', 'Where the running tool lives, if it is public.'),
        url('Code repository', 'GitHub or equivalent. Central to the reuse argument — if the code is public, say where.'),
        url('Documentation URL', 'Anything that would let someone unfamiliar set it up and run it.'),
        { name: 'Open source?', type: 'checkbox', description: 'Tick if the code carries an OSI-approved open licence.', options: { icon: 'check', color: 'greenBright' } },
        txt('Code licence', 'e.g. MIT, GPL-3.0, Apache-2.0. Blank if not open.'),
        sel('Data availability', ['Open / Public', 'Restricted — on request', 'Internal only', 'Not applicable'],
            'Who can get at the data behind it. Partner-owned data is usually Restricted.'),
        long('How it can be reused', 'In your own words: what part of this could another team pick up for a different country, species or domain — and what would they have to change? This is the argument the whole website rests on.'),
        long('Known limitations', 'What it does not do, or does badly. Saves colleagues finding out the hard way.'),
        { name: 'Screenshots / media', type: 'multipleAttachments', description: 'Interface screenshots, maps, charts — what the tool actually looks like in use. Highest resolution you have; the site downscales. Several is better than one.' },
        { name: 'Hero image', type: 'multipleAttachments', description: 'ONE wide landscape image that represents this work — a field photo or a striking screenshot. Used large on the site, so at least 2000px wide. It gets cropped to roughly 3:2 for cards and 2.3:1 for page banners, so keep the subject away from the very top and bottom.' },
        { name: 'Logo', type: 'multipleAttachments', description: 'If the tool has its own mark. PNG or SVG with a transparent background.' },
        { name: 'Demo video / screen recording', type: 'multipleAttachments', description: 'A short silent clip of the tool in use — 10–20 seconds is plenty. Raw screen recordings are fine; we compress them. Do not worry about file size here, but do trim it to the interesting part.' },
        txt('Media credit', "Photographer or source for everything above, e.g. 'Photo: Jane Doe / WorldFish'. Required if you upload anything — the credit has to travel with the picture, and we cannot reconstruct it later."),
        long('Publications & reports', 'Papers, reports or blog posts about this tool. One URL per line, with a title if you have one. These become the evidence trail on the site.'),
        url('Dataset / DOI', 'A permanent link to the data behind it — Dataverse, Zenodo, a DOI. Not a folder on a shared drive.'),
        ...curationTail(),
    ],
};

const INITIATIVES = {
    name: 'WFD Initiatives',
    description:
        'The funded bodies of work — projects, programmes, centres — that pay for and contain the tools. One record each. Only Publication state = Live is pulled onto the site.',
    fields: [
        txt('Name', 'Short name as people say it, e.g. AABS. Becomes the page title.'),
        txt('Slug', 'Lowercase, hyphenated. Stable URL id and join key. A reviewer can set it.'),
        txt('Full title', 'The formal title, spelled out.'),
        txt('What it is', 'ONE plain sentence: what this initiative is trying to change, and where.'),
        long('Description', 'Two or three sentences of context — the problem, the approach, the partners.'),
        sel('Status', PROJECT_STATUS, 'Where the work stands.'),
        sel('Impact area(s)', IMPACT, 'Which CGIAR impact area(s) it contributes to.', true),
        sel('Thematic area(s)', THEMATIC, 'The subject domains it covers.', true),
        sel('Country / region', COUNTRIES, 'Where the work happens.', true),
        { name: 'Start date', type: 'date', description: 'When it began.', options: { dateFormat: { name: 'iso' } } },
        { name: 'End date', type: 'date', description: 'When it ends or ended. Blank if ongoing.', options: { dateFormat: { name: 'iso' } } },
        txt('Lead — name', 'Who leads this work.'),
        { name: 'Lead — email', type: 'email', description: 'Contact for questions about the initiative.' },
        long('Funder(s)', 'One per line. Use the funder\'s own name for itself.'),
        { name: 'Budget (USD)', type: 'currency', description: 'Approximate total. Optional — leave blank if it is sensitive.', options: { precision: 0, symbol: '$' } },
        long('Partner organizations', 'One per line. The institutions you actually work with, not everyone cc\'d.'),
        sel('Innovation readiness level', IRL, 'CGIAR / NASA scale 0–9 for the initiative as a whole.'),
        sel('SDG alignment', SDG, 'Only those it genuinely contributes to.', true),
        url('Project page / website', 'An external page about this work, if one exists.'),
        { name: 'Hero image', type: 'multipleAttachments', description: 'ONE wide landscape image representing this initiative — ideally people, place or work in progress rather than a meeting room. At least 2000px wide; cropped to about 3:2, so keep the subject off the very top and bottom edges.' },
        { name: 'Screenshots / media', type: 'multipleAttachments', description: 'Field photos, maps, event images. Several is better than one.' },
        { name: 'Logo', type: 'multipleAttachments', description: 'Project or programme mark, if it has one. PNG or SVG, transparent background.' },
        txt('Media credit', "Photographer or source for everything above, e.g. 'Photo: Jane Doe / WorldFish'. Required if you upload anything."),
        long('Publications & reports', 'Papers, reports, briefs or blog posts from this work. One URL per line, with a title if you have one.'),
        ...curationTail(),
    ],
};

const OUTCOMES = {
    name: 'WFD Outcomes',
    description:
        'What the work has actually changed — ONE CLAIM PER RECORD, each carrying its own provenance. The website publishes the claim together with its Evidence status, so a claim with no study behind it is published as such rather than quietly presented as proven. Replaces the old free-text "Key stat 1/2/3" fields, which produced numbers nobody could trace.',
    fields: [
        txt('Claim', 'ONE sentence: what changed, in plain language. Not a number, not an activity — a change. "National catch statistics now come from the system fishers report into" rather than "200,000 trips recorded".'),
        long('Detail', 'Two or three sentences of context behind the claim.'),
        sel('Country / region', COUNTRIES, 'Where this happened.', true),
        sel('Impact area', IMPACT, 'Which impact area this outcome belongs to. Determines where it appears on the site.', true),
        txt('Counterpart institution', 'The named institution this was done with — a ministry, a research institute, an NGO. "Various partners" is not an answer; if there is no named counterpart, this probably is not an outcome yet.'),
        txt('Since', 'Year this started, e.g. 2016. Or "Ongoing".'),
        sel('Evidence status', EVIDENCE_STATE,
            'How well evidenced this claim actually is. Answer honestly — the site publishes this label next to the claim, and "No assessment yet" is a respectable answer that readers trust more than silence.'),
        txt('Evidence label', 'How the source should be cited, e.g. "Impact assessment, 2021".'),
        url('Evidence URL', 'Link to the study, dataset or report. Leave blank if there is not one yet — that is what "No assessment yet" is for.'),
        { name: 'Supporting document', type: 'multipleAttachments', description: 'The study, report or M&E extract itself, if it is not published anywhere linkable. Attaching it here is how an internal claim becomes checkable.' },
        ...curationTail(),
    ],
};

const CONNECTIONS = {
    name: 'WFD Connections',
    description:
        'Typed links between tools — what depends on what, what feeds what. The website draws its lineage diagrams from these. Today every connection sits inside the Peskas fisheries lineage, so cross-domain links (a climate tool feeding a fisheries model, a nutrient dataset drawing on catch data) are the ones most worth adding.',
    fields: [
        txt('Label', 'A human-readable summary, e.g. "Kenya pipeline feeds into Peskas API". A reviewer can set this.'),
        sel('Relationship', ['depends on', 'feeds into', 'enables', 'pilot of'],
            'Read as: [From tool] <relationship> [To tool]. Record only DIRECT links — if A feeds B and B feeds C, do not also add A→C.'),
        long('Note', 'Anything a reader would need to understand the link.'),
        ...curationTail(),
    ],
};

/* ------------------------------------------------------------------- plumbing */

const api = async (path, init = {}) => {
    const res = await fetch(`https://api.airtable.com/v0/meta/bases/${BASE}${path}`, {
        ...init,
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
            ...(init.headers || {}),
        },
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
        const msg = body?.error?.message || JSON.stringify(body);
        if (body?.error?.type === 'INVALID_PERMISSIONS_OR_MODEL_NOT_FOUND') {
            throw new Error(
                `${msg}\n\n  Two things to check at https://airtable.com/create/tokens:\n` +
                `    1. the token lists base ${BASE} under "Access"\n` +
                '    2. the token has the schema.bases:write scope\n' +
                '  Both are needed; missing either gives this same error.'
            );
        }
        throw new Error(msg);
    }
    return body;
};

const existing = async () => (await api('/tables')).tables;

async function run() {
    let tables = await existing();
    const byName = new Map(tables.map((t) => [t.name, t]));
    console.log(`Base ${BASE} — ${tables.length} existing tables (none will be modified).\n`);

    for (const spec of [TOOLS, INITIATIVES, OUTCOMES, CONNECTIONS]) {
        if (byName.has(spec.name)) {
            console.log(`• ${spec.name} — already exists, skipping`);
            continue;
        }
        if (DRY) {
            console.log(`• ${spec.name} — would create with ${spec.fields.length} fields`);
            continue;
        }
        const created = await api('/tables', { method: 'POST', body: JSON.stringify(spec) });
        byName.set(spec.name, created);
        console.log(`✓ ${spec.name} — created (${created.fields.length} fields) ${created.id}`);
    }

    // Link fields go in afterwards: they need the target table's id, which only exists
    // once that table does. Airtable auto-creates the symmetric field on the other side,
    // so each relation is declared once.
    const links = [
        ['WFD Tools', 'Part of initiative', 'WFD Initiatives',
            'Which funded work this tool came out of. A tool usually outlives the project that paid for it.'],
        ['WFD Outcomes', 'Tool', 'WFD Tools', 'The tool this outcome is attributed to.'],
        ['WFD Outcomes', 'Initiative', 'WFD Initiatives', 'The initiative this outcome is attributed to.'],
        ['WFD Connections', 'From tool', 'WFD Tools', 'The tool the arrow starts at.'],
        ['WFD Connections', 'To tool', 'WFD Tools', 'The tool the arrow points to.'],
    ];

    for (const [tableName, fieldName, targetName, description] of links) {
        const table = byName.get(tableName);
        const target = byName.get(targetName);
        if (!table || !target) {
            console.log(`• ${tableName}.${fieldName} — table missing, skipping`);
            continue;
        }
        if ((table.fields || []).some((f) => f.name === fieldName)) {
            console.log(`• ${tableName}.${fieldName} — already exists, skipping`);
            continue;
        }
        if (DRY) {
            console.log(`• ${tableName}.${fieldName} → ${targetName} — would create`);
            continue;
        }
        await api(`/tables/${table.id}/fields`, {
            method: 'POST',
            body: JSON.stringify({
                name: fieldName,
                type: 'multipleRecordLinks',
                description,
                options: { linkedTableId: target.id },
            }),
        });
        console.log(`✓ ${tableName}.${fieldName} → ${targetName}`);
        table.fields = [...(table.fields || []), { name: fieldName }];
    }

    console.log(
        DRY
            ? '\nDry run only — nothing was created.'
            : '\nDone. Next: build the two forms in the Airtable UI — see docs/INTAKE_SCHEMA.md.'
    );
}

run().catch((e) => {
    console.error('\nFailed:', e.message);
    process.exit(1);
});
