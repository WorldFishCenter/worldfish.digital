'use client'
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Header = ({ handleOpen, headerStyle }) => {
    const [scroll, setScroll] = useState(0);

    useEffect(() => {
        document.addEventListener('scroll', () => {
            const scrollCheck = window.scrollY > 100;
            if (scrollCheck !== scroll) {
                setScroll(scrollCheck);
            }
        });
    });
    return (
        <>
            <header
                className={
                    scroll
                        ? `${headerStyle} header sticky-bar stick `
                        : `${headerStyle} header sticky-bar`
                }
            >
                <div className="container">
                    <div className="main-header">
                        <div className="header-left">
                            <div className="header-logo">
                                <Link href="/" className="d-flex display-6">
                                    PESKAS™
                                </Link>
                            </div>
                            <div className="header-nav">
                                <nav className="nav-main-menu d-none d-xl-block text-end" role="navigation" aria-label="Main navigation">
                                    <ul className="main-menu" role="menubar">
                                        <li>
                                            <Link href="/how-it-works">
                                                <i className="fi-rr-settings-sliders" style={{ marginRight: 6, opacity: 1, color: 'inherit' }}></i>
                                                How it works
                                            </Link>
                                        </li>

                                        <li className="has-children">
                                            <Link href="#">
                                                <i className="fi-rr-globe" style={{ marginRight: 6, opacity: 1, color: 'inherit' }}></i>
                                                Countries
                                            </Link>
                                            <ul className="sub-menu">
                                                <li>
                                                    <a href="https://timor.peskas.org/" target="_blank" rel="noopener noreferrer">
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/26/Flag_of_East_Timor.svg" alt="Timor Flag" width={20} height={15} style={{ marginRight: '5px', verticalAlign: 'middle' }} loading="lazy" />
                                                        Timor-Leste
                                                    </a>
                                                </li>
                                                <li>
                                                    <div className="hr">
                                                        <span />
                                                    </div>
                                                    <Link href="/under-costruction">
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/66/Flag_of_Malaysia.svg" alt="Malaysia Flag" width={20} height={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} loading="lazy" />
                                                        Malaysia
                                                    </Link>
                                                </li>
                                                <li>
                                                    <div className="hr">
                                                        <span />
                                                    </div>
                                                    <a href="https://digitalfisheries.kenya.peskas.org/en" target="_blank" rel="noopener noreferrer">
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Kenya.svg" alt="Kenyan Flag" width={20} height={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} loading="lazy" />
                                                        Kenya
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="https://zanzibar.peskas.org" target="_blank" rel="noopener noreferrer">
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d4/Flag_of_Zanzibar.svg" alt="Zanzibar Flag" width={20} height={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} loading="lazy" />
                                                        Zanzibar
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="https://peskas-dashboard-mozambique.vercel.app" target="_blank" rel="noopener noreferrer">
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Flag_of_Mozambique.svg" alt="Mozambique Flag" width={20} height={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} loading="lazy" />
                                                        Mozambique
                                                    </a>
                                                </li>
                                                 <li>
                                                    <a href="https://malawi.peskas.org/" target="_blank" rel="noopener noreferrer">
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d1/Flag_of_Malawi.svg" alt="Malawi Flag" width={20} height={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} loading="lazy" />
                                                        Malawi
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                        <li>
                                            <Link href="/blog">
                                                <i className="fi-rr-book" style={{ marginRight: 6, opacity: 1, color: 'inherit' }}></i>
                                                Blog
                                            </Link>
                                        </li>
                                        <li className="has-children">
                                            <Link href="#">
                                                <i className="fi-rr-folder" style={{ marginRight: 6, opacity: 1, color: 'inherit' }}></i>
                                                Resources
                                            </Link>
                                            <ul className="sub-menu">
                                                <li>
                                                    <Link href="/data-resources">
                                                        <img
                                                            src="/assets/imgs/page/homepage1/data.svg"
                                                            alt="data"
                                                            style={{
                                                                width: '20px',
                                                                height: 'auto',
                                                                marginRight: '5px',
                                                                verticalAlign: 'middle',
                                                            }}
                                                        />
                                                        Publications and data
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/page-terms">
                                                        <img
                                                            src="/assets/imgs/page/homepage1/story.svg"
                                                            alt="documentation"
                                                            style={{
                                                                width: '20px',
                                                                height: 'auto',
                                                                marginRight: '5px',
                                                                verticalAlign: 'middle',
                                                            }}
                                                        />
                                                        Licences and policies
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        {/* <li className="has-children">
                                            <Link href="#" legacyBehavior>
                                                <a>About</a>
                                            </Link>
                                            <ul className="sub-menu">
                                                <li>
                                                    <Link href="/under-costruction" legacyBehavior>
                                                        <a>
                                                            <img src="/assets/imgs/page/homepage1/story.svg" alt="story" style={{ width: '20px', height: 'auto', marginRight: '5px', verticalAlign: 'middle' }} />
                                                            Our Story
                                                        </a>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li> */}
                                    </ul>
                                </nav>
                                <div
                                    className="burger-icon burger-icon-white d-xl-none"
                                    onClick={handleOpen}
                                >
                                    <span className="burger-icon-top" />
                                    <span className="burger-icon-mid" />
                                    <span className="burger-icon-bottom" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
