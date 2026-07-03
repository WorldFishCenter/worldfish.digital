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
                                    {navigation.primary.map((item, index) => {
                                        const key = index + 1;
                                        const subItems = item.mega
                                            ? item.mega.flatMap((column) => column.items)
                                            : item.submenu;

                                        if (!subItems) {
                                            return (
                                                <li key={item.label}>
                                                    <Link href={item.href} onClick={onClose}>
                                                        {item.label}
                                                    </Link>
                                                </li>
                                            );
                                        }

                                        return (
                                            <li
                                                key={item.label}
                                                className={isActive.key === key ? 'has-children active' : 'has-children'}
                                            >
                                                <button
                                                    type="button"
                                                    className="menu-expand"
                                                    aria-expanded={isActive.key === key}
                                                    aria-controls={`wf-mobile-sub-${key}`}
                                                    onClick={() => handleToggle(key)}
                                                >
                                                    <i className="fi-rr-angle-small-down" />
                                                </button>
                                                <Link href={item.href} onClick={onClose}>
                                                    {item.label}
                                                </Link>
                                                <ul
                                                    id={`wf-mobile-sub-${key}`}
                                                    className={isActive.key === key ? 'sub-menu d-block' : 'sub-menu d-none'}
                                                >
                                                    {subItems.map((subItem) => (
                                                        <li key={subItem.href + subItem.label}>
                                                            {subItem.external ? (
                                                                <a href={subItem.href} target="_blank" rel="noopener noreferrer">
                                                                    {subItem.label}
                                                                </a>
                                                            ) : (
                                                                <Link href={subItem.href} onClick={onClose}>
                                                                    {subItem.label}
                                                                </Link>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        );
                                    })}
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
