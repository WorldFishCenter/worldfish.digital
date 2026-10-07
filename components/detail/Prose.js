/** Authored multi-line text from Airtable — one paragraph per line. */
export default function Prose({ text }) {
    return (
        <div className="wfProse">
            {text
                .split(/\n+/)
                .filter((line) => line.trim())
                .map((line, i) => (
                    <p key={i}>{line}</p>
                ))}
        </div>
    );
}
