"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=90')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <span className="inline-block text-orange-400 text-xs font-bold uppercase tracking-[0.3em] mb-6 border border-orange-400/30 px-4 py-2 rounded-full">
            {t("Công ty TNHH Xây dựng Hữu Thành", "Huu Thanh Construction Co., Ltd.")}
          </span>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {t("Đơn vị thi công", "Professional")}
          <br />
          <span className="text-orange-400">{t("công trình", "Construction")}</span>{" "}
          {t("chuyên nghiệp", "Contractor")}
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {t(
            "Hơn 15 năm kinh nghiệm trong lĩnh vực xây dựng thủy công, cảng biển và hạ tầng giao thông tại Việt Nam",
            "Over 15 years of experience in hydraulic engineering, port construction and transportation infrastructure in Vietnam"
          )}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Link
            href="/du-an"
            className="group flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-orange-500/30"
          >
            {t("Xem dự án", "View Projects")}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/lien-he"
            className="flex items-center gap-2 border border-white/30 hover:border-white text-white px-8 py-4 rounded font-semibold text-base transition-all duration-200 hover:bg-white/10 backdrop-blur-sm"
          >
            {t("Liên hệ ngay", "Contact Us")}
          </Link>
        </motion.div>

        <motion.div
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {[
            { value: "15+", label: t("Năm kinh nghiệm", "Years Experience") },
            { value: "200+", label: t("Dự án hoàn thành", "Projects Completed") },
            { value: "50+", label: t("Thiết bị công trình", "Equipment Units") },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-orange-400">{stat.value}</div>
              <div className="text-xs text-white/60 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ChevronDown className="text-white/50" size={28} />
      </motion.div>
    </section>
  );
}
