/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Layout from "@/components/layout/Layout";

export const metadata = {
    title: 'Page Under Development - WorldFish Digital',
};

export default function UnderConstruction() {
    return (
        <Layout>
            <section className="section-box wfSectionDark wfPadSection">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center mt-10">
                           <img className="img-responsive wfUnderConstructionIcon" src="/assets/imgs/page/homepage1/under-costruction.svg" alt="Under Construction" />
                            <h2 className="display-5 wfTitleHeroTight mb-20 mt-50">
                                Page Under Development
                            </h2>
                            <p className="wfLeadMdStatic mt-30 mb-70">
                                Content Update in Progress
                            </p>
                            <div className="text-center mb-50">
                                <Link href="/" className="btn btn-black icon-arrow-left">
                                    Back to Homepage
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}
