"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { settingLines } from "@/lib/siteApi";
import { useSiteSettings } from "@/lib/useSiteSettings";

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const frameMs = 1000 / 60;
    const totalFrames = duration / frameMs;
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const eased = 1 - Math.pow(1 - frame / totalFrames, 3);
      setVal(Math.min(Math.round(to * eased), to));
      if (frame >= totalFrames) clearInterval(timer);
    }, frameMs);
    return () => clearInterval(timer);
  }, [inView, to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

const partnerImages = [
  "/images/doi-tac/huu-thanh-co_132747886943964272.jpg",
  "/images/doi-tac/huu-thanh-co_132747887169276799.jpg",
  "/images/doi-tac/huu-thanh-co_132747906276479099.jpg",
  "/images/doi-tac/huu-thanh-co_132747911027105033.jpg",
  "/images/doi-tac/huu-thanh-co_132747915873354052.jpg",
  "/images/doi-tac/huu-thanh-co_132747916552729392.jpg",
  "/images/doi-tac/huu-thanh-co_132747917517885233.jpg",
  "/images/doi-tac/huu-thanh-co_132747921285697744.jpg",
  "/images/doi-tac/huu-thanh-co_132747921436010275.jpg",
  "/images/doi-tac/huu-thanh-co_132747921578197710.jpg",
  "/images/doi-tac/huu-thanh-co_132747921728510246.jpg",
];

export default function PartnersSection() {
  const { t } = useLanguage();
  const settings = useSiteSettings("partners");
  const configuredImages = settingLines(settings, "partners.images");
  const visiblePartnerImages = configuredImages.length ? configuredImages : partnerImages;
  const track = [...visiblePartnerImages, ...visiblePartnerImages];

  const stats = [
    { value: 50,  suffix: "+",  label: t("Đối tác chiến lược", "Strategic Partners") },
    { value: 15,  suffix: "+",  label: t("Tỉnh thành hợp tác", "Provinces Covered") },
    { value: 100, suffix: "%",  label: t("Cam kết chất lượng", "Quality Commitment") },
  ];

  return (
    <section className="py-20 bg-white overflow-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-orange-500 text-xs font-bold uppercase tracking-widest mb-3 border-l-2 border-orange-500 pl-3">
            {t("Đối tác", "Partners")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            {t("Đối tác & Khách hàng tin tưởng", "Trusted Partners & Clients")}
          </h2>
          <p className="text-slate-500 text-base max-w-xl mx-auto">
            {t(
              "Hơn 15 năm hợp tác với các chủ đầu tư và tổ chức uy tín trong và ngoài nước.",
              "Over 15 years of collaboration with reputable investors and organizations at home and abroad."
            )}
          </p>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden mb-16">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee gap-6 w-max">
          {track.map((src, i) => (
            <div
              key={i}
              className="shrink-0 w-64 h-36 rounded-2xl bg-white flex items-center justify-center p-5 shadow-sm hover:shadow-md border border-slate-100 hover:border-orange-200 transition-all duration-300 group cursor-pointer"
            >
              <img
                src={src}
                alt={`Đối tác ${(i % visiblePartnerImages.length) + 1}`}
                className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center justify-center py-8 px-4 text-center"
              style={{  }}
            >
              <div className="text-4xl font-black text-orange-500 leading-none">
                <CountUp to={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-slate-500 mt-2 leading-snug">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
