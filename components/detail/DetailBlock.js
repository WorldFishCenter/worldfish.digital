/** A modest content block on a detail page: small kicker + section title + body.
 *  Deliberately lighter than a hero — several stack cleanly in one column. */
export default function DetailBlock({ kicker, title, children }) {
    return (
        <div className="wfDetailBlock">
            {kicker && <p className="wfSectionKicker">{kicker}</p>}
            {title && <h2 className="wfSectionTitle">{title}</h2>}
            {children}
        </div>
    );
}
