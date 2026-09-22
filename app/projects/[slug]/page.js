import { notFound } from 'next/navigation';
import ProjectDetailClient from '@/components/sections/ProjectDetailClient';
import { getProject, getProjects } from '@/lib/portfolio';
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

    return <ProjectDetailClient project={project} />;
}
