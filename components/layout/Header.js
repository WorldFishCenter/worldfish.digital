'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';
import navigation from '@/content/global/navigation.json';

const Header = ({ menuOpen, onMobileNavToggle, headerStyle }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 20);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className={`${headerStyle} header header-langgraph ${styles.siteHeader}`}
            data-scrolled={isScrolled ? 'true' : 'false'}
        >
            <div className="container">
                <div className="main-header">
                    <div className={`header-left header-langgraph-inner ${styles.headerInner}`}>
                        <div className={`header-logo ${styles.headerLogo}`}>
                            <Link href="/" className="header-logo-link">
                                <span className="header-logo-line1">WorldFish</span>
                                <span className="header-logo-line2">Digital</span>
                            </Link>
                        </div>
                        <nav
                            className={`nav-main-menu d-none d-xl-flex ${styles.navMain}`}
                            role="navigation"
                            aria-label="Main navigation"
                        >
                            <ul className="main-menu" role="menubar">
                                <li><Link href="/">Home</Link></li>
                                <li className="has-children">
                                    <Link href="#">Products</Link>
                                    <div className="sub-menu mega-menu">
                                        <div className="mega-menu-column">
                                            <div className="mega-menu-heading">{navigation.productsMega.peskasEcosystem.heading}</div>
                                            <ul className={styles.megaListReset}>
                                                {navigation.productsMega.peskasEcosystem.items.map((item) => (
                                                    <li key={item.href + item.label}>
                                                        {item.external ? (
                                                            <a href={item.href} target="_blank" rel="noopener noreferrer">
                                                                {item.label}
                                                            </a>
                                                        ) : (
                                                            <Link href={item.href}>{item.label}</Link>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="mega-menu-column">
                                            <div className="mega-menu-heading">{navigation.productsMega.otherSolutions.heading}</div>
                                            <ul className={styles.megaListReset}>
                                                {navigation.productsMega.otherSolutions.items.map((item) => (
                                                    <li key={item.href + item.label}>
                                                        {item.external ? (
                                                            <a href={item.href} target="_blank" rel="noopener noreferrer">
                                                                {item.label}
                                                            </a>
                                                        ) : (
                                                            <Link href={item.href}>{item.label}</Link>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                <li className="has-children">
                                    <Link href="/under-costruction">Platforms</Link>
                                    <ul className="sub-menu">
                                        <li><Link href="/under-costruction">Asia Digital Hub</Link></li>
                                        <li><Link href="/under-costruction">Digital Architecture</Link></li>
                                        <li><Link href="/under-costruction">Data Standards</Link></li>
                                        <li><Link href="/under-costruction">AI & Analytics</Link></li>
                                    </ul>
                                </li>
                                <li className="has-children">
                                    <Link href="/under-costruction">Research</Link>
                                    <ul className="sub-menu">
                                        <li><Link href="/under-costruction">Digital fisheries monitoring research</Link></li>
                                        <li><Link href="/under-costruction">AI for aquatic foods</Link></li>
                                        <li><Link href="/under-costruction">Behaviour change & digital adoption</Link></li>
                                        <li><Link href="/under-costruction">Digital governance tools</Link></li>
                                    </ul>
                                </li>
                                <li className="has-children">
                                    <Link href="#">Resources</Link>
                                    <ul className="sub-menu">
                                        <li><Link href="/data-resources">Documentation</Link></li>
                                        <li><Link href="/page-terms">Policies</Link></li>
                                        <li><Link href="/under-costruction">Licenses</Link></li>
                                        <li><Link href="/under-costruction">Media & Downloads</Link></li>
                                    </ul>
                                </li>
                                <li className="has-children">
                                    <Link href="/under-costruction">Community</Link>
                                    <ul className="sub-menu">
                                        <li><Link href="/under-costruction">Governments using tools</Link></li>
                                        <li><Link href="/under-costruction">Partner organisations</Link></li>
                                        <li><Link href="/under-costruction">Training programs</Link></li>
                                        <li><Link href="/under-costruction">Developer community</Link></li>
                                        <li><Link href="/under-costruction">Events & workshops</Link></li>
                                    </ul>
                                </li>
                            </ul>
                        </nav>
                        <button
                            type="button"
                            className={`burger-icon burger-icon-white d-xl-none ${styles.burgerBtn}`}
                            onClick={onMobileNavToggle}
                            aria-expanded={menuOpen}
                            aria-controls="wf-mobile-nav"
                            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        >
                            <span className="burger-icon-top" />
                            <span className="burger-icon-mid" />
                            <span className="burger-icon-bottom" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
