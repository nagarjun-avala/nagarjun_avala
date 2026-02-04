import { MOCK_DATA } from '@/lib/data';
import { Project } from '@/lib/types';
import Navbar from '@/components/Navbar';
import { Metadata } from 'next';
import ProjectDetailWrapper from './ProjectDetailWrapper';

// Fetch Project Data
async function getProject(slug: string): Promise<Project | null> {
    try {
        let apiUri = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
        if (apiUri.startsWith('/')) {
            apiUri = "http://localhost:5000/api";
        }
        const res = await fetch(`${apiUri}/portfolio/projects/${slug}`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) return null;

        const json = await res.json();
        return json.success ? json.data : null;
    } catch (error) {
        console.error("Failed to fetch project:", error);
        return null;
    }
}

// Generate Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        return {
            title: "Project Not Found",
        };
    }

    return {
        title: `${project.title} | Project`,
        description: project.desc,
        openGraph: {
            images: project.img ? [project.img] : [],
        }
    };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await getProject(slug);

    // Fallback to MOCK_DATA if API fails or project not found in API (for dev continuity if API is empty)
    const displayProject = project || MOCK_DATA.projects.find(p => p.slug === slug);

    if (!displayProject) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
                    <p className="text-slate-500">The project you are looking for does not exist.</p>
                </div>
            </div>
        );
    }

    // Determine Prev/Next project from MOCK_DATA for navigational continuity
    // (Ideally this should come from API, but for now we mix)
    const index = MOCK_DATA.projects.findIndex(p => p.slug === slug);
    const prevProject = index > 0 ? MOCK_DATA.projects[index - 1] : null;
    const nextProject = index < MOCK_DATA.projects.length - 1 ? MOCK_DATA.projects[index + 1] : null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Navbar isDetailView={true} />
            <ProjectDetailWrapper
                project={displayProject}
                prevProject={prevProject}
                nextProject={nextProject}
            />
        </div>
    );
}
