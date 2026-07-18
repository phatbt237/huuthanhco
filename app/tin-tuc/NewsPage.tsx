"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Search, ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import type { CmsContent } from "@/lib/cmsContent";
import { useCmsContent } from "@/lib/useCmsContent";
import { getNewsDetailHref } from "@/lib/news";

export default function NewsPage({ initialContent }: { initialContent?: CmsContent }) {
  const { lang, t } = useLanguage();
  const cmsContent = useCmsContent(initialContent);
  const newsItems = [...cmsContent.news].sort((a, b) => b.date.localeCompare(a.date));
  const [query, setQuery] = useState("");

  const filtered = newsItems.filter((n) => {
    const title = (lang === "vi" ? n.title : n.titleEn) || n.title || n.titleEn || "";
    const category = (lang === "vi" ? n.category : n.categoryEn) || n.category || n.categoryEn || "";
    return (
      title.toLowerCase().includes(query.toLowerCase()) ||
      category.toLowerCase().includes(query.toLowerCase())
    );
  });

  const rest = newsItems.slice(1);

  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: "#0D1B2A" }} className="relative py-28">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-24"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/70 to-slate-950/25" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-sky-500 text-xs font-bold uppercase tracking-widest">
              {t("Cập nhật", "Updates")}
            </span>
            <h1 className="mt-4 text-4xl font-bold uppercase tracking-wide text-white md:text-5xl">
              {t("Tin tức", "News")}
            </h1>
            <p className="text-white/60 text-lg mt-4 max-w-2xl">
              {t(
                "Theo dõi những tin tức mới nhất về các dự án và hoạt động của Hữu Thành.",
                "Stay updated with the latest news on Huu Thanh's projects and activities."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 text-sm font-bold text-slate-500 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-700 hover:text-sky-600">
            <Home size={16} />
            {t("Trang chủ", "Home")}
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-950">{t("Tin tức", "News")}</span>
        </div>
      </nav>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Search */}
              <div className="relative mb-10">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder={t("Tìm kiếm tin tức...", "Search news...")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-600/30 focus:border-sky-500 text-slate-700 text-sm"
                />
              </div>

              {/* Articles */}
              <div className="space-y-8">
                {filtered.map((item, i) => {
                  const itemTitle = (lang === "vi" ? item.title : item.titleEn) || item.title || item.titleEn;
                  const itemCategory = (lang === "vi" ? item.category : item.categoryEn) || item.category || item.categoryEn;
                  const itemExcerpt = (lang === "vi" ? item.excerpt : item.excerptEn) || item.excerpt || item.excerptEn || "";
                  const itemThumbnail = item.thumbnail || "/images/du-an/huu-thanh-co_132827983464005202.jpg";

                  return (
                    <motion.article
                      key={item.id}
                      id={`tin-tuc-${item.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="group scroll-mt-28 rounded-2xl hover:bg-slate-50 transition-colors duration-200"
                    >
                      <Link href={getNewsDetailHref(item)} className="flex gap-6 p-4">
                        <div className="relative w-36 h-28 rounded-xl overflow-hidden shrink-0">
                          <img
                            src={itemThumbnail}
                            alt={itemTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="inline-block text-xs font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded mb-2">
                            {itemCategory}
                          </span>
                          <h2 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-sky-600 transition-colors">
                            {itemTitle}
                          </h2>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-2 mb-3">
                            <Calendar size={12} /> {formatDate(item.date)}
                          </div>
                          <p className="text-slate-500 text-sm line-clamp-2">
                            {itemExcerpt}
                          </p>
                        </div>
                      </Link>
                    </motion.article>
                  );
                })}
                {filtered.length === 0 && (
                  <p className="text-center text-slate-400 py-12">
                    {t("Không tìm thấy kết quả.", "No results found.")}
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24">
                <h3 className="font-bold text-slate-900 text-lg mb-6 pb-3 border-b border-slate-100">
                  {t("Tin nổi bật", "Featured News")}
                </h3>
                <div className="space-y-5">
                  {rest.slice(0, 4).map((item) => {
                    const itemTitle = (lang === "vi" ? item.title : item.titleEn) || item.title || item.titleEn;
                    const itemThumbnail = item.thumbnail || "/images/du-an/huu-thanh-co_132827983464005202.jpg";

                    return (
                    <Link key={item.id} href={getNewsDetailHref(item)} className="group flex gap-4">
                      <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={itemThumbnail}
                          alt={itemTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 line-clamp-2 group-hover:text-sky-600 transition-colors leading-snug">
                          {itemTitle}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <Calendar size={11} /> {formatDate(item.date)}
                        </p>
                      </div>
                    </Link>
                    );
                  })}
                </div>

                <div className="mt-10 bg-slate-900 rounded-2xl p-6 text-white text-center">
                  <p className="text-sm font-semibold mb-3">
                    {t("Cần tư vấn dự án?", "Need project consultation?")}
                  </p>
                  <p className="text-white/60 text-xs mb-5">
                    {t("Liên hệ ngay để được hỗ trợ miễn phí.", "Contact us now for free support.")}
                  </p>
                  <Link
                    href="/lien-he"
                    className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors"
                  >
                    {t("Liên hệ ngay", "Contact Now")} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
