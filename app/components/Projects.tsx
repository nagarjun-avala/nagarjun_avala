"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const projects = [
  {
    name: "Inventory Management System",
    tech: "Next.js, Node.js, Prisma, PostgreSQL",
    description: "Secure, role-based dashboard with barcode support.",
  },
  {
    name: "Skopeo – Lane Detection System",
    tech: "TensorFlow, Python, OpenCV",
    description: "Deep learning-powered lane detection with Kalman filter.",
  },
  {
    name: "Shortest Path Finder",
    tech: "Next.js, Map APIs, Graph Search",
    description: "DSA-based map app for real-world coordinate navigation.",
  },
];

const ProjectsComponent = () => {
  const [filterTech, setFilterTech] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const timer = setTimeout(() => setLoading(false), 800);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("projectFilter", filterTech);
  }, [filterTech]);

  const filteredProjects = filterTech
    ? projects.filter((p) =>
        p.tech.toLowerCase().includes(filterTech.toLowerCase())
      )
    : projects;

  const uniqueTags = Array.from(
    new Set(projects.flatMap((p) => p.tech.split(", ")))
  );

  return (
    <>
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setFilterTech("")}
          className={`px-4 py-1 rounded-full text-sm ${
            filterTech === ""
              ? "bg-cyan-500 text-black"
              : "bg-white/10 hover:bg-cyan-600 text-white"
          }`}
        >
          All
        </button>
        {uniqueTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilterTech(tag)}
            className={`px-4 py-1 rounded-full text-sm ${
              filterTech === tag
                ? "bg-cyan-500 text-black"
                : "bg-white/10 hover:bg-cyan-600 text-white"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse h-40 bg-white/10 backdrop-blur rounded-xl"
              />
            ))
          : filteredProjects.map((project, index) => (
              <motion.div
                key={index}
                className="relative bg-white/10 backdrop-blur rounded-xl p-6 shadow-lg hover:shadow-xl transform transition duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                whileHover={{ rotateX: 5, rotateY: -5 }}
              >
                <h3 className="text-xl font-semibold text-white mb-2">
                  {project.name}
                </h3>
                <p className="text-sm text-cyan-300 mb-1">{project.tech}</p>
                <p className="text-muted-foreground text-sm">
                  {project.description}
                </p>
              </motion.div>
            ))}
      </div>
    </>
  );
};

export default ProjectsComponent;
