import ForPartnersClient from '@/components/sections/ForPartnersClient';
import { getThemes, getDonors } from '@/lib/portfolio';
import { DEFAULT_METADATA } from '@/lib/constants';
import settingsData from '@/content/global/settings.json';

export const metadata = {
    ...DEFAULT_METADATA,
    title: 'For Partners - WorldFish Digital',
};

export default function ForPartnersPage() {
    return (
        <ForPartnersClient
            themes={getThemes()}
            donors={getDonors()}
            contactEmails={settingsData.footer.contactEmails}
        />
    );
}
