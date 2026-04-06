'use client'
import Link from 'next/link';
import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import styles from './Sidebar.module.css';
import navigation from '@/content/global/navigation.json';

const Sidebar = ({ openClass, onClose }) => {
    const [isActive, setIsActive] = useState({
        status: false,
        key: '',
    });

    const handleToggle = (key) => {
        if (isActive.key === key) {
            setIsActive({ status: false, key: '' });
        } else {
            setIsActive({ status: true, key });
        }
    };

    return (
        <div
            className={`mobile-header-wrapper-style perfect-scrollbar ${styles.wfDrawer} ${openClass}`}
        >
            <div className={styles.drawerHeader}>
                <Link href="/" className={styles.drawerWordmark} onClick={onClose}>
                    <span className={styles.drawerWordmarkLine1}>WorldFish</span>
                    <span className={styles.drawerWordmarkLine2}>Digital</span>
                </Link>
                <button
                    type="button"
                    className={styles.closeBtn}
                    onClick={onClose}
                    aria-label="Close menu"
                >
                    <span className={styles.closeIcon} aria-hidden />
                </button>
            </div>

            <PerfectScrollbar className={`mobile-header-wrapper-inner ${styles.drawerPs}`}>
                <div className={`mobile-header-content-area ${styles.drawerContent}`}>
                    <div className={`perfect-scroll ${styles.scrollInner}`}>
                        <div className="mobile-menu-wrap mobile-header-border">
                            <nav
                                id="wf-mobile-nav"
                                role="navigation"
                                aria-label="Mobile navigation"
                            >
                                <ul className="mobile-menu font-heading" role="menubar">
                                    <li>
                                        <Link href="/" onClick={onClose}>
                                            <i className={`fi-rr-home ${styles.menuIcon}`} />
                                            Home
                                        </Link>
                                    </li>
                                    <li className={isActive.key === 1 ? 'has-children active' : 'has-children'}>
                                        <button
                                            type="button"
                                            className="menu-expand"
                                            aria-expanded={isActive.key === 1}
                                            aria-controls="wf-mobile-sub-1"
                                            onClick={() => handleToggle(1)}
                                        >
                                            <i className="fi-rr-angle-small-down" />
                                        </button>
                                        <Link href="/under-costruction" onClick={onClose}>
                                            <i className={`fi-rr-apps ${styles.menuIcon}`} />
                                            Products
                                        </Link>
                                        <ul
                                            id="wf-mobile-sub-1"
                                            className={isActive.key === 1 ? 'sub-menu d-block' : 'sub-menu d-none'}
                                        >
                                            {navigation.productsMobile.map((item) => (
                                                <li key={item.href + item.label}>
                                                    {item.external ? (
                                                        <a
                                                            href={item.href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            {item.label}
                                                        </a>
                                                    ) : (
                                                        <Link href={item.href} onClick={onClose}>
                                                            {item.label}
                                                        </Link>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                    <li className={isActive.key === 2 ? 'has-children active' : 'has-children'}>
                                        <button
                                            type="button"
                                            className="menu-expand"
                                            aria-expanded={isActive.key === 2}
                                            aria-controls="wf-mobile-sub-2"
                                            onClick={() => handleToggle(2)}
                                        >
                                            <i className="fi-rr-angle-small-down" />
                                        </button>
                                        <Link href="/under-costruction" onClick={onClose}>
                                            <i className={`fi-rr-network ${styles.menuIcon}`} />
                                            Platforms
                                        </Link>
                                        <ul
                                            id="wf-mobile-sub-2"
                                            className={isActive.key === 2 ? 'sub-menu d-block' : 'sub-menu d-none'}
                                        >
                                            <li><Link href="/under-costruction" onClick={onClose}>Asia Digital Hub</Link></li>
                                            <li><Link href="/under-costruction" onClick={onClose}>Digital Architecture</Link></li>
                                            <li><Link href="/under-costruction" onClick={onClose}>Data Standards</Link></li>
                                            <li><Link href="/under-costruction" onClick={onClose}>AI & Analytics</Link></li>
                                        </ul>
                                    </li>
                                    <li className={isActive.key === 3 ? 'has-children active' : 'has-children'}>
                                        <button
                                            type="button"
                                            className="menu-expand"
                                            aria-expanded={isActive.key === 3}
                                            aria-controls="wf-mobile-sub-3"
                                            onClick={() => handleToggle(3)}
                                        >
                                            <i className="fi-rr-angle-small-down" />
                                        </button>
                                        <Link href="/under-costruction" onClick={onClose}>
                                            <i className={`fi-rr-flask ${styles.menuIcon}`} />
                                            Research
                                        </Link>
                                        <ul
                                            id="wf-mobile-sub-3"
                                            className={isActive.key === 3 ? 'sub-menu d-block' : 'sub-menu d-none'}
                                        >
                                            <li><Link href="/under-costruction" onClick={onClose}>Digital fisheries monitoring research</Link></li>
                                            <li><Link href="/under-costruction" onClick={onClose}>AI for aquatic foods</Link></li>
                                            <li><Link href="/under-costruction" onClick={onClose}>Behaviour change & digital adoption</Link></li>
                                            <li><Link href="/under-costruction" onClick={onClose}>Digital governance tools</Link></li>
                                        </ul>
                                    </li>
                                    <li className={isActive.key === 4 ? 'has-children active' : 'has-children'}>
                                        <button
                                            type="button"
                                            className="menu-expand"
                                            aria-expanded={isActive.key === 4}
                                            aria-controls="wf-mobile-sub-4"
                                            onClick={() => handleToggle(4)}
                                        >
                                            <i className="fi-rr-angle-small-down" />
                                        </button>
                                        <Link href="/data-resources" onClick={onClose}>
                                            <i className={`fi-rr-folder ${styles.menuIcon}`} />
                                            Resources
                                        </Link>
                                        <ul
                                            id="wf-mobile-sub-4"
                                            className={isActive.key === 4 ? 'sub-menu d-block' : 'sub-menu d-none'}
                                        >
                                            <li><Link href="/data-resources" onClick={onClose}>Documentation</Link></li>
                                            <li><Link href="/page-terms" onClick={onClose}>Policies</Link></li>
                                            <li><Link href="/under-costruction" onClick={onClose}>Licenses</Link></li>
                                            <li><Link href="/under-costruction" onClick={onClose}>Media & Downloads</Link></li>
                                        </ul>
                                    </li>
                                    <li className={isActive.key === 5 ? 'has-children active' : 'has-children'}>
                                        <button
                                            type="button"
                                            className="menu-expand"
                                            aria-expanded={isActive.key === 5}
                                            aria-controls="wf-mobile-sub-5"
                                            onClick={() => handleToggle(5)}
                                        >
                                            <i className="fi-rr-angle-small-down" />
                                        </button>
                                        <Link href="/under-costruction" onClick={onClose}>
                                            <i className={`fi-rr-user ${styles.menuIcon}`} />
                                            Community
                                        </Link>
                                        <ul
                                            id="wf-mobile-sub-5"
                                            className={isActive.key === 5 ? 'sub-menu d-block' : 'sub-menu d-none'}
                                        >
                                            <li><Link href="/under-costruction" onClick={onClose}>Governments using tools</Link></li>
                                            <li><Link href="/under-costruction" onClick={onClose}>Partner organisations</Link></li>
                                            <li><Link href="/under-costruction" onClick={onClose}>Training programs</Link></li>
                                            <li><Link href="/under-costruction" onClick={onClose}>Developer community</Link></li>
                                            <li><Link href="/under-costruction" onClick={onClose}>Events & workshops</Link></li>
                                        </ul>
                                    </li>
                                    <li className={isActive.key === 6 ? 'has-children active' : 'has-children'}>
                                        <button
                                            type="button"
                                            className="menu-expand"
                                            aria-expanded={isActive.key === 6}
                                            aria-controls="wf-mobile-sub-6"
                                            onClick={() => handleToggle(6)}
                                        >
                                            <i className="fi-rr-angle-small-down" />
                                        </button>
                                        <Link href="/under-costruction" onClick={onClose}>
                                            <i className={`fi-rr-info ${styles.menuIcon}`} />
                                            About
                                        </Link>
                                        <ul
                                            id="wf-mobile-sub-6"
                                            className={isActive.key === 6 ? 'sub-menu d-block' : 'sub-menu d-none'}
                                        >
                                            <li><Link href="/under-costruction" onClick={onClose}>About WorldFish Digital</Link></li>
                                            <li><Link href="/under-costruction" onClick={onClose}>Vision & strategy</Link></li>
                                            <li><Link href="/under-costruction" onClick={onClose}>Team</Link></li>
                                            <li><Link href="/under-costruction" onClick={onClose}>Contact</Link></li>
                                        </ul>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </PerfectScrollbar>
        </div>
    );
};

export default Sidebar;
