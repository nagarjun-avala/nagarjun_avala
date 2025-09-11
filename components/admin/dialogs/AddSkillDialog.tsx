import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Skill } from '@prisma/client';

const SkillSchema = z.object({
    name: z.string().min(1, 'Skill name is required'),
    category: z.string().min(1, 'Category is required'),
    years: z.number().min(0, 'Years must be positive').max(50, 'Years cannot exceed 50'),
    proficiency: z.number().min(0, 'Proficiency must be at least 0').max(100, 'Proficiency cannot exceed 100'),
    description: z.string().optional(),
    icon: z.string().optional()
});

type SkillFormData = z.infer<typeof SkillSchema>;

interface AddSkillDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (skill: Skill) => void;
}

export const AddSkillDialog: React.FC<AddSkillDialogProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<SkillFormData>({
        resolver: zodResolver(SkillSchema),
        defaultValues: {
            name: '',
            category: 'Frontend',
            years: 1,
            proficiency: 50,
            description: '',
            icon: ''
        }
    });

    const proficiencyValue = watch('proficiency');

    const onSubmit: SubmitHandler<SkillFormData> = async (data: SkillFormData) => {
        setLoading(true);

        try {
            const response = await fetch('/api/admin/skills', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const newSkill = await response.json();
                toast.success('Skill added successfully!');
                onSuccess?.(newSkill);
                handleClose();
            } else {
                const error = await response.json();
                toast.error(error.error || 'Failed to add skill');
            }
        } catch (error) {
            console.error('Add skill error:', error);
            toast.error('Failed to add skill. Please try again.');
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
                    className="fixed inset-0 bg-black/30 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={(e) => e.target === e.currentTarget && handleClose()}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white dark:bg-gray-900/95 backdrop-blur border border-purple-500/20 dark:border-purple-500/30 rounded-2xl p-8 w-full max-w-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 dark:bg-purple-500/20 rounded-lg">
                                    <Settings className="text-purple-600 dark:text-purple-400" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Skill</h2>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Add a new skill to your portfolio</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                {/* Skill Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Skill Name *
                                    </label>
                                    <input
                                        type="text"
                                        {...register("name")}
                                        placeholder="React, Python, etc."
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        {...register("category")}
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                                    >
                                        <option value="Frontend">Frontend</option>
                                        <option value="Backend">Backend</option>
                                        <option value="Database">Database</option>
                                        <option value="Tools">Tools</option>
                                        <option value="Design">Design</option>
                                        <option value="DevOps">DevOps</option>
                                        <option value="Mobile">Mobile</option>
                                    </select>
                                    {errors.category && (
                                        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.category.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Years + Proficiency */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Years of Experience
                                    </label>
                                    <input
                                        type="number"
                                        {...register("years", { valueAsNumber: true })}
                                        min="0"
                                        max="50"
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg  text-gray-900 dark:text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                                    />
                                    {errors.years && (
                                        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.years.message}</p>
                                    )}
                                </div>


                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Proficiency:{" "}
                                        <span className="text-purple-600 dark:text-purple-400 font-bold">
                                            {proficiencyValue}%
                                        </span>
                                    </label>
                                    <input
                                        type="range"
                                        {...register("proficiency", { valueAsNumber: true })}
                                        min="0"
                                        max="100"
                                        className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
                                        style={{ background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${proficiencyValue}%, #374151 ${proficiencyValue}%, #374151 100%)` }}
                                    />
                                    {errors.proficiency && (
                                        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.proficiency.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    {...register("description")}
                                    placeholder="Brief description of your experience with this skill..."
                                    rows={3}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none"
                                />
                                {errors.description && (
                                    <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.description.message}</p>
                                )}
                            </div>

                            {/* Icon */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Icon (Emoji or Unicode)
                                </label>
                                <input
                                    type="text"
                                    {...register("icon")}
                                    placeholder="⚛️, 🐍, 💾, etc."
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                                />
                                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                    Optional: Add an emoji or icon to represent this skill
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={16} className="mr-2" />
                                                Add Skill
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                                <Button
                                    type="button"
                                    onClick={handleClose}
                                    variant="outline"
                                    className="border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 py-3 rounded-xl"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div >
            )}
        </AnimatePresence >
    );
};