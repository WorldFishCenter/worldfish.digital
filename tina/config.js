import { defineConfig } from 'tinacms';

const branch =
    process.env.NEXT_PUBLIC_TINA_BRANCH ||
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF ||
    process.env.HEAD ||
    'main';

export default defineConfig({
    branch,
    clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || '',
    token: process.env.TINA_TOKEN || '',

    media: {
        tina: {
            publicFolder: 'public',
            mediaRoot: 'uploads',
        },
    },

    build: {
        outputFolder: 'admin',
        publicFolder: 'public',
    },

    schema: {
        collections: [
            // ─── Blog Posts ──────────────────────────────────────────────
            {
                name: 'post',
                label: 'Blog Posts',
                path: 'posts',
                format: 'md',
                match: { exclude: 'draft-post' },
                defaultItem: () => ({
                    title: 'New Post',
                    date: new Date().toISOString(),
                    draft: false,
                    tags: [],
                }),
                ui: {
                    filename: {
                        slugify: (values) =>
                            (values?.title || 'new-post')
                                .toLowerCase()
                                .replace(/\s+/g, '-')
                                .replace(/[^a-z0-9-]/g, ''),
                    },
                },
                fields: [
                    {
                        type: 'string',
                        name: 'title',
                        label: 'Title',
                        isTitle: true,
                        required: true,
                    },
                    {
                        type: 'datetime',
                        name: 'date',
                        label: 'Date',
                        required: true,
                    },
                    {
                        type: 'string',
                        name: 'author',
                        label: 'Author',
                    },
                    {
                        type: 'string',
                        name: 'description',
                        label: 'Description / Excerpt',
                        ui: { component: 'textarea' },
                    },
                    {
                        type: 'string',
                        name: 'tags',
                        label: 'Tags',
                        list: true,
                    },
                    {
                        type: 'boolean',
                        name: 'draft',
                        label: 'Draft (unpublished)',
                    },
                    {
                        type: 'image',
                        name: 'coverImage',
                        label: 'Cover Image',
                    },
                    {
                        type: 'rich-text',
                        name: 'body',
                        label: 'Body',
                        isBody: true,
                    },
                ],
            },

            // ─── Regions ─────────────────────────────────────────────────
            {
                name: 'regions',
                label: 'Regions',
                path: 'content/global',
                format: 'json',
                match: { include: 'regions' },
                ui: {
                    allowedActions: { create: false, delete: false },
                },
                fields: [
                    {
                        type: 'object',
                        name: 'regions',
                        label: 'Region List',
                        list: true,
                        ui: {
                            itemProps: (item) => ({ label: item?.title || 'Region' }),
                        },
                        fields: [
                            {
                                type: 'string',
                                name: 'title',
                                label: 'Country / Region Name',
                                required: true,
                            },
                            {
                                type: 'rich-text',
                                name: 'desc',
                                label: 'Description',
                                required: true,
                            },
                            {
                                type: 'string',
                                name: 'ctaLabel',
                                label: 'Button Label (leave empty to hide)',
                            },
                            {
                                type: 'string',
                                name: 'ctaHref',
                                label: 'Button URL (leave empty to hide)',
                            },
                            {
                                type: 'image',
                                name: 'image',
                                label: 'Background Image',
                            },
                        ],
                    },
                ],
            },

            // ─── Global Settings ─────────────────────────────────────────
            {
                name: 'settings',
                label: 'Global Settings',
                path: 'content/global',
                format: 'json',
                match: { include: 'settings' },
                ui: {
                    allowedActions: { create: false, delete: false },
                },
                fields: [
                    {
                        type: 'object',
                        name: 'header',
                        label: 'Header & Navigation',
                        fields: [
                            {
                                type: 'string',
                                name: 'siteTitle',
                                label: 'Site Title / Logo Text',
                            },
                            {
                                type: 'object',
                                name: 'primaryLinks',
                                label: 'Primary Links',
                                list: true,
                                ui: {
                                    itemProps: (item) => ({ label: item?.label || 'Link' }),
                                },
                                fields: [
                                    {
                                        type: 'string',
                                        name: 'label',
                                        label: 'Label',
                                    },
                                    {
                                        type: 'string',
                                        name: 'href',
                                        label: 'URL',
                                    },
                                    {
                                        type: 'string',
                                        name: 'iconClass',
                                        label: 'Icon CSS Class (optional)',
                                    },
                                ],
                            },
                            {
                                type: 'object',
                                name: 'countriesMenu',
                                label: 'Countries Menu',
                                fields: [
                                    {
                                        type: 'string',
                                        name: 'label',
                                        label: 'Menu Label',
                                    },
                                    {
                                        type: 'string',
                                        name: 'iconClass',
                                        label: 'Icon CSS Class (optional)',
                                    },
                                    {
                                        type: 'object',
                                        name: 'items',
                                        label: 'Country Links',
                                        list: true,
                                        ui: {
                                            itemProps: (item) => ({ label: item?.label || 'Country' }),
                                        },
                                        fields: [
                                            {
                                                type: 'string',
                                                name: 'label',
                                                label: 'Label',
                                            },
                                            {
                                                type: 'string',
                                                name: 'href',
                                                label: 'URL',
                                            },
                                            {
                                                type: 'boolean',
                                                name: 'external',
                                                label: 'Open in new tab',
                                            },
                                            {
                                                type: 'image',
                                                name: 'flagSrc',
                                                label: 'Flag Image',
                                            },
                                            {
                                                type: 'string',
                                                name: 'flagAlt',
                                                label: 'Flag Alt Text',
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                type: 'object',
                                name: 'resourcesMenu',
                                label: 'Resources Menu',
                                fields: [
                                    {
                                        type: 'string',
                                        name: 'label',
                                        label: 'Menu Label',
                                    },
                                    {
                                        type: 'string',
                                        name: 'iconClass',
                                        label: 'Icon CSS Class (optional)',
                                    },
                                    {
                                        type: 'object',
                                        name: 'items',
                                        label: 'Resource Links',
                                        list: true,
                                        ui: {
                                            itemProps: (item) => ({ label: item?.label || 'Resource' }),
                                        },
                                        fields: [
                                            {
                                                type: 'string',
                                                name: 'label',
                                                label: 'Label',
                                            },
                                            {
                                                type: 'string',
                                                name: 'href',
                                                label: 'URL',
                                            },
                                            {
                                                type: 'image',
                                                name: 'iconSrc',
                                                label: 'Icon Image (optional)',
                                            },
                                            {
                                                type: 'string',
                                                name: 'iconAlt',
                                                label: 'Icon Alt Text',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'object',
                        name: 'footer',
                        label: 'Footer',
                        fields: [
                            {
                                type: 'string',
                                name: 'copyright',
                                label: 'Copyright Text',
                            },
                            {
                                type: 'string',
                                name: 'contactEmails',
                                label: 'Contact Emails',
                                list: true,
                            },
                            {
                                type: 'object',
                                name: 'columns',
                                label: 'Footer Columns',
                                list: true,
                                ui: {
                                    itemProps: (item) => ({ label: item?.title || 'Column' }),
                                },
                                fields: [
                                    {
                                        type: 'string',
                                        name: 'title',
                                        label: 'Column Title',
                                    },
                                    {
                                        type: 'object',
                                        name: 'links',
                                        label: 'Links',
                                        list: true,
                                        ui: {
                                            itemProps: (item) => ({ label: item?.label || 'Link' }),
                                        },
                                        fields: [
                                            {
                                                type: 'string',
                                                name: 'label',
                                                label: 'Label',
                                            },
                                            {
                                                type: 'string',
                                                name: 'href',
                                                label: 'URL',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'object',
                        name: 'blog',
                        label: 'Blog Settings',
                        fields: [
                            {
                                type: 'string',
                                name: 'title',
                                label: 'Blog Title',
                            },
                            {
                                type: 'rich-text',
                                name: 'description',
                                label: 'Blog Description',
                            },
                            {
                                type: 'number',
                                name: 'latestPostsCount',
                                label: 'Latest Posts on Homepage',
                            },
                            {
                                type: 'number',
                                name: 'postsPerPage',
                                label: 'Posts Per Page (future use)',
                            },
                        ],
                    },
                ],
            },

            // ─── Homepage ────────────────────────────────────────────────
            {
                name: 'homepage',
                label: 'Homepage',
                path: 'content/pages',
                format: 'json',
                match: { include: 'homepage' },
                ui: {
                    allowedActions: { create: false, delete: false },
                },
                fields: [
                    // Hero
                    {
                        type: 'object',
                        name: 'hero',
                        label: 'Hero Section',
                        fields: [
                            { type: 'string', name: 'headline', label: 'Headline' },
                            { type: 'string', name: 'headlineHighlight', label: 'Headline Highlighted Text (green)' },
                            {
                                type: 'rich-text',
                                name: 'subtitle',
                                label: 'Subtitle',
                            },
                            { type: 'string', name: 'ctaLabel', label: 'Button Label' },
                        ],
                    },
                    // Stats
                    {
                        type: 'object',
                        name: 'stats',
                        label: 'Stats',
                        list: true,
                        ui: {
                            itemProps: (item) => ({ label: item?.label || 'Stat' }),
                        },
                        fields: [
                            { type: 'number', name: 'count', label: 'Number' },
                            { type: 'string', name: 'suffix', label: 'Suffix (e.g. k, %)' },
                            { type: 'string', name: 'label', label: 'Label' },
                        ],
                    },
                    // Regions Section text
                    {
                        type: 'object',
                        name: 'regionsSection',
                        label: 'Regions Section',
                        fields: [
                            { type: 'string', name: 'title', label: 'Title' },
                            {
                                type: 'rich-text',
                                name: 'subtitle',
                                label: 'Subtitle',
                            },
                            { type: 'string', name: 'wioPrompt', label: 'WIO Link Prompt Text' },
                            { type: 'string', name: 'wioHref', label: 'WIO Link URL' },
                            { type: 'string', name: 'wioCta', label: 'WIO Button Label' },
                        ],
                    },
                    // Feature cards
                    {
                        type: 'object',
                        name: 'features',
                        label: 'Feature Cards',
                        list: true,
                        ui: {
                            itemProps: (item) => ({ label: item?.title || 'Feature' }),
                        },
                        fields: [
                            { type: 'string', name: 'title', label: 'Title' },
                            {
                                type: 'rich-text',
                                name: 'description',
                                label: 'Description',
                            },
                            { type: 'string', name: 'bgClass', label: 'CSS Background Class' },
                        ],
                    },
                    // About section
                    {
                        type: 'object',
                        name: 'about',
                        label: 'About Section',
                        fields: [
                            { type: 'string', name: 'title', label: 'Title' },
                            {
                                type: 'rich-text',
                                name: 'subtitle',
                                label: 'Subtitle',
                            },
                            { type: 'image', name: 'image', label: 'Image' },
                            {
                                type: 'object',
                                name: 'features',
                                label: 'Feature Boxes',
                                list: true,
                                ui: {
                                    itemProps: (item) => ({ label: item?.title || 'Feature' }),
                                },
                                fields: [
                                    { type: 'string', name: 'title', label: 'Title' },
                                    {
                                        type: 'rich-text',
                                        name: 'description',
                                        label: 'Description',
                                    },
                                ],
                            },
                        ],
                    },
                    // CTA section
                    {
                        type: 'object',
                        name: 'cta',
                        label: 'CTA Section',
                        fields: [
                            { type: 'string', name: 'title', label: 'Title' },
                            {
                                type: 'rich-text',
                                name: 'subtitle',
                                label: 'Subtitle',
                            },
                            { type: 'string', name: 'ctaLabel', label: 'Button Label' },
                            { type: 'string', name: 'ctaHref', label: 'Button URL' },
                        ],
                    },
                    // Tracks section
                    {
                        type: 'object',
                        name: 'tracks',
                        label: 'Tracks Section',
                        fields: [
                            { type: 'string', name: 'title', label: 'Title' },
                            {
                                type: 'rich-text',
                                name: 'subtitle',
                                label: 'Subtitle',
                            },
                            { type: 'string', name: 'col1Title', label: 'Column 1 Title' },
                            {
                                type: 'string',
                                name: 'col1Items',
                                label: 'Column 1 Items',
                                list: true,
                            },
                            { type: 'string', name: 'col2Title', label: 'Column 2 Title' },
                            {
                                type: 'string',
                                name: 'col2Items',
                                label: 'Column 2 Items',
                                list: true,
                            },
                            { type: 'string', name: 'ctaLabel', label: 'Button Label' },
                            { type: 'string', name: 'ctaHref', label: 'Button URL' },
                        ],
                    },
                    // Video
                    {
                        type: 'string',
                        name: 'videoYoutubeId',
                        label: 'YouTube Video ID',
                    },
                    // Blog section
                    {
                        type: 'object',
                        name: 'blogSection',
                        label: 'Blog Section',
                        fields: [
                            { type: 'string', name: 'title', label: 'Title' },
                            { type: 'string', name: 'subtitle', label: 'Subtitle' },
                            { type: 'string', name: 'ctaLabel', label: 'View More Button Label' },
                        ],
                    },
                ],
            },

            // ─── How It Works ────────────────────────────────────────────
            {
                name: 'howItWorks',
                label: 'How It Works Page',
                path: 'content/pages',
                format: 'json',
                match: { include: 'how-it-works' },
                ui: {
                    allowedActions: { create: false, delete: false },
                },
                fields: [
                    {
                        type: 'object',
                        name: 'hero',
                        label: 'Hero',
                        fields: [
                            { type: 'string', name: 'title', label: 'Title' },
                            {
                                type: 'rich-text',
                                name: 'subtitle',
                                label: 'Subtitle',
                            },
                        ],
                    },
                    {
                        type: 'object',
                        name: 'pipeline',
                        label: 'Pipeline Overview',
                        fields: [
                            { type: 'string', name: 'title', label: 'Title' },
                            {
                                type: 'rich-text',
                                name: 'subtitle',
                                label: 'Subtitle',
                            },
                            {
                                type: 'object',
                                name: 'stages',
                                label: 'Stages',
                                list: true,
                                ui: {
                                    itemProps: (item) => ({ label: item?.kicker || 'Stage' }),
                                },
                                fields: [
                                    { type: 'string', name: 'kicker', label: 'Badge Label' },
                                    { type: 'string', name: 'title', label: 'Title' },
                                    {
                                        type: 'rich-text',
                                        name: 'description',
                                        label: 'Description',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'object',
                        name: 'workflow',
                        label: 'Workflow Steps',
                        fields: [
                            { type: 'string', name: 'title', label: 'Title' },
                            {
                                type: 'rich-text',
                                name: 'subtitle',
                                label: 'Subtitle',
                            },
                            {
                                type: 'object',
                                name: 'steps',
                                label: 'Steps',
                                list: true,
                                ui: {
                                    itemProps: (item) => ({ label: item?.title || 'Step' }),
                                },
                                fields: [
                                    { type: 'string', name: 'id', label: 'Number (e.g. 01)' },
                                    { type: 'string', name: 'title', label: 'Title' },
                                    {
                                        type: 'rich-text',
                                        name: 'summary',
                                        label: 'Summary',
                                    },
                                    { type: 'string', name: 'items', label: 'Bullet Points', list: true },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'object',
                        name: 'modules',
                        label: 'Platform Modules',
                        fields: [
                            { type: 'string', name: 'title', label: 'Title' },
                            {
                                type: 'rich-text',
                                name: 'subtitle',
                                label: 'Subtitle',
                            },
                            {
                                type: 'object',
                                name: 'items',
                                label: 'Modules',
                                list: true,
                                ui: {
                                    itemProps: (item) => ({ label: item?.title || 'Module' }),
                                },
                                fields: [
                                    { type: 'string', name: 'title', label: 'Title' },
                                    { type: 'image', name: 'icon', label: 'Icon' },
                                    {
                                        type: 'rich-text',
                                        name: 'body',
                                        label: 'Body',
                                    },
                                    { type: 'string', name: 'items', label: 'Bullet Points', list: true },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'object',
                        name: 'keyFeatures',
                        label: 'Key Features',
                        fields: [
                            { type: 'string', name: 'title', label: 'Title' },
                            { type: 'string', name: 'items', label: 'Feature Items', list: true },
                        ],
                    },
                    {
                        type: 'object',
                        name: 'resourceLinks',
                        label: 'Resource Links',
                        fields: [
                            { type: 'string', name: 'title', label: 'Title' },
                            {
                                type: 'object',
                                name: 'items',
                                label: 'Links',
                                list: true,
                                ui: {
                                    itemProps: (item) => ({ label: item?.label || 'Link' }),
                                },
                                fields: [
                                    { type: 'string', name: 'label', label: 'Label' },
                                    { type: 'string', name: 'href', label: 'URL' },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'object',
                        name: 'faq',
                        label: 'FAQ',
                        fields: [
                            { type: 'string', name: 'title', label: 'Title' },
                            {
                                type: 'rich-text',
                                name: 'subtitle',
                                label: 'Subtitle',
                            },
                            {
                                type: 'object',
                                name: 'items',
                                label: 'Q&A Items',
                                list: true,
                                ui: {
                                    itemProps: (item) => ({ label: item?.q || 'Question' }),
                                },
                                fields: [
                                    { type: 'string', name: 'q', label: 'Question' },
                                    {
                                        type: 'rich-text',
                                        name: 'a',
                                        label: 'Answer',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'object',
                        name: 'cta',
                        label: 'CTA / Contact Section',
                        fields: [
                            { type: 'string', name: 'title', label: 'Title' },
                            {
                                type: 'rich-text',
                                name: 'subtitle',
                                label: 'Subtitle',
                            },
                            { type: 'string', name: 'airtableUrl', label: 'Airtable Form URL' },
                        ],
                    },
                ],
            },

            // ─── Data Resources ──────────────────────────────────────────
            {
                name: 'dataResources',
                label: 'Data & Resources Page',
                path: 'content/pages',
                format: 'json',
                match: { include: 'data-resources' },
                ui: {
                    allowedActions: { create: false, delete: false },
                },
                fields: [
                    {
                        type: 'object',
                        name: 'hero',
                        label: 'Hero',
                        fields: [
                            { type: 'string', name: 'title', label: 'Title' },
                            {
                                type: 'rich-text',
                                name: 'subtitle',
                                label: 'Subtitle',
                            },
                        ],
                    },
                    {
                        type: 'object',
                        name: 'publications',
                        label: 'Publications Section',
                        fields: [
                            { type: 'string', name: 'title', label: 'Title' },
                            {
                                type: 'rich-text',
                                name: 'description',
                                label: 'Description',
                            },
                            { type: 'string', name: 'airtableUrl', label: 'Airtable Embed URL' },
                        ],
                    },
                    {
                        type: 'object',
                        name: 'data',
                        label: 'Data Section',
                        fields: [
                            { type: 'string', name: 'title', label: 'Title' },
                            {
                                type: 'rich-text',
                                name: 'description',
                                label: 'Description',
                            },
                        ],
                    },
                ],
            },

            // ─── Terms & Policies ────────────────────────────────────────
            {
                name: 'terms',
                label: 'Terms & Policies Page',
                path: 'content/pages',
                format: 'json',
                match: { include: 'terms' },
                ui: {
                    allowedActions: { create: false, delete: false },
                },
                fields: [
                    {
                        type: 'object',
                        name: 'hero',
                        label: 'Hero',
                        fields: [
                            { type: 'string', name: 'title', label: 'Title' },
                        ],
                    },
                    {
                        type: 'object',
                        name: 'tableOfContents',
                        label: 'Table of Contents',
                        list: true,
                        ui: {
                            itemProps: (item) => ({ label: item?.label || item?.id || 'Section' }),
                        },
                        fields: [
                            {
                                type: 'string',
                                name: 'id',
                                label: 'Anchor ID (e.g. taseguru)',
                            },
                            {
                                type: 'string',
                                name: 'label',
                                label: 'Label',
                            },
                        ],
                    },
                    {
                        type: 'object',
                        name: 'sections',
                        label: 'Sections',
                        list: true,
                        ui: {
                            itemProps: (item) => ({ label: item?.title || item?.id || 'Section' }),
                        },
                        fields: [
                            {
                                type: 'string',
                                name: 'id',
                                label: 'Anchor ID (must match a TOC item)',
                            },
                            {
                                type: 'string',
                                name: 'title',
                                label: 'Title',
                            },
                            {
                                type: 'rich-text',
                                name: 'body',
                                label: 'Body',
                            },
                        ],
                    },
                    {
                        type: 'string',
                        name: 'footerNote',
                        label: 'Footer Note',
                    },
                ],
            },
        ],
    },
});
