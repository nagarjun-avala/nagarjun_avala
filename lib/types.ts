// lib/types.ts
export interface Profile {
    id: string;
    name: string;
    title: string;
    bio?: string;
    email: string;
    phone?: string;
    location?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    resumeUrl?: string;
    avatarUrl?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Skill {
    id: string;
    name: string;
    category: string;
    years: number;
    proficiency: number;
    description?: string;
    icon?: string;
    isActive: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface Project {
    id: string;
    name: string;
    slug: string;
    description: string;
    longDescription?: string;
    technologies: string[];
    imageUrl?: string;
    demoUrl?: string;
    githubUrl?: string;
    status: 'in-progress' | 'completed' | 'archived';
    featured: boolean;
    isActive: boolean;
    order: number;
    startDate?: string;
    endDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Experience {
    id: string;
    title: string;
    company: string;
    location?: string;
    type: 'full-time' | 'part-time' | 'freelance' | 'contract';
    description: string;
    achievements: string[];
    technologies: string[];
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
    isActive: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    tags: string[];
    isPublished: boolean;
    isFeatured: boolean;
    views: number;
    readTime?: number;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    message: string;
    ip?: string;
    userAgent?: string;
    status: 'new' | 'read' | 'replied';
    isSpam: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SiteConfig {
    id: string;
    key: string;
    value: string;
    type: 'string' | 'number' | 'boolean' | 'json';
    description?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    id: string | number;
    name?: string;
    email?: string;
    status?: string;
    createdAt?: string;
    message?: string;
}

export interface PortfolioData {
    profile: Profile | null;
    skills: Record<string, Skill[]>;
    projects: Project[];
    experiences: Experience[];
    blogPosts: BlogPost[];
    config: Record<string, unknown>;
    timestamp: string;
}

export interface AnalyticsData {
    overview: {
        totalVisitors: number;
        totalMessages: number;
        totalProjects: number;
        totalBlogPosts: number;
    };
    visitors: {
        recent: unknown[];
        topCountries: { country: string; count: number }[];
    };
    messages: ContactSubmission[];
    timestamp: string;
}