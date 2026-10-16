#!/usr/bin/env node
/**
 * Creates the four worldfish.digital intake tables in the Airtable intake base
 * (appjLGt1IWscYAV3i by default — the purpose-made base, not the live Products base).
 *
 *   WFD Products & Services        — the digital things, one record each
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
 *   node scripts/create-intake-schema.mjs                # create
 *   node scripts/create-intake-schema.mjs --descriptions # push this file's help text onto
 *                                                        # the live fields, matched by name
 *   node scripts/create-intake-schema.mjs --dry-run      # print the plan only
 *   node scripts/create-intake-schema.mjs --base=appX    # target a different base
 */

import { readFileSync } from 'node:fs';

// The new, purpose-made intake base. Override with --base=appXXXX or AIRTABLE_BASE_ID.
const DEFAULT_BASE = 'appjLGt1IWscYAV3i';
const baseArg = process.argv.find((a) => a.startsWith('--base='));
const BASE = baseArg ? baseArg.slice('--base='.length) : process.env.AIRTABLE_BASE_ID || DEFAULT_BASE;
const DRY = process.argv.includes('--dry-run');
const DESCRIPTIONS_ONLY = process.argv.includes('--descriptions');

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
// 'Shared infrastructure' is an explicit choice, not an inference from a blank cell. The
// name must match the `crossCutting` entry in content/data/themes.json exactly — that is
// what maps it to an area slug. A blank still falls back to it, and the build warns when
// a record relies on that fallback.
const IMPACT = ['Sustainable Fisheries', 'Productive Aquaculture', 'Nutrition Security',
    'Climate Adaptation', 'Resilient Livelihoods', 'Better Governance',
    'Shared Infrastructure'];
const THEMATIC = ['Climate', 'Fisheries', 'Aquaculture', 'Livestock', 'Nutrition',
    'Biosciences & Genetics', 'Gender & Social Inclusion', 'Policy', 'Digital & AI', 'Other'];
const TOOL_TYPES = ['Platform', 'Application', 'Dashboard', 'API', 'Data Pipeline', 'Model',
    'Algorithm', 'Module', 'Data Product', 'Other'];
const TOOL_STATUS = ['Prototype', 'Being piloted', 'Available for use', 'Retired'];
const PROJECT_STATUS = ['Planned', 'Active', 'Completed', 'Cancelled'];
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
        'Set by the Digital Team, not by whoever submitted the record. The site only pulls records marked Live, so this is the gate between a form submission and a public page.'),
    long('Internal notes (reviewers)', 'Curation notes. Never published.'),
    { name: 'Assigned reviewer', type: 'singleCollaborator', description: 'Who is curating this record.' },
    { name: 'Submitted by', type: 'createdBy' },
    { name: 'Submitted at', type: 'createdTime' },
    { name: 'Last updated', type: 'lastModifiedTime' },
];

/* ----------------------------------------------------------------- the tables */

const TOOLS = {
    name: 'WFD Products & Services',
    description:
        'One record for each digital thing WorldFish builds or runs: a platform, an application, a dashboard, an API, a data pipeline, a model or a published dataset. Each record becomes one page on worldfish.digital, so what you write here is what colleagues and partners read. Only records marked Publication state = Live appear on the site.',
    fields: [
        txt('Name', 'What people call it in conversation. This becomes the page title, so write it the way you would say it rather than as a formal project title.'),
        txt('Slug', 'Lowercase, hyphenated, no spaces, for example catch-monitoring-app. It becomes the web address and the key that links this record to everything else. Leave it blank if you are unsure and a reviewer will fill it in.'),
        txt('What it is', 'One plain sentence that someone outside your team would understand: what it does and who uses it. Leave out the technology it is built with. This line sits under the name in every list on the site, so it is the one worth spending a minute on.'),
        long('Full description', 'The full explanation, as long as it needs to be. Readers arrive knowing nothing about your work, so cover the problem it addresses, how it works in practice, what it produces and who it is for. If something else in the portfolio has a similar name or does a similar job, say how this one differs. There is no length limit here. A few paragraphs is normal.'),
        sel('Type', TOOL_TYPES, 'What kind of thing it is. Pick the closest match. It is how the site groups entries within a list.'),
        sel('Status', TOOL_STATUS, 'How far it has got. Prototype: built and working, but not yet used outside the team (readiness 0 to 4). Being piloted: in real use with partners while it is still being proven (5 to 6). Available for use: another team could pick it up today (7 to 9). Retired: no longer maintained, which is worth saying rather than leaving it looking current. Keep this in step with Innovation readiness level. The site flags records where the two disagree.'),
        sel('Impact area(s)', IMPACT, 'The CGIAR impact areas this contributes to. It decides where the record turns up when someone browses the site. If it underpins all of them rather than belonging to one, choose Shared Infrastructure. Leaving it blank is not the same thing.', true),
        sel('Thematic area(s)', THEMATIC, 'The subject areas it touches. Pick as many as apply.', true),
        sel('Country / region', COUNTRIES, 'Everywhere it actually runs or has run. Choose Global if it is not tied to particular countries.', true),
        sel('Who uses it', AUDIENCE, 'The people who open it or use what it produces, rather than everyone who benefits further down the line.', true),
        sel('Innovation readiness level', IRL, 'The CGIAR readiness scale, 0 to 9. It is the same scale PRMS innovation reporting uses, so filling it in here saves doing it again there. A modest answer is more useful to a reader than a flattering one.'),
        sel('SDG alignment', SDG, 'Only the ones it genuinely contributes to.', true),
        txt('Product lead', 'Who to ask about it. A name is enough. This does not have to be a developer: for a dataset or a service it is often the scientist who leads the work.'),
        { name: 'Contact email', type: 'email', description: 'Where someone who wants to use this or build on it should write. A shared team address is fine.' },
        url('Live URL', 'Where the working version lives, if it is open to the public.'),
        url('Code repository', 'GitHub or equivalent. If the code is public, this is the most useful single link you can give us.'),
        url('Documentation URL', 'Anything that would let someone who has never seen it set it up and run it. A README counts.'),
        { name: 'Open source', type: 'checkbox', description: 'Tick if the code is published under an open licence such as MIT, GPL or Apache.', options: { icon: 'check', color: 'greenBright' } },
        txt('Code licence', 'For example MIT, GPL-3.0 or Apache-2.0. Leave blank if the code is not open.'),
        sel('Data availability', ['Open / Public', 'Restricted — on request', 'Internal only', 'Not applicable'],
            'Who can get to the data behind it. Data owned by a partner institution is usually restricted, and saying so is better than leaving a reader to guess.'),
        long('How it can be reused', 'In your own words: which part of this could another team pick up for a different country, species or sector, and what would they have to change to make it work? Write as much as it takes. This answer is the reason the site lists what already exists instead of leaving every team to build its own.'),
        long('Known limitations', 'What it does not do, or does not do well yet. Saying so here saves someone finding out the hard way.'),
        { name: 'Screenshots / media', type: 'multipleAttachments', description: 'Screens, maps or charts that show what it looks like in use. Send the highest resolution you have, because the site makes them smaller but cannot make them bigger. Several pictures beat one.' },
        { name: 'Hero image', type: 'multipleAttachments', description: 'One wide landscape image that stands for this work, either a photo from the field or a striking screen. It is used large, so at least 2000px across. The site crops it to roughly 3:2 on cards and 2.3:1 as a page banner, so keep the subject away from the top and bottom edges.' },
        { name: 'Logo', type: 'multipleAttachments', description: 'If it has its own mark. PNG or SVG with a transparent background.' },
        { name: 'Demo video / screen recording', type: 'multipleAttachments', description: 'A short silent clip of it being used. Ten to twenty seconds is plenty. A raw screen recording is fine and we compress it, so ignore the file size, but do trim it to the part worth watching.' },
        txt('Media credit', "Who took the photo, or where it came from, for example 'Photo: Jane Doe / WorldFish'. Fill this in whenever you attach anything. The credit has to travel with the picture, because nobody can work it out again later, and the build flags any image published without one."),
        long('Publications & reports', 'Papers, reports or posts about this work. One link per line, with a title if you have one. They become the evidence trail on the page.'),
        url('Dataset / DOI', 'A permanent link to the data behind it, such as a DOI, a Dataverse record or a Zenodo deposit. A folder on a shared drive will not stay reachable.'),
        ...curationTail(),
    ],
};

const INITIATIVES = {
    name: 'WFD Initiatives',
    description:
        'One record for each project or programme that produces digital work. A record here is the work itself: who funds it, where it runs, who to ask. The products and services it builds are registered separately and linked back to it. Only records marked Publication state = Live appear on the site.',
    fields: [
        txt('Name', 'The short name people use in conversation, usually the acronym. It becomes the page title.'),
        txt('Slug', 'Lowercase, hyphenated, no spaces. It becomes the web address and the key that links this record to everything else. Leave it blank if you are unsure and a reviewer will fill it in.'),
        txt('Full title', 'The title written out in full, as it appears in the grant or the contract.'),
        txt('What it is', 'One plain sentence: what this project is trying to change, and where. It sits under the name wherever the project is listed.'),
        long('Description', 'The full explanation, as long as it needs to be. What problem the project works on, how it goes about it, who it works with, and what the digital side of it is for. There is no length limit, and the reader to write for is someone who has never heard of the project.'),
        sel('Status', PROJECT_STATUS, 'Where the work stands. Planned: funded but not started. Active: running now. Completed: finished. Cancelled: stopped before it finished.'),
        sel('Impact area(s)', IMPACT, 'The CGIAR impact areas this project contributes to. It decides where it turns up when someone browses the site.', true),
        sel('Thematic area(s)', THEMATIC, 'The subject areas it covers. Pick as many as apply.', true),
        sel('Country / region', COUNTRIES, 'Where the work actually happens. Choose Global if it is not tied to particular countries.', true),
        { name: 'Start date', type: 'date', description: 'When the work started.', options: { dateFormat: { name: 'iso' } } },
        { name: 'End date', type: 'date', description: 'When it ends, or ended. Leave blank if it is still running.', options: { dateFormat: { name: 'iso' } } },
        txt('Initiative lead', 'Who leads the work. A name is enough.'),
        { name: 'Contact email', type: 'email', description: 'Where to write with questions about the project. A shared team address is fine.' },
        long('Funder(s)', 'One per line, written the way the funder writes its own name.'),
        long('Partner organizations', 'One per line. The institutions you actually work with, rather than everyone on the distribution list.'),
        sel('SDG alignment', SDG, 'Only the ones it genuinely contributes to.', true),
        url('Project page / website', 'If the project has its own site or page elsewhere, link it here. The site links out to it rather than repeating what it already says.'),
        { name: 'Hero image', type: 'multipleAttachments', description: 'One wide landscape image that stands for this project, ideally people, a place or work under way rather than a meeting room. At least 2000px across. The site crops it to about 3:2, so keep the subject away from the top and bottom edges.' },
        { name: 'Screenshots / media', type: 'multipleAttachments', description: 'Field photos, maps, event pictures. Several beat one, and the highest resolution you have is the right one to send.' },
        { name: 'Logo', type: 'multipleAttachments', description: 'The project mark, if it has one. PNG or SVG with a transparent background.' },
        txt('Media credit', "Who took the photo, or where it came from, for example 'Photo: Jane Doe / WorldFish'. Fill this in whenever you attach anything. The credit has to travel with the picture, because nobody can work it out again later, and the build flags any image published without one."),
        long('Publications & reports', 'Papers, reports, briefs or posts from this work. One link per line, with a title if you have one.'),
        ...curationTail(),
    ],
};

const OUTCOMES = {
    name: 'WFD Outcomes',
    description:
        'What the work has actually changed, one claim per record, each carrying its own provenance. The site prints the claim next to its Evidence status, so a claim with no study behind it is published as exactly that rather than passed off as proven.',
    fields: [
        txt('Claim', 'One sentence in plain language saying what changed. A change, not an activity and not a number: "the national statistics office now publishes from this system" rather than "200,000 records collected".'),
        long('Detail', 'The context behind the claim: what changed, for whom, and how you know. As long as it needs to be.'),
        sel('Country / region', COUNTRIES, 'Where this happened.', true),
        sel('Impact area', IMPACT, 'The impact area this outcome belongs to. It decides where it appears on the site.', true),
        txt('Counterpart institution', 'The named institution this was done with: a ministry, a research institute, an NGO. "Various partners" is not an answer. If there is no institution to name, this is probably not an outcome yet.'),
        txt('Since', 'The year it started, for example 2016, or "Ongoing".'),
        sel('Evidence status', EVIDENCE_STATE,
            'How well evidenced the claim really is. The site prints this label beside the claim, and "No assessment yet" is a respectable answer that readers trust more than silence.'),
        txt('Evidence label', 'How the source should be cited, for example "Impact assessment, 2021".'),
        url('Evidence URL', 'A link to the study, dataset or report. Leave it blank if there is not one yet. That is what "No assessment yet" is for.'),
        { name: 'Supporting document', type: 'multipleAttachments', description: 'The study, report or monitoring extract itself, when it is not published anywhere you can link to. Attaching it here is what turns an internal claim into a checkable one.' },
        ...curationTail(),
    ],
};

const CONNECTIONS = {
    name: 'WFD Connections',
    description:
        'Typed links between products and services: what depends on what, what feeds what. The site draws its lineage diagrams from these. The links worth hunting for are the ones that cross impact areas, because a component built in one domain and reused in another is the thing nobody thinks to mention.',
    fields: [
        txt('Label', 'A readable summary of the link, for example "the national pipeline feeds into the public dashboard". A reviewer can set this.'),
        sel('Relationship', ['depends on', 'feeds into', 'enables', 'pilot of'],
            'Read it as: [From] <relationship> [To]. Record direct links only. If A feeds B and B feeds C, do not also add A to C.'),
        long('Note', 'Anything a reader would need in order to understand the link.'),
        ...curationTail(),
    ],
};

/* Link fields are added after the tables: they need the target table's id, which only
   exists once that table does. Airtable auto-creates the symmetric field on the other side,
   so each relation is declared once. */
const LINKS = [
    ['WFD Products & Services', 'Part of initiative', 'WFD Initiatives',
        'The project or programme this came out of. If it is not in the list yet, register that first with the initiative form. Pick more than one where several projects paid for it, and leave it blank if none did.'],
    ['WFD Outcomes', 'Product or service', 'WFD Products & Services', 'The product or service this outcome is attributed to.'],
    ['WFD Outcomes', 'Initiative', 'WFD Initiatives', 'The project this outcome is attributed to.'],
    ['WFD Connections', 'From', 'WFD Products & Services', 'The product or service the arrow starts at.'],
    ['WFD Connections', 'To', 'WFD Products & Services', 'The product or service the arrow points to.'],
];

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

/**
 * Push the help text in this file onto the live fields, matched by name.
 *
 * A field's description is what a submitter reads under the question on the form, so this
 * file is where that wording is edited and this is how it gets there. Descriptions only:
 * nothing is created, renamed or deleted. A live field this file does not know about is
 * reported rather than touched, which is how a leftover column surfaces.
 */
async function syncDescriptions() {
    const tables = await existing();
    let changed = 0;

    for (const spec of [TOOLS, INITIATIVES, OUTCOMES, CONNECTIONS]) {
        const table = tables.find((t) => t.name === spec.name);
        if (!table) {
            console.log(`\u2022 ${spec.name} \u2014 not in this base, skipping`);
            continue;
        }
        const wanted = new Map(spec.fields.map((f) => [f.name, f.description]));
        for (const [tableName, fieldName, , description] of LINKS) {
            if (tableName === spec.name) wanted.set(fieldName, description);
        }

        for (const field of table.fields) {
            if (!wanted.has(field.name)) {
                // Reverse link fields are Airtable's own and belong here. Anything else is
                // a column this file has forgotten about, or one that should be deleted.
                console.log(`? ${spec.name}.${field.name} \u2014 not in this file`);
                continue;
            }
            const description = wanted.get(field.name);
            if (!description || field.description === description) continue;
            if (DRY) {
                console.log(`\u2022 ${spec.name}.${field.name} \u2014 would update`);
                continue;
            }
            await api(`/tables/${table.id}/fields/${field.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ description }),
            });
            console.log(`\u2713 ${spec.name}.${field.name}`);
            changed++;
        }

        const live = new Set(table.fields.map((f) => f.name));
        for (const name of wanted.keys()) {
            if (!live.has(name)) {
                console.log(`! ${spec.name}.${name} \u2014 missing from the base`);
            }
        }
    }

    console.log(DRY ? '\nDry run only \u2014 nothing was changed.' : `\nDone. ${changed} updated.`);
}

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

    for (const [tableName, fieldName, targetName, description] of LINKS) {
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

(DESCRIPTIONS_ONLY ? syncDescriptions() : run()).catch((e) => {
    console.error('\nFailed:', e.message);
    process.exit(1);
});
