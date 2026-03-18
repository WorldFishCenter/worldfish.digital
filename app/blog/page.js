import Link from "next/link";
import Layout from "@/components/layout/Layout";
import { getAllPosts } from "@/lib/posts";
import { BLOG_CONFIG } from "@/lib/constants";

export const metadata = {
    title: `${BLOG_CONFIG.title} - ${BLOG_CONFIG.description}`,
    description: BLOG_CONFIG.description,
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
};

export default async function Blog() {
    const posts = getAllPosts();
    
    return (
        <Layout>
            <section className="section-box">
                <div className="banner-hero banner-breadcrums bg-gray-100">
                    <div className="container text-center">
                        <div className="row">
                            <div className="col-lg-12">
                                <h1 className="text-display-3 color-gray-900 mb-20">{BLOG_CONFIG.title}</h1>
                                <p className="text-heading-6 color-gray-600 mb-20">
                                    {BLOG_CONFIG.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section-box">
                <div className="container mt-90">
                    {posts.length === 0 ? (
                        <div className="row">
                            <div className="col-lg-12 text-center">
                                <p className="text-body-lead-large color-gray-600">
                                    No blog posts yet. Add markdown files to the <code>posts/</code> directory to get started.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="row">
                            {posts.map((post) => (
                                <div key={post.slug} className="col-lg-4 col-sm-12 pr-30 mb-50">
                                    <div className="card-grid-style-4">
                                        {post.date && (
                                            <span className="tag-dot">
                                                {new Date(post.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        )}
                                        <Link href={`/blog/${post.slug}`} className="text-heading-4">
                                            {post.title}
                                        </Link>
                                        {post.description && (
                                            <p className="text-body-text color-gray-500 mt-15">
                                                {post.description}
                                            </p>
                                        )}
                                        {post.coverImage && (
                                            <div className="grid-4-img">
                                                <Link href={`/blog/${post.slug}`}>
                                                    <img
                                                        src={post.coverImage}
                                                        alt={post.title}
                                                        width={400}
                                                        height={250}
                                                        loading="lazy"
                                                        style={{ width: '100%', height: 'auto' }}
                                                    />
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}
