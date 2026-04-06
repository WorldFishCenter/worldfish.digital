'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { WORLD_FISH_SITE } from '@/lib/constants';

export default function Error({ error, reset }) {
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.error(error);
        }
    }, [error]);

    return (
        <section className="section-box wfSectionDark wfPadHeroSm">
            <div className="container text-center">
                <h1 className="display-4 wfTitleWhite mb-20">Something went wrong</h1>
                <p className="wfLeadMdStatic wfMutedLg mb-40">
                    An unexpected error occurred. You can try again or return home.
                </p>
                <div className="d-flex flex-wrap gap-3 justify-content-center">
                    <button type="button" className="btn btn-black" onClick={() => reset?.()}>
                        Try again
                    </button>
                    <Link href="/" className="btn btn-black icon-arrow-right-white">
                        {WORLD_FISH_SITE.name}
                    </Link>
                </div>
            </div>
        </section>
    );
}
