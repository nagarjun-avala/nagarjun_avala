import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Blog } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Props = {
    blogs: Blog[]
}

const BlogsSection = ({ blogs }: Props) => {
    if (!blogs || blogs.length === 0) return null;
    return (
        <section id="blogs" className="py-32 px-4 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
                <h2 className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">// Latest_Thoughts</h2>
                <Button variant="link" className="text-rose-500 dark:text-rose-400" asChild>
                    <a href="#">View all posts <ArrowRight className="ml-2 w-4 h-4" /></a>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                    <motion.div
                        key={blog.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className="group cursor-pointer border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900/80 transition-colors h-full">
                            <div className="overflow-hidden rounded-t-xl relative aspect-video bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                                <div className="absolute inset-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                    <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center">
                                        <ArrowUpRight className="text-rose-500 dark:text-rose-400" size={20} />
                                    </div>
                                </div>
                            </div>
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-2 mb-3 text-xs font-medium">
                                    <Badge variant="outline" className="border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10">{blog.category}</Badge>
                                    <span className="text-slate-500">{blog.date}</span>
                                    <span className="text-slate-500">•</span>
                                    <span className="text-slate-500">{blog.readTime}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors leading-tight">
                                    {blog.title}
                                </h3>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

export default BlogsSection