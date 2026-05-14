"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { news } from "@/data/news";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NewsPage() {
  const { lang, t } = useLanguage();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const filtered = news.filter(
    (n) =>
      `${n.title} ${n.titleEn}`.toLowerCase().includes(query.toLowerCase()) ||
      `${n.category} ${n.categoryEn}`.toLowerCase().includes(query.toLowerCase()) ||
      `${n.excerpt} ${n.excerptEn}`.toLowerCase().includes(query.toLowerCase())
  );

  const featured = news[0];
  const rest = news.slice(1);

  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: "#0D1B2A" }} className="relative py-32">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80')" }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">{t("Cập nhật", "Updates")}</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">{t("Tin tức & Sự kiện", "News & Events")}</h1>
            <p className="text-white/60 text-lg mt-4 max-w-2xl">
              {t("Theo dõi những tin tức mới nhất về các dự án và hoạt động của Hữu Thành.", "Follow the latest news about Huu Thanh projects and activities.")}
            </p>
          </motion.div>
        </div>
      </section>

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
                  className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 text-slate-700 text-sm"
                />
              </div>

              {/* Articles */}
              <div className="space-y-8">
                {filtered.map((item, i) => (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="group flex gap-6 p-4 rounded-2xl hover:bg-slate-50 transition-colors duration-200"
                  >
                    <div className="relative w-36 h-28 rounded-xl overflow-hidden shrink-0">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded mb-2">
                        {lang === "vi" ? item.category : item.categoryEn}
                      </span>
                      <h2 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-orange-500 transition-colors">
                        {lang === "vi" ? item.title : item.titleEn}
                      </h2>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-2 mb-3">
                        <Calendar size={12} /> {formatDate(item.date)}
                      </div>
                      <p className="text-slate-500 text-sm line-clamp-2">{lang === "vi" ? item.excerpt : item.excerptEn}</p>
                    </div>
                  </motion.article>
                ))}
                {filtered.length === 0 && (
                  <p className="text-center text-slate-400 py-12">{t("Không tìm thấy kết quả.", "No results found.")}</p>
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
                  {rest.slice(0, 4).map((item) => (
                    <div key={item.id} className="group flex gap-4 cursor-pointer">
                      <div className="w-20 h-16 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 line-clamp-2 group-hover:text-orange-500 transition-colors leading-snug">
                          {lang === "vi" ? item.title : item.titleEn}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <Calendar size={11} /> {formatDate(item.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 bg-slate-900 rounded-2xl p-6 text-white text-center">
                  <p className="text-sm font-semibold mb-3">{t("Cần tư vấn dự án?", "Need project consultation?")}</p>
                  <p className="text-white/60 text-xs mb-5">{t("Liên hệ ngay để được hỗ trợ miễn phí.", "Contact us for free support.")}</p>
                  <Link
                    href="/lien-he"
                    className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors"
                  >
                    {t("Liên hệ ngay", "Contact Us")} <ArrowRight size={14} />
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
