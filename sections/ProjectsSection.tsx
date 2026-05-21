"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MapPin, Calendar, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCmsContent } from "@/lib/useCmsContent";
import { mergeById } from "@/lib/cmsContent";
import { getProjectDetailHref, sortProjectsByYearDesc } from "@/lib/projects";
import { mediaFileUrl } from "@/lib/siteApi";
import { projects } from "@/data/projects";

const PER_PAGE = 4;

export default function ProjectsSection() {
  const { lang, t } = useLanguage();
  const cmsContent = useCmsContent();
  const projectItems = sortProjectsByYearDesc(mergeById(projects, cmsContent.projects));
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(projectItems.length / PER_PAGE));
  const visible = projectItems.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const prev = () => setPage((p) => (p - 1 + totalPages) % totalPages);
  const next = () => setPage((p) => (p + 1) % totalPages);


  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <SectionTitle
            label={t("Dự án nổi bật", "Featured Projects")}
            title={t("Những công trình tiêu biểu", "Our Landmark Works")}
            subtitle={t(
              "Chúng tôi tự hào với danh mục dự án đa dạng trải dài khắp khu vực miền Nam.",
              "We take pride in a diverse project portfolio spanning across Southern Vietnam."
            )}
          />
          <Link
            href="/du-an"
            className="flex items-center gap-2 text-orange-500 font-semibold text-sm hover:gap-3 transition-all duration-200 shrink-0"
          >
            {t("Xem tất cả", "View All")} <ArrowRight size={16} />
          </Link>
        </div>

        {/* Cards */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {visible.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow duration-300"
                >
                  <Link href={getProjectDetailHref(project)} className="block">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={mediaFileUrl(project.image)}
                        alt={lang === "vi" ? project.name : project.nameEn}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {lang === "vi" ? project.category : project.categoryEn}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-slate-900 text-sm leading-snug mb-3 line-clamp-2 group-hover:text-orange-500 transition-colors duration-200">
                        {lang === "vi" ? project.name : project.nameEn}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5"><MapPin size={12} />{project.location}</span>
                        <span className="flex items-center gap-1.5"><Calendar size={12} />{project.year}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={prev}
            disabled={false}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-orange-400 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === page ? "w-6 h-2.5 bg-orange-500" : "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={false}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-orange-400 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <ChevronRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
}
