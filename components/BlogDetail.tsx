"use client"
import { Blog } from '@/lib/types'
import { useEffect } from 'react'
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = {
    blog: Blog | null | undefined
    onBack: () => void
}

const BlogDetail = ({ blog, onBack }: Props) => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!blog) return null;

    return (
        <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto min-h-screen">
            {/* Nav Back */}
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors mb-8 group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-bold uppercase tracking-wider">Back to Thoughts</span>
            </button>

            <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <header className="mb-10 text-center">
                    <div className="flex justify-center gap-4 mb-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {blog.date}</span>
                        <span className="flex items-center gap-1"><Clock size={14} /> {blog.readTime}</span>
                        <span className="flex items-center gap-1"><Tag size={14} /> {blog.category}</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-8 leading-tight">{blog.title}</h1>
                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
                        {blog.image ? (
                            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-64 bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                                <span className="text-slate-400">No Image</span>
                            </div>
                        )}
                    </div>
                </header>

                <div className="prose prose-slate dark:prose-invert max-w-none text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {blog.content || "No content available for this blog post."}
                    </ReactMarkdown>
                </div>
            </motion.article>
        </div>
    )
}

export default BlogDetail