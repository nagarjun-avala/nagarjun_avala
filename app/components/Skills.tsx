
import React from 'react'
import { motion } from 'framer-motion';
import {
  BadgeCheck, Database, Settings, MonitorSmartphone,
} from "lucide-react";
import { Tooltip,TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

import {
  SiReact, SiNextdotjs, SiNodedotjs, SiExpress, SiMongodb, SiPostgresql,
  SiTypescript, SiPrisma, SiTailwindcss, SiGit
} from "react-icons/si";

const skillGroups = [
  {
    category: "Frontend",
    icon: <MonitorSmartphone size={20} className="text-cyan-400" />,
    skills: [
      { name: "React", years: 2, icon: <SiReact />, description: "Component-based UI library" },
      { name: "Next.js", years: 2, icon: <SiNextdotjs />, description: "React framework for full-stack apps" },
      { name: "TypeScript", years: 2, icon: <SiTypescript />, description: "Typed superset of JavaScript" },
      { name: "Tailwind CSS", years: 2, icon: <SiTailwindcss />, description: "Utility-first CSS framework" },
    ],
  },
  {
    category: "Backend",
    icon: <Database size={20} className="text-cyan-400" />,
    skills: [
      { name: "Node.js", years: 2, icon: <SiNodedotjs />, description: "JavaScript runtime for backend" },
      { name: "Express", years: 2, icon: <SiExpress />, description: "Minimal Node.js web framework" },
      { name: "MongoDB", years: 2, icon: <SiMongodb />, description: "NoSQL database" },
      { name: "SQL", years: 2, icon: <Database size={16} />, description: "Relational query language" },
      { name: "Prisma", years: 1, icon: <SiPrisma />, description: "ORM for SQL databases" },
      { name: "PostgreSQL", years: 1, icon: <SiPostgresql />, description: "Advanced open source SQL DB" },
    ],
  },
  {
    category: "Tools",
    icon: <Settings size={20} className="text-cyan-400" />,
    skills: [
      { name: "Git", years: 2, icon: <SiGit />, description: "Version control system" },
      { name: "DSA", years: 2, icon: <BadgeCheck size={16} />, description: "Data Structures & Algorithms" },
    ],
  },
];

const skillVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
    ease: "easeOut",
  }),
};

const SkillsComponent = () => {
  return (
    <TooltipProvider>
      <div className="space-y-10">
        {skillGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            <div className="flex items-center gap-2 mb-4">
              {group.icon}
              <h3 className="text-xl font-semibold text-cyan-300">
                {group.category}
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {group.skills.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.4 }}
                  variants={skillVariants}
                  className="bg-white/10 backdrop-blur border border-cyan-400 rounded-md p-3 flex flex-col gap-1 hover:shadow-lg transition-all relative text-sm"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 text-cyan-200">
                        <span className="text-sm">{skill.icon}</span>
                        <span className="font-medium">{skill.name}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs max-w-xs">
                      {skill.description}
                    </TooltipContent>
                  </Tooltip>
                  <motion.div
                    className="w-full bg-cyan-900/40 h-1.5 rounded-full overflow-hidden"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.years * 20 + 40}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  >
                    <div className="bg-cyan-400 h-full rounded-full" />
                  </motion.div>
                  <div className="text-[11px] text-muted-foreground">
                    {skill.years}+ yrs
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}

export default SkillsComponent