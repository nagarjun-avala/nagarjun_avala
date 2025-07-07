import React from "react";
import { Metadata } from "next";
import { Calendar, User } from "lucide-react";
import { motion } from "framer-motion";

export const metadata: Metadata = {
  title: "How I Built My Portfolio Using Next.js",
  description:
    "An overview of the tech stack and design decisions I made while building my personal portfolio website.",
};

const BllogsComponent = () => {
  return (
    <motion.article
      className="prose prose-invert dark:prose-invert max-w-3xl mx-auto py-20 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <header className="mb-6 border-b border-white/10 pb-4">
        <h1 className="text-4xl font-bold">How I Built My Portfolio Using Next.js</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
          <span className="flex items-center gap-1">
            <User size={14} /> Nagarjun A
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} /> July 6, 2025
          </span>
        </div>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <p>
          When I set out to build my personal portfolio, I wanted something that felt fast,
          responsive, and visually impressive. I chose <strong>Next.js</strong> for its SSR and routing
          benefits, <strong>Tailwind CSS</strong> for design, and <strong>ShadCN UI</strong> for consistent
          components.
        </p>

        <h2>Design Philosophy</h2>
        <p>
          I followed a minimal and futuristic design language, using glassmorphism and neon
          highlights. With Framer Motion, I added subtle animations to project cards, tooltips,
          and timeline entries.
        </p>

        <h2>Core Features</h2>
        <ul>
          <li>💡 Animated skill cards with tooltips and proficiency bars</li>
          <li>🗂 Filterable projects section using tag-based chips</li>
          <li>🌗 Light/Dark theme toggle with next-themes</li>
          <li>📨 Contact form connected to /api/contact with backend handler</li>
          <li>🛡️ Honeypot protection to prevent spam bots</li>
          <li>📧 Email integration via Resend or Nodemailer</li>
          <li>🎬 Animated form fields and components as they appear</li>
        </ul>

        <h2>What I Learned</h2>
        <p>
          This project deepened my understanding of UI state management, responsive design,
          and deploying full-stack apps with modern tools. I also explored integrating Notion
          for future blog post management.
        </p>

        <footer className="mt-10 border-t border-white/10 pt-4 text-sm text-muted-foreground">
          Thanks for reading! More posts coming soon...
        </footer>
      </motion.section>
    </motion.article>
  );
}

export default BllogsComponent