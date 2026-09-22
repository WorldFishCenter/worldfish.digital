import { notFound } from 'next/navigation';
import CountryDetailClient from '@/components/sections/CountryDetailClient';
import { getCountry, getCountries } from '@/lib/portfolio';
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

    return <CountryDetailClient country={country} />;
}
