
import { About, Blog, Certification, Education, Experience, Hero, Meta, Project, Social, TechStack } from '@/lib/types';

export interface PortfolioDataTypes {
    name: string
    meta: Meta
    hero: Hero
    about: About
    techStack: TechStack
    education: Education[]
    certifications: Certification[]
    projects: Project[]
    experience: Experience[]
    blogs: Blog[]
    avatar?: string
    socials?: Social[]
    themeColor?: string
    fontPairing?: string
    borderRadius?: string
}

export const MOCK_DATA: PortfolioDataTypes = {
    "name": "Nagarjun Avala",
    "meta": {
        "title": "Nagarjun Avala | Full Stack Developer",
        "email": "nagarjun.avala.official@gmail.com",
        "phone": "+91 8374017459"
    },
    "hero": {
        "badge": "Open to Work & Collaborations",
        "roles": ["Full Stack Developer", "Technical Entrepreneur"],
        "titlePrefix": "I am a",
        "titleSuffix": "& Aspiring DevOps Engineer",
        "description": "Building scalable EdTech solutions with modern web technologies and cloud infrastructure. Proven track record in full lifecycle product development.",
        "ctaPrimary": "Explore My Work",
        "ctaSecondary": "Contact Me"
    },
    "about": {
        "title": "Hi, I'm Nagarjun.",
        "description": "Full-stack developer and technical entrepreneur with proven experience building scalable EdTech solutions. Led product development through complete lifecycle from ideation to deployment. Strong foundation in modern web technologies, DevOps practices, and user-centric design.",
        "image": "/profile.jpg",
        location: "Hyderabad, India",
        "languages": ["English (Professional)", "Hindi (Professional)", "Telugu (Native)"],
        "experience": {
            "years": 2,
            months: 1,
            "label": "of Experience",
            display: "2+ Years",
            displaySuffix: "Years"
        },
        "skills": ["JavaScript", "React.js", "Next.js", "Node.js", "AWS", "Docker", "Kubernetes", "TypeScript", "SQL", "C++"]
    },
    "techStack": [
        { category: "Languages", items: ["JavaScript", "TypeScript", "C++", "Python", "SQL", "HTML5", "CSS3"] },
        { category: "Frontend", items: ["React.js", "Next.js", "Aceternity UI", "Tailwind CSS", "Material-UI", "Responsive Design"] },
        { category: "Backend", items: ["Node.js", "Express.js", "RESTful APIs", "GraphQL", "WebSockets"] },
        { category: "DevOps & Cloud", items: ["Git", "GitHub Actions", "CI/CD", "AWS (EC2, S3, Lambda)", "Docker", "Kubernetes"] },
        { category: "Databases", items: ["MySQL", "PostgreSQL", "MongoDB", "Redis"] },
        { category: "Tools", items: ["Agile/Scrum", "TDD", "Performance Optimization", "Analytics"] }
    ],
    "education": [
        {
            "id": "1",
            "degree": "Bachelor of Technology in Computer Science",
            "institution": "Jawaharlal Nehru Technological University Hyderabad (JNTUH)",
            "location": "Hyderabad, India",
            "startDate": "2019-08-01",
            "endDate": "2023-07-31",
            "coursework": ["Data Structures", "Algorithms", "Database Management", "Operating Systems", "Software Engineering", "Cloud Computing"]
        },
        {
            id: "2",
            degree: "Pre-university",
            institution: "Jawahar Navodaya Vidyalaya (JNV BU)",
            location: "Bengaluru,India",
            startDate: "2016-04-01",
            endDate: "2018-03-31",
            coursework: ["Mathematics", "Physics", "Chemistry", "C++"]
        },
        {
            id: "3",
            degree: "High School",
            institution: "Jawahar Navodaya Vidyalaya (JNV KNR)",
            location: "Karimnagar,India",
            startDate: "2015-04-01",
            endDate: "2016-03-31",
            coursework: []
        }
    ],
    "certifications": [
        {
            "id": "1",
            "name": "Introduction to Data Analytics",
            "organization": "IBM",
            issueDate: new Date("2023-05-01"),
            credentialID: "NEM77ESNJQMW",
            credentialURL: "https://coursera.org/share/9515b89761bbfad3592a481e1d6d9c0f",
        },
        {
            "id": "2",
            "name": "Recognition for EdTech Innovation",
            "organization": "Wadhwani Foundation",
            issueDate: new Date("2023-12-01"),
            "credentialID": "WF-REC-2023",
            "credentialURL": "https://buildaccelerator2023.s3.us-west-1.amazonaws.com/Build+Accelerator+-+LinkedIn.png",
        },
    ],
    "projects": [
        {
            "id": "1",
            "slug": "scalable-lms",
            "cat": "EdTech",
            "title": "Scalable LMS",
            "desc": "Comprehensive LMS with real-time collaboration, video streaming, and progress tracking for 5000+ users.",
            "img": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1200&q=80",
            "tags": ["React", "Node.js", "PostgreSQL", "AWS", "Docker"],
            "liveLink": null,
            "client": "Learnyte",
            "role": "CTO & Lead Dev",
            "year": "2023",
            "challenge": "Scaling to support 5000+ concurrent users with real-time features and video streaming while maintaining high availability.",
            "solution": "Implemented microservices architecture with containerized deployment (Docker) and AWS infrastructure, ensuring 99.9% availability. Integrated payment gateway and automated email notifications.",
            "gallery": [
                "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1200&q=80"
            ]
        },
        {
            "id": "2",
            "slug": "portfolio-tools",
            "cat": "Web / Tools",
            "title": "Portfolio & Tools",
            "desc": "High-performance portfolio with server-side rendering and custom analytics dashboard.",
            "img": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
            "tags": ["Next.js", "TypeScript", "Vercel", "Analytics"],
            "liveLink": "https://nagarjun-avala.vercel.app",
            "client": "Personal",
            "role": "Full Stack Dev",
            "year": "2024",
            "challenge": "Achieving perfect performance scores and tracking granular user engagement without third-party bloat.",
            "solution": "Leveraged Next.js server-side rendering for 95+ Lighthouse scores and built a custom analytics dashboard to track user engagement and optimize content delivery.",
            "gallery": [
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
            ]
        }
    ],
    "experience": [
        {
            "id": "1",
            "start": new Date("2022-01-01"),
            "end": new Date("2024-01-01"),
            "role": "Chief Technology Officer & Web Developer",
            "company": "Learnyte.com",
            "desc": "Architected full-stack EdTech platform (5000+ users). Established DevOps pipeline with CI/CD (GitHub Actions) & Docker."
        },
        {
            "id": "2",
            "start": new Date("2023-10-01"),
            "end": new Date("2023-12-01"),
            "role": "Technical Entrepreneur",
            "company": "AWS Build Accelerator",
            "desc": "Developed cloud-native EdTech solution using AWS (EC2, S3, Lambda). Implemented serverless architecture reducing costs by 45%."
        },
        {
            "id": "3",
            "start": new Date("2023-02-01"),
            "end": new Date("2023-05-01"),
            "role": "Technical Entrepreneur",
            "company": "J HUB Idea Accelerator",
            "desc": "Led product lifecycle from ideation to MVP. Built interactive prototype achieving 85% positive user feedback."
        }
    ],
    "blogs": [
        { "id": "1", "title": "Optimizing EdTech Platforms for Scale", "slug": "optimizing-edtech-platforms", "publishedAt": "2024-01-15", "readingTime": 5, "category": "System Design", "image": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80", "content": "Building scalable educational technology requires a deep understanding of both user experience and system architecture. In this post, I explore the strategies we used to scale Learnyte to 5000+ users." },
        { "id": "2", "title": "Building Cost-Effective Serverless Architectures on AWS", "slug": "serverless-architectures-aws", "publishedAt": "2023-12-10", "readingTime": 8, "category": "Cloud", "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80", "content": "Serverless is not just a buzzword; it's a cost-saving strategy. Learn how migrating to AWS Lambda and S3 reduced our infrastructure costs by 45%." },
        { "id": "3", "title": "From Ideation to MVP: Lessons from J HUB Accelerator", "slug": "ideation-to-mvp", "publishedAt": "2023-06-20", "readingTime": 6, "category": "Entrepreneurship", "image": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80", "content": "The journey from a napkin sketch to a functional product is filled with challenges. Here are the key lessons I learned while building my startup at the J HUB Idea Accelerator." }
    ],
    avatar: "/profile.jpg",
    socials: [
        { platform: "GitHub", url: "https://github.com/nagarjun-avala", icon: "Github" },
        { platform: "Twitter", url: "https://twitter.com/nagarjun_avala", icon: "Twitter" },
        { platform: "LinkedIn", url: "https://linkedin.com/in/nagarjun-avala", icon: "Linkedin" }
    ],
    themeColor: "blue",
    fontPairing: "inter",
    borderRadius: "md"
};
