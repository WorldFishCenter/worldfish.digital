# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start Next.js dev server (http://localhost:3000)
npm run sass         # watch & compile SCSS (run alongside dev)
npm run sass:build   # one-shot SCSS compile (runs automatically before build)
npm run build        # production build (runs sass:build first)
npm run lint         # ESLint (Next.js core-web-vitals ruleset)
npm test             # node --test: portfolio resolver, relationships, snapshot check, routes, Airtable sync
npm run sync         # pull Live records + attachments from Airtable (needs AIRTABLE_TOKEN in .env)
npm run validate     # check content/data (also runs before every build)
```

The `prebuild` script runs `validate` then `sass:build`, so `npm run build` gates on valid data and handles CSS compilation. `sync` is never part of the build.

**Code style** (`.prettierrc`): 4-space indent, single quotes, 100-char line width, ES5 trailing commas.

## Architecture

**Framework:** Next.js 15 (App Router), React 19, no TypeScript in source files (jsconfig.json provides path aliases; `@/` maps to the project root).

**Routing:** App Router pages live in `app/`. Key routes:
- `/` → `app/page.js`
- `/our-work`, `/our-work/[theme]` — the impact areas (the browse axis)
- `/products`, `/products/[slug]` — tools · `/projects`, `/projects/[slug]` — initiatives
- `/countries`, `/countries/[slug]` · `/impact` · `/for-partners` · `/team`
- `/blog` → `app/blog/page.js` (one feed, every post) · `/blog/[slug]`

**Content pattern:** Pages are data-driven. Page copy lives in `content/pages/*.json` (one file per route). Global UI data (header nav, footer links, countries menu) lives in `content/global/*.json`. Page components import these JSON files directly and receive them as props.

**Portfolio data:** tools, initiatives, outcomes and tool-to-tool connections come from the Airtable intake base — only records marked `Publication state = Live` — synced into `content/data/` by `scripts/sync-airtable.js` and read through `lib/portfolio.js`. `products.json`, `projects.json`, `outcomes.json`, `relationships.json` and `public/assets/portfolio/` are generated: never hand-edit them. `themes.json`, `countries.json`, `taxonomy.json` and `team.json` are hand-maintained. Read `CONTEXT.md` (terms and traps) and `scripts/README.md` (the sync) before touching any of it.

**Blog posts:** Markdown files in `posts/` with gray-matter frontmatter. `lib/posts.js` reads and parses them at build/request time (no CMS). Key frontmatter fields: `title`, `date`, `author`, `description`, `draft` (bool, hides post when true), `coverImage`/`cover`, `tags`, `mermaid` (bool, enables Mermaid diagrams).

**Styling:** Two parallel systems:
1. **SCSS** — `public/assets/scss/style.scss` (entry point) compiles to `public/assets/css/style.css`. Organized into `abstracts/`, `base/`, `components/`, `layout/`, `pages/`, `vendors/`. This is the primary stylesheet for the legacy/vendor UI layer.
2. **App CSS** — `styles/app.css`, `styles/wf-components.css`, and CSS Modules in `components/layout/` for Next.js components. These layer on top of the compiled SCSS.

**Component organization** under `components/`:
- `sections/` — full-page section components (Hero, Features, Stats, Blog listings, etc.)
- `layout/` — Header, Footer, Layout, Sidebar, ErrorBoundaryWrapper
- `content/` — RichText (renders Markdown via react-markdown + rehype-raw/sanitize), BlogCoverImage
- `elements/` — small reusable UI pieces
- `analytics/` — GA4 tracker wrapper

**Constants & config:** `lib/constants.js` is the single source of truth for site metadata, product names, external URLs, GA ID, blog config, and post channel names. Import from here rather than hardcoding.

**Environment variables:**
- `NEXT_PUBLIC_SITE_URL` — live site URL; used for metadata `metadataBase` and social previews. Falls back to `https://peskas.show`.
- `NEXT_PUBLIC_GA_ID` — Google Analytics 4 measurement ID. GA only fires in `production`.

**Homepage sections** are in `components/sections/`, composed by `HomePageClient.js` and fed
by `app/page.js`. Figures printed on the page (`13 of 18 tools publish their source code`,
the shared-layer ranking) are derived in `lib/portfolio-stats.mjs`, never written into copy.

**To add a new page:** Create a JSON file in `content/pages/`, create the route in `app/`, and import the JSON directly into the page component. Follow the existing pattern in `app/page.js`.

**To add a blog post:** Create a `.md` file in `posts/` with the required frontmatter. Set `draft: true` to hide it. There is one feed; the `channel:` key some posts still carry is read by nothing.

## Working style

**Think before coding.** State assumptions; if a request has two readings, say so instead of
silently picking one. If a simpler approach exists, push back.

**Simplicity first.** The minimum code that solves the problem — no speculative abstractions, no
configurability nobody asked for, no error handling for impossible states. If 200 lines could be 50,
write 50.

**Surgical changes.** Touch only what the task requires. Don't reformat or "improve" adjacent code,
and match the existing style even where you'd choose differently. Clean up orphans *your* change
created; if you spot unrelated dead code, mention it rather than deleting it.

**Verify, don't assume.** Define what "done" looks like before starting, then check it. State what
you actually ran and what it returned. If something is unverified — a browser-only behaviour, a
flow you couldn't exercise — say so plainly instead of implying it was checked.

**Persist.** Finish the whole task, not the easy parts. If something is genuinely blocked, complete
everything else and say explicitly what was left and why.