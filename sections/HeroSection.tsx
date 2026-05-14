"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const heroImage = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=90";

export default function HeroSection() {
  const { t } = useLanguage();
  const slides = [
    {
      eyebrow: t("Công Ty Cổ phần Xây Dựng Hữu Thành", "Huu Thanh Construction Co., Ltd."),
      title: t("Đơn vị thi công công trình chuyên nghiệp", "Professional Construction Contractor"),
      highlight: t("công trình", "Construction"),
      description: t(
        "Hơn 15 năm kinh nghiệm trong lĩnh vực xây dựng thủy công, cảng biển và hạ tầng giao thông tại Việt Nam",
        "Over 15 years of experience in hydraulic engineering, port construction and transportation infrastructure in Vietnam"
      ),
      cta: t("Xem dự án", "View Projects"),
      href: "/du-an",
    },
    {
      eyebrow: t("Năng lực thi công", "Construction Capability"),
      title: t("Từng bước phát triển cùng hạ tầng Việt Nam", "Building Vietnam Infrastructure Step by Step"),
      highlight: t("hạ tầng", "Infrastructure"),
      description: t(
        "Đội ngũ kỹ thuật và thiết bị đồng bộ, đáp ứng yêu cầu tiến độ, chất lượng và an toàn trên từng công trường.",
        "A capable technical team and synchronized equipment fleet meeting schedule, quality, and safety requirements on every site."
      ),
      cta: t("Xem thiết bị", "View Equipment"),
      href: "/thiet-bi",
    },
    {
      eyebrow: t("Dự án tiêu biểu", "Featured Projects"),
      title: t("Giải pháp xây dựng bền vững cho mọi công trình", "Sustainable Construction Solutions for Every Project"),
      highlight: t("bền vững", "Sustainable"),
      description: t(
        "Từ cầu đường, cảng biển đến kè sông và thủy lợi, Hữu Thành đồng hành cùng chủ đầu tư bằng năng lực thực tế.",
        "From roads, bridges, ports, river embankments to hydraulic works, Huu Thanh partners with clients through proven field capability."
      ),
      cta: t("Liên hệ ngay", "Contact Us"),
      href: "/lien-he",
    },
  ];
  const [activeSlide, setActiveSlide] = useState(0);
  const currentSlide = slides[activeSlide];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const goToPrevious = () => {
    setActiveSlide((current) => (current === 0 ? slides.length - 1 : current - 1));
  };

  const goToNext = () => {
    setActiveSlide((current) => (current + 1) % slides.length);
  };

  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.eyebrow}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
            activeSlide === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url('${heroImage}')` }}
          role="img"
          aria-label={t("Công trường xây dựng", "Construction site")}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <span className="inline-block text-orange-400 text-xs font-bold uppercase tracking-[0.3em] mb-6 border border-orange-400/30 px-4 py-2 rounded-full">
            {currentSlide.eyebrow}
          </span>
        </motion.div>

        <motion.h1
          key={`title-${activeSlide}`}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {currentSlide.title.split(currentSlide.highlight)[0]}
          <span className="text-orange-400">{currentSlide.highlight}</span>
          {currentSlide.title.split(currentSlide.highlight)[1]}
        </motion.h1>

        <motion.p
          key={`description-${activeSlide}`}
          className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          {currentSlide.description}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Link
            href={currentSlide.href}
            className="group flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-orange-500/30"
          >
            {currentSlide.cta}
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

      <div className="absolute bottom-10 left-4 z-20 flex items-center md:left-8">
        <button
          type="button"
          onClick={goToPrevious}
          className="flex h-12 w-12 items-center justify-center bg-white text-slate-800 transition-colors hover:bg-orange-500 hover:text-white"
          aria-label={t("Slide trước", "Previous slide")}
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          onClick={goToNext}
          className="flex h-12 w-12 items-center justify-center border-l border-slate-200 bg-white text-slate-800 transition-colors hover:bg-orange-500 hover:text-white"
          aria-label={t("Slide tiếp theo", "Next slide")}
        >
          <ChevronRight size={22} />
        </button>
      </div>

      <div className="absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.eyebrow}
            type="button"
            onClick={() => setActiveSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              activeSlide === index ? "w-8 bg-orange-500" : "w-2.5 bg-white/60 hover:bg-white"
            }`}
            aria-label={t(`Chuyển đến slide ${index + 1}`, `Go to slide ${index + 1}`)}
          />
        ))}
      </div>
    </section>
  );
}
