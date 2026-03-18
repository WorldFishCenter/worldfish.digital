'use client'
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import RichText from "@/components/content/RichText";
import data from "@/content/pages/how-it-works.json";

export default function HowItWorks() {
    const [activeModule, setActiveModule] = useState(data.modules.items[0]?.title || '');
    const [activeFaq, setActiveFaq] = useState(data.faq.items[0]?.q || '');

    return (
        <>
            <Layout>
                <section className="section-box">
                    <div className="banner-hero banner-2 bg-about-1">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8">
                                    <h1 className="text-display-2 mt-30">{data.hero.title}</h1>
                                    <RichText
                                        content={data.hero.subtitle}
                                        className="text-body-lead-large color-gray-500 mt-30"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-box mt-80">
                    <div className="container">
                        <div className="row text-center mb-50">
                            <div className="col-lg-10 mx-auto">
                                <h2 className="text-heading-1 color-gray-900">{data.pipeline.title}</h2>
                                <RichText
                                    content={data.pipeline.subtitle}
                                    className="text-body-lead-large color-gray-600 mt-20"
                                />
                            </div>
                        </div>
                        <div className="row">
                            {data.pipeline.stages.map((stage) => (
                                <div key={stage.kicker} className="col-lg-4 col-md-6 mb-30">
                                    <div className="stage-card">
                                        <div className="stage-kicker">{stage.kicker}</div>
                                        <h3 className="text-heading-4 mt-10">{stage.title}</h3>
                                        <RichText
                                            content={stage.description}
                                            className="text-body-text color-gray-600 mt-15"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="section-box mt-70">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-10 mx-auto text-center mb-40">
                                <h3 className="text-heading-2 color-gray-900">{data.workflow.title}</h3>
                                <RichText
                                    content={data.workflow.subtitle}
                                    className="text-body-lead color-gray-600 mt-15"
                                />
                            </div>
                        </div>
                        <div className="timeline-grid">
                            {data.workflow.steps.map((step) => (
                                <div className="timeline-card" key={step.id}>
                                    <div className="timeline-index">{step.id}</div>
                                    <div className="timeline-body">
                                        <h4 className="text-heading-4 color-gray-900">{step.title}</h4>
                                        <RichText
                                            content={step.summary}
                                            className="text-body-text color-gray-600 mt-10"
                                        />
                                        <ul className="list-checked mt-15">
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

                <section className="section-box mt-70">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-10 mx-auto text-center mb-40">
                                <h3 className="text-heading-2 color-gray-900">{data.modules.title}</h3>
                                <RichText
                                    content={data.modules.subtitle}
                                    className="text-body-lead color-gray-600 mt-15"
                                />
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
                                                                ? "accordion-button text-heading-5"
                                                                : "accordion-button text-heading-5 collapsed"
                                                        }
                                                        type="button"
                                                        onClick={() => setActiveModule(isOpen ? "" : item.title)}
                                                    >
                                                        <span className="module-icon">
                                                            <img src={item.icon} alt={item.title} />
                                                        </span>
                                                        {item.title}
                                                    </button>
                                                </h2>
                                                <div
                                                    className={
                                                        isOpen
                                                            ? "accordion-collapse collapse show"
                                                            : "accordion-collapse collapse"
                                                    }
                                                >
                                                    <div className="accordion-body text-body-text color-gray-600">
                                                        <RichText
                                                            content={item.body}
                                                            className="mb-15"
                                                        />
                                                        <ul className="list-checked mt-10">
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

                <section className="section-box mt-70 bg-gray-50">
                    <div className="container pt-60 pb-60">
                        <div className="row">
                            <div className="col-lg-6 mb-30">
                                <div className="info-card">
                                    <h3 className="text-heading-2 color-gray-900">{data.keyFeatures.title}</h3>
                                    <ul className="list-checked mt-20">
                                        {data.keyFeatures.items.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-6 mb-30">
                                <div className="info-card">
                                    <h3 className="text-heading-2 color-gray-900">{data.resourceLinks.title}</h3>
                                    <ul className="resource-list mt-20">
                                        {data.resourceLinks.items.map((link) => (
                                            <li key={link.href}>
                                                <a href={link.href} target="_blank" rel="noopener noreferrer">
                                                    {link.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-box mt-10 bg-gray-50">
                    <div className="container pt-60 pb-60">
                        <div className="row">
                            <div className="col-lg-8">
                                <h3 className="text-heading-2 color-gray-900">{data.faq.title}</h3>
                                <RichText
                                    content={data.faq.subtitle}
                                    className="text-body-lead color-gray-600 mt-15"
                                />
                            </div>
                        </div>
                        <div className="row mt-30">
                            <div className="col-lg-10">
                                <div className="accordion module-accordion">
                                    {data.faq.items.map((item) => {
                                        const isOpen = activeFaq === item.q;
                                        return (
                                            <div className="accordion-item" key={item.q}>
                                                <h2 className="accordion-header">
                                                    <button
                                                        className={
                                                            isOpen
                                                                ? "accordion-button text-heading-5"
                                                                : "accordion-button text-heading-5 collapsed"
                                                        }
                                                        type="button"
                                                        onClick={() => setActiveFaq(isOpen ? "" : item.q)}
                                                    >
                                                        {item.q}
                                                    </button>
                                                </h2>
                                                <div
                                                    className={
                                                        isOpen
                                                            ? "accordion-collapse collapse show"
                                                            : "accordion-collapse collapse"
                                                    }
                                                >
                                                    <RichText
                                                        content={item.a}
                                                        className="accordion-body text-body-text color-gray-600"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-box mt-80">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-8">
                                <h3 className="text-heading-2 color-gray-900">{data.cta.title}</h3>
                                <RichText
                                    content={data.cta.subtitle}
                                    className="text-body-lead color-gray-600 mt-15"
                                />
                            </div>
                        </div>
                        <div className="row mt-40">
                            <div className="col-12">
                                <div className="airtable-embed-wrapper">
                                    <iframe
                                        title="Peskas instance request"
                                        className="airtable-embed"
                                        src={data.cta.airtableUrl}
                                        frameBorder="0"
                                        style={{ width: '100%', minHeight: '700px', border: 0 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>

            <style jsx>{`
                .stage-card {
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    padding: 24px;
                    height: 100%;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
                }
                .stage-kicker {
                    display: inline-flex;
                    align-items: center;
                    padding: 6px 12px;
                    border-radius: 999px;
                    background: #f0fdf4;
                    color: #047857;
                    font-weight: 600;
                    font-size: 14px;
                    letter-spacing: 0.2px;
                }
                .timeline-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 20px;
                }
                @media (min-width: 992px) {
                    .timeline-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                }
                .timeline-card {
                    display: grid;
                    grid-template-columns: 80px 1fr;
                    gap: 16px;
                    padding: 24px;
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
                    align-items: start;
                }
                .timeline-index {
                    width: 64px;
                    height: 64px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f0fdf4;
                    color: #047857;
                    font-weight: 700;
                    font-size: 18px;
                }
                .list-checked {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .list-checked li {
                    position: relative;
                    padding-left: 26px;
                    margin-bottom: 10px;
                    color: #4b5563;
                }
                .list-checked li::before {
                    content: "";
                    position: absolute;
                    left: 0;
                    top: 8px;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #047857;
                }
                .module-accordion .accordion-item {
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
                    margin-bottom: 12px;
                }
                .module-accordion .accordion-button {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px 20px;
                }
                .module-accordion .accordion-button:focus {
                    box-shadow: none;
                }
                .module-accordion .accordion-body {
                    padding: 16px 20px 20px;
                }
                .module-icon {
                    width: 34px;
                    height: 34px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                .module-icon img {
                    width: 28px;
                    height: 28px;
                }
                .resource-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .resource-list li {
                    margin-bottom: 12px;
                }
                .resource-list a {
                    color: #0f172a;
                    font-weight: 600;
                    text-decoration: none;
                }
                .resource-list a:hover {
                    text-decoration: underline;
                }
                .info-card {
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    padding: 24px;
                    height: 100%;
                    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.04);
                }
                .airtable-embed-wrapper {
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    overflow: hidden;
                    background: #f9fafb;
                }
                @media (max-width: 767px) {
                    .timeline-card {
                        grid-template-columns: 56px 1fr;
                    }
                    .timeline-index {
                        width: 56px;
                        height: 56px;
                    }
                }
            `}</style>
        </>
    );
}
