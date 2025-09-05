// components/ContentPerformance.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, FolderOpen, Eye, Star, Calendar } from 'lucide-react';

interface ContentItem {
    id: string;
    title: string;
    views: number;
    type: 'project' | 'blog';
    featured?: boolean;
    publishedAt?: string;
    status?: string;
}

interface ContentPerformanceProps {
    projects: ContentItem[];
    blogPosts: ContentItem[];
}

export const ContentPerformance: React.FC<ContentPerformanceProps> = ({
    projects,
    blogPosts
}) => {
    return (
        <div className="grid lg:grid-cols-2 gap-8" >
            {/* Top Projects */}
            < div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6" >
                <div className="flex items-center gap-2 mb-6" >
                    <FolderOpen className="text-cyan-400" size={20} />
                    <h3 className="text-lg font-semibold" > Top Performing Projects </h3>
                </div>

                < div className="space-y-3" >
                    {
                        projects.slice(0, 5).map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }
                                }
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                            >
                                <div className="flex-1" >
                                    <div className="flex items-center gap-2 mb-1" >
                                        <span className="text-white font-medium text-sm truncate" >
                                            {project.title}
                                        </span>
                                        {
                                            project.featured && (
                                                <Star size={12} className="text-yellow-400 fill-current" />
                                            )
                                        }
                                    </div>
                                    < div className="flex items-center gap-3 text-xs" >
                                        <span className={
                                            `px-2 py-1 rounded-full ${project.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                                project.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-gray-500/20 text-gray-400'
                                            }`
                                        }>
                                            {project.status}
                                        </span>
                                    </div>
                                </div>
                                < div className="text-right" >
                                    <div className="flex items-center gap-1 text-cyan-400" >
                                        <Eye size={12} />
                                        < span className="font-mono text-sm" > {project.views || 0} </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                </div>
            </div>

            {/* Top Blog Posts */}
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6" >
                <div className="flex items-center gap-2 mb-6" >
                    <FileText className="text-purple-400" size={20} />
                    <h3 className="text-lg font-semibold" > Top Blog Posts </h3>
                </div>

                < div className="space-y-3" >
                    {
                        blogPosts.slice(0, 5).map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                            >
                                <div className="flex-1" >
                                    <div className="flex items-center gap-2 mb-1" >
                                        <span className="text-white font-medium text-sm truncate" >
                                            {post.title}
                                        </span>
                                        {
                                            post.featured && (
                                                <Star size={12} className="text-yellow-400 fill-current" />
                                            )
                                        }
                                    </div>
                                    {
                                        post.publishedAt && (
                                            <div className="flex items-center gap-1 text-xs text-gray-400" >
                                                <Calendar size={10} />
                                                {new Date(post.publishedAt).toLocaleDateString()}
                                            </div>
                                        )
                                    }
                                </div>
                                < div className="text-right" >
                                    <div className="flex items-center gap-1 text-purple-400" >
                                        <Eye size={12} />
                                        < span className="font-mono text-sm" > {post.views} </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                </div>
            </div>
        </div>
    );
};