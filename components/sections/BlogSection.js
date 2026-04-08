import Link from 'next/link';
import RichText from '../content/RichText';
import BlogCoverImage from '../content/BlogCoverImage';

function BlogSection({ latestPosts, data, viewAllHref = '/blog' }) {
    const { title, subtitle, ctaLabel } = data;

    return (
        <section className="section-box wfSectionDark wfPadSection">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8">
                        <h3 className="display-4 mb-10 wfTitleWhite">{title}</h3>
                        <RichText
                            content={subtitle}
                            className="wfLeadMdStatic"
                        />
                    </div>
                    <div className="col-lg-4 text-lg-end text-start pt-30">
                        <Link
                            href={viewAllHref}
                            className="wfBtnPrimary"
                            data-analytics-event="cta_click"
                            data-analytics-category="blog"
                            data-analytics-label="view_all_news"
                            data-analytics-location="blog_section_header"
                        >
                            {ctaLabel} ↗
                        </Link>
                    </div>
                </div>
            </div>
            <div className="container mt-90">
                <div className="wfBlogGrid">
                    {latestPosts && latestPosts.length > 0 ? (
                        latestPosts.map((post) => (
                            <div key={post.slug} className="pr-30 mb-40">
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="wfLinkBlog"
                                    data-analytics-event="blog_post_click"
                                    data-analytics-category="blog"
                                    data-analytics-label={post.slug}
                                    data-analytics-location="blog_section_card"
                                >
                                    <div className="wfBlogCard">
                                        {post.coverImage && (
                                            <div className="wfBlogThumb">
                                                <BlogCoverImage
                                                    src={post.coverImage}
                                                    alt={post.title}
                                                    className="wfCover"
                                                    variant="thumb"
                                                />
                                            </div>
                                        )}
                                        <div className="wfBlogBody">
                                            {post.date && (
                                                <span className="wfBlogMeta">
                                                    {new Date(post.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </span>
                                            )}
                                            <h4 className="wfBlogCardTitle">
                                                {post.title}
                                            </h4>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="wfBlogEmpty">
                            <p className="wfMutedLg">
                                No blog posts available.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default BlogSection;
