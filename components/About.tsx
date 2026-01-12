import { motion } from 'framer-motion';
import { About } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, Code, Cpu, Globe, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Props = {
    data: About
}

const AboutSection = ({ data }: Props) => {
    if (!data) return null;
    return (
        <section id="about" className="py-32 px-4 max-w-7xl mx-auto">
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mb-10 text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
        // Profile
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="md:col-span-2">
                    <Card className="h-full border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex flex-col justify-center">
                        <CardHeader>
                            <CardTitle className="text-3xl mb-2">{data.title}</CardTitle>
                            <CardDescription className="text-lg leading-relaxed">{data.description}</CardDescription>
                        </CardHeader>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="md:col-span-1 rounded-xl overflow-hidden relative group border border-slate-200 dark:border-slate-800">
                    <img src={data.image} alt="Profile" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                </motion.div>

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

                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="md:col-span-1">
                    <Card className="h-full border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex flex-col justify-between">
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <span className="text-6xl font-bold text-slate-900 dark:text-white">{data.experience.years}</span>
                                <Globe size={24} className="text-slate-400" />
                            </div>
                            <span className="text-slate-500 dark:text-slate-400 mt-4 block">{data.experience.label}</span>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="md:col-span-3">
                    <Card className="h-full border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 flex items-center">
                        <CardContent className="flex flex-wrap gap-2 pt-6">
                            {data.skills.map((tech) => (
                                <Badge key={tech} variant="secondary" className="px-3 py-1 text-sm cursor-default hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:text-rose-600 dark:hover:text-rose-300 transition-colors">
                                    {tech}
                                </Badge>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}

export default AboutSection