import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const RichText = ({ content, className, style }) => {
    if (content == null) return null;

    const wrapperClass =
        className && className.length > 0
            ? className
            : 'text-body-text color-gray-600';

    const text =
        typeof content === 'string' || typeof content === 'number'
            ? String(content)
            : null;

    if (text == null) {
        if (process.env.NODE_ENV === 'development') {
            // Legacy Tina rich-text objects are no longer supported — use markdown strings in JSON.
            console.warn('[RichText] Expected a string or number; got', typeof content);
        }
        return null;
    }

    return (
        <div className={wrapperClass} style={style}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </div>
    );
};

export default RichText;
