import Link from 'next/link';
import Image from 'next/image';

/**
 * Three featured stories, overlapping the areas strip.
 *
 * Deliberately heterogeneous — a place, a capability, a domain — so one row shows range
 * of both kind and subject. This is the one place on the site where cards beat a list:
 * each item is carried by its own image, which is exactly the condition that makes a
 * card grid worth having.
 *
 * Photography renders monochrome and interface imagery in colour (`tone: 'colour'`), so
 * the digital artefact is the thing that draws the eye.
 *
 * `credit` is optional but should be set on every photograph. WorldFish's Flickr archive
 * names a photographer per image, and that attribution has to travel with the picture —
 * see docs/MEDIA_SOURCING.md.
 */
export default function FeaturedCards({ items, kicker }) {
    return (
        <section className="wfFeatured">
            <div className="container">
                {/* The label leads now. It used to sit under the cards, to keep the first
                    image inside the opening screen; the cards sit below the portfolio, so
                    that reason is gone and a heading a reader meets first is clearer. */}
                {kicker && <p className="wfFeaturedLabel">{kicker}</p>}
                <ul className="wfFeaturedGrid">
                    {items.map((item) => (
                        <li key={item.href} className="wfFeaturedCard">
                            <Link href={item.href} className="wfFeaturedLink">
                                <span className="wfFeaturedMedia">
                                    <Image
                                        src={item.image}
                                        alt={item.imageAlt}
                                        width={880}
                                        height={560}
                                        sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
                                        quality={74}
                                        className={
                                            item.tone === 'colour'
                                                ? 'wfFeaturedImg'
                                                : 'wfFeaturedImg wfFeaturedImgMono'
                                        }
                                        style={
                                            item.focus ? { objectPosition: item.focus } : undefined
                                        }
                                    />
                                </span>
                                {item.credit && (
                                    <span className="wfFeaturedCredit">{item.credit}</span>
                                )}
                                <span className="wfFeaturedBody">
                                    <span className="wfFeaturedKicker">{item.kicker}</span>
                                    <span className="wfFeaturedTitle">{item.title}</span>
                                    <span className="wfFeaturedText">{item.description}</span>
                                    <span className="wfFeaturedMore">{item.cta} →</span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
