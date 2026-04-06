'use client'
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import RichText from '@/components/content/RichText';
import data from '@/content/pages/how-it-works.json';
import './how-it-works.css';

export default function HowItWorks() {
    const [activeModule, setActiveModule] = useState(data.modules.items[0]?.title || '');
    const [activeFaq, setActiveFaq] = useState(data.faq.items[0]?.q || '');

    return (
        <Layout>
            <section className="section-box wfSectionDark wfPadHeroSm">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <h1 className="display-3 wfTitleHeroTight wfTitleHeroMb">{data.hero.title}</h1>
                            <RichText content={data.hero.subtitle} className="wfLead" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-box wfSectionDark wfPadSectionMd">
                <div className="container">
                    <div className="row text-center mb-50">
                        <div className="col-lg-10 mx-auto">
                            <h2 className="display-4 wfTitleHeroTight">{data.pipeline.title}</h2>
                            <RichText content={data.pipeline.subtitle} className="wfLeadMd" />
                        </div>
                    </div>
                    <div className="row">
                        {data.pipeline.stages.map((stage) => (
                            <div key={stage.kicker} className="col-lg-4 col-md-6 mb-30">
                                <div className="stage-card">
                                    <div className="stage-kicker">{stage.kicker}</div>
                                    <h3 className="hiw-stage-title">{stage.title}</h3>
                                    <RichText content={stage.description} className="wfMuted" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-box wfSectionDark wfPadSectionMd">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 mx-auto text-center mb-50">
                            <h3 className="display-4 wfTitleHeroTight">{data.workflow.title}</h3>
                            <RichText content={data.workflow.subtitle} className="wfLeadMd" />
                        </div>
                    </div>
                    <div className="timeline-grid">
                        {data.workflow.steps.map((step) => (
                            <div className="timeline-card" key={step.id}>
                                <div className="timeline-index">{step.id}</div>
                                <div className="timeline-body">
                                    <h4 className="wfHeading4">{step.title}</h4>
                                    <RichText content={step.summary} className="wfBodyTight" />
                                    <ul className="hiwCheckedList mt-15">
                                        {step.items.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-box wfSectionDark wfPadSectionMd">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 mx-auto text-center mb-50">
                            <h3 className="display-4 wfTitleHeroTight">{data.modules.title}</h3>
                            <RichText content={data.modules.subtitle} className="wfLeadMd" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            <div className="accordion module-accordion" id="modules-accordion">
                                {data.modules.items.map((item) => {
                                    const isOpen = activeModule === item.title;
                                    return (
                                        <div className="accordion-item" key={item.title}>
                                            <h2 className="accordion-header">
                                                <button
                                                    className={
                                                        isOpen
                                                            ? 'accordion-button text-heading-5'
                                                            : 'accordion-button text-heading-5 collapsed'
                                                    }
                                                    type="button"
                                                    onClick={() => setActiveModule(isOpen ? '' : item.title)}
                                                >
                                                    <span className="module-icon hidden-invert">
                                                        <img src={item.icon} alt={item.title} />
                                                    </span>
                                                    {item.title}
                                                </button>
                                            </h2>
                                            <div
                                                className={
                                                    isOpen
                                                        ? 'accordion-collapse collapse show'
                                                        : 'accordion-collapse collapse'
                                                }
                                            >
                                                <div className="accordion-body">
                                                    <RichText
                                                        content={item.body}
                                                        className="wfBody hiw-accordion-rich"
                                                    />
                                                    <ul className="hiwCheckedList">
                                                        {item.items.map((point) => (
                                                            <li key={point}>{point}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-box wfSectionDark wfPadSectionMd">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 mb-30">
                            <div className="info-card">
                                <h3 className="wfHeading4Tight">{data.keyFeatures.title}</h3>
                                <ul className="hiwCheckedList">
                                    {data.keyFeatures.items.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-6 mb-30">
                            <div className="info-card">
                                <h3 className="wfHeading4Tight">{data.resourceLinks.title}</h3>
                                <ul className="resource-list mt-20">
                                    {data.resourceLinks.items.map((link) => (
                                        <li key={link.href}>
                                            <a href={link.href} target="_blank" rel="noopener noreferrer">
                                                {link.label} ↗
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-box wfSectionDark wfPadSectionMd">
                <div className="container">
                    <div className="row text-center mb-50">
                        <div className="col-lg-8 mx-auto">
                            <h3 className="display-4 wfTitleHeroTight">{data.faq.title}</h3>
                            <RichText content={data.faq.subtitle} className="wfLeadMd" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            <div className="accordion module-accordion">
                                {data.faq.items.map((item) => {
                                    const isOpen = activeFaq === item.q;
                                    return (
                                        <div className="accordion-item" key={item.q}>
                                            <h2 className="accordion-header">
                                                <button
                                                    className={
                                                        isOpen
                                                            ? 'accordion-button text-heading-5'
                                                            : 'accordion-button text-heading-5 collapsed'
                                                    }
                                                    type="button"
                                                    onClick={() => setActiveFaq(isOpen ? '' : item.q)}
                                                >
                                                    {item.q}
                                                </button>
                                            </h2>
                                            <div
                                                className={
                                                    isOpen
                                                        ? 'accordion-collapse collapse show'
                                                        : 'accordion-collapse collapse'
                                                }
                                            >
                                                <div className="accordion-body pb-20">
                                                    <RichText content={item.a} className="wfBody" />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-box wfSectionDark wfPadSectionMdBottom">
                <div className="container">
                    <div className="row align-items-center mb-40 text-center">
                        <div className="col-lg-8 mx-auto">
                            <h3 className="display-4 wfTitleHeroTight">{data.cta.title}</h3>
                            <RichText content={data.cta.subtitle} className="wfLeadMd" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="airtable-embed-wrapper">
                                <iframe
                                    title="Peskas instance request"
                                    className="airtable-embed wfIframeTall"
                                    src={data.cta.airtableUrl}
                                    frameBorder="0"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
