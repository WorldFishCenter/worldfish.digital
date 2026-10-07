# Content data: Airtable → site

The portfolio — tools, initiatives, outcomes and the connections between tools — lives in
the **Airtable intake base** and is synced down into `content/data/`, which is what the site
builds from.

- **Base:** `appjLGt1IWscYAV3i` (the intake base — not the old `Products` base)
- **Sync:** [`sync-airtable.js`](./sync-airtable.js) · **Validator:** [`validate-content.js`](./validate-content.js) (its rules: `lib/snapshot-check.mjs`)
- **Schema, as code:** [`create-intake-schema.mjs`](./create-intake-schema.mjs) · rationale in `docs/INTAKE_SCHEMA.md`

## The one rule

**Only records with `Publication state = Live` reach the site.** That applies to all four
tables. Under review, Needs more info and Archived never leave Airtable. If nothing is Live,
the site is empty — every index page says so — and that is correct, not a bug.

A link only counts when both ends are Live: a tool's initiative, an outcome's tool, a
connection's two tools. The sync lists the connections it left out for that reason.

## Everyday workflow

```
mark records Live in Airtable  →  npm run sync  →  review git diff  →  commit  →  push
```

```bash
npm run sync              # pull Live records, download their attachments
git status                # content/data/*.json and public/assets/portfolio/
npm run validate          # also runs automatically before every build
```

`sync` is deliberately **not** part of the build: Vercel builds from the committed snapshot
and needs no token. To publish an Airtable change, run `sync` and commit what it wrote.

## What the sync writes, and what it only reads

| File | Source | Edit where? |
|---|---|---|
| `products.json` | WFD Tools | Airtable |
| `projects.json` | WFD Initiatives | Airtable |
| `outcomes.json` | WFD Outcomes | Airtable |
| `relationships.json` | WFD Connections | Airtable |
| `public/assets/portfolio/` | every attachment on the above | Airtable |
| `themes.json` | the impact areas (+ one cross-cutting entry) | **here, by hand** |
| `countries.json` | country names, flags, descriptions | **here, by hand** |
| `taxonomy.json` | the select-option vocabularies | **here, by hand** |
| `team.json` | the team page | **here, by hand** |

The four generated files and the assets folder are rewritten whole on every run — never
hand-edit them. The sync never writes the hand-maintained ones.

In code a tool is a `product` and an initiative is a `project` (the routes are `/products`
and `/projects`); the UI says Tool and Initiative.

### How select values become pages

- **Impact area(s)** → matched by name against `themes.json`. A tool or initiative with
  *no* impact area is filed under the entry marked `crossCutting` (Shared Infrastructure).
- **Country / region** → matched by name against `countries.json`. `Other` is ignored.
  A country only gets a page while something Live is tagged to it.
- A value the sync does not recognise **fails the run by name** — add the area or country
  to the reference file first. Nothing is silently dropped.

### Attachments

Airtable attachment URLs expire within hours, so the sync **downloads** every file and writes
a local path. Names are deterministic (`tools/<slug>-hero.jpg`, `-shot-1.jpg`, `-logo.png`,
`-demo.mp4`), so a re-sync overwrites instead of accumulating; the folder is replaced whole,
so a removed attachment disappears too.

- Images are re-encoded: max 2400px wide, JPEG. Logos stay PNG (transparency), max 800px.
  SVGs are rasterised.
- Demo videos are compressed to a silent 720p MP4. This needs **`ffmpeg`** on the machine
  running the sync; without it the video is skipped with a warning.
- Supporting documents on outcomes are copied as they are (`.pdf .docx .xlsx .csv` only).
- **Media credit** is written beside every image and printed under it on the page. The sync
  warns when a record has images and no credit.

## One-time setup: the token

1. **https://airtable.com/create/tokens** → create or edit a token
2. **Scopes:** `data.records:read`, `schema.bases:read` (the sync never writes to Airtable)
3. **Access:** add the intake base
4. Put it in `.env` in the repo root as `AIRTABLE_TOKEN=pat…`. `.env` is git-ignored.

| Env var | Required | Default |
|---|---|---|
| `AIRTABLE_TOKEN` | yes, to sync | — (if unset, `sync` no-ops) |
| `AIRTABLE_BASE_ID` | no | `appjLGt1IWscYAV3i` |

A token only sees the bases listed under its **Access** — owning a base is not enough.

## Changing the schema

Every column the sync reads is named once, in `FIELDS` at the top of `sync-airtable.js`.
Before reading any record the sync checks each name against the base and **fails naming the
missing column** — so a rename in Airtable cannot silently empty a field on the site.

- **Renamed a column** → change its name in `FIELDS`.
- **New column** → add a line to `FIELDS`, a line in `transform()`, and render it.
- **New select option** → add it to `taxonomy.json` (or `themes.json` / `countries.json`)
  first. The sync runs the build's checks on what it is about to write, and stops with
  nothing written if a value is not listed.
- **New relationship type** → also give it a direction in `FORWARD` in `lib/relationships.mjs`.

## Troubleshooting

- **"I marked it Live and it is not on the site"** — every run starts by printing how many
  records are in each publication state, per table. Each table has its own state: making an
  initiative Live does not publish its tools, and a connection only appears once the tool at
  both of its ends is Live.
- **"Nothing is marked Live yet"** — expected until records are flipped in Airtable.
- **403 / 404 from Airtable** — the token does not list the base under Access, or lacks a scope.
- **"no field named …"** — a column was renamed or removed; update `FIELDS`.
- **"country … is not in content/data/countries.json"** — add the country there.
- **"is Live with no Evidence status"** — every published outcome must say how well it is
  evidenced; set the status or take the record out of Live.
- **"The snapshot would fail `npm run validate`"** — the sync found a problem the build
  would reject, listed by record. Nothing was written; fix the record or the vocabulary
  and re-run.
- **`validate` says a media file is missing** — the JSON was committed without
  `public/assets/portfolio/`; re-run `sync` and commit both.
