import { notFound } from 'next/navigation';
import CountryDetailClient from '@/components/sections/CountryDetailClient';
import { getCountry, getCountries, getTheme, getProduct, getProject } from '@/lib/content';
import { DEFAULT_METADATA } from '@/lib/constants';

export function generateStaticParams() {
    return getCountries().map((country) => ({ slug: country.slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const country = getCountry(slug);
    if (!country) return DEFAULT_METADATA;

    return {
        ...DEFAULT_METADATA,
        title: `${country.name} - WorldFish Digital`,
        description: country.description,
    };
}

export default async function CountryPage({ params }) {
    const { slug } = await params;
    const country = getCountry(slug);
    if (!country) notFound();

    const themes = country.themeSlugs.map(getTheme).filter(Boolean);
    const products = country.productSlugs.map(getProduct).filter(Boolean);
    const projects = country.projectSlugs.map(getProject).filter(Boolean);

    return <CountryDetailClient country={country} themes={themes} products={products} projects={projects} />;
}
