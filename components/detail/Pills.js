import Link from 'next/link';
import { statusVariant } from './meta';

/** A status dot + label, pill-shaped. Used in hero kicker rows. */
export function StatusPill({ status }) {
    if (!status) return null;
    return (
        <span className="wfMetaPill">
            <span className={`wfStatusDot wfStatusDot--${statusVariant(status)}`} aria-hidden="true" />
            {status}
        </span>
    );
}

/** A plain (non-status) pill — e.g. product type or programme. */
export function MetaPill({ children }) {
    if (!children) return null;
    return <span className="wfMetaPill">{children}</span>;
}

/** Compact status readout for list rows (dot + mono label, no border). */
export function StatusTag({ status }) {
    if (!status) return null;
    return (
        <span className="wfStatusTag">
            <span className={`wfStatusDot wfStatusDot--${statusVariant(status)}`} aria-hidden="true" />
            {status}
        </span>
    );
}

/** Non-interactive tag pills (thematic / impact areas, donors, outputs…). */
export function TagList({ items }) {
    if (!items || items.length === 0) return null;
    return (
        <div className="wfFactTags">
            {items.map((item) => (
                <span key={item} className="wfMetaPill wfMetaPill--plain">
                    {item}
                </span>
            ))}
        </div>
    );
}

/** Linked tag pills — items: [{ href, label }]. */
export function LinkTagList({ items }) {
    if (!items || items.length === 0) return null;
    return (
        <div className="wfFactTags">
            {items.map(({ href, label }) => (
                <Link key={href} href={href} className="wfMetaPill wfMetaPill--plain">
                    {label}
                </Link>
            ))}
        </div>
    );
}
