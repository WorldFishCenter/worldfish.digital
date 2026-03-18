import BlogPostClient from "@/components/sections/BlogPostClient";
import { getPostBySlug, getAllPostSlugs } from "@/lib/posts";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return { title: 'Post Not Found' };

    return {
        title: `${post.title} - Peskas Blog`,
        description: post.description || post.content?.substring(0, 160),
        authors: post.author ? [{ name: post.author }] : [],
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
            },
        },
    };
}

export async function generateStaticParams() {
    const slugs = getAllPostSlugs();
    return slugs.map(s => ({ slug: s.params.slug }));
}

export default async function BlogPost({ params }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    
    if (!post) {
        notFound();
    }

    return <BlogPostClient post={post} />;
}
