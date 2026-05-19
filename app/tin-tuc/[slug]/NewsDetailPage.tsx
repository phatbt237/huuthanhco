"use client";

import Link from "next/link";
import { Calendar, Home } from "lucide-react";
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
  const cmsContent = useCmsContent();
  const allNews = mergeById(news, cmsContent.news);
  const activeItem = item ?? allNews.find((newsItem) => getNewsSlug(newsItem) === slug || newsItem.id === slug);

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
            <img src={thumbnail} alt={title} className="mb-10 w-full rounded-2xl object-cover shadow-sm" />
            <div className="prose prose-slate max-w-none">
              {content.split("\n\n").map((paragraph) => (
                <p key={paragraph} className="mb-6 text-base leading-8 text-slate-600">
                  {paragraph}
                </p>
              ))}
            </div>
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
