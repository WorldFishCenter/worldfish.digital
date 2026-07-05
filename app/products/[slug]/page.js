import { notFound } from 'next/navigation';
import ProductPageClient from '@/components/sections/ProductPageClient';
import {
    getProduct,
    getProducts,
    getRelationshipGraph,
    getTheme,
    getCountry,
    getProject,
} from '@/lib/content';
import { getLatestPostsByChannel } from '@/lib/posts';
import { DEFAULT_METADATA, BLOG_PESKAS } from '@/lib/constants';

export function generateStaticParams() {
    return getProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const product = getProduct(slug);
    if (!product) return DEFAULT_METADATA;

    return {
        ...DEFAULT_METADATA,
        title: `${product.name} - WorldFish Digital`,
        description: product.description || DEFAULT_METADATA.description,
    };
}

export default async function ProductPage({ params }) {
    const { slug } = await params;
    const product = getProduct(slug);
    if (!product) notFound();

    const latestPosts = product.rich?.blogSection?.channel
        ? getLatestPostsByChannel(product.rich.blogSection.channel, BLOG_PESKAS.latestPostsCount)
        : [];
    const graph = getRelationshipGraph(product.slug);
    const themes = (product.themeSlugs || []).map(getTheme).filter(Boolean);
    const countries = (product.countrySlugs || []).map(getCountry).filter(Boolean);
    const projects = (product.projectSlugs || []).map(getProject).filter(Boolean);

    return (
        <ProductPageClient
            product={product}
            latestPosts={latestPosts}
            graph={graph}
            themes={themes}
            countries={countries}
            projects={projects}
        />
    );
}
