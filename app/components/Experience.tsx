import React from 'react'
import { ExperienceItem as Experience } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Globe } from 'lucide-react';


type Props = {
    experience: Experience[]
}

const ExperienceSection = ({ experience }: Props) => {
    if (!experience || experience.length === 0) return null;

    // Calculate dynamic years of experience
    let totalYears = 0;
    if (experience.length > 0) {
        const startYears = experience.map(exp => exp.start ? exp.start.getFullYear() : new Date().getFullYear());
        const minYear = Math.min(...startYears);
        const currentYear = new Date().getFullYear();
        totalYears = currentYear - minYear;
    }

    // Sort experience by end date (most recent first)
    const sortedExperience = [...experience].sort((a, b) => {
        const dateA = a.end === "present" ? new Date() : new Date(a.end);
        const dateB = b.end === "present" ? new Date() : new Date(b.end);
        return dateB.getTime() - dateA.getTime();
    });

    const formatDate = (date: Date | "present") => {
        if (date === "present") return "Present";
        const d = new Date(date);
        return `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
    };

    return (
        <section id="experience" className="py-32 px-4 max-w-7xl mx-auto">
            <h2 className="mb-16 text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">// Career_Timeline</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column: Timeline */}
                <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 md:ml-0 space-y-12">
                    {sortedExperience.map((exp, i) => {
                        const isActive = exp.end === "present";

                        return (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="relative pl-8 md:pl-12"
                            >
                                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 transition-all ${isActive ? 'bg-rose-500 border-rose-500 dark:shadow-[0_0_15px_rgba(244,63,94,0.6)]' : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-600'}`} />

                                <Badge variant={isActive ? "default" : "secondary"} className="mb-2 font-mono">
                                    {`${formatDate(exp.start)} - ${formatDate(exp.end)}`}
                                </Badge>

                                <h3 className={`text-2xl font-bold ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>{exp.role}</h3>
                                <h4 className="text-lg text-slate-500 dark:text-slate-400 mb-2">{exp.company}</h4>
                                <p className="text-slate-600 dark:text-slate-500 leading-relaxed">{exp.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Right Column: Career Snapshot (Sticky) */}
                <div className="hidden lg:block relative">
                    <div className="sticky top-32">
                        <Card className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-6">
                            <CardHeader className="p-0 mb-6">
                                <CardTitle className="text-xl">Career Snapshot</CardTitle>
                                <CardDescription>A quick look at my professional journey.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 dark:text-slate-400">Total Experience</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{totalYears}+ Years</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "85%" }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="h-full bg-rose-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                        <span className="block text-2xl font-bold text-slate-900 dark:text-white mb-1">5+</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Projects</span>
                                    </div>
                                    <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                        <span className="block text-2xl font-bold text-slate-900 dark:text-white mb-1">1</span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Client</span>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                        <Globe size={16} className="text-rose-500" />
                                        <span>Remote First Culture</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                        <Code size={16} className="text-rose-500" />
                                        <span>Full Stack Capable</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ExperienceSection