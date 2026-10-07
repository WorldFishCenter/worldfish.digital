import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import RichText from '@/components/content/RichText';
import { DEFAULT_METADATA } from '@/lib/constants';
import data from '@/content/pages/taseguru-privacy.json';

/**
 * The Taseguru app's privacy policy.
 *
 * Not portfolio content — it is here because an app store listing needs a reachable
 * policy URL, and this is where it was published. So it keeps its URL and stays
 * indexable, but it is linked only from the footer's legal line: it was previously in
 * the main navigation as "Terms & policies", where it read as the site's own terms.
 *
 * If more apps need one, this becomes a route with a slug rather than another one-off.
 */
export const metadata = {
    ...DEFAULT_METADATA,
    title: `${data.hero.title} — ${data.hero.app}`,
    description: data.hero.summary,
};

export default function TaseguruPrivacy() {
    return (
        <Layout>
            <section className="section-box wfSectionDark wfPadHeroSm">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <p className="wfSectionKicker">{data.hero.app}</p>
                            <h1 className="display-3 wfTitleHeroTight wfTitleHeroMb">
                                {data.hero.title}
                            </h1>
                            <p className="wfLead">{data.hero.summary}</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section-box wfSectionDark wfPadSectionMdBottom">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-2">
                            <div className="table-of-content">
                                <h6 className="mb-15">Table of content</h6>
                                <ul>
                                    {data.tableOfContents.map((item) => (
                                        <li key={item.id}>
                                            <Link href={`#${item.id}`}>{item.label}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="single-detail wf-prose">
                                {data.sections.map((section) => (
                                    <div key={section.id}>
                                        <h6 className="mt-35 mb-25" id={section.id}>
                                            {section.title}
                                        </h6>
                                        <RichText content={section.body} className="wf-prose" />
                                    </div>
                                ))}
                                {data.footerNote && (
                                    <p className="wfMuted mt-50">{data.footerNote}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
