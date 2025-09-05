// components/DynamicProjects.tsx - Add tracking
const DynamicProjectsComponent: React.FC<DynamicProjectsProps> = ({ projects }) => {
    const analytics = useAnalytics();

    const handleProjectClick = (project: Project) => {
        // Track project view
        analytics?.trackProjectView(project.id, project.slug);
        analytics?.trackEvent('project_clicked', {
            projectName: project.name,
            projectSlug: project.slug,
            projectTech: project.technologies
        });
    };

    // ... rest of component with onClick handlers
};
