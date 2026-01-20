import { Education } from '@/lib/types'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import { Badge } from './ui/badge';


type Props = { education: Education[] }

const EducationSection = ({ education }: Props) => {
    if (!education || education.length === 0) return null;
    return (
        <section id="education" className="py-32 px-4 max-w-7xl mx-auto">
            <h2 className="mb-10 text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">// Education</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {education.map((edu) => (
                    <Card key={edu.id} className="border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-rose-100 dark:bg-rose-500/20 rounded-lg">
                                    <GraduationCap size={24} className="text-rose-600 dark:text-rose-400" />
                                </div>
                                <Badge variant="outline">{edu.year}</Badge>
                            </div>
                            <CardTitle className="text-xl mb-1">{edu.degree}</CardTitle>
                            <CardDescription className="flex items-center gap-1">
                                {edu.institution}, {edu.location}
                            </CardDescription>
                        </CardHeader>
                        {edu.coursework.length > 0 && (
                            <CardContent>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Relevant Coursework:</p>
                                <div className="flex flex-wrap gap-2">
                                    {edu.coursework.map(course => (
                                        <span key={course} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">
                                            {course}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        )}

                    </Card>
                ))}
            </div>
        </section>
    );
}

export default EducationSection