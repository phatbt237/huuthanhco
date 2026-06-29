"use client";

import { motion } from "framer-motion";
import { equipment } from "@/data/equipment";
import type { Equipment } from "@/data/equipment";
import { useLanguage } from "@/contexts/LanguageContext";
import { settingJson } from "@/lib/siteApi";
import { useSiteSettings } from "@/lib/useSiteSettings";

export default function EquipmentPage() {
  const { lang, t } = useLanguage();
  const settings = useSiteSettings("equipment");
  const equipmentItems = settingJson<Equipment[]>(settings, "equipment.items", equipment);

  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: "#0D1B2A" }} className="relative py-32">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-45"
          style={{ backgroundImage: "url('/images/thiet-bi/huu-thanh-co_132830581726080671.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/62 to-slate-950/26" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-sky-500 text-xs font-bold uppercase tracking-widest">
              {t("Phương tiện & Máy móc", "Vehicles & Machinery")}
            </span>
            <h1 className="mt-4 text-4xl font-bold uppercase tracking-wide text-white md:text-5xl">
              {t("Thiết bị thi công", "Construction Equipment")}
            </h1>
            <p className="text-white/60 text-lg mt-4 max-w-2xl">
              {t(
                "Đội ngũ thiết bị đồng bộ, hiện đại đảm bảo chất lượng thi công tốt nhất.",
                "A comprehensive and modern fleet of equipment ensuring the highest construction quality."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Equipment grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipmentItems.map((item, i) => (
              <motion.div
                key={item.id}
                id={`thiet-bi-${item.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group scroll-mt-28 bg-slate-50 rounded-2xl overflow-hidden hover:shadow-xl border border-slate-100 transition-all duration-300"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={lang === "vi" ? item.name : item.nameEn}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-6">
                  <h2 className="font-bold text-slate-900 text-xl mb-2 group-hover:text-sky-600 transition-colors">
                    {lang === "vi" ? item.name : item.nameEn}
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed mb-5">
                    {lang === "vi" ? item.description : item.descriptionEn}
                  </p>
                  <div className="space-y-2 border-t border-slate-200 pt-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      {t("Thông số kỹ thuật", "Specifications")}
                    </p>
                    {(lang === "vi" ? item.specs : item.specsEn).map((spec) => (
                      <div key={spec} className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-600 shrink-0" />
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
