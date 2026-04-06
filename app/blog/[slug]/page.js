import BlogPostClient from "@/components/sections/BlogPostClient";
import { getPostBySlug, getAllPostSlugs } from "@/lib/posts";
import { notFound } from "next/navigation";
import { POST_CHANNELS, WORLD_FISH_SITE, PESKAS_PRODUCT } from "@/lib/constants";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post || post.draft) return { title: 'Post Not Found' };

    const titleSuffix =
        post.channel === POST_CHANNELS.peskas
            ? `${PESKAS_PRODUCT.name} — ${WORLD_FISH_SITE.name}`
            : WORLD_FISH_SITE.name;

    return {
        title: `${post.title} | ${titleSuffix}`,
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

    if (!post || post.draft) {
        notFound();
    }

    return <BlogPostClient post={post} />;
}
