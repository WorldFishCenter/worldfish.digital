import Link from 'next/link';
import { StatusTag } from './Pills';

const ArrowIcon = () => (
    <svg
        className="wfEntityArrow"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

function EntityRow({ href, name, sub, status, leading }) {
    return (
        <li className="wfEntityItem">
            <Link href={href} className="wfEntityLink">
                <span className="wfEntityLeft">
                    {leading && <span className="wfEntityLead">{leading}</span>}
                    <span className="wfEntityMain">
                        <span className="wfEntityName">{name}</span>
                        {sub && <span className="wfEntitySub">{sub}</span>}
                    </span>
                </span>
                <span className="wfEntityRight">
                    {status && <StatusTag status={status} />}
                    <ArrowIcon />
                </span>
            </Link>
        </li>
    );
}

/**
 * A dense, scannable list of linked entities (products, projects…).
 * Pass a flat `items` list, or `groups` of [{ title, count?, items }] to
 * organize by (e.g.) component type. Each item: { href, name, sub?, status? }.
 */
export default function EntityLinkList({ items, groups }) {
    if (groups) {
        return (
            <div>
                {groups.map((group) => (
                    <div key={group.title} className="wfEntityGroup">
                        <p className="wfEntityGroupTitle">
                            {group.title}
                            <span className="wfEntityGroupCount">{group.items.length}</span>
                        </p>
                        <ul className="wfEntityList">
                            {group.items.map((item) => (
                                <EntityRow key={item.href} {...item} />
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <ul className="wfEntityList">
            {items.map((item) => (
                <EntityRow key={item.href} {...item} />
            ))}
        </ul>
    );
}
