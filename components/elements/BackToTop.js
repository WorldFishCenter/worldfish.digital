'use client'
import { useEffect, useState } from "react";

function BackToTop() {
    const [hasScrolled, setHasScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => {
            if (window.scrollY > 100) {
                setHasScrolled(true);
            } else {
                setHasScrolled(false);
            }
        };
        window.addEventListener("scroll", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    return (
        <>
            {hasScrolled && (
                <a id="scrollUp" href="#top" className="wfBackToTop">
                    <i className="fi-rr-arrow-small-up" />
                </a>


            )}
        </>
    );
}
export default BackToTop;