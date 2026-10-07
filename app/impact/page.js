import ImpactPageClient from '@/components/sections/ImpactPageClient';
import { getOutcomes } from '@/lib/portfolio';
import { DEFAULT_METADATA } from '@/lib/constants';
import impactCopy from '@/content/pages/impact.json';

export const metadata = {
    ...DEFAULT_METADATA,
    title: 'Impact — WorldFish Digital',
    description:
        'What the WorldFish Digital portfolio has changed, where, with whom — and how well each claim is evidenced.',
};

export default function ImpactPage() {
    return <ImpactPageClient copy={impactCopy} outcomes={getOutcomes()} />;
}
