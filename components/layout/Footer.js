'use client'
import Link from "next/link";
import settingsData from '@/content/global/settings.json';

const Footer = () => {
    const { footer } = settingsData;

    return (
        <>
            <footer className="footer mt-50">
                <div className="container">
                    <div className="footer-top">
                        <div className="row">
                            <div className="col-md-4 col-sm-6 text-center text-md-start">
                                <Link href="/" className="d-flex display-6">
                                    PESKAS™
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
                        <div className="col-lg-3 width-20 mb-30">
                            <h4 className="text-heading-5">About Us</h4>
                            <ul className="menu-footer mt-20">
                                <li>
                                    <Link href="/under-costruction">Mission and Vision</Link>
                                </li>
                                <li>
                                    <Link href="/under-costruction">Our Team</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-3 width-20 mb-30">
                            <h4 className="text-heading-5">Discover</h4>
                            <ul className="menu-footer mt-20">
                                <li>
                                    <Link href="/blog">Our Blog</Link>
                                </li>
                                <li>
                                    <Link href="under-costruction">Knowledge Base</Link>
                                </li>
                                <li>
                                    <Link href="under-costruction">News and Events</Link>
                                </li>
                                <li>
                                    <Link href="/under-costruction">Media</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-3 width-16">
                            <h4 className="text-heading-5">Useful links</h4>
                            <ul className="menu-footer mt-20">
                                <li>
                                    <Link href="/how-it-works">How it works</Link>
                                </li>
                                <li>
                                    <Link href="/under-costruction">Stories</Link>
                                </li>
                            </ul>
                        </div>
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
