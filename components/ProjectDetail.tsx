import { Project } from '@/lib/types'
import { motion } from 'framer-motion';
import { Button } from './ui/button'
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react'
import { Badge } from './ui/badge'
import { useEffect } from 'react';

type Props = {
    project: Project | null | undefined
    onBack: () => void
    onNavigate: (slug: string) => void
    prevProject: Project | null
    nextProject: Project | null
}

const ProjectDetail = ({ project, onBack, onNavigate, prevProject, nextProject }: Props) => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!project) return null;

    return (
        <div className="pt-32 pb-20 px-4 max-w-7xl mx-auto">
            {/* Nav Back */}
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors mb-8 group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-bold uppercase tracking-wider">Back to Work</span>
            </button>

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <Badge variant="secondary" className="mb-4">{project.cat}</Badge>
                        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white">{project.title}</h1>
                    </div>
                    {project.liveLink && (
                        <Button size="lg" className="rounded-full gap-2" asChild>
                            <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                                Visit Live Site <ExternalLink size={18} />
                            </a>
                        </Button>
                    )}
                </div>

                {/* Hero Image */}
                <div className="rounded-2xl overflow-hidden aspect-video border border-slate-200 dark:border-slate-800 shadow-2xl">
                    <img src={project.img} alt={project.title} className="w-full h-full object-cover" />
                </div>
            </motion.div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">

                {/* Sidebar / Metadata */}
                <div className="lg:col-span-1 space-y-8">
                    <div>
                        <h4 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Client</h4>
                        <p className="text-xl text-slate-900 dark:text-white font-medium">{project.client || "Confidential"}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Role</h4>
                        <p className="text-xl text-slate-900 dark:text-white font-medium">{project.role || "Developer"}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Year</h4>
                        <p className="text-xl text-slate-900 dark:text-white font-medium">{project.year || "2023"}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400 mb-3">Tech Stack</h4>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="py-1 px-3 text-sm">{tag}</Badge>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-12">
                    <section>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Overview</h3>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                            {project.desc}
                        </p>
                    </section>

                    {project.challenge && (
                        <section>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">The Challenge</h3>
                            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                {project.challenge}
                            </p>
                        </section>
                    )}

                    {project.solution && (
                        <section>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">The Solution</h3>
                            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                {project.solution}
                            </p>
                        </section>
                    )}

                    {/* Gallery */}
                    {project.gallery && project.gallery.length > 0 && (
                        <section>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Gallery</h3>
                            <div className="grid grid-cols-1 gap-6">
                                {project.gallery.map((img, i) => (
                                    <div key={i} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                                        <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-auto object-cover" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            {/* Next Project Nav (Simple) */}
            <div className="mt-32 pt-12 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <Button variant="ghost" size="lg" className="text-xl gap-4 hover:bg-transparent hover:text-rose-500" onClick={onBack}>
                    Next Project <ArrowRight />
                </Button>
            </div>
        </div>
    );
}

export default ProjectDetail