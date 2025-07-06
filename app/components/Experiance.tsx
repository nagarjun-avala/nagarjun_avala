import React from 'react'
import { motion } from 'framer-motion';
const experiences = [
  {
    year: "2023",
    title: "Frontend Developer",
    company: "Tech Startup",
    description:
      "Built interactive dashboards and admin panels using Next.js and Tailwind.",
  },
  {
    year: "2024",
    title: "Full Stack Developer",
    company: "Freelance",
    description:
      "Created full-stack applications with role-based access, API integrations, and database support.",
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
    ease: "easeOut",
  },
};

const ExperianceComponent = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeIn}
      className="space-y-6 border-l-2 border-cyan-400 pl-6"
    >
      {experiences.map((exp, i) => (
        <motion.div
          key={i}
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.2 }}
        >
          <div className="absolute -left-3 top-1.5 w-3 h-3 bg-cyan-400 rounded-full" />
          <div className="text-sm text-muted-foreground">{exp.year}</div>
          <h4 className="text-lg font-semibold text-white">
            {exp.title} @ {exp.company}
          </h4>
          <p className="text-sm text-gray-300">{exp.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default ExperianceComponent