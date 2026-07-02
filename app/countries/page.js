import CountriesIndexClient from '@/components/sections/CountriesIndexClient';
import { getCountries, getThemes } from '@/lib/content';
import { DEFAULT_METADATA } from '@/lib/constants';

export const metadata = {
    ...DEFAULT_METADATA,
    title: 'Countries - WorldFish Digital',
};

export default function CountriesPage() {
    const themeBySlug = new Map(getThemes().map((theme) => [theme.slug, theme.name]));

    return <CountriesIndexClient countries={getCountries()} themeBySlug={themeBySlug} />;
}
