import Link from 'next/link';
import { productHref, themeHref } from '@/lib/routes.mjs';
import { countLabel } from '../detail/meta';

/**
 * What the rest is built on — the reuse argument, shown.
 *
 * The section this replaces asserted that work gets reused and left the reader to take it
 * on trust. These rows are the same claim as a fact: each one is a tool, ranked by how many
 * other tools are downstream of it in the recorded connections, with the count stated. One
 * shared library carrying six dependants says more than three paragraphs about reuse, and
 * it is checkable — every row opens the tool, whose own page draws the lineage.
 *
 * It is also the answer to the first question a researcher has. "What is already built that
 * I could build on" is exactly this list, in exactly this order.
 *
 * Renders nothing until connections are recorded, which keeps the claim honest while the
 * database fills: an empty shared layer is not an argument for reuse.
 */
export default function SharedLayer({ data, entries, crossCutting, connectionCount }) {
    if (!entries || entries.length === 0) return null;

    return (
        <section className="section-box wfSectionDark wfPadSection">
            <div className="container">
                <p className="wfSectionKicker">{data.kicker}</p>
                <div className="wfDarkHead">
                    <h2 className="wfSectionTitle">{data.title}</h2>
                    <p className="wfDarkHeadLead">{data.lead}</p>
                </div>

                <ol className="wfReuseList">
                    {entries.map(({ product, dependants }) => (
                        <li key={product.slug} className="wfReuseRow">
                            <Link href={productHref(product.slug)} className="wfReuseLink">
                                <span className="wfReuseCount">
                                    {dependants}
                                    <span className="wfReuseCountLabel">
                                        {dependants === 1 ? 'tool' : 'tools'} build on this
                                    </span>
                                </span>
                                <span className="wfReuseMain">
                                    <span className="wfReuseName">{product.name}</span>
                                    {product.summary && (
                                        <span className="wfReuseSub">{product.summary}</span>
                                    )}
                                </span>
                                <span className="wfReuseType">{product.type}</span>
                            </Link>
                        </li>
                    ))}
                </ol>

                <p className="wfReuseFoot">
                    {countLabel(connectionCount, 'connection')} between tools are recorded, and
                    each tool&rsquo;s page draws the ones it sits in.
                    {crossCutting && (
                        <>
                            {' '}
                            The components every impact area draws on are listed under{' '}
                            <Link href={themeHref(crossCutting.slug)} className="wfEvidenceLink">
                                {crossCutting.name}
                            </Link>
                            .
                        </>
                    )}
                </p>
            </div>
        </section>
    );
}
