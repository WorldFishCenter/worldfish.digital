import TeamPageClient from '@/components/sections/TeamPageClient';
import { getTeam } from '@/lib/content';
import { DEFAULT_METADATA } from '@/lib/constants';

export const metadata = {
    ...DEFAULT_METADATA,
    title: 'Team - WorldFish Digital',
};

export default function TeamPage() {
    return <TeamPageClient team={getTeam()} />;
}
