"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, ChevronLeft, ChevronRight, Home, X } from "lucide-react";
import { legacyContentFallbackEnabled, mediaFileUrl } from "@/lib/siteApi";
import { news } from "@/data/news";
import type { NewsItem } from "@/data/news";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { mergeById } from "@/lib/cmsContent";
import { useCmsContent } from "@/lib/useCmsContent";
import { getNewsDetailHref, getNewsSlug } from "@/lib/news";

export default function NewsDetailPage({
  item,
  relatedNews = [],
  slug,
}: {
  item?: NewsItem;
  relatedNews?: NewsItem[];
  slug?: string;
}) {
  const { lang, t } = useLanguage();
  const cmsContent = useCmsContent(undefined, !item);
  const allNews = mergeById(legacyContentFallbackEnabled ? news : [], cmsContent.news);
  const activeItem = item ?? allNews.find((newsItem) => getNewsSlug(newsItem) === slug || newsItem.id === slug);

  const [galleryPage, setGalleryPage] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const PER_PAGE = 3;

  if (!activeItem) {
    return (
      <section className="min-h-[60vh] bg-white px-4 py-28 text-center">
        <h1 className="text-3xl font-black text-slate-950">
          {t("Không tìm thấy tin tức", "News not found")}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-500">
          {t(
            "Tin này có thể đã bị xóa hoặc chưa được đồng bộ từ hệ thống quản trị.",
            "This article may have been removed or has not been synced from the admin system."
          )}
        </p>
        <Link
          href="/tin-tuc"
          className="mt-8 inline-flex bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600"
        >
          {t("Quay lại tin tức", "Back to news")}
        </Link>
      </section>
    );
  }

  const relatedItems =
    relatedNews.length > 0
      ? relatedNews
      : allNews.filter((newsItem) => newsItem.id !== activeItem.id).slice(0, 4);
  const title = (lang === "vi" ? activeItem.title : activeItem.titleEn) || activeItem.title || activeItem.titleEn;
  const category =
    (lang === "vi" ? activeItem.category : activeItem.categoryEn) || activeItem.category || activeItem.categoryEn;
  const thumbnail = activeItem.thumbnail || "/images/du-an/huu-thanh-co_132827983464005202.jpg";
  const content =
    (lang === "vi" ? activeItem.content : activeItem.contentEn) ||
    activeItem.excerpt ||
    activeItem.excerptEn ||
    t("Nội dung đang được cập nhật.", "Content is being updated.");

  const galleryImages = Array.from(new Set([thumbnail, ...(activeItem.galleryImages ?? [])].filter(Boolean)));
  const totalPages = Math.ceil(galleryImages.length / PER_PAGE);
  const visibleImages = galleryImages.slice(galleryPage * PER_PAGE, (galleryPage + 1) * PER_PAGE);
  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevLightbox = () => setLightboxIndex((i) => (i !== null ? (i - 1 + galleryImages.length) % galleryImages.length : null));
  const nextLightbox = () => setLightboxIndex((i) => (i !== null ? (i + 1) % galleryImages.length : null));

  return (
    <>
      <section className="relative bg-slate-950 py-24">
        <div className="absolute inset-0">
          <img src={thumbnail} alt={title} className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/82 to-slate-950/40" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <span className="inline-flex bg-orange-500 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white">
            {category}
          </span>
          <h1 className="mt-5 text-4xl font-black leading-tight text-white md:text-5xl">{title}</h1>
          <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-white/60">
            <Calendar size={16} />
            {formatDate(activeItem.date)}
          </div>
        </div>
      </section>

      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-4 text-sm font-bold text-slate-500 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-700 hover:text-orange-500">
            <Home size={16} />
            {t("Trang chủ", "Home")}
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/tin-tuc" className="text-slate-700 hover:text-orange-500">
            {t("Tin tức", "News")}
          </Link>
          <span className="text-slate-300">/</span>
          <span className="line-clamp-1 text-slate-950">{title}</span>
        </div>
      </nav>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
          <article>
            {/* Main thumbnail */}
            <div
              className="group relative mb-6 cursor-zoom-in overflow-hidden rounded-2xl shadow-sm"
              onClick={() => openLightbox(0)}
            >
              <img src={mediaFileUrl(thumbnail)} alt={title} className="h-auto w-full object-cover" />
              <div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/20" />
            </div>

            {/* Gallery carousel */}
            {galleryImages.length > 1 && (
              <div className="mb-10">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                    {t("Hình ảnh", "Photos")} ({galleryImages.length})
                  </span>
                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setGalleryPage((p) => p - 1)}
                        disabled={galleryPage === 0}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-orange-400 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="min-w-[3rem] text-center text-xs font-bold text-slate-500">
                        {galleryPage + 1} / {totalPages}
                      </span>
                      <button
                        onClick={() => setGalleryPage((p) => p + 1)}
                        disabled={galleryPage === totalPages - 1}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-orange-400 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-30"
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

            {/* Text content */}
            <div className="prose prose-slate max-w-none">
              {content.split("\n\n").map((paragraph) => (
                <p key={paragraph} className="mb-6 text-base leading-8 text-slate-600">
                  {paragraph}
                </p>
              ))}
            </div>

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
          </article>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <h2 className="mb-5 text-lg font-black text-slate-950">
                {t("Tin liên quan", "Related News")}
              </h2>
              <div className="space-y-5">
                {relatedItems.map((newsItem) => (
                  <Link key={newsItem.id} href={getNewsDetailHref(newsItem)} className="group flex gap-4">
                    <img
                      src={newsItem.thumbnail || "/images/du-an/huu-thanh-co_132827983464005202.jpg"}
                      alt={(lang === "vi" ? newsItem.title : newsItem.titleEn) || newsItem.title || newsItem.titleEn}
                      className="h-16 w-20 shrink-0 rounded-lg object-cover"
                      loading="lazy"
                    />
                    <div>
                      <p className="line-clamp-2 text-sm font-bold leading-5 text-slate-800 group-hover:text-orange-500">
                        {(lang === "vi" ? newsItem.title : newsItem.titleEn) || newsItem.title || newsItem.titleEn}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">{formatDate(newsItem.date)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
