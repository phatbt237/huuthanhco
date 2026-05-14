"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import { projects } from "@/data/projects";
import { useLanguage } from "@/contexts/LanguageContext";

const categoryMap: Record<string, string> = {
  "cau-duong": "Cầu đường",
  "cang-bien": "Cảng biển",
  "thuy-loi": "Thủy lợi",
  "nao-vet": "Nạo vét",
};

export default function ProjectsPage() {
  const { lang, t } = useLanguage();
  const searchParams = useSearchParams();
  const loaiParam = searchParams.get("loai");
  const allLabel = t("Tất cả", "All");
  const before2022Label = t("Trước 2022", "Before 2022");
  const years = [allLabel, "2024", "2023", "2022", before2022Label];
  const initialCategory = loaiParam ? (categoryMap[loaiParam] ?? allLabel) : allLabel;

  const [activeYear, setActiveYear] = useState(allLabel);
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  // Sync category when URL param changes
  useEffect(() => {
    const category = loaiParam ? (categoryMap[loaiParam] ?? allLabel) : allLabel;
    setActiveCategory(category);
  }, [loaiParam, allLabel]);

  useEffect(() => {
    setActiveYear((current) => (current === "Tất cả" || current === "All" ? allLabel : current === "Trước 2022" || current === "Before 2022" ? before2022Label : current));
  }, [allLabel, before2022Label]);

  const categories = [allLabel, ...Array.from(new Set(projects.map((p) => p.category)))];

  const filtered = projects.filter((p) => {
    const matchYear =
      activeYear === allLabel ||
      (activeYear === before2022Label ? p.year < 2022 : p.year === parseInt(activeYear));
    const matchCategory = activeCategory === allLabel || p.category === activeCategory;
    return matchYear && matchCategory;
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">{t("Dự án tiêu biểu", "Featured Projects")}</h1>
            <p className="text-white/60 text-lg mt-4 max-w-2xl">
              {t("Hơn 200 dự án hoàn thành trải dài khắp miền Nam Việt Nam.", "Over 200 completed projects across Southern Vietnam.")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Category filter */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{t("Lọc theo chủ đề", "Filter by category")}</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat === allLabel ? allLabel : lang === "vi" ? cat : projects.find((p) => p.category === cat)?.categoryEn ?? cat}
                </button>
              ))}
            </div>
          </div>

          {/* Year filter */}
          <div className="mb-12">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{t("Lọc theo năm", "Filter by year")}</p>
            <div className="flex flex-wrap gap-2">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => setActiveYear(y)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeYear === y
                      ? "bg-slate-800 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
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
                    {lang === "vi" ? project.category : project.categoryEn}
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="font-bold text-slate-900 text-lg leading-snug mb-3 group-hover:text-orange-500 transition-colors">
                    {lang === "vi" ? project.name : project.nameEn}
                  </h2>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{lang === "vi" ? project.description : project.descriptionEn}</p>
                  <div className="flex items-center gap-5 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} /> {lang === "vi" ? project.location : project.locationEn}
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
              {t("Không có dự án nào phù hợp với bộ lọc đã chọn.", "No projects match the selected filters.")}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
