# Domain context

Terms this codebase uses in a specific way, and the traps that cost time to discover.
For how the data gets here, see [`scripts/README.md`](scripts/README.md).

## Terms

**Portfolio** — the linked graph of what WorldFish Digital builds and runs: tools,
initiatives, outcomes, impact areas and countries. It lives in `content/data/*.json` and is
read through `lib/portfolio.js`. Distinct from *content*, which is page copy
(`content/pages/`), global UI data (`content/global/`), and the blog (`posts/`).

**Live** — `Publication state = Live` in Airtable. The only records the sync pulls. The
site shows nothing else, so an intake base with nothing Live is an empty site, by design.

**Tool** — one record in the `WFD Tools` table: a platform, pipeline, dashboard, model or
data product. Called a **product** in code and URLs (`products.json`, `getProduct`,
`/products/[slug]`).

**Initiative** — one record in `WFD Initiatives`: the funded body of work that pays for and
contains tools. Called a **project** in code and URLs (`projects.json`, `getProject`,
`/projects/[slug]`). Every initiative renders through the same template — Peskas included;
its own site is peskas.org.

**Outcome** — one evidenced claim from `WFD Outcomes`, with a counterpart institution and an
**evidence status**. The status is printed beside the claim wherever it appears; that label
is the guard against unevidenced claims, so it is never optional and never hidden.

**Impact area** — one of the six canonical areas, plus the cross-cutting *Shared
Infrastructure* entry. The site's browse axis: `/our-work`, the nav, the footer. A `theme`
in code. Listed by hand in `content/data/themes.json`; a tool or initiative with no impact
area belongs to the cross-cutting one.

**Relationship** — a tool↔tool edge from `WFD Connections` (depends on / feeds into /
enables / pilot of). The relationship diagram renders the whole connected component, not
only direct neighbours, and groups nodes by the initiative they sit in. Everything that
walks these edges is in `lib/relationships.mjs`: which way a type runs, the connected
component, the diagram's columns, the path that lights up, and shortcut detection.

**Entity** — a tool, initiative, impact area or country, identified by its `slug`. The slug
is the stable join key everywhere: in the JSON, in URLs, and in Airtable.

## Traps

**Generated vs hand-maintained.** `products.json`, `projects.json`, `outcomes.json`,
`relationships.json` and `public/assets/portfolio/` are rewritten whole by every sync —
never edit them. `themes.json`, `countries.json`, `taxonomy.json` and `team.json` are
hand-maintained and the sync only reads them.

**Reverse links are derived, never stored.** The JSON holds only forward links: a tool's
areas, countries and initiatives; an initiative's areas and countries; an outcome's tools,
initiatives, areas and countries. Everything on an impact area or a country, and an
initiative's list of tools, is computed by `buildPortfolio` in `lib/portfolio-resolve.mjs`.
There is no second copy to drift.

**A country exists only while something Live is tagged to it.** `countries.json` lists
more countries than the site shows. `getCountries()` returns the ones with a Live tool,
initiative or outcome; the rest have no page and no route. There is no "active vs pilot"
distinction any more — nothing in the data says which is which.

**Entity pages are exactly the snapshot.** The four `[slug]` routes set
`dynamicParams = false`, so a slug that is not in the committed JSON is a real 404. A record
taken out of Live loses its page on the next sync.

**Adding an Airtable field is a two-step.**

- A new **scalar field** → one line in `FIELDS` and one in `transform()`, both in
  `scripts/sync-airtable.js`. It then appears on the resolved entity with no change to the
  resolver, which spreads the raw record.
- A new **link relation** → also a line in `LINKS` in `lib/portfolio-resolve.mjs`. The
  snapshot check reads `LINKS`, so the relation is validated with no further edit.
- A new **select option** → add it to `taxonomy.json` first. The sync runs the snapshot
  check on what it is about to write and stops, with nothing written, on a value that is
  not listed.
- A new **relationship type** → also a line in `FORWARD` in `lib/relationships.mjs`. The
  snapshot check rejects a type with no direction rather than draw it backwards.

`FIELDS` is deliberately explicit rather than pass-through, and every name in it is checked
against the base before a record is read — so a renamed column fails the sync by name
instead of silently becoming `undefined` on every record.

## Reading the portfolio

`lib/portfolio.js` exposes four resolvers — `getProduct`, `getProject`, `getCountry`,
`getTheme` — each returning the entity's own record plus its neighbours and its `outcomes`
already resolved, so a route page never walks a slug array itself. A missing slug returns
`null`. Plus the collection accessors (`getProducts`, `getThemes`, `getOutcomes`, …) for
index pages.

Resolution goes one hop further than the entity. Each neighbour carries neighbours of its
own (a tool listed on an initiative's page has its `countries`), each outcome carries its
`countries`, and the collection accessors return records in that same linked shape. So
nothing outside the resolver turns a slug into a name. The cost: a linked record holds
whole neighbour records, so hand a client component only the fields it uses, as
`app/products/page.js` does for the catalogue.

The resolution logic is in `lib/portfolio-resolve.mjs`, which is pure and takes its data as
an argument. That is the test seam: the app binds it to the committed JSON, and
`test/portfolio.test.mjs` binds it to fixtures. The sync's record-to-JSON step is pure too
(`transform` in `scripts/sync-airtable.js`, pinned by `test/sync.test.mjs`); the attachment
pipeline is exercised on real bytes by `test/sync-media.test.mjs`. Run with `npm test`.

Two more pure modules sit on the same seam. `lib/relationships.mjs` is pinned by
`test/relationships.test.mjs`. `lib/snapshot-check.mjs` decides whether a snapshot is
publishable (references, vocabularies, evidence status, media files); the sync calls it
before it writes, `scripts/validate-content.js` calls it on the committed JSON at build,
and `test/snapshot-check.test.mjs` calls it on fixtures.

## Linking to a page

`lib/routes.mjs` builds every entity URL — `productHref`, `projectHref`, `countryHref`,
`themeHref`, `postHref`. Use them instead of interpolating a path, so a route can be renamed
in one edit.

The reason it is a module and not a convention is `portfolioRoutes()`, which enumerates the
four index pages plus every entity detail page. `app/sitemap.js` is built on it, so a tool,
initiative or country appears in the sitemap as soon as it is in the data — no second list
to update. The homepage uses the same list to keep a featured card from linking to an
entity that is not Live.

Watch for one mismatch: an **impact area** is a `theme` entity, but its route is
`/our-work`. `PORTFOLIO_PATHS` is the only place that knows this, and a test asserts each
path still has a real directory with a dynamic segment under `app/`.
