"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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

export default function AboutSection() {
  const { t } = useLanguage();

  const stats = [
    { value: 200, suffix: "+", label: t("Dự án hoàn thành", "Projects Completed") },
    { value: 50,  suffix: "+", label: t("Thiết bị công trình", "Equipment Units") },
    { value: 300, suffix: "+", label: t("Cán bộ nhân viên", "Staff Members") },
  ];

  const highlights = [
    t("Chuyên gia thi công thủy công và cảng biển", "Specialists in hydraulic and port construction"),
    t("Đội ngũ kỹ sư kinh nghiệm, được đào tạo bài bản", "Experienced, well-trained engineering team"),
    t("Thiết bị hiện đại, đồng bộ", "Modern and fully synchronized equipment"),
    t("Cam kết tiến độ và chất lượng", "Committed to schedule and quality"),
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
                alt={t("Công trình Hữu Thành", "Huu Thanh Construction Project")}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-navy-900/20 to-transparent" />
            </div>
            <div
              className="absolute -bottom-6 -right-6 rounded-2xl p-6 text-white shadow-2xl"
              style={{ backgroundColor: "#0D1B2A" }}
            >
              <div className="text-4xl font-bold text-orange-400">15+</div>
              <div className="text-sm text-white/70 mt-1">{t("Năm kinh nghiệm", "Years Experience")}</div>
            </div>
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-500 rounded-2xl -z-10" />
          </motion.div>

          {/* Content */}
          <div>
            <SectionTitle
              label={t("Về chúng tôi", "About Us")}
              title={t("Xây dựng nền tảng vững chắc cho tương lai", "Building a solid foundation for the future")}
              subtitle={t(
                "Công ty TNHH Xây dựng Hữu Thành được thành lập năm 2009, chuyên thi công các công trình thủy công, cảng biển, kè sông và hạ tầng giao thông tại khu vực miền Nam Việt Nam.",
                "Huu Thanh Construction Co., Ltd. was established in 2009, specializing in hydraulic engineering, port construction, riverbank reinforcement and transportation infrastructure in Southern Vietnam."
              )}
            />

            <div className="mt-8 space-y-3">
              {highlights.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="text-orange-500 shrink-0" size={20} />
                  <span className="text-slate-600 text-sm">{item}</span>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex flex-col items-center justify-center py-6 px-4 text-center"
                >
                  <div className="text-4xl font-black text-orange-500 leading-none">
                    <CountUp to={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-slate-500 mt-2 leading-snug">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <Link
              href="/gioi-thieu"
              className="inline-flex items-center gap-2 mt-8 bg-slate-900 hover:bg-orange-500 text-white px-6 py-3 rounded font-semibold text-sm transition-colors duration-200"
            >
              {t("Tìm hiểu thêm", "Learn More")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
