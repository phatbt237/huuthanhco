"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { searchSite } from "@/data/search";
import { useCmsContent } from "@/lib/useCmsContent";

export default function SearchPage() {
  const { lang, t } = useLanguage();
  const cmsContent = useCmsContent();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const results = searchSite(query, lang, { projects: cmsContent.projects, news: cmsContent.news });

  return (
    <>
      <section className="relative bg-slate-950 py-28">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/images/hero/Flash-5_132827290406613154.jpg')" }}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-sky-600">
            {t("Tìm kiếm", "Search")}
          </span>
          <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
            {t("Kết quả tìm kiếm", "Search Results")}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/65">
            {query
              ? `${t("Từ khóa", "Keyword")}: "${query}"`
              : t(
                  "Nhập từ khóa trên thanh tìm kiếm để xem kết quả liên quan.",
                  "Enter a keyword in the search bar to view related results."
                )}
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {query && (
            <div className="mb-8 flex items-center gap-3 text-sm font-semibold text-slate-500">
              <Search size={18} className="text-sky-600" />
              {t(`Tìm thấy ${results.length} kết quả liên quan`, `${results.length} related results found`)}
            </div>
          )}

          {results.length > 0 ? (
            <div className="space-y-4">
              {results.map((item, index) => (
                <motion.div
                  key={`${item.href}-${item.title}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.35 }}
                >
                  <Link
                    href={item.href}
                    className="group block border border-slate-200 p-6 transition-all hover:border-sky-300 hover:bg-sky-50/40 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <span className="inline-block bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-500">
                          {item.category}
                        </span>
                        <h2 className="mt-3 text-xl font-bold text-slate-950 transition-colors group-hover:text-sky-600">
                          {item.title}
                        </h2>
                        <p className="mt-2 leading-7 text-slate-600">{item.excerpt}</p>
                      </div>
                      <ArrowRight className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-sky-600" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="border border-slate-200 p-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center bg-sky-50 text-sky-600">
                <Search size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-950">
                {t("Không tìm thấy kết quả phù hợp", "No matching results found")}
              </h2>
              <p className="mt-3 text-slate-500">
                {t(
                  "Thử tìm bằng từ khóa khác như “dự án”, “thiết bị”, “nạo vét”, “cảng biển”.",
                  "Try another keyword such as “projects”, “equipment”, “dredging”, or “seaport”."
                )}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
