// components/admin/ContentTab.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, FileText, Settings, Users, Plus, Edit, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContentTabProps {
    onAddProject: () => void;
    onAddSkill: () => void;
    onAddBlog: () => void;
    onAddExperience: () => void;
}

export const ContentTab: React.FC<ContentTabProps> = ({
    onAddProject,
    onAddSkill,
    onAddBlog,
    onAddExperience
}) => (
    <div className="space-y-8">
        <div>
            <h3 className="text-xl font-semibold mb-2">Content Management</h3>
            <p className="text-gray-400">Manage all your portfolio content from one place</p>
        </div>

        {/* Content Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ContentOverviewCard
                title="Projects"
                count={8}
                subtitle="3 featured"
                icon={<FolderOpen className="text-cyan-400" />}
                color="cyan"
                onAdd={onAddProject}
            />
            <ContentOverviewCard
                title="Skills"
                count={14}
                subtitle="4 categories"
                icon={<Settings className="text-purple-400" />}
                color="purple"
                onAdd={onAddSkill}
            />
            <ContentOverviewCard
                title="Blog Posts"
                count={5}
                subtitle="3 published"
                icon={<FileText className="text-green-400" />}
                color="green"
                onAdd={onAddBlog}
            />
            <ContentOverviewCard
                title="Experience"
                count={3}
                subtitle="1 current"
                icon={<Users className="text-orange-400" />}
                color="orange"
                onAdd={onAddExperience}
            />
        </div>

        {/* Recent Content */}
        <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Recent Projects</h4>
                    <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500" onClick={onAddProject}>
                        <Plus size={14} className="mr-2" />
                        Add Project
                    </Button>
                </div>
                <div className="space-y-3">
                    {[
                        { name: 'Penny Trail Finance Tracker', status: 'completed', featured: true },
                        { name: 'Quiz Application', status: 'completed', featured: false },
                        { name: 'Portfolio Website', status: 'in-progress', featured: true }
                    ].map((project, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                            <div>
                                <p className="text-white text-sm font-medium">{project.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-1 text-xs rounded-full ${project.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {project.status}
                                    </span>
                                    {project.featured && (
                                        <span className="px-2 py-1 text-xs bg-orange-500/20 text-orange-400 rounded-full">
                                            <Star size={10} className="inline mr-1" />
                                            Featured
                                        </span>
                                    )}
                                </div>
                            </div>
                            <Button size="sm" variant="outline">
                                <Edit size={14} />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Recent Blog Posts</h4>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-500" onClick={onAddBlog}>
                        <Plus size={14} className="mr-2" />
                        New Post
                    </Button>
                </div>
                <div className="space-y-3">
                    {[
                        { title: 'How I Built My Portfolio', views: 156, published: true },
                        { title: 'Node.js Best Practices', views: 89, published: true },
                        { title: 'Future of Web Dev', views: 0, published: false }
                    ].map((post, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                            <div>
                                <p className="text-white text-sm font-medium">{post.title}</p>
                                <div className="flex items-center gap-3 text-xs mt-1">
                                    <span className="flex items-center gap-1 text-gray-400">
                                        <Eye size={12} />
                                        {post.views}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full ${post.published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {post.published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                            </div>
                            <Button size="sm" variant="outline">
                                <Edit size={14} />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// Content Overview Card Component
const ContentOverviewCard = ({ title, count, subtitle, icon, color, onAdd }: {
    title: string;
    count: number;
    subtitle: string;
    icon: React.ReactNode;
    color: 'cyan' | 'purple' | 'green' | 'orange';
    onAdd: () => void;
}) => (
    <motion.div
        whileHover={{ y: -2 }}
        className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 hover:border-cyan-500/30 transition-all duration-300 group"
    >
        <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${color === 'cyan' ? 'bg-cyan-500/20' :
                color === 'purple' ? 'bg-purple-500/20' :
                    color === 'green' ? 'bg-green-500/20' :
                        'bg-orange-500/20'
                }`}>
                {icon}
            </div>
            <button
                onClick={onAdd}
                className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${color === 'cyan' ? 'hover:bg-cyan-500/20 text-cyan-400' :
                    color === 'purple' ? 'hover:bg-purple-500/20 text-purple-400' :
                        color === 'green' ? 'hover:bg-green-500/20 text-green-400' :
                            'hover:bg-orange-500/20 text-orange-400'
                    }`}
            >
                <Plus size={14} />
            </button>
        </div>
        <div>
            <p className="text-white font-medium">{title}</p>
            <p className="text-gray-400 text-xs">{subtitle}</p>
        </div>
        <p className="text-2xl font-bold text-white mt-1">{count}</p>
    </motion.div>
);