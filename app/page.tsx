"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Folder,
  FileText,
  Book,
  MessageSquare,
  Home,
  ArrowUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useAnimation, useScroll, useSpring } from "motion/react";
import DynamicHomeComponent from "./components/DynamicHome";
import DynamicSkillsComponent from "./components/DynamicSkills";
import DynamicProjectsComponent from "./components/DynamicProjects";
import DynamicBlogComponent from "./components/DynamicBlog";
import DynamicContactMeComponent from "./components/DynamicContactMe";
import DynamicExperienceComponent from "./components/DynamicExperience";
import VisitorCounter from "./components/VisitorCounter";
import { BlogPost, Experience, Profile, Project, Skill } from "@prisma/client";


export interface PortfolioData {
  profile: Profile | null;
  skills: Record<string, Skill[]>;
  projects: Project[];
  experiences: Experience[];
  blogPosts: BlogPost[];
  config: Record<string, unknown>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
    ease: "easeOut",
  }),
};

const sections = [
  { id: "home", label: "Home", icon: <Home size={16} /> },
  { id: "skills", label: "Skills", icon: <Folder size={16} /> },
  { id: "projects", label: "Projects", icon: <FileText size={16} /> },
  { id: "experience", label: "Experience", icon: <Book size={16} /> },
  { id: "blog", label: "Blog", icon: <Book size={16} /> },
  { id: "contact", label: "Contact", icon: <MessageSquare size={16} /> },
];

export default function DynamicPortfolioPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const scrollControls = useAnimation();

  // Fetch portfolio data
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/portfolio');

        if (!response.ok) {
          throw new Error(`Failed to fetch portfolio data: ${response.status}`);
        }

        const data: PortfolioData = await response.json();
        setPortfolioData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load portfolio data');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  useEffect(() => {
    if (!loading) {
      scrollControls.start({ opacity: 1 });
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      let current = "home";
      sections.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && scrollY >= el.offsetTop - 150) current = id;
      });
      setActiveSection(current);
      setShowTopBtn(scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollControls, loading]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4 text-cyan-400" size={48} />
          <h2 className="text-2xl font-semibold mb-2">Loading Portfolio...</h2>
          <p className="text-gray-400">Fetching the latest data</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !portfolioData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="mx-auto mb-4 text-red-400" size={48} />
          <h2 className="text-2xl font-semibold mb-2 text-red-400">Something went wrong</h2>
          <p className="text-gray-400 mb-4">{error || 'Failed to load portfolio data'}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-cyan-600 hover:bg-cyan-500"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white px-4 py-10 sm:px-6 md:px-10 font-sans transition-all duration-300">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-2 z-50 bg-gradient-to-r from-purple-500 via-cyan-400 to-pink-500 animate-pulse rounded-full opacity-0 origin-left shadow-[0_0_8px_rgba(0,255,255,0.5),0_0_16px_rgba(255,0,255,0.4),0_0_24px_rgba(255,255,0,0.2)]"
        style={{
          scaleX,
          boxShadow: `0 0 ${20 + scaleX.get() * 30}px rgba(0,255,255,0.6),
                    0 0 ${30 + scaleX.get() * 40}px rgba(255,0,255,0.5),
                    0 0 ${40 + scaleX.get() * 50}px rgba(255,255,0,0.3)`
        }}
        animate={scrollControls}
        initial={{ opacity: 0 }}
      />

      {/* Back to Top Button */}
      {showTopBtn && (
        <button
          onClick={() => scrollToSection("home")}
          className="fixed bottom-6 right-6 z-50 bg-cyan-500 text-white p-3 rounded-full shadow-lg hover:bg-cyan-600 transition-colors"
        >
          <ArrowUp size={20} />
        </button>
      )}

      <div className="md:ml-20">
        {/* Dynamic Sections */}
        {sections.map(({ id }) => (
          <motion.section
            key={id}
            id={id}
            className="mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            {id !== "home" && portfolioData && (
              <>
                <h2 className="text-3xl font-bold mb-2 capitalize">{id}</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mb-10" />
              </>
            )}

            {id === "home" && portfolioData?.profile && (
              <div className="text-center">
                <DynamicHomeComponent profile={portfolioData.profile} />
              </div>
            )}

            {id === "skills" && portfolioData?.skills && (
              <DynamicSkillsComponent skills={portfolioData.skills} />
            )}

            {id === "projects" && portfolioData?.projects && (
              <DynamicProjectsComponent projects={portfolioData.projects} />
            )}

            {id === "blog" && portfolioData?.blogPosts && (
              <DynamicBlogComponent blogPosts={portfolioData.blogPosts} />
            )}

            {id === "contact" && portfolioData?.profile && (
              <DynamicContactMeComponent profile={portfolioData.profile} />
            )}

            {id === "experience" && portfolioData?.experiences && (
              <DynamicExperienceComponent experiences={portfolioData.experiences} />
            )}
          </motion.section>
        ))}

        {/* Floating section nav for desktop */}
        <div className="fixed top-1/2 left-4 z-40 hidden md:flex flex-col gap-4">
          {sections.map(({ id, label, icon }) => (
            <motion.button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`text-sm px-3 py-1 rounded backdrop-blur flex items-center gap-2 transition-all duration-300 font-medium ${activeSection === id
                ? "bg-cyan-400 text-black shadow-[0_0_10px_2px_rgba(34,211,238,0.8)]"
                : "bg-white/10 hover:bg-cyan-600 hover:shadow-[0_0_6px_rgba(34,211,238,0.5)]"
                }`}
              whileHover={{ scale: 1.05 }}
              title={label}
            >
              {icon}
            </motion.button>
          ))}
        </div>

        {/* Mobile bottom navigation */}
        <div className="fixed bottom-2 left-0 right-0 z-50 flex justify-center md:hidden overflow-x-auto px-4">
          <div className="flex gap-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-xl">
            {sections.map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`p-2 rounded-full transition-all duration-300 ${activeSection === id
                  ? "bg-cyan-400 text-black shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                  : "text-white hover:bg-cyan-600 hover:text-black"
                  }`}
                title={label}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile hamburger menu */}
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <Button variant="ghost" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {menuOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center space-y-6">
            {sections.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="text-xl text-white hover:text-cyan-400 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <VisitorCounter />
      </div>
    </main>
  );
}