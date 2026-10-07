import Link from 'next/link';
import Image from 'next/image';
import { countryHref } from '@/lib/routes.mjs';

/**
 * Proof the tools are real.
 *
 * The reuse argument above this section is a claim; these are the running deployments
 * that back it — the same pipeline and API rendered as one national dashboard per
 * country. Screenshots rather than prose because a colleague deciding whether to reuse
 * something wants to see it, and because nothing else on the page shows what the work
 * actually looks like.
 *
 * The caller decides which countries qualify (see app/page.js); the row sizes itself to
 * however many arrive, so neither the copy nor the grid encodes a count that will be
 * wrong as soon as a deployment is added or retired.
 */
export default function ToolsShowcase({ data, deployments }) {
    // Screenshots of countries with nothing Live would be a claim the data does not back.
    if (deployments.length === 0) return null;

    return (
        <section className="section-box wfSectionDark wfPadSection">
            <div className="container">
                <p className="wfSectionKicker">{data.kicker}</p>
                <div className="wfDarkHead">
                    <h2 className="wfSectionTitle">{data.title}</h2>
                    <p className="wfDarkHeadLead">{data.lead}</p>
                </div>
                <ul
                    className="wfShowcase"
                    style={{ '--wf-showcase-n': deployments.length }}
                >
                    {deployments.map((d) => (
                        <li key={d.slug} className="wfShowcaseItem">
                            <Link href={countryHref(d.slug)} className="wfShowcaseLink">
                                <span className="wfShowcaseShot">
                                    <Image
                                        src={d.image}
                                        alt={`${d.name} fisheries dashboard`}
                                        width={760}
                                        height={460}
                                        sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
                                        quality={70}
                                        className="wfShowcaseImg"
                                    />
                                </span>
                                <span className="wfShowcaseMeta">
                                    <span className="wfShowcaseName">{d.name}</span>
                                    <span className="wfShowcaseArrow" aria-hidden="true">→</span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
