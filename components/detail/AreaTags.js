import Link from 'next/link';
import { areaColor } from './meta';
import { themeHref } from '@/lib/routes.mjs';

/**
 * The impact areas an initiative or tool contributes to, as linked tags.
 *
 * The browse axis the team chose, made visible wherever a reader is deciding what to open.
 * The portfolio listings said where work runs and who funds it but never which domain it
 * serves, which is the one thing a colleague scanning for something reusable is filtering on
 * in their head.
 *
 * Colour is a recognition aid and nothing more — the name is always printed beside the dot,
 * so nothing is carried by hue alone. `exclude` drops the area whose own page this is, where
 * repeating it on every row would be noise.
 */
export default function AreaTags({ areas, exclude, className = '' }) {
    const shown = (areas || []).filter((area) => area.slug !== exclude);
    if (shown.length === 0) return null;

    return (
        <ul className={`wfAreaTags ${className}`.trim()}>
            {shown.map((area) => (
                <li key={area.slug}>
                    <Link href={themeHref(area.slug)} className="wfAreaTag">
                        <span
                            className="wfAreaTagDot"
                            style={{ backgroundColor: areaColor(area.slug) }}
                            aria-hidden="true"
                        />
                        {area.name}
                    </Link>
                </li>
            ))}
        </ul>
    );
}
