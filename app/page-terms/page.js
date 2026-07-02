'use client';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import RichText from '@/components/content/RichText';
import data from '@/content/pages/terms.json';

export default function Terms() {
    return (
        <Layout>
            <section className="section-box wfSectionDark wfPadHeroSm">
                <div className="container text-center">
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            <h1 className="display-3 wfTitleHeroTight wfTitleHeroMb">{data.hero.title}</h1>
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
                                {data.footerNote && <p className="wfMuted mt-50">{data.footerNote}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
