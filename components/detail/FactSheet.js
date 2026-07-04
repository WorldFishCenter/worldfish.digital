/**
 * Fact sheet — the single home for an entity's metadata associations.
 * Replaces the old stack of one-section-per-association.
 *
 * rows: [{ label, value }]  (rows with a null/empty value are dropped)
 * variant: "aside"  → vertical panel, meant for a sticky sidebar column
 *          "strip"  → horizontal grid of cells, meant for a full-width summary
 */
export default function FactSheet({ rows, variant = 'aside' }) {
    const visible = (rows || []).filter((row) => row && row.value);
    if (visible.length === 0) return null;

    if (variant === 'strip') {
        return (
            <div className="wfFactStrip">
                {visible.map((row) => (
                    <div key={row.label} className="wfFactCell">
                        <div className="wfFactCellLabel">{row.label}</div>
                        <div className="wfFactCellValue">{row.value}</div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="wfFactSheet">
            {visible.map((row) => (
                <div key={row.label} className="wfFactRow">
                    <div className="wfFactLabel">{row.label}</div>
                    <div className="wfFactValue">{row.value}</div>
                </div>
            ))}
        </div>
    );
}
