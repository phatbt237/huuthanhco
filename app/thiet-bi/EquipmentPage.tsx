"use client";

import { motion } from "framer-motion";
import { equipment } from "@/data/equipment";
import { useLanguage } from "@/contexts/LanguageContext";

export default function EquipmentPage() {
  const { lang, t } = useLanguage();

  return (
    <>
      {/* Hero */}
      <section style={{ backgroundColor: "#0D1B2A" }} className="relative py-32">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=1600&q=80')" }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">
              {t("Phương tiện & Máy móc", "Vehicles & Machinery")}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">{t("Thiết bị thi công", "Construction Equipment")}</h1>
            <p className="text-white/60 text-lg mt-4 max-w-2xl">
              {t(
                "Đội ngũ thiết bị đồng bộ, hiện đại đảm bảo chất lượng thi công tốt nhất.",
                "A synchronized and modern equipment fleet ensures the best construction quality."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Equipment grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipment.map((item, i) => (
              <motion.div
                key={item.id}
                id={`thiet-bi-${item.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group scroll-mt-32 bg-slate-50 rounded-2xl overflow-hidden hover:shadow-xl border border-slate-100 transition-all duration-300"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-6">
                  <h2 className="font-bold text-slate-900 text-xl mb-2 group-hover:text-orange-500 transition-colors">
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
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
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
