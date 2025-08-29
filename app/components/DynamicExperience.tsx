// components/DynamicExperience.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, } from 'lucide-react';
import { Experience } from '@prisma/client';

interface DynamicExperienceProps {
  experiences: Experience[];
}

const DynamicExperienceComponent: React.FC<DynamicExperienceProps> = ({ experiences }) => {
  if (!experiences.length) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="text-6xl">💼</div>
          <h3 className="text-xl text-gray-300">Experience section coming soon!</h3>
          <p className="text-gray-400">Professional experience will be showcased here.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500" />

        {experiences.map((experience, index) => (
          <motion.div
            key={experience.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            className="relative pl-12 pb-12 last:pb-0"
          >
            {/* Timeline Dot */}
            <motion.div
              className={`absolute left-2 top-2 w-4 h-4 rounded-full border-2 ${experience.isCurrent
                ? 'bg-cyan-400 border-cyan-400 shadow-lg shadow-cyan-400/50'
                : 'bg-gray-600 border-gray-400'
                }`}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: index * 0.2 + 0.3, duration: 0.3 }}
            />

            {experience.isCurrent && (
              <motion.div
                className="absolute left-2 top-2 w-4 h-4 rounded-full bg-cyan-400"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(6, 182, 212, 0.4)",
                    "0 0 0 10px rgba(6, 182, 212, 0)",
                  ]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
            )}

            <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10 hover:border-cyan-500/50 transition-all duration-300">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {experience.title}
                  </h3>
                  <div className="flex items-center gap-2 text-cyan-400">
                    <span className="font-medium">{experience.company}</span>
                    {experience.location && (
                      <>
                        <span className="text-gray-500">•</span>
                        <span className="flex items-center gap-1 text-gray-400">
                          <MapPin size={14} />
                          {experience.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${experience.type === 'full-time'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : experience.type === 'freelance'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}>
                    {experience.type.replace('-', ' ')}
                  </span>

                  {experience.isCurrent && (
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-medium rounded-full border border-cyan-500/30">
                      Current
                    </span>
                  )}
                </div>
              </div>

              {/* Date Range */}
              <div className="flex items-center gap-1 text-sm text-gray-400 mb-4">
                <Calendar size={14} />
                <span>
                  {new Date(experience.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  {' - '}
                  {experience.isCurrent
                    ? 'Present'
                    : experience.endDate
                      ? new Date(experience.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                      : 'Present'
                  }
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-4">
                {experience.description}
              </p>

              {/* Achievements */}
              {experience.achievements.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-cyan-300 mb-2">Key Achievements:</h4>
                  <ul className="space-y-1">
                    {experience.achievements.map((achievement, i) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-cyan-400 mt-1.5 w-1 h-1 rounded-full bg-cyan-400 flex-shrink-0" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies */}
              {experience.technologies.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-cyan-300 mb-2">Technologies Used:</h4>
                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded border border-gray-600"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DynamicExperienceComponent;