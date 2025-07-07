// Next.js Page with Glassmorphism, Responsive Design, Link Tags, Theme Toggle, and Email Handler

"use client";

import React, { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Menu,
  X,
  Folder,
  FileText,
  Book,
  MessageSquare,
  Home,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useAnimation, useScroll, useSpring } from "motion/react";
import HomeComponent from "./components/Home";
import SkillsComponent from "./components/Skills";
import ProjectsComponent from "./components/Projects";
import BllogsComponent from "./components/Blogs";
import ContactMeComponent from "./components/ContactMe";
import ExperianceComponent from "./components/Experiance";


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

export default function HomePage() {
  const [theme, setTheme] = useState("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showTopBtn, setShowTopBtn] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const scrollControls = useAnimation();

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    scrollControls.start({ opacity: 1 });

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
  }, [scrollControls]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

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
          className="fixed bottom-6 right-6 z-50 bg-cyan-500 text-white p-3 rounded-full shadow-lg hover:bg-cyan-600"
        >
          <ArrowUp size={20} />
        </button>
      )}

      <div className="md:ml-20">
        {/* Sections */}

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
            {id !== "home" && (
              <>
                <h2 className="text-3xl font-bold mb-2 capitalize">{id}</h2>
                <p className="text-muted-foreground mb-10">
                  This is the {id} section content.
                </p>
              </>
            )}

            

            {id === "home" && (
              <div className="text-center">
                <HomeComponent />
              </div>
            )}

            {id === "skills" && <SkillsComponent />}

            {id === "projects" && <ProjectsComponent />}

            {id === "blog" && <BllogsComponent />}

            {id === "contact" && <ContactMeComponent />}

            {id === "experience" && <ExperianceComponent />}
          </motion.section>
        ))}
        {/* Floating section nav for desktop with active highlight and neon glow */}
        <div className="fixed top-1/2 left-4 z-40 hidden md:flex flex-col gap-4">
          {sections.map(({ id, label, icon }) => (
            <motion.button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`text-sm px-3 py-1 rounded backdrop-blur flex items-center gap-2 transition-all duration-300 font-medium ${
                activeSection === id
                  ? "bg-cyan-400 text-black shadow-[0_0_10px_2px_rgba(34,211,238,0.8)]"
                  : "bg-white/10 hover:bg-cyan-600 hover:shadow-[0_0_6px_rgba(34,211,238,0.5)]"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <span className="sr-only">{label}</span>
              {icon}
            </motion.button>
          ))}
        </div>

        {/* Scrollable section nav for mobile */}
        <div className="fixed bottom-2 left-0 right-0 z-50 flex justify-center md:hidden overflow-x-auto px-4">
          <div className="flex gap-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-xl">
            {sections.map(({ id, icon, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`p-2 rounded-full transition ${
                  activeSection === id
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

        {/* Mobile hamburger */}
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
                className="text-xl text-white hover:text-cyan-400 transition"
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <div className="absolute top-6 right-6">
          <Button
            variant="ghost"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hover:text-cyan-400"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>
      </div>

      <footer className="text-center text-sm text-gray-500 mt-16">
        &copy; {new Date().getFullYear()} Nagarjun A. All rights reserved.
      </footer>
    </main>
  );
}
