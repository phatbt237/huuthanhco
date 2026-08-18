"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const slides = [
  {
    src: "/images/gioi-thieu/anh-khoi-cong.jpg",
    altVi: "Tập thể Hữu Thành tại lễ khởi công công trình Bến tàu 30.000DWT",
    altEn: "Huu Thanh team at the groundbreaking ceremony for the 30,000DWT wharf project",
  },
  {
    src: "/images/gioi-thieu/le-khanh-thanh-ptsc-dung-quat.png",
    altVi: "Lễ khánh thành Bến số 3 Cảng PTSC Dung Quất",
    altEn: "Inauguration ceremony of Berth No. 3 at PTSC Dung Quat Port",
  },
  {
    src: "/images/gioi-thieu/khai-truong-cau-cang-sowatco-long-binh.png",
    altVi: "Lễ khai trương cầu cảng số 1 Cảng Sowatco Long Bình",
    altEn: "Opening ceremony of Berth No. 1 at Sowatco Long Binh Port",
  },
  {
    src: "/images/gioi-thieu/khoi-cong-ha-luu-vung-tau-gd3.jpg",
    altVi: "Lễ khởi công dự án nối dài cầu cảng giai đoạn III tại Cảng Hạ Lưu Vũng Tàu",
    altEn: "Groundbreaking ceremony for the phase III wharf extension at Vung Tau downstream port",
  },
  {
    src: "/images/gioi-thieu/khoi-cong-99.jpg",
    altVi: "Lễ khởi công xây dựng kho cảng Mái Dầm và nhà máy pha chế xăng",
    altEn: "Groundbreaking ceremony for Mai Dam storage port and fuel blending plant",
  },
  {
    src: "/images/gioi-thieu/anh-tat-nien.jpg",
    altVi: "Tập thể Hữu Thành tại tiệc tất niên",
    altEn: "Huu Thanh team at the year-end party",
  },
  {
    src: "/images/gioi-thieu/anh-tat-nien-1.jpg",
    altVi: "Đội ngũ Hữu Thành tại tiệc tất niên",
    altEn: "Huu Thanh staff at the year-end party",
  },
  {
    src: "/images/gioi-thieu/anh-tat-nien-2.jpg",
    altVi: "Hoạt động khen thưởng tại tiệc tất niên Hữu Thành",
    altEn: "Award activity at Huu Thanh's year-end party",
  },
];

const AUTO_PLAY_INTERVAL = 5000;

export default function GroundbreakingCarousel() {
  const { lang, t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const move = useCallback((step: number) => {
    setDirection(step);
    setCurrent((index) => (index + step + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion || slides.length < 2) return;

    const timer = window.setInterval(() => move(1), AUTO_PLAY_INTERVAL);
    return () => window.clearInterval(timer);
  }, [move, paused, reduceMotion]);

  const goTo = (index: number) => {
    if (index === current) return;
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const activeSlide = slides[current];

  return (
    <div
      className="group relative aspect-[16/9] overflow-hidden bg-slate-200 shadow-2xl ring-1 ring-slate-200"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={activeSlide.src}
          custom={direction}
          variants={{
            enter: (slideDirection: number) => ({
              x: reduceMotion ? 0 : slideDirection * 48,
              opacity: 0,
              scale: reduceMotion ? 1 : 1.015,
            }),
            center: { x: 0, opacity: 1, scale: 1 },
            exit: (slideDirection: number) => ({
              x: reduceMotion ? 0 : slideDirection * -48,
              opacity: 0,
              scale: 1,
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: reduceMotion ? 0.2 : 0.75, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={activeSlide.src}
            alt={lang === "en" ? activeSlide.altEn : activeSlide.altVi}
            fill
            sizes="(min-width: 1024px) 52vw, 100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/38 via-transparent to-transparent" />

      <button
        type="button"
        onClick={() => move(-1)}
        className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md border border-white/40 bg-slate-950/35 text-white opacity-100 backdrop-blur-sm transition hover:bg-slate-950/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
        aria-label={t("Ảnh trước", "Previous image")}
      >
        <ChevronLeft size={22} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => move(1)}
        className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md border border-white/40 bg-slate-950/35 text-white opacity-100 backdrop-blur-sm transition hover:bg-slate-950/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
        aria-label={t("Ảnh tiếp theo", "Next image")}
      >
        <ChevronRight size={22} aria-hidden="true" />
      </button>

      <div
        className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2"
        aria-label={t("Chọn ảnh", "Select image")}
      >
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => goTo(index)}
            className={`h-2.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${
              index === current ? "w-7 bg-sky-600" : "w-2.5 bg-white/75 hover:bg-white"
            }`}
            aria-label={t(`Xem ảnh ${index + 1}`, `View image ${index + 1}`)}
            aria-current={index === current ? "true" : undefined}
          />
        ))}
      </div>

      <span className="sr-only" aria-live="polite">
        {t(`Ảnh ${current + 1} trên ${slides.length}`, `Image ${current + 1} of ${slides.length}`)}
      </span>
    </div>
  );
}
