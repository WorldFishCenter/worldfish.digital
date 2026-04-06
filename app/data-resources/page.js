'use client'
import { useEffect, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import RichText from '@/components/content/RichText';
import data from '@/content/pages/data-resources.json';

export default function DataResources() {
    const dataverseRef = useRef(null);

    useEffect(() => {
        const currentRef = dataverseRef.current;
        if (!currentRef) return;

        if (document.getElementById('dataverse-widget-js')) {
            return;
        }

        currentRef.innerHTML = '';

        const script = document.createElement('script');
        script.id = 'dataverse-widget-js';
        script.src = 'https://dataverse.harvard.edu/resources/js/widgets.js?alias=peskas&dvUrl=https://dataverse.harvard.edu&widgetScope=peskas&widget=iframe&heightPx=600';
        script.async = true;

        script.onerror = () => {
            console.error('Failed to load Dataverse widget');
            if (currentRef) {
                currentRef.innerHTML =
                    '<p class="wf-muted-inline">Unable to load Dataverse widget. Please try refreshing the page.</p>';
            }
        };

        currentRef.appendChild(script);

        return () => {
            const existingScript = document.getElementById('dataverse-widget-js');
            if (existingScript && existingScript.parentNode === currentRef) {
                currentRef.removeChild(existingScript);
            }
        };
    }, []);

    return (
        <Layout>
            <section className="section-box wfSectionDark wfPadHeroSm">
                <div className="container text-center">
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            <h1 className="display-3 wfTitleHeroTight wfTitleHeroMb">{data.hero.title}</h1>
                            <RichText content={data.hero.subtitle} className="wfLead" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-box wfSectionDark wfPadSectionMd border-0">
                <div className="container">
                    <h2 className="display-5 wfTitleHeroTight mb-30">{data.publications.title}</h2>
                    <div className="row">
                        <div className="col-lg-8">
                            <RichText content={data.publications.description} className="wfLeadMdStatic mb-40" />
                        </div>
                    </div>
                    <iframe
                        title="Publications"
                        className="airtable-embed wfDataResourceCard wf-rounded-iframe"
                        src={data.publications.airtableUrl}
                        frameBorder="0"
                        width="100%"
                        height="533"
                    />
                </div>
            </section>

            <section className="section-box wfSectionDark wfPadSectionMdBottom">
                <div className="container">
                    <h2 className="display-5 wfTitleHeroTight mb-30">{data.data.title}</h2>
                    <div className="row">
                        <div className="col-lg-8">
                            <RichText content={data.data.description} className="wfLeadMdStatic mb-40" />
                        </div>
                    </div>
                    <div ref={dataverseRef} className="wfDataverseHost wf-dataverse-frame" />
                </div>
            </section>
        </Layout>
    );
}
