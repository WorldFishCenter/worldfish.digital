import ThemeIndexClient from '@/components/sections/ThemeIndexClient';
import { getThemes } from '@/lib/portfolio';
import { DEFAULT_METADATA } from '@/lib/constants';

export const metadata = {
    ...DEFAULT_METADATA,
    title: 'Our Work - WorldFish Digital',
};

export default function OurWorkPage() {
    return <ThemeIndexClient themes={getThemes()} />;
}
