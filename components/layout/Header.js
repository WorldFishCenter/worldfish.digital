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
                            <Link href="/" className={`header-logo-link ${styles.logoLink}`}>
                                <img
                                    src="/assets/imgs/brand/worldfish-logo-white.svg"
                                    alt="WorldFish"
                                    className={styles.logoImg}
                                />
                                <span className={styles.logoSuffix}>Digital</span>
                            </Link>
                        </div>
                        <nav
                            className={`nav-main-menu d-none d-xl-flex ${styles.navMain}`}
                            role="navigation"
                            aria-label="Main navigation"
                        >
                            <ul className="main-menu" role="menubar">
                                <li><Link href="/">Home</Link></li>
                                {navigation.primary.map((item) => {
                                    if (item.mega) {
                                        return (
                                            <li key={item.label} className="has-children">
                                                <Link href={item.href}>{item.label}</Link>
                                                <div className="sub-menu mega-menu">
                                                    {item.mega.map((column) => (
                                                        <div key={column.heading} className="mega-menu-column">
                                                            <div className="mega-menu-heading">{column.heading}</div>
                                                            <ul className={styles.megaListReset}>
                                                                {column.items.map((subItem) => (
                                                                    <li key={subItem.href + subItem.label}>
                                                                        {subItem.external ? (
                                                                            <a href={subItem.href} target="_blank" rel="noopener noreferrer">
                                                                                {subItem.label}
                                                                            </a>
                                                                        ) : (
                                                                            <Link href={subItem.href}>{subItem.label}</Link>
                                                                        )}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            </li>
                                        );
                                    }

                                    if (item.submenu) {
                                        return (
                                            <li key={item.label} className="has-children">
                                                <Link href={item.href}>{item.label}</Link>
                                                <ul className="sub-menu">
                                                    {item.submenu.map((subItem) => (
                                                        <li key={subItem.href + subItem.label}>
                                                            <Link href={subItem.href}>{subItem.label}</Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        );
                                    }

                                    return (
                                        <li key={item.label}>
                                            <Link href={item.href}>{item.label}</Link>
                                        </li>
                                    );
                                })}
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
