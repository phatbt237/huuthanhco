"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronLeft, ChevronRight, Home, Link2, Share2, X } from "lucide-react";
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

  const relatedItems = (
    relatedNews.length > 0
      ? relatedNews
      : allNews.filter((newsItem) => newsItem.id !== activeItem.id)
  ).slice(0, 3);
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
  const canonicalUrl = `https://huuthanhco.vercel.app${getNewsDetailHref(activeItem)}`;
  const galleryImages = Array.from(new Set([thumbnail, ...(activeItem.galleryImages ?? [])].filter(Boolean)));
  const additionalImages = galleryImages.slice(1);
  const hasInlineMedia = /<(?:img|figure)\b/i.test(content);
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
      <section className="relative overflow-hidden bg-[#0D1B2A] py-20 sm:py-24 lg:py-28">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/70 to-slate-950/25" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-500">
            {t("Cập nhật", "Updates")}
          </span>
          <h2 className="mt-4 text-4xl font-bold uppercase tracking-wide text-white md:text-5xl">
            {t("Tin tức", "News")}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-white/60">
            {t(
              "Theo dõi những tin tức mới nhất về các dự án và hoạt động của Hữu Thành.",
              "Stay updated with the latest news on Huu Thanh's projects and activities.",
            )}
          </p>
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

      <main className="news-article-document bg-white">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 lg:px-8 lg:pt-16">
          <article className="min-w-0">
            <header className="border-b border-slate-200 pb-7">
              <h1 className="max-w-5xl text-left text-3xl font-bold uppercase leading-[1.24] text-[#173c7a] sm:text-4xl lg:text-[48px]">
                {title}
              </h1>
              <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 text-base text-slate-500">
                <time dateTime={activeItem.date}>{formatDate(activeItem.date)}</time>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-medium text-slate-800 transition hover:text-[#173c7a]"
                >
                  <Share2 size={17} className="text-sky-500" />
                  Facebook
                </a>
              </div>
            </header>

            {excerpt && (
              <p className="mb-10 mt-8 text-lg font-normal leading-[1.75] text-slate-800">
                {excerpt}
              </p>
            )}

            {hasInlineMedia ? (
              <NewsRichContent
                content={content}
                className={`news-rich-content--preview ${excerpt ? "" : "news-rich-content--after-header"}`}
              />
            ) : (
              <>
                <button
                  type="button"
                  className="group relative mb-3 block aspect-[16/9] w-full cursor-zoom-in overflow-hidden bg-slate-100"
                  onClick={() => openLightbox(0)}
                  aria-label={t("Mở ảnh lớn", "Open large image")}
                >
                  <img src={mediaFileUrl(thumbnail)} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
                  <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                </button>
                <p className="mb-10 text-sm italic leading-6 text-slate-500">{imageCaption}</p>

                <NewsRichContent
                  content={content}
                  className={`news-rich-content--preview ${excerpt ? "" : "news-rich-content--after-header"}`}
                />

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
                    <figcaption className="mt-3 text-sm italic leading-6 text-slate-500">
                      {imageCaption}
                    </figcaption>
                  </figure>
                ))}
              </>
            )}

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

          <aside className="self-start bg-[#f6f6f6] p-5 sm:p-7 lg:sticky lg:top-24">
            <h2 className="mb-6 text-2xl font-bold uppercase text-slate-950">
              {t("Tin nổi bật", "Featured news")}
            </h2>
            <div className="space-y-8">
              {relatedItems.map((newsItem) => {
                const relatedTitle =
                  (lang === "vi" ? newsItem.title : newsItem.titleEn) || newsItem.title || newsItem.titleEn;
                return (
                  <Link key={newsItem.id} href={getNewsDetailHref(newsItem)} className="group block">
                    <div className="aspect-[16/9] overflow-hidden bg-slate-200">
                      <img
                        src={mediaFileUrl(newsItem.thumbnail || "/images/du-an/huu-thanh-co_132827983464005202.jpg")}
                        alt={relatedTitle}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </div>
                    <p className="mt-3 text-sm text-slate-400">{formatDate(newsItem.date)}</p>
                    <h3 className="mt-2 text-lg font-normal leading-[1.35] text-[#173c7a] transition group-hover:text-sky-600">
                      {relatedTitle}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
