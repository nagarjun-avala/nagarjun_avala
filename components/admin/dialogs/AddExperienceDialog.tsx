// components/admin/dialogs/AddExperienceDialog.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Briefcase,
    Save,
    Calendar,
    MapPin,
    Building2,
    Plus,
    Trash2,
    Star,
    Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

const ExperienceSchema = z.object({
    title: z.string().min(1, 'Job title is required'),
    company: z.string().min(1, 'Company name is required'),
    location: z.string().optional(),
    type: z.enum(['full-time', 'part-time', 'freelance', 'contract', 'internship']),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    achievements: z.array(z.object({
        text: z.string().min(1, 'Achievement cannot be empty')
    })).min(1, 'At least one achievement is required'),
    technologies: z.array(z.object({
        name: z.string().min(1, 'Technology name cannot be empty')
    })),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    isCurrent: z.boolean().default(false),
    companyUrl: z.string().url().optional().or(z.literal('')),
    salary: z.string().optional(),
    teamSize: z.number().min(0).optional(),
    isRemote: z.boolean().default(false)
});

type ExperienceFormData = z.infer<typeof ExperienceSchema>;

interface AddExperienceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (experience: ExperienceFormData) => void;
    editData?: any; // For editing existing experience
}

export const AddExperienceDialog: React.FC<AddExperienceDialogProps> = ({
    isOpen,
    onClose,
    onSuccess,
    editData
}) => {
    const [loading, setLoading] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
        control
    } = useForm<ExperienceFormData>({
        resolver: zodResolver(ExperienceSchema),
        defaultValues: {
            title: '',
            company: '',
            location: '',
            type: 'full-time',
            description: '',
            achievements: [{ text: '' }],
            technologies: [],
            startDate: '',
            endDate: '',
            isCurrent: false,
            companyUrl: '',
            salary: '',
            teamSize: undefined,
            isRemote: false
        }
    });

    const { fields: achievementFields, append: appendAchievement, remove: removeAchievement } = useFieldArray({
        control,
        name: "achievements"
    });

    const { fields: techFields, append: appendTech, remove: removeTech } = useFieldArray({
        control,
        name: "technologies"
    });

    const isCurrent = watch('isCurrent');
    const watchedData = watch();

    // Load edit data
    useEffect(() => {
        if (editData && isOpen) {
            reset({
                ...editData,
                achievements: editData.achievements?.map((text: string) => ({ text })) || [{ text: '' }],
                technologies: editData.technologies?.map((name: string) => ({ name })) || [],
                startDate: editData.startDate ? new Date(editData.startDate).toISOString().split('T')[0] : '',
                endDate: editData.endDate ? new Date(editData.endDate).toISOString().split('T')[0] : ''
            });
        }
    }, [editData, isOpen, reset]);

    const onSubmit: SubmitHandler<ExperienceFormData> = async (data: ExperienceFormData) => {
        setLoading(true);

        try {
            const payload = {
                ...data,
                achievements: data.achievements.map(a => a.text).filter(Boolean),
                technologies: data.technologies.map(t => t.name).filter(Boolean),
                startDate: new Date(data.startDate),
                endDate: data.endDate && !data.isCurrent ? new Date(data.endDate) : null
            };

            const url = editData ? `/api/admin/experience/${editData.id}` : '/api/admin/experience';
            const method = editData ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                toast.success(`Experience ${editData ? 'updated' : 'added'} successfully!`);
                onSuccess?.(result);
                handleClose();
            } else {
                const error = await response.json();
                toast.error(error.error || `Failed to ${editData ? 'update' : 'add'} experience`);
            }
        } catch (error) {
            console.error('Experience form error:', error);
            toast.error(`Failed to ${editData ? 'update' : 'add'} experience. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        reset();
        setPreviewMode(false);
        onClose();
    };

    const addAchievement = () => {
        appendAchievement({ text: '' });
    };

    const addTechnology = () => {
        appendTech({ name: '' });
    };

    const calculateDuration = () => {
        if (!watchedData.startDate) return '';

        const start = new Date(watchedData.startDate);
        const end = isCurrent ? new Date() : (watchedData.endDate ? new Date(watchedData.endDate) : new Date());

        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        if (years === 0) return `${months} month${months !== 1 ? 's' : ''}`;
        if (remainingMonths === 0) return `${years} year${years !== 1 ? 's' : ''}`;
        return `${years} year${years !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
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
                        className="bg-gray-900/95 backdrop-blur border border-orange-500/30 rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-500/20 rounded-lg">
                                    <Briefcase className="text-orange-400" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        {editData ? 'Edit' : 'Add'} Work Experience
                                    </h2>
                                    <p className="text-gray-400 text-sm">
                                        {editData ? 'Update your professional experience' : 'Add your professional experience'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button
                                    type="button"
                                    onClick={() => setPreviewMode(!previewMode)}
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-600"
                                >
                                    {previewMode ? 'Edit' : 'Preview'}
                                </Button>
                                <button
                                    onClick={handleClose}
                                    className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700/50"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {previewMode ? (
                                // Preview Mode
                                <ExperiencePreview data={watchedData} duration={calculateDuration()} />
                            ) : (
                                // Edit Mode
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    {/* Basic Information */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Job Title *
                                            </label>
                                            <input
                                                type="text"
                                                {...register('title')}
                                                placeholder="Senior Frontend Developer"
                                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                                            />
                                            {errors.title && (
                                                <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Company *
                                            </label>
                                            <input
                                                type="text"
                                                {...register('company')}
                                                placeholder="Amazing Tech Co."
                                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                                            />
                                            {errors.company && (
                                                <p className="text-red-400 text-sm mt-1">{errors.company.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Location
                                            </label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                                <input
                                                    type="text"
                                                    {...register('location')}
                                                    placeholder="Chennai, India"
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Employment Type
                                            </label>
                                            <select
                                                {...register('type')}
                                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                                            >
                                                <option value="full-time">Full-time</option>
                                                <option value="part-time">Part-time</option>
                                                <option value="freelance">Freelance</option>
                                                <option value="contract">Contract</option>
                                                <option value="internship">Internship</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Team Size
                                            </label>
                                            <div className="relative">
                                                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                                <input
                                                    type="number"
                                                    {...register('teamSize', { valueAsNumber: true })}
                                                    placeholder="5"
                                                    min="0"
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Details */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Company URL
                                            </label>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                                <input
                                                    type="url"
                                                    {...register('companyUrl')}
                                                    placeholder="https://company.com"
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Salary Range (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                {...register('salary')}
                                                placeholder="$50,000 - $70,000"
                                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                                            />
                                        </div>
                                    </div>

                                    {/* Work Type Toggles */}
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="remote"
                                                {...register('isRemote')}
                                                className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                                            />
                                            <label htmlFor="remote" className="text-gray-300 text-sm">
                                                Remote Position
                                            </label>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Job Description *
                                        </label>
                                        <textarea
                                            {...register('description')}
                                            placeholder="Describe your role, responsibilities, and day-to-day activities..."
                                            rows={4}
                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 resize-none"
                                        />
                                        {errors.description && (
                                            <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
                                        )}
                                    </div>

                                    {/* Achievements */}
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="block text-sm font-medium text-gray-300">
                                                Key Achievements *
                                            </label>
                                            <Button
                                                type="button"
                                                onClick={addAchievement}
                                                size="sm"
                                                variant="outline"
                                                className="border-orange-500/30 text-orange-400"
                                            >
                                                <Plus size={14} className="mr-2" />
                                                Add Achievement
                                            </Button>
                                        </div>

                                        <div className="space-y-3">
                                            {achievementFields.map((field, index) => (
                                                <motion.div
                                                    key={field.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="flex gap-3 items-start"
                                                >
                                                    <div className="flex-1">
                                                        <textarea
                                                            {...register(`achievements.${index}.text` as const)}
                                                            placeholder="Built responsive web applications that improved user engagement by 40%..."
                                                            rows={2}
                                                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 resize-none"
                                                        />
                                                        {errors.achievements?.[index]?.text && (
                                                            <p className="text-red-400 text-sm mt-1">
                                                                {errors.achievements[index]?.text?.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {achievementFields.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            onClick={() => removeAchievement(index)}
                                                            size="sm"
                                                            variant="outline"
                                                            className="mt-3 border-red-500/30 text-red-400 hover:bg-red-500/10"
                                                        >
                                                            <Trash2 size={14} />
                                                        </Button>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                        {errors.achievements && (
                                            <p className="text-red-400 text-sm mt-1">At least one achievement is required</p>
                                        )}
                                    </div>

                                    {/* Technologies */}
                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="block text-sm font-medium text-gray-300">
                                                Technologies Used
                                            </label>
                                            <Button
                                                type="button"
                                                onClick={addTechnology}
                                                size="sm"
                                                variant="outline"
                                                className="border-orange-500/30 text-orange-400"
                                            >
                                                <Plus size={14} className="mr-2" />
                                                Add Technology
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {techFields.map((field, index) => (
                                                <motion.div
                                                    key={field.id}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="flex gap-2"
                                                >
                                                    <input
                                                        {...register(`technologies.${index}.name` as const)}
                                                        placeholder="React"
                                                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 text-sm"
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={() => removeTech(index)}
                                                        size="sm"
                                                        variant="outline"
                                                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 p-2"
                                                    >
                                                        <Trash2 size={12} />
                                                    </Button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Date Range */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Start Date *
                                            </label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                                <input
                                                    type="date"
                                                    {...register('startDate')}
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300"
                                                />
                                            </div>
                                            {errors.startDate && (
                                                <p className="text-red-400 text-sm mt-1">{errors.startDate.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                End Date
                                            </label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                                <input
                                                    type="date"
                                                    {...register('endDate')}
                                                    disabled={isCurrent}
                                                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                />
                                            </div>
                                            {calculateDuration() && (
                                                <p className="text-orange-400 text-sm mt-1">
                                                    Duration: {calculateDuration()}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="current"
                                            {...register('isCurrent')}
                                            onChange={(e) => {
                                                setValue('isCurrent', e.target.checked);
                                                if (e.target.checked) {
                                                    setValue('endDate', '');
                                                }
                                            }}
                                            className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500 focus:ring-2"
                                        />
                                        <label htmlFor="current" className="text-gray-300 text-sm flex items-center gap-2">
                                            <Star size={14} className="text-orange-400" />
                                            This is my current position
                                        </label>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-6">
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                            >
                                                {loading ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                                        {editData ? 'Updating...' : 'Adding...'}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save size={16} className="mr-2" />
                                                        {editData ? 'Update Experience' : 'Add Experience'}
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
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Experience Preview Component
const ExperiencePreview: React.FC<{
    data: ExperienceFormData;
    duration: string;
}> = ({ data, duration }) => (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-4">
        <div className="flex items-start justify-between">
            <div>
                <h3 className="text-xl font-semibold text-white">{data.title || 'Job Title'}</h3>
                <div className="flex items-center gap-2 text-orange-400 mt-1">
                    <Building2 size={16} />
                    <span className="font-medium">{data.company || 'Company Name'}</span>
                    {data.location && (
                        <>
                            <span className="text-gray-500">•</span>
                            <span className="text-gray-400 flex items-center gap-1">
                                <MapPin size={14} />
                                {data.location}
                            </span>
                        </>
                    )}
                </div>
            </div>

            <div className="text-right">
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${data.type === 'full-time' ? 'bg-green-500/20 text-green-400' :
                        data.type === 'freelance' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-purple-500/20 text-purple-400'
                        }`}>
                        {data.type.replace('-', ' ')}
                    </span>
                    {data.isCurrent && (
                        <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs font-medium rounded-full flex items-center gap-1">
                            <Star size={10} />
                            Current
                        </span>
                    )}
                </div>
                {duration && (
                    <p className="text-gray-400 text-sm mt-1">{duration}</p>
                )}
            </div>
        </div>

        {data.description && (
            <p className="text-gray-300 leading-relaxed">{data.description}</p>
        )}

        {data.achievements.some(a => a.text) && (
            <div>
                <h4 className="text-sm font-semibold text-orange-300 mb-2">Key Achievements:</h4>
                <ul className="space-y-1">
                    {data.achievements.filter(a => a.text).map((achievement, i) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-orange-400 mt-1.5 w-1 h-1 rounded-full bg-orange-400 flex-shrink-0" />
                            {achievement.text}
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {data.technologies.some(t => t.name) && (
            <div>
                <h4 className="text-sm font-semibold text-orange-300 mb-2">Technologies Used:</h4>
                <div className="flex flex-wrap gap-2">
                    {data.technologies.filter(t => t.name).map((tech, i) => (
                        <span
                            key={i}
                            className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded border border-gray-600"
                        >
                            {tech.name}
                        </span>
                    ))}
                </div>
            </div>
        )}
    </div>
);

export default AddExperienceDialog;