"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Check, ChevronLeft, ChevronRight, Home, Link2, X } from "lucide-react";
import { mediaFileUrl } from "@/lib/siteApi";
import { news } from "@/data/news";
import type { NewsItem } from "@/data/news";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { mergeById } from "@/lib/cmsContent";
import { useCmsContent } from "@/lib/useCmsContent";
import { getNewsDetailHref, getNewsSlug } from "@/lib/news";
import NewsRichContent from "@/components/news/NewsRichContent";

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
  const allNews = mergeById(news, cmsContent.news, true);
  const activeItem = item ?? allNews.find((newsItem) => getNewsSlug(newsItem) === slug || newsItem.id === slug);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

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
          className="mt-8 inline-flex bg-sky-600 px-5 py-3 text-sm font-bold text-white hover:bg-sky-700"
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
  const excerpt =
    (lang === "vi" ? activeItem.excerpt : activeItem.excerptEn) ||
    activeItem.excerpt ||
    activeItem.excerptEn;
  const imageCaption =
    (lang === "vi" ? activeItem.imageCaption : activeItem.imageCaptionEn) ||
    activeItem.imageCaption ||
    activeItem.imageCaptionEn ||
    title;
  const articlePath = getNewsDetailHref(activeItem);
  const canonicalUrl = `https://huuthanhco.vercel.app${articlePath}`;
  const categoryNames = Array.from(
    new Set(
      allNews
        .map((newsItem) =>
          (lang === "vi" ? newsItem.category : newsItem.categoryEn) ||
          newsItem.category ||
          newsItem.categoryEn
        )
        .filter(Boolean)
    )
  ).slice(0, 5);

  const galleryImages = Array.from(new Set([thumbnail, ...(activeItem.galleryImages ?? [])].filter(Boolean)));
  const additionalImages = galleryImages.slice(1);
  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevLightbox = () => setLightboxIndex((i) => (i !== null ? (i - 1 + galleryImages.length) % galleryImages.length : null));
  const nextLightbox = () => setLightboxIndex((i) => (i !== null ? (i + 1) % galleryImages.length : null));
  const copyArticleLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      <section className="relative h-[280px] overflow-hidden bg-slate-900 sm:h-[360px] lg:h-[430px]">
        <img
          src="/images/hero/Flash-7_132827290711634447.jpg"
          alt={t("Công trường xây dựng trên sông của Hữu Thành", "Huu Thanh marine construction site")}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-7 sm:px-6 lg:px-8">
          <span className="inline-flex border-l-4 border-sky-500 bg-slate-950/80 px-4 py-2 text-sm font-black uppercase tracking-[0.16em] text-white backdrop-blur-sm">
            {t("Tin tức", "News")}
          </span>
        </div>
      </section>

      <nav className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-4 text-sm font-semibold text-slate-500 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-700 hover:text-sky-600">
            <Home size={16} />
            {t("Trang chủ", "Home")}
          </Link>
          <ChevronRight size={15} className="text-slate-300" />
          <Link href="/tin-tuc" className="text-slate-700 hover:text-sky-600">
            {t("Tin tức", "News")}
          </Link>
          <ChevronRight size={15} className="text-slate-300" />
          <span className="text-slate-950">{category}</span>
        </div>
      </nav>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-x-8 overflow-x-auto px-4 py-5 text-sm font-bold text-slate-400 sm:px-6">
          {categoryNames.map((categoryName) => (
            <span
              key={categoryName}
              className={`shrink-0 border-b-2 py-2 ${categoryName === category ? "border-sky-600 text-sky-700" : "border-transparent"}`}
            >
              {categoryName}
            </span>
          ))}
        </div>
      </section>

      <main className="bg-white">
        <header className="mx-auto max-w-5xl px-4 pb-10 pt-12 sm:px-6 lg:px-8 lg:pt-16">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-600">{category}</p>
          <h1 className="mt-4 max-w-4xl text-3xl font-black leading-[1.2] text-slate-950 sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-7">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <Calendar size={16} className="text-sky-600" />
              {formatDate(activeItem.date)}
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`}
                target="_blank"
                rel="noreferrer"
                aria-label={t("Chia sẻ lên Facebook", "Share on Facebook")}
                className="flex h-10 items-center gap-2 border border-slate-200 px-3 text-sm font-bold text-slate-600 transition hover:border-sky-600 hover:text-sky-700"
              >
                <span className="text-base font-black text-[#1877f2]">f</span>
                Facebook
              </a>
              <button
                type="button"
                onClick={copyArticleLink}
                aria-label={t("Sao chép liên kết bài viết", "Copy article link")}
                className="flex h-10 w-10 items-center justify-center border border-slate-200 text-slate-500 transition hover:border-sky-600 hover:text-sky-700"
              >
                {copied ? <Check size={17} /> : <Link2 size={17} />}
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
          <article className="mx-auto w-full max-w-4xl">
            {excerpt && (
              <p className="mb-8 border-l-4 border-sky-600 pl-5 text-lg font-semibold leading-8 text-slate-700">
                {excerpt}
              </p>
            )}

            <button
              type="button"
              className="group relative mb-3 block aspect-[16/9] w-full cursor-zoom-in overflow-hidden bg-slate-100"
              onClick={() => openLightbox(0)}
              aria-label={t("Mở ảnh lớn", "Open large image")}
            >
              <img src={mediaFileUrl(thumbnail)} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
              <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
            </button>
            <p className="mb-10 text-center text-sm italic leading-6 text-slate-500">{imageCaption}</p>

            <NewsRichContent content={content} />

            {additionalImages.map((src, index) => (
              <figure key={src} className="mb-10">
                <button
                  type="button"
                  onClick={() => openLightbox(index + 1)}
                  aria-label={t(`Mở ảnh ${index + 2}`, `Open image ${index + 2}`)}
                  className="group relative block aspect-[16/9] w-full cursor-zoom-in overflow-hidden bg-slate-100"
                >
                  <img
                    src={mediaFileUrl(src)}
                    alt={`${title} ${index + 2}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                </button>
                <figcaption className="mt-3 text-center text-sm italic leading-6 text-slate-500">
                  {imageCaption}
                </figcaption>
              </figure>
            ))}

            <div className="mt-12 flex items-center justify-between border-t border-slate-200 pt-6 text-sm">
              <span className="font-bold text-slate-500">{t("Chia sẻ bài viết", "Share article")}</span>
              <button
                type="button"
                onClick={copyArticleLink}
                className="inline-flex items-center gap-2 font-bold text-sky-700 hover:text-sky-900"
              >
                {copied ? <Check size={16} /> : <Link2 size={16} />}
                {copied ? t("Đã sao chép", "Copied") : t("Sao chép liên kết", "Copy link")}
              </button>
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
                  aria-label={t("Đóng ảnh", "Close image")}
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
                >
                  <X size={20} />
                </button>

                {galleryImages.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
                    aria-label={t("Ảnh trước", "Previous image")}
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
                    aria-label={t("Ảnh tiếp theo", "Next image")}
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
            <div className="border-t-4 border-sky-600 bg-slate-50 p-6">
              <h2 className="mb-6 text-xl font-black uppercase tracking-tight text-slate-950">
                {t("Tin nổi bật", "Featured News")}
              </h2>
              <div className="divide-y divide-slate-200">
                {relatedItems.map((newsItem, index) => (
                  <Link key={newsItem.id} href={getNewsDetailHref(newsItem)} className="group block py-5 first:pt-0">
                    <img
                      src={newsItem.thumbnail || "/images/du-an/huu-thanh-co_132827983464005202.jpg"}
                      alt={(lang === "vi" ? newsItem.title : newsItem.titleEn) || newsItem.title || newsItem.titleEn}
                      className={`mb-3 w-full object-cover ${index === 0 ? "aspect-[16/9]" : "aspect-[2/1]"}`}
                      loading="lazy"
                    />
                    <p className="line-clamp-2 text-sm font-bold leading-6 text-slate-800 group-hover:text-sky-600">
                      {(lang === "vi" ? newsItem.title : newsItem.titleEn) || newsItem.title || newsItem.titleEn}
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                      <Calendar size={12} /> {formatDate(newsItem.date)}
                    </p>
                  </Link>
                ))}
              </div>
              <Link
                href="/tin-tuc"
                className="mt-6 inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide text-sky-700 hover:text-sky-900"
              >
                {t("Xem tất cả tin tức", "View all news")} <ChevronRight size={16} />
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
