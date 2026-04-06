import { defaultSchema } from 'hast-util-sanitize';

/**
 * Sanitization schema for blog HTML embedded in markdown (rehype-raw).
 * Extends GitHub-style defaults with classes and data attrs used by Mermaid/script placeholders.
 */
export const blogPostSanitizeSchema = {
    ...defaultSchema,
    attributes: {
        ...defaultSchema.attributes,
        div: [
            ...(defaultSchema.attributes.div ?? []),
            'className',
            'dataMermaidCode',
            'dataScriptSrc',
            'dataRendered',
        ],
    },
    tagNames: [...defaultSchema.tagNames, 'figure', 'figcaption'],
};
