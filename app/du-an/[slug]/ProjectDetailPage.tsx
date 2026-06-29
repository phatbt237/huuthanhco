"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, CheckCircle2, ChevronLeft, ChevronRight, MapPin, Tag, X } from "lucide-react";
import { projects } from "@/data/projects";
import type { Project } from "@/data/projects";
import { useLanguage } from "@/contexts/LanguageContext";
import { mergeById } from "@/lib/cmsContent";
import { useCmsContent } from "@/lib/useCmsContent";
import { getProjectDetailHref, getProjectSlug } from "@/lib/projects";
import { mediaFileUrl } from "@/lib/siteApi";

const hiddenDescriptionPlaceholders = new Set([
  "nội dung đang được cập nhật.",
  "noi dung dang duoc cap nhat.",
  "content is being updated.",
]);

function isHiddenDescription(value: string) {
  return hiddenDescriptionPlaceholders.has(value.trim().toLowerCase());
}

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
  const cmsContent = useCmsContent(undefined, !project);
  const allProjects = mergeById(projects, cmsContent.projects);
  const activeProject =
    project ?? allProjects.find((item) => getProjectSlug(item) === slug || item.id === slug);

  const [galleryPage, setGalleryPage] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const PER_PAGE = 3;

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
          className="mt-8 inline-flex bg-sky-600 px-5 py-3 text-sm font-bold text-white hover:bg-sky-700"
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
  const rawDescription =
    (lang === "vi" ? activeProject.description : activeProject.descriptionEn) ||
    activeProject.description ||
    activeProject.descriptionEn ||
    "";
  const description = isHiddenDescription(rawDescription) ? "" : rawDescription;
  const category =
    (lang === "vi" ? activeProject.category : activeProject.categoryEn) ||
    activeProject.category ||
    activeProject.categoryEn;
  const galleryImages = Array.from(new Set([activeProject.image, ...(activeProject.galleryImages ?? [])].filter(Boolean)));
  const totalPages = Math.ceil(galleryImages.length / PER_PAGE);
  const visibleImages = galleryImages.slice(galleryPage * PER_PAGE, (galleryPage + 1) * PER_PAGE);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevLightbox = () => setLightboxIndex((i) => (i !== null ? (i - 1 + galleryImages.length) % galleryImages.length : null));
  const nextLightbox = () => setLightboxIndex((i) => (i !== null ? (i + 1) % galleryImages.length : null));

  const infoRows = [
    { label: t("Lĩnh vực", "Sector"), value: category, icon: Tag },
    { label: t("Địa điểm", "Location"), value: activeProject.location, icon: MapPin },
    { label: t("Năm thực hiện", "Year"), value: String(activeProject.year), icon: Calendar },
    {
      label: t("Phạm vi công việc", "Scope of work"),
      value: description,
      icon: CheckCircle2,
    },
  ].filter((row) => row.value?.trim());

  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 pt-28 pb-20">
        <div className="absolute inset-0">
          <img src={mediaFileUrl(activeProject.image)} alt={title} className="h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/82 to-slate-950/35" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/60">
            <Link href="/" className="hover:text-sky-500">
              {t("Trang chủ", "Home")}
            </Link>
            <span>/</span>
            <Link href="/du-an" className="hover:text-sky-500">
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
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-600/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-sky-300">
              {category}
            </span>
            <h1 className="mt-6 text-4xl font-black leading-tight text-white md:text-6xl">
              {title}
            </h1>
            {description && (
              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/72">
                {description}
              </p>
            )}
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
            {/* Main image */}
            <div
              className="group relative cursor-zoom-in overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm"
              onClick={() => openLightbox(0)}
            >
              <img src={mediaFileUrl(activeProject.image)} alt={title} className="h-auto w-full object-contain" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/20">
                <ChevronRight size={36} className="text-white opacity-0 transition-all group-hover:opacity-100" />
              </div>
            </div>

            {/* Gallery carousel */}
            {galleryImages.length > 1 && (
              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                    {t("Hình ảnh thi công", "Construction Photos")} ({galleryImages.length})
                  </span>
                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setGalleryPage((p) => p - 1)}
                        disabled={galleryPage === 0}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-sky-500 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="min-w-[3rem] text-center text-xs font-bold text-slate-500">
                        {galleryPage + 1} / {totalPages}
                      </span>
                      <button
                        onClick={() => setGalleryPage((p) => p + 1)}
                        disabled={galleryPage === totalPages - 1}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-sky-500 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {visibleImages.map((src, i) => {
                    const globalIndex = galleryPage * PER_PAGE + i;
                    return (
                      <button
                        key={src}
                        type="button"
                        onClick={() => openLightbox(globalIndex)}
                        className="group relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-sm"
                      >
                        <img
                          src={mediaFileUrl(src)}
                          alt={`${title} ${globalIndex + 1}`}
                          className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/25" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Lightbox */}
            {lightboxIndex !== null && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/88 p-4"
                onClick={closeLightbox}
              >
                <button
                  type="button"
                  onClick={closeLightbox}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
                >
                  <X size={20} />
                </button>

                {galleryImages.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
                  >
                    <ChevronLeft size={24} />
                  </button>
                )}

                <img
                  src={mediaFileUrl(galleryImages[lightboxIndex])}
                  alt={`${title} ${lightboxIndex + 1}`}
                  className="max-h-[88vh] max-w-[88vw] rounded-xl object-contain shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />

                {galleryImages.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
                  >
                    <ChevronRight size={24} />
                  </button>
                )}

                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-4 py-1.5 text-xs font-bold text-white/80">
                  {lightboxIndex + 1} / {galleryImages.length}
                </div>
              </div>
            )}

            <div className="mt-10">
              <span className="text-xs font-black uppercase tracking-[0.24em] text-sky-600">
                {t("Tổng quan dự án", "Project Overview")}
              </span>
              <h2 className="mt-3 text-3xl font-black text-slate-950">
                {t("Thông tin thi công", "Construction Information")}
              </h2>
              <div className="mt-6 space-y-5 text-base leading-8 text-slate-600">
                {description && <p>{description}</p>}
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
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white">
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
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-4 text-sm font-black text-slate-700 transition-colors hover:border-sky-500 hover:text-sky-600"
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
                <span className="text-xs font-black uppercase tracking-[0.24em] text-sky-600">
                  {t("Dự án liên quan", "Related Projects")}
                </span>
                <h2 className="mt-3 text-3xl font-black text-slate-950">
                  {t("Công trình cùng lĩnh vực", "Works in the Same Sector")}
                </h2>
              </div>
              <Link href="/du-an" className="text-sm font-black text-sky-600 hover:text-sky-700">
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
                      src={mediaFileUrl(item.image)}
                      alt={lang === "vi" ? item.name : item.nameEn}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <div className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-sky-600">
                      {lang === "vi" ? item.category : item.categoryEn}
                    </div>
                    <h3 className="line-clamp-2 text-base font-black leading-6 text-slate-950 group-hover:text-sky-600">
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
