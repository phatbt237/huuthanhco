"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, MapPin, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCmsContent } from "@/lib/useCmsContent";
import { mergeById, type CmsContent } from "@/lib/cmsContent";
import { getProjectDetailHref, sortProjectsByYearDesc } from "@/lib/projects";
import { mediaFileUrl } from "@/lib/siteApi";
import { projects } from "@/data/projects";
import { normalizeSearchText } from "@/lib/utils";

const categoryMapVi: Record<string, string> = {
  "giao-thong-hang-hai": "Công trình giao thông hàng hải",
  "ha-tang-ky-thuat": "Công trình hạ tầng kỹ thuật",
  "cang-bien": "Công trình giao thông hàng hải",
  "nao-vet": "Công trình giao thông hàng hải",
  "ha-tang": "Công trình hạ tầng kỹ thuật",
  "thuy-loi": "Công trình hạ tầng kỹ thuật",
  "cau-duong": "Công trình hạ tầng kỹ thuật",
};

export default function ProjectsPage({ initialContent }: { initialContent?: CmsContent }) {
  const { lang, t } = useLanguage();
  const cmsContent = useCmsContent(initialContent);
  const projectItems = sortProjectsByYearDesc(mergeById(projects, cmsContent.projects));
  const searchParams = useSearchParams();
  const loaiParam = searchParams.get("loai");
  const initialCategory = loaiParam ? (categoryMapVi[loaiParam] ?? "all") : "all";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const category = loaiParam ? (categoryMapVi[loaiParam] ?? "all") : "all";
    setActiveCategory(category);
  }, [loaiParam]);

  const categories = [
    { key: "all", label: t("Tất cả", "All") },
    { key: "Công trình giao thông hàng hải", label: t("Công trình giao thông hàng hải", "Marine Transportation Works") },
    { key: "Công trình hạ tầng kỹ thuật", label: t("Công trình hạ tầng kỹ thuật", "Technical Infrastructure Works") },
  ];

  const filtered = projectItems.filter((p) => {
    const matchCategory = activeCategory === "all" || p.category === activeCategory;
    const keyword = normalizeSearchText(`${p.name} ${p.nameEn} ${p.location} ${p.category} ${p.categoryEn} ${p.description} ${p.descriptionEn}`);
    const matchQuery = !query.trim() || keyword.includes(normalizeSearchText(query.trim()));
    return matchCategory && matchQuery;
  });

  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: "#0D1B2A" }} className="relative py-32">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{ backgroundImage: "url('/images/du-an/huu-thanh-co_132827983464005202.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/62 to-slate-950/26" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="mt-4 text-4xl font-bold uppercase tracking-wide text-white md:text-5xl">
              {t("Dự án tiêu biểu", "Featured Projects")}
            </h1>
            <p className="text-white/60 text-lg mt-4 max-w-2xl">
              {t(
                "Hơn 50 dự án hoàn thành trải dài từ Bắc vào Nam.",
                "Over 50 completed projects spanning across Vietnam from North to South."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-12">
            <div className="grid gap-5 md:grid-cols-[1fr_0.9fr] md:items-center">
              <label className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
                <span className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                  {t("Dự án", "Project")}
                </span>
                <select
                  value={activeCategory}
                  onChange={(event) => setActiveCategory(event.target.value)}
                  className="h-14 w-full border border-slate-200 bg-white px-5 text-base font-semibold text-slate-700 outline-none transition-colors focus:border-sky-600"
                >
                  {categories.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="relative block">
                <span className="sr-only">{t("Tìm kiếm", "Search")}</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t("Tìm kiếm", "Search")}
                  className="h-14 w-full border border-slate-200 bg-white px-5 pr-16 text-base text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-600"
                />
                <span className="absolute right-0 top-0 flex h-14 w-16 items-center justify-center bg-sky-600 text-white">
                  <Search size={22} />
                </span>
              </label>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                id={`du-an-${project.id}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="group flex h-full scroll-mt-28 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
              >
                <a href={getProjectDetailHref(project)} className="flex h-full w-full flex-col">
                  <div className="relative h-60 shrink-0 overflow-hidden">
                    <img
                      src={mediaFileUrl(project.image)}
                      alt={lang === "vi" ? project.name : project.nameEn}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/*
                      <span className="absolute top-3 left-3 bg-sky-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {lang === "vi" ? project.category : project.categoryEn}
                      </span>
                    */}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="mb-4 min-h-[5.1rem] text-lg font-bold leading-snug text-slate-900 line-clamp-3 transition-colors group-hover:text-sky-600">
                      {lang === "vi" ? project.name : project.nameEn}
                    </h2>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                      {lang === "vi" ? project.description : project.descriptionEn}
                    </p>
                    <div className="mt-auto flex min-w-0 items-center gap-5 text-xs font-semibold text-slate-400">
                      <span className="flex min-w-0 items-center gap-1.5">
                        <MapPin size={13} className="shrink-0" />
                        <span className="truncate">{project.location}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5">
                        <Calendar size={13} className="shrink-0" />
                        {project.year}
                      </span>
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              {t(
                "Không có dự án nào phù hợp với bộ lọc đã chọn.",
                "No projects match the selected filters."
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
