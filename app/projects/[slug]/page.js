import { notFound } from 'next/navigation';
import ProjectDetailClient from '@/components/sections/ProjectDetailClient';
import {
    getProject,
    getProjects,
    getTheme,
    getCountry,
    getProductsForProject,
    getDonorsForProject,
} from '@/lib/content';
import { DEFAULT_METADATA } from '@/lib/constants';

export function generateStaticParams() {
    return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const project = getProject(slug);
    if (!project) return DEFAULT_METADATA;

    return {
        ...DEFAULT_METADATA,
        title: `${project.fullName || project.name} - WorldFish Digital`,
        description: project.fullName || DEFAULT_METADATA.description,
    };
}

export default async function ProjectPage({ params }) {
    const { slug } = await params;
    const project = getProject(slug);
    if (!project) notFound();

    const themes = project.themeSlugs.map(getTheme).filter(Boolean);
    const countries = project.countrySlugs.map(getCountry).filter(Boolean);
    const products = getProductsForProject(project.slug);
    const donors = getDonorsForProject(project.slug);

    return (
        <ProjectDetailClient
            project={project}
            themes={themes}
            countries={countries}
            products={products}
            donors={donors}
        />
    );
}
