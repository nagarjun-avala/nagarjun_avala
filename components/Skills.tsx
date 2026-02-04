"use client"
import { TechStack } from '@/lib/types'
import React from 'react'
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Code, Cpu, Database, Layers, Terminal } from 'lucide-react';
import { Badge } from './ui/badge';

type Props = {
    techStack: TechStack
}

const SkillsSection = ({ techStack }: Props) => {
    if (!techStack) return null;

    return (
        <section id="skills" className="py-32 px-4 max-w-7xl mx-auto">
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mb-10 text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">// Technical Arsenal</motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(techStack || []).map((stackItem, index) => (
                    <motion.div
                        key={stackItem.category}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="h-full border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-rose-500/30 transition-colors">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    {stackItem.category === "Languages" && <Code size={18} className="text-rose-500" />}
                                    {stackItem.category === "Frontend" && <Layers size={18} className="text-rose-500" />}
                                    {stackItem.category === "Backend" && <Cpu size={18} className="text-rose-500" />}
                                    {stackItem.category === "DevOps & Cloud" && <Cloud size={18} className="text-rose-500" />}
                                    {stackItem.category === "Databases" && <Database size={18} className="text-rose-500" />}
                                    {stackItem.category === "Tools" && <Terminal size={18} className="text-rose-500" />}
                                    {stackItem.category}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-wrap gap-2">
                                {(stackItem.items || []).map(skill => (
                                    <Badge key={skill} variant="secondary" className="text-xs font-normal">
                                        {skill}
                                    </Badge>
                                ))}
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

export default SkillsSection