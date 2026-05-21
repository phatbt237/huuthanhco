"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, CheckCircle2, MapPin, Tag } from "lucide-react";
import { projects } from "@/data/projects";
import type { Project } from "@/data/projects";
import { useLanguage } from "@/contexts/LanguageContext";
import { mergeById, useCmsContent } from "@/lib/cmsContent";
import { getProjectDetailHref, getProjectSlug } from "@/lib/projects";

export default function ProjectDetailPage({
  project,
  relatedProjects,
  slug,
}: {
  project?: Project;
  relatedProjects: Project[];
  slug?: string;
}) {
  const { lang, t } = useLanguage();
  const cmsContent = useCmsContent();
  const allProjects = mergeById(projects, cmsContent.projects);
  const activeProject =
    project ?? allProjects.find((item) => getProjectSlug(item) === slug || item.id === slug);

  if (!activeProject) {
    return (
      <section className="min-h-[60vh] bg-white px-4 py-28 text-center">
        <h1 className="text-3xl font-black text-slate-950">
          {t("Không tìm thấy dự án", "Project not found")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-500">
          {t(
            "Dự án này có thể đã bị xóa hoặc chưa được đồng bộ từ hệ thống quản trị.",
            "This project may have been removed or has not been synced from the admin system."
          )}
        </p>
        <Link
          href="/du-an"
          className="mt-8 inline-flex bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600"
        >
          {t("Quay lại dự án", "Back to projects")}
        </Link>
      </section>
    );
  }

  const relatedItems =
    relatedProjects.length > 0
      ? relatedProjects
      : allProjects.filter((item) => item.id !== activeProject.id).slice(0, 3);
  const title = (lang === "vi" ? activeProject.name : activeProject.nameEn) || activeProject.name || activeProject.nameEn;
  const description =
    (lang === "vi" ? activeProject.description : activeProject.descriptionEn) ||
    activeProject.description ||
    activeProject.descriptionEn ||
    t("Nội dung đang được cập nhật.", "Content is being updated.");
  const category =
    (lang === "vi" ? activeProject.category : activeProject.categoryEn) ||
    activeProject.category ||
    activeProject.categoryEn;

  const infoRows = [
    { label: t("Lĩnh vực", "Sector"), value: category, icon: Tag },
    { label: t("Địa điểm", "Location"), value: activeProject.location, icon: MapPin },
    { label: t("Năm thực hiện", "Year"), value: String(activeProject.year), icon: Calendar },
    {
      label: t("Phạm vi công việc", "Scope of work"),
      value: description,
      icon: CheckCircle2,
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 pt-28 pb-20">
        <div className="absolute inset-0">
          <img src={activeProject.image} alt={title} className="h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/82 to-slate-950/35" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/60">
            <Link href="/" className="hover:text-orange-400">
              {t("Trang chủ", "Home")}
            </Link>
            <span>/</span>
            <Link href="/du-an" className="hover:text-orange-400">
              {t("Dự án", "Projects")}
            </Link>
            <span>/</span>
            <span className="text-white/80">{category}</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="max-w-4xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/40 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-orange-300">
              {category}
            </span>
            <h1 className="mt-6 text-4xl font-black leading-tight text-white md:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/72">
              {description}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm">
              <img src={activeProject.image} alt={title} className="h-auto w-full object-contain" />
            </div>

            <div className="mt-10">
              <span className="text-xs font-black uppercase tracking-[0.24em] text-orange-500">
                {t("Tổng quan dự án", "Project Overview")}
              </span>
              <h2 className="mt-3 text-3xl font-black text-slate-950">
                {t("Thông tin thi công", "Construction Information")}
              </h2>
              <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
                <p>{description}</p>
                <p>
                  {t(
                    "Hữu Thành triển khai dự án với đội ngũ kỹ thuật chuyên trách, hệ thống thiết bị phù hợp và quy trình kiểm soát an toàn, chất lượng, tiến độ theo từng giai đoạn thi công.",
                    "Huu Thanh executes the project with dedicated engineering teams, suitable equipment systems, and a staged process for safety, quality, and schedule control."
                  )}
                </p>
              </div>
            </div>
          </motion.div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">
                {t("Thông tin dự án", "Project Information")}
              </h2>
              <div className="mt-6 divide-y divide-slate-200">
                {infoRows.map((row) => (
                  <div key={row.label} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                      <row.icon size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                        {row.label}
                      </div>
                      <div className="mt-1 text-sm font-bold leading-6 text-slate-800">
                        {row.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/du-an"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-4 text-sm font-black text-slate-700 transition-colors hover:border-orange-400 hover:text-orange-500"
            >
              <ArrowLeft size={16} />
              {t("Quay lại danh sách dự án", "Back to Projects")}
            </Link>
          </aside>
        </div>
      </section>

      {relatedItems.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.24em] text-orange-500">
                  {t("Dự án liên quan", "Related Projects")}
                </span>
                <h2 className="mt-3 text-3xl font-black text-slate-950">
                  {t("Công trình cùng lĩnh vực", "Works in the Same Sector")}
                </h2>
              </div>
              <Link href="/du-an" className="text-sm font-black text-orange-500 hover:text-orange-600">
                {t("Xem tất cả", "View All")}
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {relatedItems.map((item) => (
                <Link
                  key={item.id}
                  href={getProjectDetailHref(item)}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-xl"
                >
                  <div className="h-52 overflow-hidden">
                    <img
                      src={item.image}
                      alt={lang === "vi" ? item.name : item.nameEn}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <div className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-orange-500">
                      {lang === "vi" ? item.category : item.categoryEn}
                    </div>
                    <h3 className="line-clamp-2 text-base font-black leading-6 text-slate-950 group-hover:text-orange-500">
                      {lang === "vi" ? item.name : item.nameEn}
                    </h3>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-slate-500">
                      {t("Xem chi tiết", "View Details")}
                      <ArrowRight size={15} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
