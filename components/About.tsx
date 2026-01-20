import { motion } from 'framer-motion';
import { About } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, Code, Cpu, Globe, Layers, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Props = {
    data: About & {
        languages: string[]
    }
}

const AboutSection = ({ data }: Props) => {
    if (!data) return null;
    return (
        <section id="about" className="py-32 px-4 max-w-7xl mx-auto">
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mb-10 text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        // Profile
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-150">

                {/* 1. Bio Box (Row 1, Span 2) */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="md:col-span-2">
                    <Card className="h-full border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex flex-col justify-center">
                        <CardHeader>
                            <CardTitle className="text-3xl mb-2">{data.title}</CardTitle>
                            <CardDescription className="text-lg leading-relaxed">{data.description}</CardDescription>
                        </CardHeader>
                    </Card>
                </motion.div>

                {/* 2. Image Box (Row 1, Span 1) */}
                <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="md:col-span-1 rounded-xl overflow-hidden relative group border border-slate-200 dark:border-slate-800">
                    <img src={data.image} alt="Profile" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                </motion.div>

                {/* 3. Focus Box (Row 1, Span 1) - Restored from previous turn */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="md:col-span-1">
                    <Card className="h-full border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex flex-col justify-between">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-bold">Focus</CardTitle>
                            <ArrowUpRight size={20} className="text-rose-500 dark:text-rose-400" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-500/20"><Layers size={18} className="text-rose-600 dark:text-rose-400" /></div>
                                <span className="font-medium text-slate-700 dark:text-slate-300">UI/UX Design</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-500/20"><Code size={18} className="text-rose-600 dark:text-rose-400" /></div>
                                <span className="font-medium text-slate-700 dark:text-slate-300">Frontend Dev</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-500/20"><Cpu size={18} className="text-rose-600 dark:text-rose-400" /></div>
                                <span className="font-medium text-slate-700 dark:text-slate-300">Backend Ops</span>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* 4. Global/Languages Box (Row 2, Span 1) */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 }} className="md:col-span-1">
                    <Card className="h-full border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex flex-col justify-between">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Globe size={20} className="text-rose-500 dark:text-rose-400" />
                                Global
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-500/20"><MapPin size={18} className="text-rose-600 dark:text-rose-400" /></div>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{data.location}</span>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Languages</p>
                                <div className="flex flex-wrap gap-2">
                                    {data.languages && data.languages.map(lang => (
                                        <Badge key={lang} variant="secondary" className="text-xs">{lang.split(' ')[0]}</Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* 5. Experience Box (Row 2, Span 1) */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="md:col-span-1">
                    <Card className="h-full border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex flex-col justify-center items-center">
                        <CardContent className="pt-6 text-center">
                            <div className="flex items-center justify-center gap-4 mb-2">
                                <span className="text-8xl font-bold text-slate-900 dark:text-white leading-none">{data.experience.years > 0 ? data.experience.years : data.experience.months}{data.experience.sign}</span>
                                <Globe size={48} className="text-slate-400 opacity-50" />
                            </div>
                            <span className="text-xl text-slate-500 dark:text-slate-400 block font-medium uppercase tracking-widest">{data.experience.displaySuffix} {data.experience.label}</span>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* 6. Tech Stack Summary (Row 2, Span 2) - New to fill the grid */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="md:col-span-2">
                    <Card className="h-full border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex flex-col justify-center">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold mb-2">Core Tech</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {/* Show a subset of skills for the summary */}
                            {data.skills && data.skills.slice(0, 8).map((tech) => (
                                <Badge key={tech} variant="secondary" className="px-3 py-1 text-sm cursor-default hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:text-rose-600 dark:hover:text-rose-300 transition-colors">
                                    {tech}
                                </Badge>
                            ))}
                            {data.skills && data.skills.length > 8 && (
                                <Badge variant="outline" className="px-3 py-1 text-sm text-slate-500">+{data.skills.length - 8} more</Badge>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}

export default AboutSection