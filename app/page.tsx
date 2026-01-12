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
import { About, Blog, Experience, Hero, Meta, Project } from '@/lib/types';

interface PortfolioDataTypes {
  name: string
  meta: Meta
  hero: Hero
  about: About
  projects: Project[]
  experience: Experience[]
  blogs: Blog[]
}

const MOCK_DATA: PortfolioDataTypes = {
  name: "Nagarjun Avala",
  meta: {
    title: "Creative Developer Portfolio",
    email: "nagarjun.avala.official@gmail.com"
  },
  hero: {
    badge: "Open to Work & Collaborations",
    roles: ["Web Developer"],
    titlePrefix: "I am a",
    titleSuffix: "& Aspiring DevOps Engineer",
    description: "Bridging the gap between code and infrastructure with precision and chaos-engineering.",
    ctaPrimary: "Explore My Work",
    ctaSecondary: "Contact Me"
  },
  about: {
    title: "",
    description: "I specialize in building performant, accessible, and beautiful web applications. Currently obsessed with React, Framer Motion, and micro-interactions.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    experience: {
      years: "5+",
      label: "Years of Experience"
    },
    skills: ["JavaScript", "React", "Next.js", "TypeScript", "Node.js", "Tailwind", "Framer Motion", "Three.js", "PostgreSQL", "AWS"]
  },
  projects: [
    {
      "id": 1,
      "cat": "E-Commerce",
      "title": "Neon Market",
      "desc": "Next-gen shopping experience with 3D product previews.",
      "img": "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80",
      "tags": ["React", "Three.js", "Shopify"]
    },
    {
      "id": 2,
      "cat": "SaaS Platform",
      "title": "Flow Dashboard",
      "desc": "Real-time analytics platform for enterprise teams.",
      "img": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      "tags": ["Next.js", "D3.js", "Supabase"]
    },
    {
      "id": 3,
      "cat": "3D Experience",
      "title": "Orbit Visuals",
      "desc": "Interactive audio-reactive visualizer in the browser.",
      "img": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      "tags": ["WebGL", "GLSL", "React"]
    },
    {
      "id": 4,
      "cat": "AI Integration",
      "title": "Brainwave",
      "desc": "Generative AI interface for creative writing.",
      "img": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
      "tags": ["OpenAI", "Node.js", "Tailwind"]
    }
  ],
  experience: [
    {
      "id": "3",
      "start": new Date("2023-02-01"),
      "end": new Date("2023-05-01"),
      "role": "Entrepreneur",
      "company": "J Hub",
      "desc": "Award-winning WebGL sites for top clients."
    },
    {
      "id": "1",
      "start": new Date("2022-01-01"),
      "end": new Date("2024-01-01"),
      "role": "Web Developer",
      "company": "Learnyte",
      "desc": "Leading design system & Next.js migration."
    },
    {
      "id": "2",
      "start": new Date("2023-10-01"),
      "end": new Date("2023-12-01"),
      "role": "Entrepreneur",
      "company": "Amazon Web Services(AWS)",
      "desc": "Scaled MVP to 10k users with AWS & Node.js."
    },

  ],
  blogs: [
    { "id": 1, "title": "The Future of React Server Components", "date": "Oct 12, 2023", "readTime": "5 min read", "category": "Tech" },
    { "id": 2, "title": "Mastering Framer Motion layout animations", "date": "Sep 28, 2023", "readTime": "8 min read", "category": "Design" },
    { "id": 3, "title": "Why I switched from VS Code to Neovim", "date": "Aug 15, 2023", "readTime": "6 min read", "category": "Productivity" }
  ]
};

export default function App() {
  const [data, setData] = useState<PortfolioDataTypes | null>(null);
  const [isDark, setIsDark] = useState(false); // Default dark mode
  const { setTheme } = useTheme()

  // Data Fetching Simulation
  useEffect(() => {
    const fetchData = async () => {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));

      // Calculate years of experience dynamically based on the earliest date found
      let totalYears = "5+"; // fallback
      if (MOCK_DATA.experience && MOCK_DATA.experience.length > 0) {
        const startYears = MOCK_DATA.experience.map(exp => exp.start.getFullYear());
        const minYear = Math.min(...startYears);
        const currentYear = new Date().getFullYear();
        totalYears = `${currentYear - minYear}+`;
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
            years: totalYears
          }
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

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  // Calculate sections for Navbar based on available data
  const sections = {
    hero: !!data.hero,
    about: !!data.about,
    projects: data.projects && data.projects.length > 0,
    experience: data.experience && data.experience.length > 0,
    blogs: data.blogs && data.blogs.length > 0,
  };

  return (
    <div className={`min-h-screen selection:bg-rose-500/30 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300`}>
      <Cursor />
      <Navbar toggleTheme={toggleTheme} isDark={isDark} sections={sections} />

      <main>
        {sections.hero && <HeroSection data={data.hero} />}
        {sections.about && <AboutSection data={data.about} />}
        {sections.projects && <ProjectsSection projects={data.projects} />}
        {sections.experience && <ExperienceSection experience={data.experience} />}
        {sections.blogs && <BlogsSection blogs={data.blogs} />}
      </main>

      <ContactAndFooter email={data?.meta?.email} name={data.name} />
    </div>
  );
}