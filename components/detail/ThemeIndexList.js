import Link from 'next/link';

const ArrowIcon = () => (
    <svg
        className="wfIndexArrow"
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

/**
 * Editorial numbered index of the work-area themes — typographic rows instead
 * of a card grid. Used on the homepage, /our-work, and For Partners.
 * When `showStats`, the meta line reports portfolio counts; otherwise it shows
 * the theme tagline.
 */
export default function ThemeIndexList({ themes, showStats = false }) {
    return (
        <ol className="wfIndexList">
            {themes.map((theme, i) => {
                const meta = showStats
                    ? `${theme.projectSlugs.length} projects · ${theme.productSlugs.length} tools · ${theme.countrySlugs.length} countries`
                    : theme.tagline;

                return (
                    <li key={theme.slug} className="wfIndexRow">
                        <Link href={`/our-work/${theme.slug}`} className="wfIndexLink">
                            <span className="wfIndexNum">{String(i + 1).padStart(2, '0')}</span>
                            <span className="wfIndexMain">
                                <span className="wfIndexName">{theme.name}</span>
                                {meta && <span className="wfIndexMeta">{meta}</span>}
                            </span>
                            <ArrowIcon />
                        </Link>
                    </li>
                );
            })}
        </ol>
    );
}
