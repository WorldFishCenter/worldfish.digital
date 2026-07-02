'use client'
import Link from 'next/link';
import settingsData from '@/content/global/settings.json';
import styles from './Footer.module.css';

const Footer = () => {
    const { footer } = settingsData;

    return (
        <>
            <footer className="footer mt-50">
                <div className="container">
                    <div className="footer-top">
                        <div className="row">
                            <div className="col-md-4 col-sm-6 text-center text-md-start">
                                <Link href="/" className={`d-flex ${styles.brandLink}`}>
                                    <img
                                        src="/assets/imgs/brand/worldfish-logo-white.svg"
                                        alt="WorldFish"
                                        className={styles.brandLogoImg}
                                    />
                                    <span className={styles.brandSuffix}>Digital</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 width-20 mb-30">
                            <h4 className="text-heading-5">Contact</h4>
                            <ul className="list-unstyled mt-20 mb-0">
                                {footer.contactEmails.map((email) => (
                                    <li key={email} className="text-body-text color-gray-600">
                                        <a href={`mailto:${email}`} className="color-gray-600 text-decoration-none">
                                            {email}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {footer.columns.map((column) => (
                            <div key={column.title} className="col-lg-3 width-20 mb-30">
                                <h4 className="text-heading-5">{column.title}</h4>
                                <ul className="menu-footer mt-20">
                                    {column.links.map((link) => (
                                        <li key={link.href + link.label}>
                                            <Link href={link.href}>{link.label}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="footer-bottom mt-20">
                        <div className="row">
                            <div className="col-md-6">
                                <span className="color-gray-400 text-body-lead">{footer.copyright}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
