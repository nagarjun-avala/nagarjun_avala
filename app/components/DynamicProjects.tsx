// components/DynamicProjects.tsx
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Calendar, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@prisma/client';

interface DynamicProjectsProps {
  projects: Project[];
}

const DynamicProjectsComponent: React.FC<DynamicProjectsProps> = ({ projects }) => {
  const [filterTech, setFilterTech] = useState("");

  const filteredProjects = useMemo(() => {
    if (!filterTech) return projects;
    return projects.filter(project =>
      project.technologies.some(tech =>
        tech.toLowerCase().includes(filterTech.toLowerCase())
      )
    );
  }, [projects, filterTech]);

  const uniqueTechnologies = useMemo(() => {
    const allTechs = projects.flatMap(project => project.technologies);
    return Array.from(new Set(allTechs));
  }, [projects]);

  if (!projects.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No projects available yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filter Tags */}
      <div className="flex flex-wrap gap-3 justify-center">
        <motion.button
          onClick={() => setFilterTech("")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filterTech === ""
            ? "bg-cyan-500 text-black shadow-lg"
            : "bg-white/10 hover:bg-cyan-600/20 text-white border border-cyan-500/30"
            }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          All ({projects.length})
        </motion.button>

        {uniqueTechnologies.map((tech) => {
          const count = projects.filter(p => p.technologies.includes(tech)).length;
          return (
            <motion.button
              key={tech}
              onClick={() => setFilterTech(tech)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filterTech === tech
                ? "bg-cyan-500 text-black shadow-lg"
                : "bg-white/10 hover:bg-cyan-600/20 text-white border border-cyan-500/30"
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tech} ({count})
            </motion.button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        layout
      >
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{
              y: -5,
              boxShadow: "0 20px 40px rgba(6, 182, 212, 0.1)"
            }}
            className="relative bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 group"
          >
            {/* Featured Badge */}
            {project.featured && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Star size={12} fill="currentColor" />
                Featured
              </div>
            )}

            {/* Project Image */}
            {project.imageUrl && (
              <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={project.imageUrl}
                  alt={project.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            )}

            {/* Project Info */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {project.name}
                </h3>
                <span className={`px-2 py-1 text-xs rounded-full ${project.status === 'completed'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : project.status === 'in-progress'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                  {project.status.replace('-', ' ')}
                </span>
              </div>

              <p className="text-gray-300 text-sm line-clamp-3">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1">
                {project.technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs bg-cyan-500/10 text-cyan-400 rounded border border-cyan-500/30"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="px-2 py-1 text-xs bg-gray-500/10 text-gray-400 rounded border border-gray-500/30">
                    +{project.technologies.length - 4}
                  </span>
                )}
              </div>

              {/* Links */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-3">
                  {project.demoUrl && (
                    <Link
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      <ExternalLink size={14} />
                      Live Demo
                    </Link>
                  )}

                  {project.githubUrl && (
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      <Github size={14} />
                      Code
                    </Link>
                  )}
                </div>

                {project.startDate && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} />
                    {new Date(project.startDate).getFullYear()}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredProjects.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-gray-400">
            No projects found matching &quot;<span className="text-cyan-400">{filterTech}</span>&quot;.
            Try a different filter.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default DynamicProjectsComponent;