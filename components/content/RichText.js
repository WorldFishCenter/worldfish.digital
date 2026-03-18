import { TinaMarkdown } from "tinacms/dist/rich-text";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const RichText = ({ content, className }) => {
    if (!content) return null;

    const wrapperClass =
        className && className.length > 0
            ? className
            : "text-body-text color-gray-600";

    // Legacy / markdown-string content: render as Markdown
    if (typeof content === "string") {
        return (
            <div className={wrapperClass}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                </ReactMarkdown>
            </div>
        );
    }

    // Rich-text AST from Tina
    return (
        <div className={wrapperClass}>
            <TinaMarkdown content={content} />
        </div>
    );
};

export default RichText;


