"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import { services } from "@/data/services";
import type { Service } from "@/data/services";
import { useLanguage } from "@/contexts/LanguageContext";
import { settingJson, type SettingsMap } from "@/lib/siteApi";
import { useSiteSettings } from "@/lib/useSiteSettings";

export default function ServicesSection({ initialSettings }: { initialSettings?: SettingsMap }) {
  const { lang, t } = useLanguage();
  const settings = useSiteSettings("services", initialSettings);
  const serviceItems = settingJson<Service[]>(settings, "services.items", services);
  const serviceLinks = [
    "/du-an?loai=cang-bien",
    "/du-an?loai=cang-bien",
    "/du-an?loai=thuy-loi",
    "/du-an?loai=nao-vet",
    "/du-an?loai=ha-tang",
    "/thiet-bi",
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
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
          {serviceItems.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-slate-800"
            >
              <Link href={serviceLinks[i] ?? "/du-an"} className="block">
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <img
                    src={service.image}
                    alt={lang === "vi" ? service.name : service.nameEn}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Text content */}
                <div className="p-6">
                  <h3 className="font-playfair font-bold text-slate-900 dark:text-white text-lg mb-3 line-clamp-2 group-hover:text-orange-500 transition-colors">
                    {lang === "vi" ? service.name : service.nameEn}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4">
                    {lang === "vi" ? service.description : service.descriptionEn}
                  </p>
                  <div className="flex items-center gap-2 text-orange-500 font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                    {t("Tìm hiểu thêm", "Learn More")}
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
