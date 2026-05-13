"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import { projects } from "@/data/projects";

const years = ["Tất cả", "2024", "2023", "2022", "Trước 2022"];

export default function ProjectsPage() {
  const [activeYear, setActiveYear] = useState("Tất cả");

  const filtered = projects.filter((p) => {
    if (activeYear === "Tất cả") return true;
    if (activeYear === "Trước 2022") return p.year < 2022;
    return p.year === parseInt(activeYear);
  });

  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: "#0D1B2A" }} className="relative py-32">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1600&q=80')" }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">Portfolio</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">Dự án tiêu biểu</h1>
            <p className="text-white/60 text-lg mt-4 max-w-2xl">
              Hơn 200 dự án hoàn thành trải dài khắp miền Nam Việt Nam.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-3 mb-12">
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setActiveYear(y)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeYear === y
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl border border-slate-100 transition-shadow duration-300"
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {project.category}
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="font-bold text-slate-900 text-lg leading-snug mb-3 group-hover:text-orange-500 transition-colors">
                    {project.name}
                  </h2>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex items-center gap-5 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} /> {project.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} /> {project.year}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              Không có dự án nào trong năm này.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
