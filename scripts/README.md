# Content data: Airtable → site

The site's portfolio data (themes, projects, products, countries, donors, personas,
team, partners, relationships) lives in **Airtable** and is synced down into
`content/data/*.json`, which is what the site actually builds from.

**Airtable is the source of truth. Do not hand-edit `content/data/*.json`** — your
changes will be overwritten on the next sync. Edit in Airtable, then run the sync.

- **Base:** `Products` (`appwOB0tczOVKXuQL`)
- **Sync script:** [`sync-airtable.js`](./sync-airtable.js)
- **Validator:** [`validate-content.js`](./validate-content.js)

---

## Everyday workflow

```
edit in Airtable  →  npm run sync  →  review git diff + commit  →  push (Vercel builds)
```

This is the "committed snapshot" model: the JSON is versioned in git, builds are fast
and offline-safe, and every content change shows up as a reviewable diff.

```bash
AIRTABLE_TOKEN=pat_xxx npm run sync   # regenerate content/data/*.json from Airtable
git diff content/data/                # review what changed
npm run validate                      # optional; also runs automatically before build
git add content/data/ && git commit   # commit the snapshot
```

---

## One-time setup: Airtable Personal Access Token

The sync needs a token (the Claude/MCP connection can't be used by the CLI or CI).

1. Go to **https://airtable.com/create/tokens** → **Create new token**
2. Name: `worldfish.digital sync`
3. **Scopes:** `data.records:read`, `schema.bases:read`
4. **Access:** add the **Products** base
5. Create and copy the `pat…` token (shown only once)

You can provide the token three ways (any one works):

- **Inline:** `AIRTABLE_TOKEN=pat_xxx npm run sync` — stored nowhere.
- **`.env` file** (recommended if you'll sync often): create `.env` in the repo root with
  `AIRTABLE_TOKEN=pat_xxx`, then just run `npm run sync`. The script auto-loads `.env`,
  and `.env` is already git-ignored. **Never commit the token.**
- **Shell export:** `export AIRTABLE_TOKEN=pat_xxx` for the current terminal session.

| Env var | Required | Default |
|---|---|---|
| `AIRTABLE_TOKEN` | yes, to sync | — (if unset, `sync` no-ops so builds use committed JSON) |
| `AIRTABLE_BASE_ID` | no | `appwOB0tczOVKXuQL` |

---

## npm scripts

| Command | Does |
|---|---|
| `npm run sync` | Pull Airtable → write `content/data/*.json`. No-ops (exit 0) if `AIRTABLE_TOKEN` is unset. |
| `npm run validate` | Referential integrity + taxonomy conformance check. Fails non-zero on any problem. |
| `npm run build` | Runs `prebuild` (`validate` → `sass:build`) then the Next.js build. The validator is a gate: bad data fails the build instead of shipping. |

`sync` is intentionally **not** part of `prebuild`, so Vercel builds from the committed
JSON (no token needed in CI). To publish Airtable edits, run `sync` and commit.

---

## What the tables map to

| Airtable table | File | Notes |
|---|---|---|
| Themes | `themes.json` | 5 work areas; drives `/our-work`, nav, footer |
| PRODUCTS | `products.json` | `Slug` = URL id; `Type`/`Status` are the dropdowns |
| Projects | `projects.json` | `Programme`, `Archived`, `Background note`, links |
| Countries | `countries.json` | `CTA label`/`CTA href` = the country-page button |
| Donors | `donors.json` | funders (linked from Projects) |
| Partners | `partners.json` | implementing/research orgs — **distinct from donors** |
| Personas | `personas.json` | audiences |
| Team | `team.json` | people |
| Relationships | `relationships.json` | the product↔product graph (`From → type → To`) |

**Not synced** (stay in the repo): `taxonomy.json`, `content/pages/*`, blog posts, and
the **Project Intake** table (that's the curation funnel, not published data).

### Editing tips
- **Slug** is the page's permanent URL id. Set it once; changing it changes the URL.
  Every record needs one — the sync fails loudly if any are missing.
- **Relationships:** edit the *Relationships* table (that's where the connection type
  lives), not the mirror columns on PRODUCTS.
- **Product types / statuses / taxonomy:** edit the dropdown options on the field
  (column header → *Edit field*). New taxonomy values must also be added to
  `content/data/taxonomy.json`, or `validate` will reject them.

### Content kept in the repo, merged back by slug
The sync preserves these (they aren't modelled in Airtable):
- `products[].rich` — the Peskas microsite block
- `themes[].featuredProductSlugs`
- `team[].bio`, `team[].initials`

---

## Troubleshooting

- **`sync` says "skipping"** — `AIRTABLE_TOKEN` isn't set.
- **`sync` fails with a slug error** — a record in Airtable has no `Slug`; add one.
- **`validate` fails after a sync** — usually a taxonomy value used in Airtable that
  isn't in `taxonomy.json`, or a broken link. The message names the record and field.
- **Build fails in `prebuild`** — run `npm run validate` locally to see the same error.
