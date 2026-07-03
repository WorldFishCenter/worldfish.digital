import ProjectsIndexClient from '@/components/sections/ProjectsIndexClient';
import { getProjects } from '@/lib/content';
import { DEFAULT_METADATA } from '@/lib/constants';

export const metadata = {
    ...DEFAULT_METADATA,
    title: 'Projects - WorldFish Digital',
};

export default function ProjectsPage() {
    return <ProjectsIndexClient projects={getProjects()} />;
}
