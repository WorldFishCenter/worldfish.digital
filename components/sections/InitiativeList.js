import Link from 'next/link';
import AreaTags from '../detail/AreaTags';
import { groupProductsByType, countLabel } from '../detail/meta';
import { productHref, projectHref } from '@/lib/routes.mjs';

/**
 * Initiatives with their tools — the list itself, with no section chrome.
 *
 * Presentational only: the caller decides what is in `groups` and what frames them, so the
 * same list renders the whole portfolio or one impact area's slice of it without knowing
 * which. See PortfolioBrowser.
 *
 * Tools appear as names grouped by type rather than full rows: the block has to stay compact
 * enough that the next initiative is visible, and a tool's description belongs on its own
 * page and in the filterable catalogue at /products. Every tool is still named — one nobody
 * can see is one somebody rebuilds.
 */
function ToolGroups({ tools }) {
    return (
        <div className="wfInitTools">
            {groupProductsByType(tools).map((group) => (
                <div key={group.title} className="wfInitToolGroup">
                    <p className="wfInitToolType">{group.title}</p>
                    <ul className="wfInitToolList">
                        {group.items.map((tool) => (
                            <li key={tool.slug}>
                                <Link href={productHref(tool.slug)} className="wfInitToolLink">
                                    {tool.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default function InitiativeList({ groups, countryName, standalone }) {
    const places = (slugs) =>
        (slugs || [])
            .map((slug) => countryName?.get(slug))
            .filter(Boolean)
            .join(' · ');

    return (
        <div className="wfInitList">
            {groups.map(({ initiative, tools }) => (
                <article
                    key={initiative ? initiative.slug : 'standalone'}
                    className="wfInitBlock"
                >
                    <div className="wfInitHead">
                        <h3 className="wfInitName">
                            {initiative ? (
                                <Link
                                    href={projectHref(initiative.slug)}
                                    className="wfInitNameLink"
                                >
                                    {initiative.name}
                                </Link>
                            ) : (
                                standalone.title
                            )}
                        </h3>
                        <p className="wfInitSummary">
                            {initiative ? initiative.summary : standalone.lead}
                        </p>
                        <p className="wfInitMeta">
                            {[
                                countLabel(tools.length, 'tool'),
                                initiative && places(initiative.countrySlugs),
                                initiative && (initiative.funders || []).join(', '),
                            ]
                                .filter(Boolean)
                                .join(' · ')}
                        </p>
                        {initiative && (
                            <AreaTags areas={initiative.themes} className="wfAreaTagsSpaced" />
                        )}
                        {initiative && (
                            <Link href={projectHref(initiative.slug)} className="wfInitMore">
                                About {initiative.name} <span aria-hidden="true">→</span>
                            </Link>
                        )}
                    </div>

                    <ToolGroups tools={tools} />
                </article>
            ))}
        </div>
    );
}
