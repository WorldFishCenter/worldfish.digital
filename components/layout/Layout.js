'use client'
import { useState } from 'react';
import BackToTop from '../elements/BackToTop';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children, headerStyle }) => {
    const [openClass, setOpenClass] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        document.body.classList.add('mobile-menu-active');
        setOpenClass('sidebar-visible');
        setIsOpen((state) => !state);
    };

    const handleRemove = () => {
        if (openClass === 'sidebar-visible') {
            setOpenClass('');
            document.body.classList.remove('mobile-menu-active');
        }
    };
    return (
        <>
            <div className={openClass && 'body-overlay-1'} onClick={handleRemove} />

            <Header handleOpen={handleOpen} headerStyle={headerStyle} />
            <Sidebar openClass={isOpen ? 'sidebar-visible' : ''} />
            <main className="main">{children}</main>
            <Footer />
            <BackToTop />
        </>
    );
};

export default Layout;
