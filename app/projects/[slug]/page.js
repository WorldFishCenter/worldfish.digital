import { notFound } from 'next/navigation';
import ProjectDetailClient from '@/components/sections/ProjectDetailClient';
import { getProject, getProjects } from '@/lib/portfolio';
import { DEFAULT_METADATA } from '@/lib/constants';

// The pages that exist are exactly the ones in the committed snapshot. Anything else —
// including a record that is no longer Live — is a real 404, not a rendered "not found".
export const dynamicParams = false;

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
        description: project.summary || DEFAULT_METADATA.description,
    };
}

export default async function ProjectPage({ params }) {
    const { slug } = await params;
    const project = getProject(slug);
    if (!project) notFound();

    return <ProjectDetailClient project={project} />;
}
