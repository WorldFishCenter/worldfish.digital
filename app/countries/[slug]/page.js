import { notFound } from 'next/navigation';
import CountryDetailClient from '@/components/sections/CountryDetailClient';
import { getCountry, getCountries } from '@/lib/portfolio';
import { DEFAULT_METADATA } from '@/lib/constants';

// The pages that exist are exactly the ones in the committed snapshot. Anything else —
// including a record that is no longer Live — is a real 404, not a rendered "not found".
export const dynamicParams = false;

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
