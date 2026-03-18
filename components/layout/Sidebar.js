'use client'
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';

const Sidebar = ({ openClass }) => {
    const [isActive, setIsActive] = useState({
        status: false,
        key: '',
    });

    const handleToggle = (key) => {
        if (isActive.key === key) {
            setIsActive({
                status: false,
            });
        } else {
            setIsActive({
                status: true,
                key,
            });
        }
    };
    return (
        <>
            <div
                className={`mobile-header-active mobile-header-wrapper-style perfect-scrollbar ${openClass}`}
            >
                <PerfectScrollbar className="mobile-header-wrapper-inner">
                    <div className="mobile-header-content-area">
                        <div className="perfect-scroll">
                            <div className="mobile-menu-wrap mobile-header-border">
                                <nav role="navigation" aria-label="Mobile navigation">
                                    <ul className="mobile-menu font-heading" role="menubar">
                                        <li>
                                            <Link href="/how-it-works">
                                                <i className="fi-rr-settings-sliders" style={{ marginRight: 6, opacity: 1, color: 'inherit' }}></i>
                                                How it works
                                            </Link>
                                        </li>
                                        <li
                                            className={
                                                isActive.key == 3
                                                    ? 'has-children active'
                                                    : 'has-children'
                                            }
                                        >
                                            <span
                                                onClick={() => handleToggle(3)}
                                                className="menu-expand"
                                            >
                                                <i className="fi-rr-angle-small-down"></i>
                                            </span>
                                            <Link href="#">
                                                <i className="fi-rr-globe" style={{ marginRight: 6, opacity: 1, color: 'inherit' }}></i>
                                                Countries
                                            </Link>
                                            <ul
                                                className={
                                                    isActive.key == 3
                                                        ? 'sub-menu d-block'
                                                        : 'sub-menu d-none'
                                                }
                                            >
                                                <li>
                                                    <a href="https://timor.peskas.org/" target="_blank" rel="noopener noreferrer">
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/26/Flag_of_East_Timor.svg" alt="Timor Flag" width={20} height={15} style={{ marginRight: '5px', verticalAlign: 'middle' }} loading="lazy" />
                                                        Timor-Leste
                                                    </a>
                                                </li>
                                                <li>
                                                    <Link href="/under-costruction">
                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/66/Flag_of_Malaysia.svg" alt="Malaysia Flag" width={20} height={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} loading="lazy" />
                                                        Malaysia
                                                    </Link>
                                                </li>
                                                <li className="hr">
                                                    <span />
                                                </li>
                                                <li>
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
                                        <li
                                            className={
                                                isActive.key == 4
                                                    ? 'has-children active'
                                                    : 'has-children'
                                            }
                                        >
                                            <span
                                                onClick={() => handleToggle(4)}
                                                className="menu-expand"
                                            >
                                                <i className="fi-rr-angle-small-down"></i>
                                            </span>
                                            <Link href="#">
                                                <i className="fi-rr-folder" style={{ marginRight: 6, opacity: 1, color: 'inherit' }}></i>
                                                Resources
                                            </Link>
                                            <ul
                                                className={
                                                    isActive.key == 4
                                                        ? 'sub-menu d-block'
                                                        : 'sub-menu d-none'
                                                }
                                            >
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
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </PerfectScrollbar>
            </div>
        </>
    );
};

export default Sidebar;
