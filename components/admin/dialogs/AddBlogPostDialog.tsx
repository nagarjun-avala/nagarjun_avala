// components/admin/dialogs/AddBlogPostDialog.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    FileText,
    Save,
    Eye,
    Star,
    Image,
    Tag,
    Calendar,
    Clock,
    Zap,
    Hash,
    Bold,
    Italic,
    Link,
    List,
    Code,
    Quote,
    Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

const BlogPostSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
    slug: z.string().optional(),
    excerpt: z.string().min(1, 'Excerpt is required').max(300, 'Excerpt must be less than 300 characters'),
    content: z.string().min(50, 'Content must be at least 50 characters'),
    tags: z.array(z.object({
        name: z.string().min(1, 'Tag cannot be empty')
    })),
    coverImage: z.string().url().optional().or(z.literal('')),
    isPublished: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    publishDate: z.string().optional(),
    metaDescription: z.string().max(160, 'Meta description must be less than 160 characters').optional(),
    canonicalUrl: z.string().url().optional().or(z.literal('')),
    category: z.string().optional()
});

type BlogPostFormData = z.infer<typeof BlogPostSchema>;

interface AddBlogPostDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (post: BlogPostFormData) => void;
    editData?: any;
}

const AddBlogPostDialog: React.FC<AddBlogPostDialogProps> = ({
    isOpen,
    onClose,
    onSuccess,
    editData
}) => {
    const [loading, setLoading] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [wordCount, setWordCount] = useState(0);
    const [readTime, setReadTime] = useState(0);
    const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
        control,
        getValues
    } = useForm<BlogPostFormData>({
        resolver: zodResolver(BlogPostSchema),
        defaultValues: {
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            tags: [],
            coverImage: '',
            isPublished: false,
            isFeatured: false,
            publishDate: '',
            metaDescription: '',
            canonicalUrl: '',
            category: ''
        }
    });

    const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({
        control,
        name: "tags"
    });

    const watchedContent = watch('content');
    const watchedTitle = watch('title');
    const isPublished = watch('isPublished');
    const watchedData = watch();

    // Auto-generate slug from title
    useEffect(() => {
        if (watchedTitle && !editData) {
            const slug = watchedTitle
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
            setValue('slug', slug);
        }
    }, [watchedTitle, setValue, editData]);

    // Calculate word count and reading time
    useEffect(() => {
        if (watchedContent) {
            const words = watchedContent.trim().split(/\s+/).filter(word => word.length > 0);
            const count = words.length;
            setWordCount(count);
            setReadTime(Math.ceil(count / 200)); // Average reading speed: 200 words per minute
        } else {
            setWordCount(0);
            setReadTime(0);
        }
    }, [watchedContent]);

    // Auto-save functionality
    useEffect(() => {
        if (watchedContent || watchedTitle) {
            setAutoSaveStatus('unsaved');

            // Clear existing timeout
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }

            // Set new timeout for auto-save
            autoSaveTimeoutRef.current = setTimeout(async () => {
                if (editData && (watchedContent || watchedTitle)) {
                    setAutoSaveStatus('saving');
                    try {
                        await autoSave();
                        setAutoSaveStatus('saved');
                    } catch (error) {
                        setAutoSaveStatus('unsaved');
                    }
                }
            }, 3000);
        }

        return () => {
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, [watchedContent, watchedTitle, editData]);

    // Load edit data
    useEffect(() => {
        if (editData && isOpen) {
            reset({
                ...editData,
                tags: editData.tags?.map((name: string) => ({ name })) || [],
                publishDate: editData.publishedAt ? new Date(editData.publishedAt).toISOString().split('T')[0] : ''
            });
        }
    }, [editData, isOpen, reset]);

    const autoSave = async () => {
        if (!editData) return;

        const currentData = getValues();
        try {
            await fetch(`/api/admin/blog/${editData.id}/autosave`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentData)
            });
        } catch (error) {
            console.error('Auto-save failed:', error);
        }
    };

    const handleSubmit_ = async (data: BlogPostFormData) => {
        setLoading(true);

        try {
            const payload = {
                ...data,
                tags: data.tags.map(t => t.name).filter(Boolean),
                slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                readTime,
                publishedAt: data.isPublished ? (data.publishDate ? new Date(data.publishDate) : new Date()) : null
            };

            const url = editData ? `/api/admin/blog/${editData.id}` : '/api/admin/blog';
            const method = editData ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                toast.success(
                    `Blog post ${editData ? 'updated' : 'created'} ${data.isPublished ? 'and published' : 'as draft'} successfully!`
                );
                onSuccess?.(result);
                handleClose();
            } else {
                const error = await response.json();
                toast.error(error.error || `Failed to ${editData ? 'update' : 'create'} blog post`);
            }
        } catch (error) {
            console.error('Blog post form error:', error);
            toast.error(`Failed to ${editData ? 'update' : 'create'} blog post. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        reset();
        setPreviewMode(false);
        setAutoSaveStatus('saved');
        onClose();
    };

    const addTag = () => {
        appendTag({ name: '' });
    };

    const insertMarkdown = (syntax: string, placeholder: string = '') => {
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        const replacement = selectedText || placeholder;

        let newText = '';
        switch (syntax) {
            case 'bold':
                newText = `**${replacement}**`;
                break;
            case 'italic':
                newText = `*${replacement}*`;
                break;
            case 'link':
                newText = `[${replacement || 'link text'}](url)`;
                break;
            case 'code':
                newText = `\`${replacement}\``;
                break;
            case 'quote':
                newText = `> ${replacement || 'quote'}`;
                break;
            case 'list':
                newText = `- ${replacement || 'list item'}`;
                break;
            case 'h1':
                newText = `# ${replacement || 'Heading 1'}`;
                break;
            case 'h2':
                newText = `## ${replacement || 'Heading 2'}`;
                break;
            case 'h3':
                newText = `### ${replacement || 'Heading 3'}`;
                break;
            default:
                return;
        }

        const newValue =
            textarea.value.substring(0, start) +
            newText +
            textarea.value.substring(end);

        setValue('content', newValue);

        // Focus and set cursor position
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + newText.length, start + newText.length);
        }, 0);
    };

    const categories = [
        'Technology',
        'Web Development',
        'Programming',
        'Tutorial',
        'Career',
        'Personal',
        'Industry News',
        'Tips & Tricks'
    ];

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
                        className="bg-gray-900/95 backdrop-blur border border-green-500/30 rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <FileText className="text-green-400" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">
                                        {editData ? 'Edit' : 'Create'} Blog Post
                                    </h2>
                                    <div className="flex items-center gap-4 text-sm text-gray-400">
                                        <span>Words: {wordCount}</span>
                                        <span>Read time: ~{readTime} min{readTime !== 1 ? 's' : ''}</span>
                                        {editData && (
                                            <span className={`flex items-center gap-1 ${autoSaveStatus === 'saved' ? 'text-green-400' :
                                                autoSaveStatus === 'saving' ? 'text-yellow-400' : 'text-orange-400'
                                                }`}>
                                                <div className={`w-2 h-2 rounded-full ${autoSaveStatus === 'saved' ? 'bg-green-400' :
                                                    autoSaveStatus === 'saving' ? 'bg-yellow-400 animate-pulse' : 'bg-orange-400'
                                                    }`} />
                                                {autoSaveStatus === 'saved' ? 'Saved' :
                                                    autoSaveStatus === 'saving' ? 'Saving...' : 'Unsaved'}
                                            </span>
                                        )}
                                    </div>
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
                                    <Eye size={14} className="mr-2" />
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
                        <div className="flex-1 overflow-y-auto">
                            {previewMode ? (
                                // Preview Mode
                                <BlogPostPreview data={watchedData} readTime={readTime} />
                            ) : (
                                // Edit Mode
                                <div className="grid lg:grid-cols-3 gap-6 p-6">
                                    {/* Main Content - 2/3 */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <form onSubmit={handleSubmit(handleSubmit_)} className="space-y-6">
                                            {/* Title */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Post Title *
                                                </label>
                                                <input
                                                    type="text"
                                                    {...register('title')}
                                                    placeholder="How to Build Amazing Web Applications"
                                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 text-lg font-medium"
                                                />
                                                {errors.title && (
                                                    <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
                                                )}
                                            </div>

                                            {/* Slug */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    URL Slug
                                                </label>
                                                <div className="flex items-center">
                                                    <span className="text-gray-400 text-sm mr-2">yoursite.com/blog/</span>
                                                    <input
                                                        type="text"
                                                        {...register('slug')}
                                                        placeholder="how-to-build-amazing-web-applications"
                                                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 font-mono text-sm"
                                                    />
                                                </div>
                                            </div>

                                            {/* Excerpt */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Excerpt *
                                                </label>
                                                <textarea
                                                    {...register('excerpt')}
                                                    placeholder="A compelling summary that will appear in preview cards and social media shares..."
                                                    rows={3}
                                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 resize-none"
                                                />
                                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                    {errors.excerpt && (
                                                        <p className="text-red-400">{errors.excerpt.message}</p>
                                                    )}
                                                    <p className="ml-auto">{watch('excerpt')?.length || 0}/300</p>
                                                </div>
                                            </div>

                                            {/* Markdown Toolbar */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                                    Content *
                                                </label>
                                                <div className="flex flex-wrap gap-1 p-2 bg-gray-800 border border-gray-600 rounded-t-lg">
                                                    <ToolbarButton onClick={() => insertMarkdown('h1')} icon={<Hash size={14} />} title="Heading 1" />
                                                    <ToolbarButton onClick={() => insertMarkdown('h2')} icon={<Hash size={12} />} title="Heading 2" />
                                                    <ToolbarButton onClick={() => insertMarkdown('bold')} icon={<Bold size={14} />} title="Bold" />
                                                    <ToolbarButton onClick={() => insertMarkdown('italic')} icon={<Italic size={14} />} title="Italic" />
                                                    <ToolbarButton onClick={() => insertMarkdown('link')} icon={<Link size={14} />} title="Link" />
                                                    <ToolbarButton onClick={() => insertMarkdown('list')} icon={<List size={14} />} title="List" />
                                                    <ToolbarButton onClick={() => insertMarkdown('code')} icon={<Code size={14} />} title="Inline Code" />
                                                    <ToolbarButton onClick={() => insertMarkdown('quote')} icon={<Quote size={14} />} title="Quote" />
                                                </div>
                                                <textarea
                                                    ref={contentRef}
                                                    {...register('content')}
                                                    placeholder="Start writing your amazing blog post...

You can use Markdown formatting:
# Headers
**Bold text**
*Italic text*
[Links](https://example.com)
`Inline code`
> Quotes

```
Code blocks
```

- Lists
1. Numbered lists

Happy writing! 🚀"
                                                    rows={16}
                                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 border-t-0 rounded-b-lg text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-300 font-mono text-sm resize-none"
                                                />
                                                {errors.content && (
                                                    <p className="text-red-400 text-sm mt-1">{errors.content.message}</p>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-3 pt-6">
                                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                                                    <Button
                                                        type="submit"
                                                        disabled={loading}
                                                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                                                {isPublished ? 'Publishing...' : 'Saving...'}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Save size={16} className="mr-2" />
                                                                {isPublished ? `${editData ? 'Update &' : ''} Publish` : 'Save Draft'}
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
                                    </div>

                                    {/* Sidebar - 1/3 */}
                                    <div className="space-y-6">
                                        {/* Publishing Options */}
                                        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                                            <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                                                <Zap className="text-green-400" size={16} />
                                                Publishing
                                            </h3>

                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id="published"
                                                        {...register('isPublished')}
                                                        className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                                                    />
                                                    <label htmlFor="published" className="text-gray-300 text-sm flex items-center gap-2">
                                                        <Eye size={14} className="text-green-400" />
                                                        Publish immediately
                                                    </label>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        id="featured"
                                                        {...register('isFeatured')}
                                                        className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                                                    />
                                                    <label htmlFor="featured" className="text-gray-300 text-sm flex items-center gap-2">
                                                        <Star size={14} className="text-yellow-400" />
                                                        Mark as featured
                                                    </label>
                                                </div>

                                                {/* Publish Date */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-400 mb-1">
                                                        Publish Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        {...register('publishDate')}
                                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-green-500"
                                                    />
                                                </div>

                                                {!isPublished && (
                                                    <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg p-2">
                                                        💡 This post will be saved as a draft
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Cover Image */}
                                        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                                            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                                                <Image className="text-purple-400" size={16} />
                                                Cover Image
                                            </h3>

                                            <div className="space-y-3">
                                                <input
                                                    type="url"
                                                    {...register('coverImage')}
                                                    placeholder="https://example.com/image.jpg"
                                                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:border-purple-500"
                                                />

                                                {watch('coverImage') && (
                                                    <div className="relative">
                                                        <img
                                                            src={watch('coverImage')}
                                                            alt="Cover preview"
                                                            className="w-full h-24 object-cover rounded-lg"
                                                            onError={(e) => {
                                                                e.currentTarget.src = '/api/placeholder/300/150';
                                                            }}
                                                        />
                                                    </div>
                                                )}

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full border-purple-500/30 text-purple-400"
                                                >
                                                    <Upload size={14} className="mr-2" />
                                                    Upload Image
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Category & Tags */}
                                        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                                            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                                                <Tag className="text-blue-400" size={16} />
                                                Category & Tags
                                            </h3>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-400 mb-1">
                                                        Category
                                                    </label>
                                                    <select
                                                        {...register('category')}
                                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-blue-500"
                                                    >
                                                        <option value="">Select category</option>
                                                        {categories.map(cat => (
                                                            <option key={cat} value={cat}>{cat}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <label className="block text-xs font-medium text-gray-400">
                                                            Tags
                                                        </label>
                                                        <Button
                                                            type="button"
                                                            onClick={addTag}
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-blue-500/30 text-blue-400 text-xs px-2 py-1"
                                                        >
                                                            <Hash size={10} className="mr-1" />
                                                            Add
                                                        </Button>
                                                    </div>

                                                    <div className="space-y-2 max-h-32 overflow-y-auto">
                                                        {tagFields.map((field, index) => (
                                                            <div key={field.id} className="flex gap-2">
                                                                <input
                                                                    {...register(`tags.${index}.name` as const)}
                                                                    placeholder="React"
                                                                    className="flex-1 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 text-sm focus:border-blue-500"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => removeTag(index)}
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="border-red-500/30 text-red-400 px-2"
                                                                >
                                                                    <X size={10} />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* SEO Settings */}
                                        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                                            <h3 className="text-sm font-semibold text-gray-300 mb-3">
                                                SEO Settings
                                            </h3>

                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-400 mb-1">
                                                        Meta Description
                                                    </label>
                                                    <textarea
                                                        {...register('metaDescription')}
                                                        placeholder="Brief description for search engines..."
                                                        rows={2}
                                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm resize-none focus:border-green-500"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {watch('metaDescription')?.length || 0}/160
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-gray-400 mb-1">
                                                        Canonical URL
                                                    </label>
                                                    <input
                                                        type="url"
                                                        {...register('canonicalUrl')}
                                                        placeholder="https://yoursite.com/blog/post-url"
                                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:border-green-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Toolbar Button Component
const ToolbarButton: React.FC<{
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
}> = ({ onClick, icon, title }) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
    >
        {icon}
    </button>
);

// Blog Post Preview Component
const BlogPostPreview: React.FC<{
    data: BlogPostFormData;
    readTime: number;
}> = ({ data, readTime }) => (
    <div className="p-8 max-w-4xl mx-auto">
        {/* Article Header */}
        <div className="mb-8">
            {data.category && (
                <div className="mb-4">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
                        {data.category}
                    </span>
                </div>
            )}

            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                {data.title || 'Your Blog Post Title'}
            </h1>

            {data.excerpt && (
                <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                    {data.excerpt}
                </p>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
                <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{readTime} min read</span>
                </div>
                {data.isFeatured && (
                    <div className="flex items-center gap-1 text-yellow-400">
                        <Star size={14} />
                        <span>Featured</span>
                    </div>
                )}
            </div>

            {data.coverImage && (
                <div className="mb-8">
                    <img
                        src={data.coverImage}
                        alt="Cover"
                        className="w-full h-64 object-cover rounded-xl"
                        onError={(e) => {
                            e.currentTarget.src = '/api/placeholder/800/400';
                        }}
                    />
                </div>
            )}
        </div>

        {/* Article Content */}
        <div className="prose prose-invert prose-lg max-w-none">
            {data.content ? (
                <div className="whitespace-pre-wrap leading-relaxed text-gray-300">
                    {renderMarkdownPreview(data.content)}
                </div>
            ) : (
                <div className="text-gray-500 italic text-center py-12 border-2 border-dashed border-gray-700 rounded-lg">
                    Start writing your content to see the preview...
                </div>
            )}
        </div>

        {/* Tags */}
        {data.tags.some(t => t.name) && (
            <div className="mt-12 pt-8 border-t border-gray-700">
                <h3 className="text-sm font-medium text-gray-400 mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                    {data.tags.filter(t => t.name).map((tag, i) => (
                        <span
                            key={i}
                            className="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-full border border-gray-600 hover:border-green-500/50 transition-colors"
                        >
                            #{tag.name}
                        </span>
                    ))}
                </div>
            </div>
        )}

        {/* Publishing Status */}
        <div className="mt-8 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-white font-medium">Publishing Status</p>
                    <p className="text-gray-400 text-sm">
                        This post will be {data.isPublished ? 'published' : 'saved as draft'}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {data.isPublished ? (
                        <>
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-green-400 text-sm font-medium">Live</span>
                        </>
                    ) : (
                        <>
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <span className="text-yellow-400 text-sm font-medium">Draft</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>
);

// Simple Markdown Preview Renderer
const renderMarkdownPreview = (content: string) => {
    return content
        .split('\n')
        .map((line, index) => {
            // Headers
            if (line.startsWith('### ')) {
                return <h3 key={index} className="text-xl font-semibold text-white mt-6 mb-3">{line.substring(4)}</h3>;
            }
            if (line.startsWith('## ')) {
                return <h2 key={index} className="text-2xl font-semibold text-white mt-8 mb-4">{line.substring(3)}</h2>;
            }
            if (line.startsWith('# ')) {
                return <h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4">{line.substring(2)}</h1>;
            }

            // Quotes
            if (line.startsWith('> ')) {
                return (
                    <blockquote key={index} className="border-l-4 border-green-500 pl-4 italic text-gray-300 my-4 bg-gray-800/30 py-2">
                        {line.substring(2)}
                    </blockquote>
                );
            }

            // Lists
            if (line.startsWith('- ') || line.startsWith('* ')) {
                return (
                    <li key={index} className="ml-6 mb-1 text-gray-300">
                        {line.substring(2)}
                    </li>
                );
            }

            // Code blocks
            if (line.startsWith('```')) {
                return <div key={index} className="bg-gray-800 p-4 rounded-lg font-mono text-sm my-4"></div>;
            }

            // Regular paragraphs
            if (line.trim() === '') {
                return <br key={index} />;
            }

            // Process inline formatting
            let processedLine = line;

            // Bold
            processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');

            // Italic
            processedLine = processedLine.replace(/\*(.*?)\*/g, '<em class="italic text-gray-200">$1</em>');

            // Inline code
            processedLine = processedLine.replace(/`(.*?)`/g, '<code class="bg-gray-800 px-2 py-1 rounded text-green-400 font-mono text-sm">$1</code>');

            // Links
            processedLine = processedLine.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-green-400 hover:text-green-300 underline">$1</a>');

            return (
                <p
                    key={index}
                    className="mb-4 text-gray-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: processedLine }}
                />
            );
        });
};

export default AddBlogPostDialog;

// Additional utility components and hooks

// Auto-save hook
export const useAutoSave = (data: any, saveFunction: (data: any) => Promise<void>, delay: number = 3000) => {
    const [status, setStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (data) {
            setStatus('unsaved');

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(async () => {
                setStatus('saving');
                try {
                    await saveFunction(data);
                    setStatus('saved');
                } catch (error) {
                    setStatus('unsaved');
                    console.error('Auto-save failed:', error);
                }
            }, delay);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [data, saveFunction, delay]);

    return status;
};

// Markdown editor hook
export const useMarkdownEditor = () => {
    const insertText = (textarea: HTMLTextAreaElement, text: string, selectText: boolean = false) => {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;

        const newValue = value.substring(0, start) + text + value.substring(end);
        textarea.value = newValue;

        if (selectText) {
            textarea.setSelectionRange(start, start + text.length);
        } else {
            textarea.setSelectionRange(start + text.length, start + text.length);
        }

        textarea.focus();
    };

    const wrapSelection = (textarea: HTMLTextAreaElement, before: string, after: string = before) => {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);

        const newText = before + selectedText + after;
        insertText(textarea, newText);
    };

    return { insertText, wrapSelection };
};

// Word count and reading time utilities
export const calculateReadingTime = (text: string, wordsPerMinute: number = 200): number => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return Math.ceil(words.length / wordsPerMinute);
};

export const getWordCount = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

// SEO utilities
export const generateSlug = (title: string): string => {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

export const validateSEO = (data: { title: string; excerpt: string; metaDescription?: string }) => {
    const issues = [];

    if (!data.title) {
        issues.push('Title is required');
    } else if (data.title.length > 60) {
        issues.push('Title should be under 60 characters for better SEO');
    }

    if (!data.excerpt) {
        issues.push('Excerpt is required');
    } else if (data.excerpt.length > 160) {
        issues.push('Excerpt should be under 160 characters');
    }

    if (data.metaDescription && data.metaDescription.length > 160) {
        issues.push('Meta description should be under 160 characters');
    }

    return issues;
};

// Image upload utilities (placeholder for future implementation)
export const uploadImage = async (file: File): Promise<string> => {
    // This would integrate with your preferred image hosting service
    // For now, return a placeholder
    return '/api/placeholder/800/400';
};

export const optimizeImage = (url: string, width?: number, height?: number): string => {
    // This would integrate with image optimization services
    return url;
};

// Blog post validation utilities
export const validateBlogPost = (data: BlogPostFormData) => {
    const errors = [];

    if (!data.title.trim()) {
        errors.push('Title is required');
    }

    if (!data.excerpt.trim()) {
        errors.push('Excerpt is required');
    }

    if (!data.content.trim()) {
        errors.push('Content is required');
    } else if (data.content.trim().length < 50) {
        errors.push('Content should be at least 50 characters long');
    }

    if (data.coverImage && !isValidUrl(data.coverImage)) {
        errors.push('Cover image must be a valid URL');
    }

    return errors;
};

const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};