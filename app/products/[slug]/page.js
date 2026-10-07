import { notFound } from 'next/navigation';
import ProductPageClient from '@/components/sections/ProductPageClient';
import { getProduct, getProducts } from '@/lib/portfolio';
import { DEFAULT_METADATA } from '@/lib/constants';

// The pages that exist are exactly the ones in the committed snapshot. Anything else —
// including a record that is no longer Live — is a real 404, not a rendered "not found".
export const dynamicParams = false;

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
        description: product.summary || DEFAULT_METADATA.description,
    };
}

export default async function ProductPage({ params }) {
    const { slug } = await params;
    const product = getProduct(slug);
    if (!product) notFound();

    return <ProductPageClient product={product} />;
}
