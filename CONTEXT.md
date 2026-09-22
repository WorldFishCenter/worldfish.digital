# Domain context

Terms this codebase uses in a specific way, and the traps that cost time to discover.
For how the data gets here, see [`scripts/README.md`](scripts/README.md).

## Terms

**Portfolio** — the linked graph of everything WorldFish Digital builds and runs: products,
projects, themes, countries, donors, personas, initiatives. It lives in `content/data/*.json`
and is read through `lib/portfolio.js`. Distinct from *content*, which is page copy
(`content/pages/`), global UI data (`content/global/`), and the blog (`posts/`).

**Entity** — one record in the portfolio, of one of those seven kinds, identified by its
`slug`. The slug is the stable join key everywhere: in the JSON, in URLs, and in Airtable.

**Work area** — one of the five browse themes (small-scale-fisheries, aquaculture,
nutrition-food-systems, climate-adaptation, data-infrastructure). These drive `/our-work`,
the nav, and the footer. They are **not** the same as `thematicAreas` and `impactAreas`,
which are canonical Airtable vocabularies layered on top and rendered as plain tags. A theme
is a place you can navigate to; a thematic area is a label. See `content/data/taxonomy.json`
for the controlled vocabularies.

**Initiative** — a cross-cutting ecosystem grouping (e.g. "Peskas ecosystem") linked from
both products and projects. Supersedes the older project `programme` field, which is still
synced. Used to draw the labelled container behind related nodes in the relationship diagram.

**Relationship** — a product↔product edge only (`content/data/relationships.json`, types:
depends on / feeds into / enables / pilot of). Entity-to-entity links of every other kind are
just links, not "relationships". The relationship diagram renders the whole connected
component, not only direct neighbours.

**Engagement** — whether a country is an active deployment or a pilot/emerging geography.
Be careful: the codebase currently answers this three different ways (`productSlugs.length`
in two places, the `pipeline` flag in a third) and they disagree on three countries. If you
touch this, unify it rather than adding a fourth.

## Traps

**`project.leadProductSlugs` is not "the lead product."** The Airtable field is named "Lead
product", but it is a plain symmetric link — the same relation as `product.projectSlugs` seen
from the other side, not a lead/primary distinction. Every linked-record field in the base is
symmetric, so the two sides can never diverge and there is no need to union them. Callers of
`lib/portfolio.js` just see `project.products`.

**Reverse arrays are derived, never authored.** Only products, projects and personas carry
real link data. Everything on themes, countries, donors and initiatives
(`theme.productSlugs`, `country.projectSlugs`, `donor.projectSlugs`, …) is computed by
`scripts/sync-airtable.js` from the other side. Read the stored array — do not scan the far
collection to rebuild it. Note the stored order is *discovery* order and therefore
incidental, which is why `lib/portfolio-resolve.mjs` declares an explicit `order` per
relation.

**Adding an Airtable field is a two-step, and only one step is in this repo's control.**

- A new **link relation** → add one line to `LINKS` in `lib/portfolio-resolve.mjs`. Nothing
  else changes.
- A new **scalar field** → add one line to the field map in `scripts/sync-airtable.js`, then
  it is free everywhere: a resolved entity spreads its raw record, so the field appears
  without any change to the resolver.

The sync's field map is deliberately explicit rather than pass-through, so a renamed or
mistyped Airtable column fails loudly instead of silently becoming `undefined` on every
record.

## Reading the portfolio

`lib/portfolio.js` exposes four resolvers — `getProduct`, `getProject`, `getCountry`,
`getTheme` — each returning the entity's own record plus its neighbours already resolved, so
a route page never walks a slug array itself. A missing slug returns `null`. Plus the plain
collection accessors (`getProducts`, `getThemes`, …) for index pages.

The resolution logic is in `lib/portfolio-resolve.mjs`, which is pure and takes its data as
an argument. That is the test seam: the app binds it to the committed JSON, and
`test/portfolio.test.mjs` binds it to fixtures. Run with `npm test`.

## Linking to a page

`lib/routes.mjs` builds every entity URL — `productHref`, `projectHref`, `countryHref`,
`themeHref`, `postHref`. Use them instead of interpolating a path, so a route can be renamed
in one edit.

The reason it is a module and not a convention is `portfolioRoutes()`, which enumerates the
four index pages plus every entity detail page. `app/sitemap.js` is built on it, so a new
product, project, country or work area appears in the sitemap as soon as it is in the data —
no second list to update.

Watch for one mismatch: a **work area** is a `theme` entity, but its route is `/our-work`.
`PORTFOLIO_PATHS` is the only place that knows this, and a test asserts each path still has
a real directory with a dynamic segment under `app/`.
