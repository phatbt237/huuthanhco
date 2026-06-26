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
  const activityItems = [
    {
      ...serviceItems.find((service) => service.id === "1") ?? services[0],
      name: "Các công trình giao thông hàng hải",
      nameEn: "Marine Transportation Works",
      description: "Thi công cảng biển, cảng nội địa, cầu cảng và các công trình phục vụ giao thông hàng hải.",
      descriptionEn: "Construction of seaports, inland ports, wharves and marine transportation facilities.",
      href: "/du-an?loai=giao-thong-hang-hai",
    },
    {
      ...serviceItems.find((service) => service.id === "5") ?? services[4],
      name: "Các công trình hạ tầng kỹ thuật",
      nameEn: "Technical Infrastructure Works",
      description: "Thi công hạ tầng giao thông, thủy lợi, kè bảo vệ bờ và các công trình kỹ thuật chuyên dụng.",
      descriptionEn: "Construction of transportation, irrigation, shoreline protection and specialized technical infrastructure.",
      href: "/du-an?loai=ha-tang-ky-thuat",
    },
    {
      ...serviceItems.find((service) => service.id === "6") ?? services[5],
      name: "Dịch vụ kinh doanh, mua bán và cho thuê",
      nameEn: "Trading, Sales and Leasing Services",
      description: "Kinh doanh, mua bán và cho thuê máy móc, thiết bị thi công phục vụ các công trình xây dựng.",
      descriptionEn: "Trading, sales and leasing of construction machinery and equipment for construction projects.",
      image: "/images/dich-vu-kinh-doanh-mua-ban-cho-thue.png",
      href: "/thiet-bi",
    },
  ];

  return (
    <section id="linh-vuc-hoat-dong" className="scroll-mt-24 bg-slate-50 py-24 lg:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <SectionTitle
            title={t("Lĩnh vực hoạt động", "Areas of Operation")}
            subtitle={t(
              "Hữu Thành tập trung năng lực vào ba lĩnh vực hoạt động chủ lực.",
              "Huu Thanh focuses its expertise on three core areas of operation."
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activityItems.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group relative overflow-hidden rounded-2xl shadow-sm transition-shadow duration-300 hover:shadow-xl"
            >
              <Link href={service.href} className="block">
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
                    <div className="shrink-0 w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
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
