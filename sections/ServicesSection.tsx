"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import { services } from "@/data/services";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ServicesSection() {
  const { lang, t } = useLanguage();
  const serviceLinks = [
    "/du-an?loai=cang-bien",
    "/du-an?loai=cang-bien",
    "/du-an?loai=thuy-loi",
    "/du-an?loai=nao-vet",
    "/du-an?loai=ha-tang",
    "/thiet-bi",
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <SectionTitle
            label={t("Dịch vụ", "Services")}
            title={t("Lĩnh vực dịch vụ", "Our Service Areas")}
            subtitle={t(
              "Hữu Thành cung cấp đa dạng dịch vụ xây dựng và thi công chuyên nghiệp.",
              "Huu Thanh provides a wide range of professional construction and engineering services."
            )}
          />
          <Link
            href="/du-an"
            className="flex items-center gap-2 text-orange-500 font-semibold text-sm hover:gap-3 transition-all duration-200 shrink-0"
          >
            {t("Xem dự án", "View Projects")} <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group relative overflow-hidden rounded-2xl shadow-sm transition-shadow duration-300 hover:shadow-xl"
            >
              <Link href={serviceLinks[i] ?? "/du-an"} className="block">
                {/* Image */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={service.image}
                    alt={lang === "vi" ? service.name : service.nameEn}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>

                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-end justify-between gap-3">
                    <h3 className="font-bold text-white text-base leading-snug line-clamp-2 flex-1">
                      {lang === "vi" ? service.name : service.nameEn}
                    </h3>
                    <div className="shrink-0 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <ArrowRight size={14} className="text-white" />
                    </div>
                  </div>
                  <p className="text-white/70 text-xs mt-2 line-clamp-2">
                    {lang === "vi" ? service.description : service.descriptionEn}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
