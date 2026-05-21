"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import { equipment } from "@/data/equipment";
import type { Equipment } from "@/data/equipment";
import { useLanguage } from "@/contexts/LanguageContext";
import { settingJson, useSiteSettings } from "@/lib/siteApi";

const PER_PAGE = 4;

export default function EquipmentSection() {
  const { lang, t } = useLanguage();
  const settings = useSiteSettings("equipment");
  const equipmentItems = settingJson<Equipment[]>(settings, "equipment.items", equipment);
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(equipmentItems.length / PER_PAGE));
  const visible = equipmentItems.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const prev = () => setPage((p) => (p - 1 + totalPages) % totalPages);
  const next = () => setPage((p) => (p + 1) % totalPages);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <SectionTitle
            label={t("Thiết bị", "Equipment")}
            title={t("Hệ thống thiết bị hiện đại", "Modern Equipment Fleet")}
            subtitle={t(
              "Đội ngũ phương tiện và máy móc đồng bộ, đáp ứng mọi yêu cầu thi công.",
              "A synchronized fleet of vehicles and machinery meeting all construction requirements."
            )}
          />
          <Link
            href="/thiet-bi"
            className="flex items-center gap-2 text-orange-500 font-semibold text-sm hover:gap-3 transition-all duration-200 shrink-0"
          >
            {t("Xem tất cả", "View All")} <ArrowRight size={16} />
          </Link>
        </div>

        {/* Cards */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {visible.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="group bg-slate-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
                >
                  <Link href={`/thiet-bi#thiet-bi-${item.id}`} className="block">
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={item.image}
                        alt={lang === "vi" ? item.name : item.nameEn}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-orange-500 transition-colors duration-200">
                        {lang === "vi" ? item.name : item.nameEn}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">
                        {lang === "vi" ? item.description : item.descriptionEn}
                      </p>
                      <div className="space-y-1">
                        {(lang === "vi" ? item.specs : item.specsEn).map((spec) => (
                          <div key={spec} className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                            {spec}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-orange-400 hover:text-orange-500 transition-all duration-200"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === page ? "w-6 h-2.5 bg-orange-500" : "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-orange-400 hover:text-orange-500 transition-all duration-200"
          >
            <ChevronRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
}
