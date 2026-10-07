import ForPartnersClient from '@/components/sections/ForPartnersClient';
import { getThemes, getProducts, getProjects } from '@/lib/portfolio';
import { productHref } from '@/lib/routes.mjs';
import { DEFAULT_METADATA } from '@/lib/constants';
import settingsData from '@/content/global/settings.json';
import taxonomy from '@/content/data/taxonomy.json';
import pageCopy from '@/content/pages/for-partners.json';

export const metadata = {
    ...DEFAULT_METADATA,
    title: 'Funding & partnership — WorldFish Digital',
    description:
        'What the WorldFish Digital portfolio covers, who funds it today, and where additional investment would go.',
};

export default function ForPartnersPage() {
    const tools = getProducts();
    // One row per audience, in the vocabulary's order, listing the tools that name it.
    const audiences = taxonomy.audiences.map((audience) => ({
        label: audience,
        value: tools
            .filter((tool) => tool.audiences.includes(audience))
            .map((tool) => ({ href: productHref(tool.slug), label: tool.name })),
    }));
    const funders = [...new Set(getProjects().flatMap((project) => project.funders))];

    return (
        <ForPartnersClient
            themes={getThemes()}
            funders={funders}
            audiences={audiences}
            contactEmails={settingsData.footer.contactEmails}
            unlocks={pageCopy.unlocks}
        />
    );
}
