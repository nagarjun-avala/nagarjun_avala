// Types for portfolio data
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
}

export interface Skill {
    id: string;
    name: string;
    category: string;
    years: number;
    proficiency: number;
    description?: string;
    icon?: string;
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
    status: string;
    featured: boolean;
    startDate: string;
}

export interface Experience {
    id: string;
    title: string;
    company: string;
    location?: string;
    type: string;
    description: string;
    achievements: string[];
    technologies: string[];
    startDate: string;
    endDate?: string;
    isCurrent: boolean;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImage?: string;
    tags: string[];
    publishedAt: string;
    readTime?: number;
    views: number;
}

export interface PortfolioData {
    profile: Profile | null;
    skills: Record<string, Skill[]>;
    projects: Project[];
    experiences: Experience[];
    blogPosts: BlogPost[];
    config: Record<string, unknown>;
}