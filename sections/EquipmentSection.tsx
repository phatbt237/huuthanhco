"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import { equipment } from "@/data/equipment";
import { useLanguage } from "@/contexts/LanguageContext";

export default function EquipmentSection() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipment.slice(0, 6).map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group bg-slate-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-orange-500 transition-colors">
                  {item.name}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{item.description}</p>
                <div className="mt-4 space-y-1">
                  {item.specs.slice(0, 2).map((spec) => (
                    <div key={spec} className="flex items-center gap-2 text-xs text-slate-400">
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
  );
}
