"use client"

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { ContactAndFooter } from '@/components/ContactAndFooter';
import { useTheme } from 'next-themes';
import { HeroSection } from '@/components/Hero';
import AboutSection from '@/components/About';
import ProjectsSection from '@/components/Projects';
import ExperienceSection from '@/components/Experience';
import BlogsSection from '@/components/Blogs';
import Cursor from '@/components/Cursor';
import Navbar from '@/components/Navbar';
import { About, Blog, Certification, Education, Experience, Hero, Meta, Project, TechStack } from '@/lib/types';
import ProjectDetail from '@/components/ProjectDetail';
import SkillsSection from '@/components/Skills';
import EducationSection from '@/components/Education';
import CertificationsSection from '@/components/Certifications';
import BlogDetail from '@/components/BlogDetail';
import { calculateTotalExperience, formatDate, formatExperience } from '@/lib/utils';

interface PortfolioDataTypes {
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
}

const MOCK_DATA: PortfolioDataTypes = {
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
  "techStack": {
    "Languages": ["JavaScript", "TypeScript", "C++", "Python", "SQL", "HTML5", "CSS3"],
    "Frontend": ["React.js", "Next.js", "Aceternity UI", "Tailwind CSS", "Material-UI", "Responsive Design"],
    "Backend": ["Node.js", "Express.js", "RESTful APIs", "GraphQL", "WebSockets"],
    "DevOps & Cloud": ["Git", "GitHub Actions", "CI/CD", "AWS (EC2, S3, Lambda)", "Docker", "Kubernetes"],
    "Databases": ["MySQL", "PostgreSQL", "MongoDB", "Redis"],
    "Tools": ["Agile/Scrum", "TDD", "Performance Optimization", "Analytics"]
  },
  "education": [
    {
      "id": "1",
      "degree": "Bachelor of Technology in Computer Science",
      "institution": "Jawaharlal Nehru Technological University Hyderabad (JNTUH)",
      "location": "Hyderabad, India",
      "year": "Aug 2019 - Jul 2023",
      "coursework": ["Data Structures", "Algorithms", "Database Management", "Operating Systems", "Software Engineering", "Cloud Computing"]
    },
    {
      id: "2",
      degree: "Pre-university",
      institution: "Jawahar Navodaya Vidyalaya (JNV BU)",
      location: "Bengaluru,India",
      year: "April 2016 - Mar 2018",
      coursework: ["Mathematics", "Physics", "Chemistry", "C++"]
    },
    {
      id: "3",
      degree: "High School",
      institution: "Jawahar Navodaya Vidyalaya (JNV KNR)",
      location: "Karimnagar,India",
      year: "April 2015 - Mar 2016",
      coursework: []
    }
  ],
  "certifications": [
    {
      "id": "1",
      "title": "Introduction to Data Analytics",
      "issuer": "IBM",
      issueDate: new Date("2023-05-01"),
      credentialID: "NEM77ESNJQMW",
      credentialURL: "https://coursera.org/share/9515b89761bbfad3592a481e1d6d9c0f",
      "type": "Certification"
    },
    {
      "id": "2",
      "title": "Recognition for EdTech Innovation",
      "issuer": "Wadhwani Foundation",
      issueDate: new Date("2023-12-01"),
      "credentialID": "WF-REC-2023",
      "credentialURL": "https://buildaccelerator2023.s3.us-west-1.amazonaws.com/Build+Accelerator+-+LinkedIn.png",
      "type": "Achievement",
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
    { "id": "1", "title": "Optimizing EdTech Platforms for Scale", "date": "Jan 15, 2024", "readTime": "5 min read", "category": "System Design", "link": "#", "image": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80", "content": "Building scalable educational technology requires a deep understanding of both user experience and system architecture. In this post, I explore the strategies we used to scale Learnyte to 5000+ users." },
    { "id": "2", "title": "Building Cost-Effective Serverless Architectures on AWS", "date": "Dec 10, 2023", "readTime": "8 min read", "category": "Cloud", "link": "#", "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80", "content": "Serverless is not just a buzzword; it's a cost-saving strategy. Learn how migrating to AWS Lambda and S3 reduced our infrastructure costs by 45%." },
    { "id": "3", "title": "From Ideation to MVP: Lessons from J HUB Accelerator", "date": "Jun 20, 2023", "readTime": "6 min read", "category": "Entrepreneurship", "link": "#", "image": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80", "content": "The journey from a napkin sketch to a functional product is filled with challenges. Here are the key lessons I learned while building my startup at the J HUB Idea Accelerator." }
  ]
};

export default function App() {
  const [data, setData] = useState<PortfolioDataTypes | null>(null);
  const [isDark, setIsDark] = useState(false); // Default dark mode
  const { setTheme } = useTheme()
  const [activePage, setActivePage] = useState('home'); // 'home' | 'project'
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null); // Changed to ID

  // Data Fetching Simulation
  useEffect(() => {
    const fetchData = async () => {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      // const apiUri = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
      // const { data: res } = await fetch(`${apiUri}/portfolio`, {
      //   method: 'GET'
      // }).then(data => data.json()).catch((err) => toast(err.message ?? "Failed to fetch data"));

      // console.log(res)
      // Calculate years of experience dynamically based on the earliest date found
      let totalYears = 0; // fallback
      let totalMonths = 0; // fallback

      let displayStr = ""
      let displaySuffixStr = ""
      let showPlusBool = false
      if (MOCK_DATA.experience && MOCK_DATA.experience.length > 0) {
        const result = calculateTotalExperience(MOCK_DATA.experience);
        const { display, displaySuffix, showPlus } = formatExperience(result.years, result.months)
        totalYears = result.years;
        totalMonths = result.months
        displayStr = display
        displaySuffixStr = displaySuffix ?? ""
        showPlusBool = showPlus
      }

      // Create first name for dynamic title
      const firstName = MOCK_DATA.name.split(' ')[0];

      const enrichedData = {
        ...MOCK_DATA,
        meta: {
          ...MOCK_DATA.meta,
          title: `${MOCK_DATA.name} | Creative Developer` // Dynamic Meta Title
        },
        about: {
          ...MOCK_DATA.about,
          title: `Hi, I'm ${firstName}.`, // Dynamic About Title
          experience: {
            ...MOCK_DATA.about.experience,
            years: totalYears,
            months: totalMonths,
            display: displayStr,
            displaySuffix: displaySuffixStr,
            sign: showPlusBool ? "+" : ""
          },
          // Inject languages here
          languages: MOCK_DATA.about.languages,
          location: MOCK_DATA.about.location
        }
      };

      setData(enrichedData);

      // Update document title dynamically
      if (typeof document !== 'undefined') {
        document.title = enrichedData.meta.title;
      }
    };
    fetchData();
  }, []);

  // Theme Toggle
  const toggleTheme = () => {
    setIsDark(!isDark);
    setTheme(isDark ? "dark" : "light")
  };

  // Router Handlers
  const handleProjectClick = (slug: string) => {
    setSelectedProjectSlug(slug);
    setActivePage('project');
    // In a real app we'd use router.push, here we just set state
    // window.history.pushState({}, "", `/projects/${slug}`); // Disabled for sandbox safety
  };

  const handleBlogClick = (id: string) => {
    setSelectedBlogId(id);
    setActivePage('blog');
  };

  const handleBackHome = () => {
    setActivePage('home');
    setSelectedProjectSlug(null);
    setSelectedBlogId(null);
    // window.history.pushState({}, "", "/"); // Disabled for sandbox safety
  };


  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  // Find active project for detail view
  const activeProjectIndex = selectedProjectSlug ? data.projects.findIndex(p => p.slug === selectedProjectSlug) : -1;
  const activeProject = activeProjectIndex !== -1 ? data.projects[activeProjectIndex] : null;
  const prevProject = activeProjectIndex > 0 ? data.projects[activeProjectIndex - 1] : null;
  const nextProject = activeProjectIndex < data.projects.length - 1 ? data.projects[activeProjectIndex + 1] : null;

  // Find active blog for detail view
  const activeBlog = selectedBlogId ? data.blogs.find(b => b.id === selectedBlogId) : null;

  return (
    <div className={`min-h-screen selection:bg-rose-500/30 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300`}>
      <Cursor />

      {/* Conditionally Render Navbar based on view (simplified in detail view) */}
      <Navbar toggleTheme={toggleTheme} isDark={isDark} onNavClick={handleBackHome} isDetailView={activePage !== 'home'} />

      <main>
        {activePage === 'home' && (
          <>
            <HeroSection data={data.hero} />
            <AboutSection data={data.about} />
            <SkillsSection techStack={data.techStack} />
            <ProjectsSection projects={data.projects} onProjectClick={handleProjectClick} />
            <ExperienceSection experience={data.experience} totalExperiance={data.about.experience.display} />
            <EducationSection education={data.education} />
            <CertificationsSection certifications={data.certifications} />
            <BlogsSection blogs={data.blogs} onBlogClick={handleBlogClick} />
            <ContactAndFooter email={data.meta.email} phone={data.meta.phone} name={data.name} />
          </>
        )}
        {activePage === 'project' && (
          <ProjectDetail
            project={activeProject}
            onBack={handleBackHome}
            onNavigate={handleProjectClick}
            prevProject={prevProject}
            nextProject={nextProject}
          />
        )}
        {activePage === 'blog' && (
          <BlogDetail
            blog={activeBlog}
            onBack={handleBackHome}
          />
        )}
      </main>
    </div>
  );
}