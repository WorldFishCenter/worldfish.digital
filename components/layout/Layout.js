'use client'

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import BackToTop from '../elements/BackToTop';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children, headerStyle }) => {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [navPath, setNavPath] = useState(pathname);

    if (pathname !== navPath) {
        setNavPath(pathname);
        setMenuOpen(false);
    }

    const closeMenu = useCallback(() => {
        setMenuOpen(false);
        document.body.classList.remove('mobile-menu-active');
    }, []);

    const toggleMenu = useCallback(() => {
        setMenuOpen((open) => {
            const next = !open;
            if (next) {
                document.body.classList.add('mobile-menu-active');
            } else {
                document.body.classList.remove('mobile-menu-active');
            }
            return next;
        });
    }, []);

    useEffect(() => {
        if (!menuOpen) {
            document.body.classList.remove('mobile-menu-active');
        }
    }, [menuOpen]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') closeMenu();
        };
        if (menuOpen) {
            window.addEventListener('keydown', onKey);
            return () => window.removeEventListener('keydown', onKey);
        }
    }, [menuOpen, closeMenu]);

    useEffect(
        () => () => {
            document.body.classList.remove('mobile-menu-active');
        },
        []
    );

    useEffect(() => {
        if (!menuOpen) return undefined;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [menuOpen]);

    return (
        <>
            <Header menuOpen={menuOpen} onMobileNavToggle={toggleMenu} headerStyle={headerStyle} />
            <div
                className={menuOpen ? 'body-overlay-1 wf-mobile-nav-backdrop' : ''}
                onClick={closeMenu}
                role="presentation"
                aria-hidden={!menuOpen}
            />
            <Sidebar openClass={menuOpen ? 'sidebar-visible' : ''} onClose={closeMenu} />
            <main className="main">{children}</main>
            <Footer />
            <BackToTop />
        </>
    );
};

export default Layout;
