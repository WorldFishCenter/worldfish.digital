import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import BlogCoverImage from '@/components/content/BlogCoverImage';
import { getAllPosts } from '@/lib/posts';
import { BLOG_WORLD_FISH, WORLD_FISH_SITE } from '@/lib/constants';

export const metadata = {
    title: `${BLOG_WORLD_FISH.title} | ${WORLD_FISH_SITE.name}`,
    description: BLOG_WORLD_FISH.description,
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
            <section className="section-box wfSectionDark wfPadHeroSm">
                <div className="container text-center">
                    <div className="row">
                        <div className="col-lg-10 mx-auto">
                            <h1 className="display-3 wfTitleHeroTight wfTitleHeroMb">{BLOG_WORLD_FISH.title}</h1>
                            <p className="wfLeadMdStatic">{BLOG_WORLD_FISH.description}</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section-box wfSectionDark wfPadSection">
                <div className="container">
                    {posts.length === 0 ? (
                        <div className="row">
                            <div className="col-lg-12 text-center">
                                <p className="wfMutedLg">
                                    No blog posts yet. Add markdown files to the{' '}
                                    <code className="wf-code-inline">posts/</code> directory to get started.
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
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        )}
                                        <Link href={`/blog/${post.slug}`} className="text-heading-4">
                                            {post.title}
                                        </Link>
                                        {post.description && (
                                            <p className="text-body-text color-gray-500 mt-15">{post.description}</p>
                                        )}
                                        {post.coverImage && (
                                            <div className="grid-4-img">
                                                <Link href={`/blog/${post.slug}`}>
                                                    <BlogCoverImage
                                                        src={post.coverImage}
                                                        alt={post.title}
                                                        className="wfImgResponsive"
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
