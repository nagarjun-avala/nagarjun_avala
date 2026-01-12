import { motion } from 'framer-motion';
import { Project } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';

type Props = {
    projects: Project[]
}

const ProjectsSection = ({ projects }: Props) => {
    if (!projects || projects.length === 0) return null;
    return (
        <section id="work" className="py-32 px-4 max-w-7xl mx-auto">
            <h2 className="mb-10 text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">// Selected_Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((project, i) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="group relative overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 h-[400px] md:h-[500px]">
                            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800">
                                <img
                                    src={project.img}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 dark:opacity-60 dark:group-hover:opacity-40"
                                />
                            </div>

                            <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-white/90 dark:from-slate-950 via-transparent to-transparent">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="mb-3">
                                        <Badge variant="default">{project.cat}</Badge>
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">{project.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-300 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        {project.desc}
                                    </p>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                                        {project.tags.map(tag => (
                                            <Badge key={tag} variant="outline" className="border-slate-400 dark:border-slate-500 text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-transparent">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="absolute top-8 right-8 p-3 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 rotate-45 group-hover:rotate-0">
                                    <ArrowUpRight size={24} />
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

export default ProjectsSection