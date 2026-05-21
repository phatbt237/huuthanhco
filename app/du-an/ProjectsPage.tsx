"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, MapPin, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCmsContent } from "@/lib/useCmsContent";
import { mergeById } from "@/lib/cmsContent";
import { getProjectDetailHref, sortProjectsByYearDesc } from "@/lib/projects";
import { mediaFileUrl } from "@/lib/siteApi";
import { projects } from "@/data/projects";
import { normalizeSearchText } from "@/lib/utils";

const categoryMapVi: Record<string, string> = {
  "cang-bien": "Cảng biển",
  "thuy-loi": "Thủy lợi",
  "nao-vet": "Nạo vét",
  "ha-tang": "Hạ tầng",
  "dich-vu": "Dịch vụ",
};

export default function ProjectsPage() {
  const { lang, t } = useLanguage();
  const cmsContent = useCmsContent();
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

  const allCategoryKeys = Array.from(new Set(projectItems.map((p) => p.category)));
  const categories = [
    { key: "all", label: t("Tất cả", "All") },
    ...allCategoryKeys.map((key) => {
      const proj = projectItems.find((p) => p.category === key)!;
      return { key, label: lang === "vi" ? proj.category : proj.categoryEn };
    }),
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">
              {t("Dự án tiêu biểu", "Featured Projects")}
            </h1>
            <p className="text-white/60 text-lg mt-4 max-w-2xl">
              {t(
                "Hơn 200 dự án hoàn thành trải dài khắp miền Nam Việt Nam.",
                "Over 200 completed projects spanning across Southern Vietnam."
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
                  className="h-14 w-full border border-slate-200 bg-white px-5 text-base font-semibold text-slate-700 outline-none transition-colors focus:border-orange-400"
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
                  className="h-14 w-full border border-slate-200 bg-white px-5 pr-16 text-base text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-orange-400"
                />
                <span className="absolute right-0 top-0 flex h-14 w-16 items-center justify-center bg-orange-500 text-white">
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
                className="group scroll-mt-28 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl border border-slate-100 transition-shadow duration-300"
              >
                <a href={getProjectDetailHref(project)} className="block">
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={mediaFileUrl(project.image)}
                      alt={lang === "vi" ? project.name : project.nameEn}
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
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                      {lang === "vi" ? project.description : project.descriptionEn}
                    </p>
                    <div className="flex items-center gap-5 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} /> {project.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} /> {project.year}
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
