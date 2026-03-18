import Link from 'next/link';
import RichText from '../content/RichText';

function BlogSection({ latestPosts, data }) {
    const { title, subtitle, ctaLabel } = data;

    return (
        <section className="section-box">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8">
                        <h3 className="text-heading-1 mb-10">{title}</h3>
                        <RichText
                            content={subtitle}
                            className="text-body-lead-large color-gray-600"
                        />
                    </div>
                    <div className="col-lg-4 text-lg-end text-start pt-30">
                        <Link href="/blog" className="btn btn-black icon-arrow-right-white">
                            {ctaLabel}
                        </Link>
                    </div>
                </div>
            </div>
            <div className="container mt-90">
                <div className="row">
                    {latestPosts && latestPosts.length > 0 ? (
                        latestPosts.map((post) => (
                            <div key={post.slug} className="col-lg-4 col-sm-12 pr-30">
                                <div className="card-grid-style-4">
                                    {post.date && (
                                        <span className="tag-dot">
                                            {new Date(post.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    )}
                                    <Link href={`/blog/${post.slug}`} className="text-heading-4">
                                        {post.title.toUpperCase()}
                                    </Link>
                                    {post.coverImage && (
                                        <div className="grid-4-img">
                                            <Link href={`/blog/${post.slug}`}>
                                                <img
                                                    src={post.coverImage}
                                                    alt={post.title}
                                                    width={400}
                                                    height={250}
                                                    loading="lazy"
                                                />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-lg-12 text-center">
                            <p className="text-body-lead-large color-gray-600">
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
