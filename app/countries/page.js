import CountriesIndexClient from '@/components/sections/CountriesIndexClient';
import { buildCountryMarkers } from '@/components/sections/countryMarkers';
import { getCountries, getThemes } from '@/lib/portfolio';
import { DEFAULT_METADATA } from '@/lib/constants';

export const metadata = {
    ...DEFAULT_METADATA,
    title: 'Countries - WorldFish Digital',
};

export default function CountriesPage() {
    const countries = getCountries();
    const themes = getThemes();
    const themeBySlug = new Map(themes.map((theme) => [theme.slug, theme.name]));

    return (
        <CountriesIndexClient
            countries={countries}
            themeBySlug={themeBySlug}
            markers={buildCountryMarkers(countries, themes)}
        />
    );
}
