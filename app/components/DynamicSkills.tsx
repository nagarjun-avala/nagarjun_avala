// components/DynamicSkills.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  BadgeCheck, Database, Settings, MonitorSmartphone, Code, Palette, Server
} from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Skill } from '@prisma/client';

interface DynamicSkillsProps {
  skills: Record<string, Skill[]>;
}

const skillVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
    ease: "easeOut",
  }),
};

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'frontend': return <MonitorSmartphone size={20} className="text-cyan-400" />;
    case 'backend': return <Database size={20} className="text-cyan-400" />;
    case 'database': return <Server size={20} className="text-cyan-400" />;
    case 'tools': return <Settings size={20} className="text-cyan-400" />;
    case 'design': return <Palette size={20} className="text-cyan-400" />;
    case 'programming': return <Code size={20} className="text-cyan-400" />;
    default: return <BadgeCheck size={20} className="text-cyan-400" />;
  }
};

const DynamicSkillsComponent: React.FC<DynamicSkillsProps> = ({ skills }) => {
  return (
    <TooltipProvider>
      <div className="space-y-10">
        {Object.entries(skills).map(([category, categorySkills], groupIdx) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: groupIdx * 0.1, duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              {getCategoryIcon(category)}
              <h3 className="text-xl font-semibold text-cyan-300">
                {category}
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent ml-4" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {categorySkills.map((skill, i) => (
                <motion.div
                  key={skill.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.4 }}
                  variants={skillVariants}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(6, 182, 212, 0.15)"
                  }}
                  className="bg-white/5 backdrop-blur border border-cyan-400/30 rounded-lg p-4 flex flex-col gap-2 hover:border-cyan-400 transition-all duration-300 relative text-sm group"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 text-cyan-200">
                        {skill.icon && (
                          <span className="text-lg">{skill.icon}</span>
                        )}
                        <span className="font-medium text-white group-hover:text-cyan-300 transition-colors">
                          {skill.name}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs max-w-xs bg-gray-800 border-cyan-500/30">
                      <p>{skill.description || `${skill.years}+ years of experience with ${skill.name}`}</p>
                      <p className="text-cyan-400 mt-1">Proficiency: {skill.proficiency}%</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Proficiency Bar */}
                  <div className="space-y-1">
                    <motion.div
                      className="w-full bg-gray-700/50 h-2 rounded-full overflow-hidden"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    >
                      <motion.div
                        className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-full rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency}%` }}
                        transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                      />
                    </motion.div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-400">{skill.years}+ yrs</span>
                      <span className="text-cyan-400 font-medium">{skill.proficiency}%</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default DynamicSkillsComponent;