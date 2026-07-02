import ProductsCatalogClient from '@/components/sections/ProductsCatalogClient';
import { getProducts, getThemes } from '@/lib/content';
import { DEFAULT_METADATA } from '@/lib/constants';

export const metadata = {
    ...DEFAULT_METADATA,
    title: 'Tools & Products - WorldFish Digital',
};

export default function ProductsPage() {
    return <ProductsCatalogClient products={getProducts()} themes={getThemes()} />;
}
