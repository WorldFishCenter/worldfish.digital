import CountriesIndexClient from '@/components/sections/CountriesIndexClient';
import { buildCountryMarkers } from '@/components/sections/countryMarkers';
import { getCountries } from '@/lib/portfolio';
import { DEFAULT_METADATA } from '@/lib/constants';

export const metadata = {
    ...DEFAULT_METADATA,
    title: 'Countries - WorldFish Digital',
};

export default function CountriesPage() {
    const countries = getCountries();

    return <CountriesIndexClient countries={countries} markers={buildCountryMarkers(countries)} />;
}
