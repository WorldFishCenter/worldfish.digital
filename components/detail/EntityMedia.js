import Image from 'next/image';

function MediaFigure({ image, alt, sizes }) {
    return (
        <figure className="wfMedia">
            <Image
                src={image.src}
                alt={alt}
                width={image.width}
                height={image.height}
                sizes={sizes}
            />
            {image.credit && <figcaption className="wfMediaCredit">{image.credit}</figcaption>}
        </figure>
    );
}

/**
 * The images and video a tool or initiative was submitted with: hero, demo clip, then
 * screenshots. All of it is downloaded and downscaled by scripts/sync-airtable.js, and
 * each image carries its own credit. Renders nothing when there is no media.
 *
 * The video never preloads — much of the audience is on metered mobile data, so no bytes
 * move until someone presses play.
 */
export default function EntityMedia({ name, hero, screenshots = [], video }) {
    if (!hero && !video && screenshots.length === 0) return null;

    return (
        <>
            {hero && (
                <MediaFigure image={hero} alt={name} sizes="(max-width: 1199px) 100vw, 1140px" />
            )}
            {video && (
                <figure className="wfMedia">
                    <video controls playsInline preload="none" poster={hero?.src} src={video.src} />
                </figure>
            )}
            {screenshots.length > 0 && (
                <ul className="wfMediaList">
                    {screenshots.map((shot, i) => (
                        <li key={shot.src}>
                            <MediaFigure
                                image={shot}
                                alt={`${name} — screenshot ${i + 1}`}
                                sizes="(max-width: 767px) 100vw, 570px"
                            />
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
}
