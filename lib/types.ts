// lib/types.ts

export interface Meta {
    title: string;
    email: string;
}

export interface Hero {
    badge: string;
    roles: string[];
    titlePrefix: string;
    titleSuffix: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
}

export interface AboutExperience {
    years: string;
    label: string;
}

export interface About {
    title: string;
    description: string;
    image: string;
    experience: AboutExperience;
    skills: string[];
}

export interface Project {
    id: string;
    cat: string;
    title: string;
    desc: string;
    img: string;
    tags: string[];
}

export interface ExperienceItem {
    id: string;
    start: Date;
    end: Date | "present"; // Can be a Date object or the string literal "present"
    role: string;
    company: string;
    desc: string;
}

export interface Blog {
    id: number;
    title: string;
    date: string;
    readTime: string;
    category: string;
}

export interface PortfolioData {
    name: string;
    meta: Meta;
    hero: Hero;
    about: About;
    projects: Project[];
    experience: Experience[];
    blogs: Blog[];
}