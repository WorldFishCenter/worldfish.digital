# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start Next.js dev server (http://localhost:3000)
npm run sass         # watch & compile SCSS (run alongside dev)
npm run sass:build   # one-shot SCSS compile (runs automatically before build)
npm run build        # production build (runs sass:build first)
npm run lint         # ESLint (Next.js core-web-vitals ruleset)
```

No test suite is configured. The `prebuild` script runs `sass:build` automatically, so `npm run build` handles CSS compilation.

**Code style** (`.prettierrc`): 4-space indent, single quotes, 100-char line width, ES5 trailing commas.

## Architecture

**Framework:** Next.js 15 (App Router), React 19, no TypeScript in source files (jsconfig.json provides path aliases; `@/` maps to the project root).

**Routing:** App Router pages live in `app/`. Key routes:
- `/` → `app/page.js`
- `/products/peskas` → `app/products/peskas/page.js`
- `/blog` → `app/blog/page.js` (all channels)
- `/blog/peskas` → `app/blog/peskas/page.js` (Peskas channel only)
- `/blog/[slug]` → `app/blog/[slug]/page.js`

**Content pattern:** Pages are data-driven. Page copy lives in `content/pages/*.json` (one file per route). Global UI data (header nav, footer links, countries menu) lives in `content/global/*.json`. Page components import these JSON files directly and receive them as props.

**Blog posts:** Markdown files in `posts/` with gray-matter frontmatter. `lib/posts.js` reads and parses them at build/request time (no CMS). Key frontmatter fields: `title`, `date`, `author`, `description`, `draft` (bool, hides post when true), `channel` (`worldfish` or `peskas`), `coverImage`/`cover`, `tags`, `mermaid` (bool, enables Mermaid diagrams).

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

**To add a new page:** Create a JSON file in `content/pages/`, create the route in `app/`, and import the JSON directly into the page component. Follow the existing pattern in `app/page.js`.

**To add a blog post:** Create a `.md` file in `posts/` with the required frontmatter. Set `draft: true` to hide it. Set `channel: peskas` to appear under `/blog/peskas`; omit or set `worldfish` for the main `/blog`.
