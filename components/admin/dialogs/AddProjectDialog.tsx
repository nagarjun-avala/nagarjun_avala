// components/admin/dialogs/AddProjectDialog.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderOpen, Save, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Project } from '@prisma/client';

const ProjectSchema = z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().min(1, 'Description is required'),
    longDescription: z.string().optional(),
    technologies: z.string().min(1, 'Technologies are required'),
    imageUrl: z.string().optional(),
    demoUrl: z.string().optional(),
    githubUrl: z.string().optional(),
    status: z.enum(['completed', 'in-progress', 'archived']),
    featured: z.boolean()
});

type ProjectFormData = z.infer<typeof ProjectSchema>;

interface AddProjectDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (project: Project) => void;
}

export const AddProjectDialog: React.FC<AddProjectDialogProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset } = useForm<ProjectFormData>({
            resolver: zodResolver(ProjectSchema),
            defaultValues: {
                name: '',
                description: '',
                longDescription: '',
                technologies: '',
                imageUrl: '',
                demoUrl: '',
                githubUrl: '',
                status: 'completed',
                featured: false
            }
        });

    const onSubmit: SubmitHandler<ProjectFormData> = async (data: ProjectFormData) => {
        setLoading(true);

        try {
            const techArray = data.technologies.split(',').map(t => t.trim()).filter(Boolean);
            const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            const response = await fetch('/api/admin/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    technologies: techArray,
                    slug
                })
            });

            if (response.ok) {
                const newProject = await response.json();
                toast.success('Project added successfully!');
                onSuccess?.(newProject);
                handleClose();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to add project');
            }
        } catch (error) {
            console.error('Add project error:', error);
            toast.error('Failed to add project. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={(e) => e.target === e.currentTarget && handleClose()}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-gray-900/95 backdrop-blur border border-cyan-500/30 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-cyan-500/20 rounded-lg">
                                    <FolderOpen className="text-cyan-400" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Add New Project</h2>
                                    <p className="text-gray-400 text-sm">Create a new portfolio project</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Project Name *</label>
                                    <input
                                        type="text"
                                        {...register('name')}
                                        placeholder="Awesome Project"
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                                    />
                                    {errors.name && (
                                        <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                                    <select
                                        {...register('status')}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                                    >
                                        <option value="completed">Completed</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                                <textarea
                                    {...register('description')}
                                    placeholder="Brief description of your project..."
                                    rows={3}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 resize-none"
                                />
                                {errors.description && (
                                    <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Detailed Description</label>
                                <textarea
                                    {...register('longDescription')}
                                    placeholder="Detailed description with features, architecture, challenges, etc..."
                                    rows={4}
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Technologies *</label>
                                <input
                                    type="text"
                                    {...register('technologies')}
                                    placeholder="React, Next.js, TypeScript, MongoDB (comma separated)"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                                />
                                <p className="text-gray-500 text-xs mt-1">Separate technologies with commas</p>
                                {errors.technologies && (
                                    <p className="text-red-400 text-sm mt-1">{errors.technologies.message}</p>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Demo URL</label>
                                    <input
                                        type="url"
                                        {...register('demoUrl')}
                                        placeholder="https://project-demo.com"
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
                                    <input
                                        type="url"
                                        {...register('githubUrl')}
                                        placeholder="https://github.com/username/repo"
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Project Image URL</label>
                                <input
                                    type="url"
                                    {...register('imageUrl')}
                                    placeholder="https://example.com/project-image.jpg"
                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    {...register('featured')}
                                    className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 focus:ring-2"
                                />
                                <label htmlFor="featured" className="text-gray-300 text-sm flex items-center gap-2">
                                    <Star size={14} className="text-yellow-400" />
                                    Mark as featured project
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} className="mr-2" />
                                                Add Project
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                                <Button
                                    type="button"
                                    onClick={handleClose}
                                    variant="outline"
                                    className="border-gray-600 hover:border-gray-500 py-3 rounded-xl"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};