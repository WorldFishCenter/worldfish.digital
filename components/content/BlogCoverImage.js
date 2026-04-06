import Image from 'next/image';

export function normalizeBlogCoverSrc(src) {
    if (src == null) return src;
    return String(src).replace(/^\/img\//, '/assets/imgs/page/blog/');
}

/**
 * Blog listing / card image. Uses next/image for same-origin paths; plain img for remote URLs.
 * @param {'thumb' | 'grid'} [variant] thumb = fill inside fixed-height thumb; grid = card grid aspect
 */
export default function BlogCoverImage({ src, alt, className, sizes, priority = false, variant = 'grid' }) {
    const s = normalizeBlogCoverSrc(src);
    const isLocal = typeof s === 'string' && s.startsWith('/');

    if (isLocal) {
        if (variant === 'thumb') {
            return (
                <Image
                    fill
                    src={s}
                    alt={alt || ''}
                    sizes={sizes ?? '(max-width: 992px) 100vw, 400px'}
                    className={className}
                    priority={priority}
                />
            );
        }

        return (
            <Image
                src={s}
                alt={alt || ''}
                width={800}
                height={500}
                sizes={sizes ?? '(max-width: 768px) 100vw, 400px'}
                className={className}
                priority={priority}
            />
        );
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element -- remote URLs need explicit remotePatterns to use next/image
        <img src={s} alt={alt || ''} className={className} loading={priority ? 'eager' : 'lazy'} />
    );
}
