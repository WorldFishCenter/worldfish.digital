import Link from 'next/link';
import EntityLinkList from './EntityLinkList';
import AreaTags from './AreaTags';
import { groupProductsByType, countLabel } from './meta';
import { productHref, projectHref } from '@/lib/routes.mjs';

/**
 * Tools under the initiative that produced them, for the filtered pages — one impact area,
 * one country.
 *
 * Those pages used to show a flat list of tools grouped by component type, then a thin list
 * of initiatives underneath as names and one-liners. So an impact area with five tools and
 * one initiative said almost nothing about the initiative, which is the thing that produced
 * all five. An initiative is the container; on any page listing its tools it should be the
 * heading above them, not a footnote below.
 *
 * Each block carries the initiative's own summary and funders, so a reader learns what the
 * programme is without opening it, and the tools shown are only the ones that belong on
 * this page — an initiative spanning six countries contributes to a country page only the
 * tools deployed there, with the count saying so.
 *
 * `countrySlugs` on the heading meta is omitted on a country page, where it would repeat the
 * page's own subject on every row; `excludeArea` does the same for the impact-area page.
 */
export default function InitiativeGroups({
    groups,
    countryName,
    showCountries = true,
    standalone,
    excludeArea,
}) {
    return (
        <div className="wfInitGroups">
            {groups.map(({ initiative, tools }) => {
                const toolItems = groupProductsByType(tools).map((group) => ({
                    title: group.title,
                    items: group.items.map((tool) => ({
                        href: productHref(tool.slug),
                        name: tool.name,
                        sub: tool.summary,
                        meta:
                            (showCountries &&
                                (tool.countries || [])
                                    .map((c) => c.name || countryName?.get(c.slug))
                                    .filter(Boolean)
                                    .join(' · ')) ||
                            null,
                        status: tool.status,
                    })),
                }));

                const meta = initiative
                    ? [
                          countLabel(tools.length, 'tool'),
                          showCountries &&
                              (initiative.countries || [])
                                  .map((c) => c.name)
                                  .filter(Boolean)
                                  .join(' · '),
                          (initiative.funders || []).join(', '),
                      ]
                          .filter(Boolean)
                          .join(' · ')
                    : countLabel(tools.length, 'tool');

                return (
                    <section
                        key={initiative ? initiative.slug : 'standalone'}
                        className="wfInitGroup"
                    >
                        <header className="wfInitGroupHead">
                            <h3 className="wfInitGroupName">
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
                            <p className="wfInitGroupSummary">
                                {initiative ? initiative.summary : standalone.lead}
                            </p>
                            <p className="wfInitGroupMeta">{meta}</p>
                            {initiative && (
                                <AreaTags
                                    areas={initiative.themes}
                                    exclude={excludeArea}
                                    className="wfAreaTagsSpaced"
                                />
                            )}
                            {initiative && (
                                <Link
                                    href={projectHref(initiative.slug)}
                                    className="wfInitMore"
                                >
                                    About {initiative.name} <span aria-hidden="true">→</span>
                                </Link>
                            )}
                        </header>
                        <EntityLinkList groups={toolItems} />
                    </section>
                );
            })}
        </div>
    );
}
