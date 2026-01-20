export interface Meta {
    title: string;
    email: string;
    phone?: string;
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
    years: number;
    months: number;
    label: string;
    display: string;
    displaySuffix?: string;
    sign?: string
}

export interface About {
    title: string;
    description: string;
    image: string;
    location: string;
    languages: string[]
    experience: AboutExperience;
    skills: string[];
}

export interface TechStack {
    [category: string]: string[];
}

export interface Education {
    id: string;
    degree: string;
    institution: string;
    location: string;
    year: string;
    coursework: string[];
}

export interface Certification {
    id: string;
    title: string;
    issuer: string;
    issueDate: Date;
    credentialID?: string | null;
    credentialURL?: string | null;
    type: string;
}

export interface Project {
    id: string;
    slug: string;
    cat: string;
    title: string;
    desc: string;
    img: string;
    tags: string[];
    liveLink: string | null;
    client?: string;
    role?: string;
    year?: string;
    challenge?: string;
    solution?: string;
    gallery?: string[];
}

export interface Experience {
    id: string;
    start: Date;
    end: Date | "present";
    role: string;
    company: string;
    desc: string;
}

export interface Blog {
    id: string;
    title: string;
    date: string;
    readTime: string;
    category: string;
    link?: string;
    slug?: string;
    image?: string;
    content?: string;
    tags?: string[];
}

export interface PortfolioData {
    name: string;
    meta: Meta;
    hero: Hero;
    about: About;
    techStack: TechStack;
    education: Education[];
    certifications: Certification[];
    languages: string[];
    projects: Project[];
    experience: Experience[];
    blogs: Blog[];
}