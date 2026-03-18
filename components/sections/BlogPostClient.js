'use client'
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Layout from "../layout/Layout";

export default function BlogPostClient({ post }) {
    // Handle script tags in content
    useEffect(() => {
        if (typeof window !== 'undefined' && post?.content) {
            const scriptRegex = /<script\s+src=["']([^"']+)["'][^>]*><\/script>/gi;
            let match;
            const scriptSources = new Set();
            
            while ((match = scriptRegex.exec(post.content)) !== null) {
                scriptSources.add(match[1]);
            }
            
            const placeholders = document.querySelectorAll('.blog-content [data-script-src]');
            placeholders.forEach((placeholder) => {
                const src = placeholder.getAttribute('data-script-src');
                if (src) scriptSources.add(src);
            });
            
            const domScripts = document.querySelectorAll('.blog-content script[src]');
            domScripts.forEach((script) => {
                const src = script.getAttribute('src');
                if (src) scriptSources.add(src);
            });
            
            scriptSources.forEach((src) => {
                if (!document.querySelector(`script[src="${src}"]`)) {
                    const newScript = document.createElement('script');
                    newScript.src = src;
                    newScript.async = true;
                    const placeholder = document.querySelector(`[data-script-src="${src}"]`);
                    if (placeholder && placeholder.parentNode) {
                        placeholder.parentNode.insertBefore(newScript, placeholder);
                    } else {
                        document.body.appendChild(newScript);
                    }
                }
            });
        }
    }, [post]);

    const processContent = (content) => {
        let processed = content.replace(/&#x2F;/g, '/');
        processed = processed.replace(/&#x2f;/g, '/');
        processed = processed.replace(/&amp;/g, '&');
        processed = processed.replace(/&lt;/g, '<');
        processed = processed.replace(/&gt;/g, '>');
        processed = processed.replace(/&quot;/g, '"');
        
        processed = processed.replace(
            /\{\{<mermaid>\}\}([\s\S]*?)\{\{<\/mermaid>\}\}/g,
            (match, mermaidContent) => `\n\`\`\`mermaid\n${mermaidContent.trim()}\n\`\`\`\n`
        );
        
        processed = processed.replace(
            /\{\{<\s*mermaid\s*>\}\}([\s\S]*?)\{\{<\s*\/\s*mermaid\s*>\}\}/g,
            (match, mermaidContent) => `\n\`\`\`mermaid\n${mermaidContent.trim()}\n\`\`\`\n`
        );
        
        processed = processed.replace(
            /\{\{< rawhtml >\}\}([\s\S]*?)\{\{< \/rawhtml >\}\}/g,
            (match, htmlContent) => htmlContent.trim()
        );
        
        processed = processed.replace(
            /\{\{< figure src="([^"]+)"\s*>\}\}/g,
            (match, src) => `![Image](${src.replace(/^\/img\//, '/assets/imgs/page/blog/')})`
        );
        
        processed = processed.replace(
            /!\[([^\]]*)\]\(\/img\/([^)]+)\)/g,
            '![$1](/assets/imgs/page/blog/$2)'
        );
        
        return processed;
    };
    
    const [mermaidLoaded, setMermaidLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            import('mermaid').then((mermaidModule) => {
                const mermaid = mermaidModule.default;
                mermaid.initialize({
                    startOnLoad: false,
                    theme: 'neutral',
                    securityLevel: 'loose',
                    fontFamily: 'Roboto Condensed',
                    fontSize: '14px',
                });
                setMermaidLoaded(true);
            });
        }
    }, []);

    useEffect(() => {
        if (!mermaidLoaded || typeof window === 'undefined') return;

        const renderMermaidDiagrams = async () => {
            const mermaidModule = await import('mermaid');
            const mermaid = mermaidModule.default;
            const mermaidElements = document.querySelectorAll('.mermaid:not([data-rendered])');
            
            if (mermaidElements.length === 0) return;

            mermaidElements.forEach(async (element, index) => {
                element.setAttribute('data-rendered', 'true');
                const graphDefinition = element.getAttribute('data-mermaid-code') || element.textContent.trim();
                if (!graphDefinition) return;

                try {
                    element.textContent = '';
                    const id = `mermaid-${Date.now()}-${index}`;
                    const { svg } = await mermaid.render(id, graphDefinition);
                    element.innerHTML = svg;
                } catch (error) {
                    console.error('Error rendering mermaid diagram:', error);
                    element.textContent = graphDefinition;
                }
            });
        };

        const timer = setTimeout(renderMermaidDiagrams, 300);
        return () => clearTimeout(timer);
    }, [mermaidLoaded, post]);

    if (!post) return null;

    return (
        <Layout>
            <section className="section-box">
                <div className="banner-hero banner-breadcrums bg-gray-100">
                    <div className="container text-center">
                        <div className="row">
                            <div className="col-lg-12">
                                <Link href="/blog" className="text-body-text color-gray-600 mb-10 d-inline-block">
                                    ← Back to Blog
                                </Link>
                                <h1 className="text-display-3 color-gray-900 mb-20">{post.title}</h1>
                                <div className="text-heading-6 color-gray-600 mb-20">
                                    {post.date && (
                                        <span>
                                            {new Date(post.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    )}
                                    {post.author && (
                                        <span>
                                            {post.date && ' • '}
                                            By {post.author}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section-box">
                <div className="container mt-100">
                    <div className="row">
                        <div className="col-lg-1 col-sm-1 col-12" />
                        <div className="col-lg-10 col-sm-10 col-12">
                            {post.coverImage && (
                                <div className="mb-40">
                                    <img
                                        src={post.coverImage.replace(/^\/img\//, '/assets/imgs/page/blog/')}
                                        alt={post.title}
                                        style={{ width: '100%', height: 'auto', borderRadius: '16px' }}
                                    />
                                </div>
                            )}
                            {post.description && (
                                <p className="text-body-lead-large color-gray-600 mb-40">{post.description}</p>
                            )}
                            <div className="blog-content text-body-text color-gray-600">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeRaw]}
                                    components={{
                                        code: ({ node, inline, className, children, ...props }) => {
                                            const match = /language-(\w+)/.exec(className || '');
                                            const language = match ? match[1] : '';
                                            if (inline) return <code className={className} {...props}>{children}</code>;
                                            if (language === 'mermaid') {
                                                const mermaidCode = String(children).replace(/\n$/, '').trim();
                                                return (
                                                    <div className="mermaid-container">
                                                        <div className="mermaid" data-mermaid-code={mermaidCode}>{mermaidCode}</div>
                                                    </div>
                                                );
                                            }
                                            return <pre className={className} {...props}><code>{children}</code></pre>;
                                        },
                                        script: ({ node, ...props }) => <div data-script-src={props.src} style={{ minHeight: '100px' }} className="script-placeholder" />,
                                        img: ({ node, ...props }) => (
                                            <img
                                                {...props}
                                                src={props.src?.replace(/^\/img\//, '/assets/imgs/page/blog/')}
                                                alt={props.alt || ''}
                                                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', margin: '2rem 0' }}
                                            />
                                        ),
                                    }}
                                >
                                    {processContent(post.content)}
                                </ReactMarkdown>
                            </div>
                            {post.tags && post.tags.length > 0 && (
                                <div className="mt-40">
                                    <div className="d-flex flex-wrap gap-2">
                                        {post.tags.map((tag, index) => <span key={index} className="tag-dot">{tag}</span>)}
                                    </div>
                                </div>
                            )}
                            <div className="mt-40 pt-40 bd-top">
                                <Link href="/blog" className="btn btn-black icon-arrow-right-white">Back to Blog</Link>
                            </div>
                        </div>
                        <div className="col-lg-1 col-sm-1 col-12" />
                    </div>
                </div>
            </section>
        </Layout>
    );
}
