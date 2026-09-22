<!--
  Changelog for worldfish.digital.
  Keep entries short, plain-language, and focused on what changed for visitors,
  not how it was built.

  How versioning works here:
    • package.json `version` is the single source of truth (semantic versioning).
    • Bump it with `npm run version:patch | version:minor | version:major`.
    • Add a matching `# worldfish.digital X.Y.Z` block at the top of this file.
    • On merge to `main`, .github/workflows/release.yaml reads the version from
      package.json, pulls the notes below it, and publishes a GitHub Release
      (tag `vX.Y.Z`). It skips cleanly if that release already exists.

  Bullet prefixes: **NEW** (new capability) · **IMPROVEMENT** (better than before)
  · **FIX** (something that was broken now works).
-->

# worldfish.digital 7.0.1

* **FIX** The whole portfolio is now discoverable by search engines. Every project, product, country, and work-area page was missing from the sitemap; all of them are now listed, and anything published from now on is added automatically.

# worldfish.digital 7.0.0

* **NEW** A connected portfolio. The site now presents WorldFish's digital work as one linked collection — projects, products, themes, countries, donors, and teams — instead of a set of standalone pages. Everything is cross-referenced, so from any project you can jump to the products it uses, the countries it runs in, and the themes it belongs to.
* **NEW** Detail pages for every entity. Themes, projects, products, and countries each have their own page with a clear fact sheet summarising the essentials at a glance, plus links out to everything related.
* **NEW** Relationship diagrams. Product pages show how tools connect to one another — what feeds into what, what depends on what — as an end-to-end flow diagram rather than a wall of cards, so the bigger picture is easy to follow.
* **NEW** Browse by theme, country, or product. New index pages let visitors explore the whole portfolio along the dimension that matters to them, with filters and clear grouping.
* **NEW** Peskas as a product, in context. Peskas is presented as one product within the wider WorldFish portfolio, with its own microsite section, alongside the other tools and initiatives.
* **IMPROVEMENT** Cleaner, more readable layouts. Dense card grids were replaced with editorial lists and indexes across the site, making long lists of projects and products faster to scan.
* **IMPROVEMENT** Consistent branding. Header, footer, and sidebar were simplified to a unified text-based brand mark for a cleaner, more coherent look across the site.
* **IMPROVEMENT** Two news channels. Updates are split between general WorldFish Digital news and Peskas-specific product news, so readers can follow just what they care about.
