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
    ctaPrimaryLink?: string;
    ctaSecondaryLink?: string;
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

export interface TechStackItem {
    id?: string;
    profileId?: string;
    category: string;
    items: string[];
    order?: number;
    createdAt?: string;
    updatedAt?: string;
}

export type TechStack = TechStackItem[];

// Enums for Education
export type EducationStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type EducationVisibility = 'PUBLIC' | 'PRIVATE';
export type DegreeType = 'BACHELORS' | 'MASTERS' | 'PHD' | 'CERTIFICATION' | 'BOOTCAMP' | 'DIPLOMA' | 'ASSOCIATE';
export type EducationProgress = 'COMPLETED' | 'IN_PROGRESS' | 'PAUSED';

export interface ThesisProject {
    title: string;
    description?: string;
    link?: string;
}

export interface Education {
    id: string;
    order?: number;

    // Core Fields
    degree: string;
    institution: string;
    location?: string;
    fieldOfStudy?: string;

    // Dates
    startDate?: string | Date;
    endDate?: string | Date | null;
    currentlyPursuing?: boolean;

    // Institution Details
    institutionLogo?: string;
    institutionWebsite?: string;
    degreeType?: DegreeType;

    // Academic Details
    gpa?: string;
    showGpa?: boolean;
    description?: string;

    // Content Arrays
    coursework?: string[];
    highlights?: string[];
    awards?: string[];
    activities?: string[];
    skillsAcquired?: string[];

    // Thesis/Capstone
    thesis?: ThesisProject;

    // Status & Visibility
    status?: EducationStatus;
    visibility?: EducationVisibility;
    featured?: boolean;
    featuredOrder?: number;
    progress?: EducationProgress;

    // Relationships
    relatedProjectIds?: string[];

    // SEO
    keywords?: string[];

    // Metadata
    createdAt?: string;
    updatedAt?: string;
}

// Enums for Certification
export type CertificationStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type CertificationVisibility = 'PUBLIC' | 'PRIVATE';
export type CertificationCategory = 'TECHNICAL' | 'PROFESSIONAL' | 'ACADEMIC' | 'LANGUAGE' | 'OTHER';
export type CertificationLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface Certification {
    id: string;
    order?: number;

    // Core Fields
    name: string;
    organization: string;
    description?: string;

    // Dates
    issueDate?: string | Date;
    expirationDate?: string | Date | null;

    // Credentials & Verification
    credentialID?: string;
    credentialURL?: string;
    verificationLink?: string;

    // Categorization
    category?: CertificationCategory;
    level?: CertificationLevel;
    tags?: string[];

    // Skills & Performance
    skillsGained?: string[];
    score?: string;
    grade?: string;

    // Media & Assets
    badgeImage?: string;
    certificateImage?: string;
    certificatePdf?: string;

    // Professional Details
    ceUnits?: number;
    requiresRenewal?: boolean;

    // Status & Visibility
    status?: CertificationStatus;
    visibility?: CertificationVisibility;
    featured?: boolean;
    featuredOrder?: number;

    // Relationships
    relatedProjectIds?: string[];
    relatedExperienceIds?: string[];

    // SEO
    keywords?: string[];

    // Legacy fields for backward compatibility
    title?: string; // Use 'name' instead
    issuer?: string; // Use 'organization' instead
    type?: string; // Deprecated

    // Metadata
    createdAt?: string;
    updatedAt?: string;
}

// Enums for Project
export type ProjectStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'IN_PROGRESS';
export type ProjectVisibility = 'PUBLIC' | 'PRIVATE';
export type TeamSize = 'SOLO' | 'SMALL' | 'MEDIUM' | 'LARGE';
export type BudgetRange = 'SMALL' | 'MEDIUM' | 'LARGE';
export type ProjectType = 'PERSONAL' | 'CLIENT' | 'OPEN_SOURCE' | 'CONTRACT';
export type CompletionStatus = 'COMPLETED' | 'ONGOING' | 'MAINTENANCE';
export type ProjectScale = 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';

export interface Collaborator {
    name: string;
    url: string;
    avatar?: string;
}

export interface DemoCredentials {
    username: string;
    password: string;
}

export interface Project {
    id: string;
    order?: number;
    slug: string;
    title: string;
    desc: string;

    // Phase 1: Essential Features
    // Featured/Pinned
    featured?: boolean;
    featuredOrder?: number;

    // Status & Visibility
    status?: ProjectStatus;
    visibility?: ProjectVisibility;
    publishDate?: string | Date;

    // Media Management
    img: string;
    videoUrl?: string;
    gallery?: string[];
    beforeImage?: string;
    afterImage?: string;
    featuredImageIndex?: number;

    // Project Metadata
    startDate?: string | Date;
    endDate?: string | Date;
    teamSize?: TeamSize;
    budgetRange?: BudgetRange;
    projectType?: ProjectType;
    completionStatus?: CompletionStatus;

    // Legacy/Basic Fields
    tags: string[];
    liveLink: string | null;
    cat: string;
    client?: string;
    role?: string;
    year?: string;
    challenge?: string;
    solution?: string;

    // Phase 2: Enhanced Features
    // Case Study Fields
    results?: string;
    testimonial?: string;
    learnings?: string;

    // SEO Fields
    metaDescription?: string;
    ogImage?: string;
    keywords?: string[];

    // Categorization (enhanced)
    categories?: string[];
    industryTags?: string[];
    projectScale?: ProjectScale;
    platform?: string[];

    // External Links
    githubUrl?: string;
    apiDocsUrl?: string;
    packageUrl?: string;
    figmaUrl?: string;
    demoCredentials?: DemoCredentials;

    // Phase 3: Advanced Features
    // Analytics
    viewCount?: number;
    clickCount?: number;
    popularityScore?: number;
    lastViewedAt?: string | Date;

    // Collaboration
    collaborators?: Collaborator[];
    specificRole?: string;
    contributionPercentage?: number;
    agency?: string;

    // Project Relationships
    relatedProjectIds?: string[];
    partOfSeriesId?: string;
    builtUponId?: string;

    createdAt?: string;
    updatedAt?: string;
}

// Enums for Experience
export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP';
export type LocationType = 'ONSITE' | 'REMOTE' | 'HYBRID';
export type ExperienceStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type ExperienceVisibility = 'PUBLIC' | 'PRIVATE';

export interface Testimonial {
    text: string;
    author: string;
    position: string;
    avatar?: string;
}

export interface Experience {
    id: string;
    order?: number;

    // Basic Role Information (Legacy fields)
    start: Date | string;
    end: Date | string | "present" | null;
    role: string;
    company: string;
    desc: string;

    // Company Information
    companyLogo?: string;
    companyWebsite?: string;
    companySize?: string;
    location?: string;
    locationType?: LocationType;

    // Role Details
    employmentType?: EmploymentType;
    currentlyWorking?: boolean;
    duration?: string;

    // Description & Content (Rich fields)
    responsibilities?: string[];
    achievements?: string[];
    impact?: string;
    technologies?: string[];
    skillsAcquired?: string[];

    // Status & Visibility
    status?: ExperienceStatus;
    visibility?: ExperienceVisibility;
    featured?: boolean;
    featuredOrder?: number;

    // Media & Links
    media?: string[];
    certificateUrl?: string;
    recommendationLetter?: string;
    testimonial?: Testimonial;

    // Metadata
    relatedProjectIds?: string[];
    teamSize?: string;
    reportsTo?: string;
    managedTeamSize?: number;

    // SEO
    keywords?: string[];

    createdAt?: string;
    updatedAt?: string;
}

// Enums for Blog
export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
export type BlogVisibility = 'PUBLIC' | 'PRIVATE';

export interface Blog {
    id: string;
    order?: number;

    // Core Content
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;

    // Publishing & Status
    status?: BlogStatus;
    visibility?: BlogVisibility;
    publishedAt?: string | Date;
    scheduledFor?: string | Date;

    // Media
    coverImage?: string;
    ogImage?: string;
    gallery?: string[];
    image?: string; // Legacy, maps to coverImage

    // Categorization
    category?: string;
    tags?: string[];
    series?: string;
    seriesOrder?: number;

    // SEO
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];

    // Features & Settings
    featured?: boolean;
    featuredOrder?: number;
    enableComments?: boolean;
    showInNewsletter?: boolean;

    // Analytics
    viewCount?: number;
    readingTime?: number; // minutes

    // Relationships
    relatedBlogIds?: string[];
    relatedProjectIds?: string[];

    // Legacy fields for backward compatibility
    date?: string; // Deprecated, use publishedAt
    readTime?: string; // Deprecated, use readingTime
    link?: string; // Deprecated, use slug

    // Metadata
    createdAt?: string;
    updatedAt?: string;
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
    avatar?: string;
    socials?: Social[];
    themeColor?: string;
    fontPairing?: string;
    borderRadius?: string;
}

export interface Social {
    platform: string;
    url: string;
    icon?: string;
}