/**
 * Figures the site is allowed to print, derived from the Live portfolio.
 *
 * The standing rule is that no figure appears unless it can be traced to a source. These
 * qualify in the strictest way available: each one counts records on this site, and each
 * one is published as a link to the page that lists exactly those records. A reader who
 * doubts "13 of 18 tools publish their source code" is one click from the 18 tools. That
 * is a different kind of claim from an aggregate like "200,000 trips recorded", which the
 * team ruled out and which this does not reintroduce.
 *
 * Every figure returns `null` when it would be zero or meaningless, and the caller then
 * renders its copy without a link. This matters more than it looks: the tables are filling
 * up over time, so a section built on these has to read correctly at every stage between
 * empty and full, without anyone editing it on the way.
 *
 * Pure, and takes its collections as arguments, so it can be tested against fixtures the
 * way lib/portfolio-resolve.mjs is.
 */
import { flow } from './relationships.mjs';

/** Plural-aware count. */
const n = (count, singular, plural = `${singular}s`) =>
    `${count} ${count === 1 ? singular : plural}`;

/**
 * True when two tools share no impact area — the connections worth pointing at, because
 * they are the ones showing a component built for one domain reused in another.
 */
function crossesAreas(from, to) {
    if (!from || !to) return false;
    const areas = new Set(from.themeSlugs || []);
    const other = to.themeSlugs || [];
    // A tool with no impact area is shared infrastructure; every link to it crosses by
    // definition, which is the whole reason the cross-cutting entry exists.
    if (areas.size === 0 || other.length === 0) return true;
    return !other.some((slug) => areas.has(slug));
}

/**
 * @param {object} input
 * @param {Array} input.products       Live tools
 * @param {Array} input.relationships  Live tool-to-tool connections
 * @param {Array} input.themes         The impact areas, for the cross-cutting href
 * @returns {Record<string, {label: string, href: string} | null>}
 */
export function reuseEvidence({ products = [], relationships = [], themes = [] }) {
    const bySlug = new Map(products.map((product) => [product.slug, product]));
    const crossCutting = themes.find((theme) => theme.crossCutting);

    const openCode = products.filter((p) => p.openSource && p.repoUrl).length;
    const openData = products.filter((p) => p.dataAvailability === 'Open / Public').length;
    const crossing = relationships.filter((edge) =>
        crossesAreas(bySlug.get(edge.from), bySlug.get(edge.to))
    ).length;

    return {
        connections:
            relationships.length > 0
                ? {
                      label: crossing
                          ? `${n(relationships.length, 'recorded dependency', 'recorded dependencies')} between tools, ${crossing} crossing impact areas`
                          : `${n(relationships.length, 'recorded dependency', 'recorded dependencies')} between tools`,
                      // The cross-cutting area is where the shared components live. Looked
                      // up by flag rather than by slug so renaming it in themes.json does
                      // not silently break this link.
                      href: crossCutting ? `/our-work/${crossCutting.slug}` : '/products',
                  }
                : null,

        openCode:
            openCode > 0
                ? {
                      label: `${openCode} of ${n(products.length, 'tool')} publish their source code`,
                      href: '/products',
                  }
                : null,

        openData:
            products.length > 0
                ? {
                      label: openData
                          ? `${n(openData, 'tool')} publish open data; every tool states what its data allows`
                          : 'Every tool states what its data allows',
                      href: '/products',
                  }
                : null,
    };
}

/**
 * The shared layer: the tools other tools are built on, most-reused first.
 *
 * This is the reuse argument as a fact rather than a claim. A tool's "dependants" are the
 * tools downstream of it once every edge is normalised to the direction work flows in
 * (`flow` in lib/relationships.mjs), so a `depends on` edge counts towards the thing being
 * depended on, not the thing depending. Counting raw `from`/`to` would rank the graph
 * backwards.
 *
 * It is also the first question a researcher has — "what is already built that I can build
 * on?" — answered by the data instead of by prose.
 *
 * @param {object} input
 * @param {Array} input.products       Live tools
 * @param {Array} input.relationships  Live connections
 * @param {number} [input.limit]       How many to return
 */
export function sharedLayer({ products = [], relationships = [], limit = 4 }) {
    const downstream = new Map();
    for (const edge of flow(relationships)) {
        if (!downstream.has(edge.source)) downstream.set(edge.source, new Set());
        downstream.get(edge.source).add(edge.target);
    }

    return products
        .map((product) => ({ product, dependants: downstream.get(product.slug)?.size || 0 }))
        .filter((entry) => entry.dependants > 0)
        .sort(
            (a, b) =>
                b.dependants - a.dependants || a.product.name.localeCompare(b.product.name)
        )
        .slice(0, limit);
}

/**
 * Tools grouped under the initiative that produced them — the containment axis of the
 * schema (`Part of initiative` on WFD Tools), and the order the site is organised in.
 *
 * Initiatives come first because that is the shape of the work: a funded body of work
 * produces tools, and a reader asking "what has WorldFish built" means "what came out of
 * which programme". Grouping tools by component type instead reads as a technical taxonomy
 * and stops scaling the moment there are more than a screenful — a flat list of 200 tools
 * is unusable where twenty initiatives of ten are not.
 *
 * `Part of initiative` is optional, so a tool with no initiative is real, not an error. Those
 * come back in a final group with a null initiative rather than being dropped — a tool the
 * site does not show is a tool somebody rebuilds. So does a tool whose initiative is not in
 * the `projects` passed in, which happens on every filtered page.
 *
 * Initiatives with nothing Live under them are left out: an empty block says nothing to a
 * reader, and the initiative still has its own page.
 *
 * @param {object} input
 * @param {Array} input.products  Live tools
 * @param {Array} input.projects  Live initiatives, in the order they should appear
 * @returns {Array<{initiative: object|null, tools: Array}>}
 */
export function toolsByInitiative({ products = [], projects = [] }) {
    const groups = projects
        .map((initiative) => ({
            initiative,
            tools: products.filter((tool) => (tool.projectSlugs || []).includes(initiative.slug)),
        }))
        .filter((group) => group.tools.length > 0);

    // Anything no group claimed, not merely anything with an empty `Part of initiative`.
    // On a filtered page — one impact area, one country — `projects` holds only the
    // initiatives relevant there, so a tool belonging to an initiative outside that set
    // would otherwise vanish from a list that counts it in its own heading.
    const claimed = new Set(groups.flatMap((g) => g.tools.map((t) => t.slug)));
    const standalone = products.filter((tool) => !claimed.has(tool.slug));
    return standalone.length > 0 ? [...groups, { initiative: null, tools: standalone }] : groups;
}
