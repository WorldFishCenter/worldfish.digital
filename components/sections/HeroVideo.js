'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

/**
 * Full-bleed hero: Timor-Leste vessel tracks behind the headline.
 *
 * The video is decoration — it carries nothing the poster frame doesn't — so it is
 * strictly progressive enhancement:
 *   - the poster renders for everyone, always, and is the only thing in the markup;
 *   - the <video> mounts client-side and only on wide viewports;
 *   - `prefers-reduced-motion` suppresses it entirely.
 * Much of the audience is on African and Pacific mobile connections, which is why
 * mobile never downloads it. If the sources 404 (they do until the compressed loop is
 * generated — see docs/HERO_VIDEO.md) the poster simply stays put.
 */
export default function HeroVideo({ poster, sources = [], children }) {
    const [playVideo, setPlayVideo] = useState(false);

    useEffect(() => {
        const wide = window.matchMedia('(min-width: 992px)');
        const still = window.matchMedia('(prefers-reduced-motion: reduce)');
        const decide = () => setPlayVideo(wide.matches && !still.matches);

        decide();
        wide.addEventListener('change', decide);
        still.addEventListener('change', decide);
        return () => {
            wide.removeEventListener('change', decide);
            still.removeEventListener('change', decide);
        };
    }, []);

    return (
        <section className="wfHeroBand">
            <div className="wfHeroMedia" aria-hidden="true">
                {/* LCP element: eager, optimised, and the permanent fallback for every
                    viewport that never loads the video. */}
                <Image
                    className="wfHeroPoster"
                    src={poster}
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                    quality={72}
                />
                {playVideo && (
                    <video
                        className="wfHeroVideo"
                        poster={poster}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="none"
                        tabIndex={-1}
                    >
                        {sources.map((s) => (
                            <source key={s.src} src={s.src} type={s.type} />
                        ))}
                    </video>
                )}
            </div>
            <div className="wfHeroScrim" aria-hidden="true" />
            <div className="container wfHeroCopy">{children}</div>
        </section>
    );
}
