// components/portfolio/ProjectShowcase.tsx - Interactive Project Demos
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    Pause,
    Maximize2,
    ExternalLink,
    Github,
    Code,
    Eye,
    Star,
    Zap,
    Monitor,
    Smartphone,
    Tablet,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface ProjectShowcaseProps {
    project: {
        id: string;
        name: string;
        description: string;
        longDescription: string;
        technologies: string[];
        imageUrl?: string;
        demoUrl?: string;
        githubUrl?: string;
        livePreviewUrl?: string;
        beforeImage?: string;
        afterImage?: string;
        videoUrl?: string;
        screenshots: string[];
        features: string[];
        challenges: string[];
        solutions: string[];
        metrics?: {
            performance?: string;
            users?: string;
            loading?: string;
        };
        timeline?: {
            planning: string;
            development: string;
            testing: string;
            deployment: string;
        };
    };
}

export const ProjectShowcase: React.FC<ProjectShowcaseProps> = ({ project }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'demo' | 'code' | 'metrics'>('overview');
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [currentDevice, setCurrentDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [currentScreenshot, setCurrentScreenshot] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const demoRef = useRef<HTMLIFrameElement>(null);

    const deviceSizes = {
        desktop: { width: '100%', height: '600px' },
        tablet: { width: '768px', height: '1024px' },
        mobile: { width: '375px', height: '667px' }
    };

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (project.screenshots.length > 1) {
                setCurrentScreenshot((prev) => (prev + 1) % project.screenshots.length);
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [project.screenshots.length]);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <Eye size={16} /> },
        { id: 'demo', label: 'Live Demo', icon: <Play size={16} /> },
        { id: 'code', label: 'Code', icon: <Code size={16} /> },
        { id: 'metrics', label: 'Metrics', icon: <Zap size={16} /> }
    ];

    return (
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">{project.name}</h2>
                        <p className="text-gray-300 leading-relaxed">{project.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        {project.demoUrl && (
                            <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500">
                                <ExternalLink size={14} className="mr-2" />
                                Live Site
                            </Button>
                        )}
                        {project.githubUrl && (
                            <Button size="sm" variant="outline">
                                <Github size={14} className="mr-2" />
                                Code
                            </Button>
                        )}
                    </div>
                </div>

                {/* Technology Stack */}
                <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-sm rounded-full border border-cyan-500/30"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700 bg-gray-800/30">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as string as 'overview' | 'demo' | 'code' | 'metrics')}
                        className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${activeTab === tab.id
                            ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/10'
                            : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            key="overview"
                            className="space-y-8"
                        >
                            {/* Before/After Comparison */}
                            {project.beforeImage && project.afterImage && (
                                <BeforeAfterComparison
                                    beforeImage={project.beforeImage}
                                    afterImage={project.afterImage}
                                />
                            )}

                            {/* Screenshot Gallery */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Screenshots</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="relative aspect-video rounded-lg overflow-hidden">
                                        <Image
                                            src={project.screenshots[currentScreenshot] || project.imageUrl || ''}
                                            alt={`${project.name} screenshot ${currentScreenshot + 1}`}
                                            fill
                                            className="object-cover transition-all duration-500"
                                        />
                                        <div className="absolute bottom-4 left-4 flex gap-2">
                                            {project.screenshots.map((_, index) => (
                                                <div
                                                    key={index}
                                                    className={`w-2 h-2 rounded-full transition-colors ${index === currentScreenshot ? 'bg-cyan-400' : 'bg-gray-600'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Features */}
                                        <div>
                                            <h4 className="font-semibold text-cyan-300 mb-3">Key Features</h4>
                                            <ul className="space-y-2">
                                                {project.features.map((feature, index) => (
                                                    <li key={index} className="flex items-start gap-2 text-gray-300">
                                                        <Star size={14} className="text-cyan-400 mt-1 flex-shrink-0" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Challenges & Solutions */}
                                        <div>
                                            <h4 className="font-semibold text-orange-300 mb-3">Challenges & Solutions</h4>
                                            <div className="space-y-3">
                                                {project.challenges.map((challenge, index) => (
                                                    <div key={index} className="bg-gray-700/30 rounded-lg p-3">
                                                        <p className="text-red-300 text-sm mb-2">Challenge: {challenge}</p>
                                                        <p className="text-green-300 text-sm">Solution: {project.solutions[index]}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Project Timeline */}
                            {project.timeline && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Development Timeline</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        {Object.entries(project.timeline).map(([phase, duration], index) => (
                                            <motion.div
                                                key={phase}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="text-center p-4 bg-gray-700/30 rounded-lg"
                                            >
                                                <div className="w-8 h-8 bg-cyan-500 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm font-bold">
                                                    {index + 1}
                                                </div>
                                                <h4 className="font-medium text-white capitalize mb-1">{phase}</h4>
                                                <p className="text-gray-400 text-sm">{duration}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'demo' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            key="demo"
                            className="space-y-6"
                        >
                            {/* Device Preview Controls */}
                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    {Object.entries(deviceSizes).map(([device]) => (
                                        <button
                                            key={device}
                                            onClick={() => setCurrentDevice(device as string as 'desktop' | 'tablet' | 'mobile')}
                                            className={`p-2 rounded-lg transition-colors ${currentDevice === device
                                                ? 'bg-cyan-500/20 text-cyan-400'
                                                : 'bg-gray-700 text-gray-400 hover:text-white'
                                                }`}
                                            title={`${device} view`}
                                        >
                                            {device === 'desktop' && <Monitor size={16} />}
                                            {device === 'tablet' && <Tablet size={16} />}
                                            {device === 'mobile' && <Smartphone size={16} />}
                                        </button>
                                    ))}
                                </div>

                                <Button onClick={toggleFullscreen} variant="outline" size="sm">
                                    <Maximize2 size={14} className="mr-2" />
                                    Fullscreen
                                </Button>
                            </div>

                            {/* Live Demo Frame */}
                            <div className="bg-gray-900 rounded-xl p-6 flex justify-center">
                                <div
                                    className="transition-all duration-500 rounded-lg overflow-hidden shadow-2xl"
                                    style={{
                                        width: deviceSizes[currentDevice].width,
                                        maxWidth: '100%'
                                    }}
                                >
                                    {project.livePreviewUrl ? (
                                        <iframe
                                            ref={demoRef}
                                            src={project.livePreviewUrl}
                                            className="w-full border-0 rounded-lg"
                                            style={{ height: deviceSizes[currentDevice].height }}
                                            title={`${project.name} demo`}
                                        />
                                    ) : project.videoUrl ? (
                                        <div className="relative">
                                            <video
                                                ref={videoRef}
                                                className="w-full rounded-lg"
                                                style={{ height: deviceSizes[currentDevice].height }}
                                                poster={project.imageUrl}
                                                onPlay={() => setIsPlaying(true)}
                                                onPause={() => setIsPlaying(false)}
                                            >
                                                <source src={project.videoUrl} type="video/mp4" />
                                            </video>
                                            <button
                                                onClick={handlePlayPause}
                                                className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/30 transition-colors"
                                            >
                                                {isPlaying ? (
                                                    <Pause className="text-white" size={48} />
                                                ) : (
                                                    <Play className="text-white" size={48} />
                                                )}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center bg-gray-800 rounded-lg" style={{ height: deviceSizes[currentDevice].height }}>
                                            <p className="text-gray-400">No demo available</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'code' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            key="code"
                            className="space-y-6"
                        >
                            <CodeSnippetShowcase project={project} />
                        </motion.div>
                    )}

                    {activeTab === 'metrics' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            key="metrics"
                            className="space-y-6"
                        >
                            {project.metrics && (
                                <div className="grid md:grid-cols-3 gap-6">
                                    {Object.entries(project.metrics).map(([key, value]) => (
                                        <div key={key} className="bg-gray-700/30 rounded-lg p-6 text-center">
                                            <div className="text-3xl font-bold text-cyan-400 mb-2">{value}</div>
                                            <div className="text-gray-400 capitalize">{key}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="bg-gray-700/30 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Project Impact</h3>
                                <p className="text-gray-300">
                                    {project.longDescription}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="absolute top-4 right-4 p-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700"
                        >
                            <X size={20} />
                        </button>

                        <div className="w-full h-full max-w-6xl">
                            {project.livePreviewUrl && (
                                <iframe
                                    src={project.livePreviewUrl}
                                    className="w-full h-full border-0 rounded-lg"
                                    title={`${project.name} fullscreen demo`}
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Before/After Comparison Component
const BeforeAfterComparison: React.FC<{
    beforeImage: string;
    afterImage: string;
}> = ({ beforeImage, afterImage }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const position = ((e.clientX - rect.left) / rect.width) * 100;
        setSliderPosition(Math.max(0, Math.min(100, position)));
    };

    return (
        <div>
            <h3 className="text-lg font-semibold text-white mb-4">Before vs After</h3>
            <div
                className="relative aspect-video rounded-lg overflow-hidden cursor-col-resize select-none"
                onMouseMove={handleMouseMove}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
            >
                {/* After Image (Background) */}
                <Image
                    src={afterImage}
                    alt="After"
                    fill
                    className="object-cover"
                />

                {/* Before Image (Clipped) */}
                <div
                    className="absolute inset-0"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                    <Image
                        src={beforeImage}
                        alt="Before"
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Slider Line */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize"
                    style={{ left: `${sliderPosition}%` }}
                >
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                        <div className="w-1 h-4 bg-gray-600 mx-1"></div>
                        <div className="w-1 h-4 bg-gray-600 mx-1"></div>
                    </div>
                </div>

                {/* Labels */}
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                    Before
                </div>
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                    After
                </div>
            </div>
        </div>
    );
};

// Code Snippet Showcase Component
const CodeSnippetShowcase: React.FC<{
    project: {
        id: string;
        name: string;
        description: string;
        longDescription: string;
        technologies: string[];
        imageUrl?: string | undefined;
        demoUrl?: string | undefined;
        githubUrl?: string | undefined;
        livePreviewUrl?: string | undefined;
        beforeImage?: string | undefined;
        afterImage?: string | undefined;
        videoUrl?: string | undefined;
        screenshots: string[];
        features: string[];
        challenges: string[];
        solutions: string[];
        metrics?: {
            performance?: string | undefined;
            users?: string | undefined;
            loading?: string | undefined;
        } | undefined;
        timeline?: {
            planning: string;
            development: string;
            testing: string;
            deployment: string;
        } | undefined;
    }
}> = ({ project }) => {
    const [selectedSnippet, setSelectedSnippet] = useState(0);

    const codeSnippets = [
        {
            title: 'Component Architecture',
            language: 'tsx',
            code: `// Main component structure
export const ${project.name.replace(/\s+/g, '')}Component = () => {
  const [state, setState] = useState(initialState);
  
  return (
    <div className="container">
      {/* Component content */}
    </div>
  );
};`
        },
        {
            title: 'API Integration',
            language: 'ts',
            code: `// API service layer
export const apiService = {
  async fetchData() {
    const response = await fetch('/api/data');
    return response.json();
  }
};`
        },
        {
            title: 'State Management',
            language: 'ts',
            code: `// State management with hooks
const useProjectState = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  return { data, loading, setData, setLoading };
};`
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex gap-2 flex-wrap">
                {codeSnippets.map((snippet, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedSnippet(index)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedSnippet === index
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'bg-gray-700 text-gray-400 hover:text-white'
                            }`}
                    >
                        {snippet.title}
                    </button>
                ))}
            </div>

            <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                    <span className="text-gray-400 text-sm">{codeSnippets[selectedSnippet].title}</span>
                    <span className="text-xs text-gray-500">{codeSnippets[selectedSnippet].language}</span>
                </div>
                <pre className="p-4 overflow-x-auto">
                    <code className="text-gray-300 text-sm font-mono">
                        {codeSnippets[selectedSnippet].code}
                    </code>
                </pre>
            </div>

            <div className="flex gap-4">
                {project.githubUrl && (
                    <Button className="bg-gray-800 hover:bg-gray-700">
                        <Github size={16} className="mr-2" />
                        View Full Code
                    </Button>
                )}
                <Button variant="outline">
                    <Code size={16} className="mr-2" />
                    More Examples
                </Button>
            </div>
        </div>
    );
};

export default ProjectShowcase;