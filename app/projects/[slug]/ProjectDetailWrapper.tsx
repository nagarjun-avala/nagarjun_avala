"use client"

import { useRouter } from 'next/navigation';
import ProjectDetail from '@/components/ProjectDetail';
import { Project } from '@/lib/types';

interface WrapperProps {
    project: Project;
    prevProject: Project | null;
    nextProject: Project | null;
}

export default function ProjectDetailWrapper({ project, prevProject, nextProject }: WrapperProps) {
    const router = useRouter();

    return (
        <ProjectDetail
            project={project}
            onBack={() => router.push('/#work')}
            onNavigate={(slug) => router.push(`/projects/${slug}`)}
            prevProject={prevProject}
            nextProject={nextProject}
        />
    );
}
