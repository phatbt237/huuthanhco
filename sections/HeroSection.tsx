"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getSetting, settingLines, useSiteSettings } from "@/lib/siteApi";

const fallbackHeroImages = [
  "/images/hero/Flash-4_132827290261925965.jpg",
  "/images/hero/Flash-5_132827290406613154.jpg",
  "/images/hero/Flash-6_132827290576435207.jpg",
  "/images/hero/Flash-7_132827290711634447.jpg",
  "/images/hero/Flash-8_132827290841017153.jpg",
];

const INTERVAL = 5000;

export default function HeroSection() {
  const { t } = useLanguage();
  const settings = useSiteSettings();
  const heroImages = settingLines(settings, "hero.images");
  const slides = heroImages.length ? heroImages : fallbackHeroImages;
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (current >= slides.length) setCurrent(0);
  }, [current, slides.length]);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative flex h-screen min-h-[620px] w-full items-center overflow-hidden">

      {/* Slideshow background */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={{
            enter: (d: number) => ({ x: d * 80, opacity: 0, scale: 1.04 }),
            center: { x: 0, opacity: 1, scale: 1 },
            exit: (d: number) => ({ x: d * -80, opacity: 0, scale: 0.98 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${slides[current]}')` }}
        />
      </AnimatePresence>

      {/* Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/58 via-slate-950/16 to-slate-950/8" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-950/12 via-transparent to-slate-950/28" />
      <div className="absolute bottom-0 left-0 right-0 z-10 h-28 bg-gradient-to-t from-slate-50 to-transparent" />

      {/* Prev / Next buttons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-slate-950/20 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/25 md:left-8"
        aria-label="Previous"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-slate-950/20 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/25 md:right-8"
        aria-label="Next"
      >
        <ChevronRight size={20} />
      </button>

      {/* Content */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 text-left text-white sm:px-8 lg:px-12">
        <div className="max-w-2xl pt-16 md:pt-20 lg:pt-24">
        <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, delay: 0.15 }}>
          <span className="mb-5 inline-block rounded-full border border-orange-300/45 bg-slate-950/18 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.26em] text-orange-200 shadow-sm backdrop-blur-sm">
            {getSetting(settings, "hero.eyebrow") || t("Công Ty Cổ phần Xây Dựng Hữu Thành", "Huu Thanh Construction Co., Ltd.")}
          </span>
        </motion.div>

        <motion.h1
          className="mb-5 max-w-xl text-3xl font-extrabold uppercase leading-tight drop-shadow-[0_3px_10px_rgba(0,0,0,0.55)] sm:text-4xl md:text-5xl lg:text-[54px]"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.25 }}
        >
          {getSetting(settings, "hero.title") || t("Đơn vị thi công công trình chuyên nghiệp", "Professional Construction Contractor")}
        </motion.h1>

        <motion.p
          className="mb-8 max-w-xl text-base font-medium leading-8 text-white/86 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] md:text-lg"
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.4 }}
        >
          {getSetting(settings, "hero.description") ||
            t(
              "Hơn 15 năm kinh nghiệm trong lĩnh vực xây dựng thủy công, cảng biển và hạ tầng giao thông tại Việt Nam",
              "Over 15 years of experience in hydraulic engineering, port construction and transportation infrastructure in Vietnam"
            )}
        </motion.p>

        <motion.div
          className="flex flex-col items-start gap-3 sm:flex-row"
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.55 }}
        >
          <Link
            href="/du-an"
            className="group flex items-center gap-2 rounded bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-950/20 transition-all duration-200 hover:bg-orange-600 hover:shadow-orange-500/30"
          >
            {t("Xem dự án", "View Projects")}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/lien-he"
            className="flex items-center gap-2 rounded border border-white/35 bg-slate-950/18 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-white hover:bg-white/10"
          >
            {t("Liên hệ ngay", "Contact Us")}
          </Link>
        </motion.div>

        <motion.div
          className="mt-12 grid max-w-md grid-cols-3 gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {[
            { value: "15+", label: t("Năm kinh nghiệm", "Years Experience") },
            { value: "200+", label: t("Dự án hoàn thành", "Projects Completed") },
            { value: "50+", label: t("Thiết bị công trình", "Equipment Units") },
          ].map((stat) => (
            <div key={stat.label} className="border-l border-white/25 pl-4">
              <div className="text-2xl font-bold text-orange-300 md:text-3xl">{stat.value}</div>
              <div className="mt-1 text-[11px] text-white/70">{stat.label}</div>
            </div>
          ))}
        </motion.div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-16 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "w-6 h-2 bg-orange-400"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ChevronDown className="text-white/50" size={28} />
      </motion.div>
    </section>
  );
}
