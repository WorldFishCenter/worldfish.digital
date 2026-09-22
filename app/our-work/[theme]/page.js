import { notFound } from 'next/navigation';
import ThemeDetailClient from '@/components/sections/ThemeDetailClient';
import { getTheme, getThemes } from '@/lib/portfolio';
import { DEFAULT_METADATA } from '@/lib/constants';

export function generateStaticParams() {
    return getThemes().map((theme) => ({ theme: theme.slug }));
}

export async function generateMetadata({ params }) {
    const { theme: themeSlug } = await params;
    const theme = getTheme(themeSlug);
    if (!theme) return DEFAULT_METADATA;

    return {
        ...DEFAULT_METADATA,
        title: `${theme.name} - WorldFish Digital`,
        description: theme.description,
    };
}

export default async function ThemePage({ params }) {
    const { theme: themeSlug } = await params;
    const theme = getTheme(themeSlug);
    if (!theme) notFound();

    return <ThemeDetailClient theme={theme} />;
}
