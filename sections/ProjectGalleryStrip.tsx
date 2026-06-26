"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCmsContent } from "@/lib/useCmsContent";
import { mergeById, type CmsContent } from "@/lib/cmsContent";
import { getProjectDetailHref, sortProjectsByYearDesc } from "@/lib/projects";
import { mediaFileUrl } from "@/lib/siteApi";
import { projects } from "@/data/projects";

export default function ProjectGalleryStrip({ initialContent }: { initialContent?: CmsContent }) {
  const { lang, t } = useLanguage();
  const cmsContent = useCmsContent(initialContent);
  const projectItems = sortProjectsByYearDesc(mergeById(projects, cmsContent.projects));

  // Select 8 projects for gallery (2 large, 6 small in 3x3 - masonry style)
  const galleryProjects = projectItems.slice(0, 8);

  // Mosaic pattern: alternating image sizes
  const getMosaicClass = (index: number) => {
    if (index === 0 || index === 3) return "md:col-span-2 md:row-span-2";
    return "col-span-1 row-span-1";
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-sky-600 text-xs font-bold uppercase tracking-widest mb-3">
              {t("Thư viện công trình", "Project Showcase")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              {t("Dấu ấn công trình", "Our Landmark Projects")}
            </h2>
          </motion.div>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-max md:auto-rows-[280px]">
          {galleryProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`${getMosaicClass(i)} group relative overflow-hidden rounded-2xl h-64 md:h-auto`}
            >
              <Link href={getProjectDetailHref(project)} className="block w-full h-full">
                <div className="relative w-full h-full">
                  <img
                    src={mediaFileUrl(project.image)}
                    alt={lang === "vi" ? project.name : project.nameEn}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-between translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block w-fit bg-sky-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {lang === "vi" ? project.category : project.categoryEn}
                    </span>
                    <div className="text-white">
                      <h3 className="font-bold text-sm leading-snug line-clamp-2 mb-2">
                        {lang === "vi" ? project.name : project.nameEn}
                      </h3>
                      <p className="text-xs text-white/70">{project.location} • {project.year}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/du-an"
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200"
          >
            {t("Xem toàn bộ dự án", "View All Projects")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
