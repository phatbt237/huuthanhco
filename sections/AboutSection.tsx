"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import CountUp from "@/components/CountUp";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import groundbreakingImage from "@/public/images/gioi-thieu/le-khoi-cong-cang-dong-nai.jpg";

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
    <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Large stats */}
        <div className="mb-24 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="font-playfair text-5xl md:text-6xl font-bold text-orange-500 mb-3">200+</div>
            <p className="text-slate-600 dark:text-slate-300 text-lg">{t("Dự án hoàn thành", "Projects Completed")}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="font-playfair text-5xl md:text-6xl font-bold text-orange-500 mb-3">50+</div>
            <p className="text-slate-600 dark:text-slate-300 text-lg">{t("Thiết bị công trình", "Equipment Units")}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="font-playfair text-5xl md:text-6xl font-bold text-orange-500 mb-3">300+</div>
            <p className="text-slate-600 dark:text-slate-300 text-lg">{t("Cán bộ nhân viên", "Staff Members")}</p>
          </motion.div>
        </div>

        {/* Overview grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-100">
              <Image
                src={groundbreakingImage}
                alt={t("Lễ khởi công công trình Hữu Thành", "Huu Thanh project groundbreaking ceremony")}
                className="object-contain"
                sizes="(min-width: 1024px) 50vw, 100vw"
                placeholder="blur"
                fill
              />
            </div>
            <div
              className="absolute -bottom-6 -right-6 rounded-2xl p-6 text-white shadow-2xl"
              style={{ backgroundColor: "#0D1B2A" }}
            >
              <div className="text-4xl font-bold text-orange-400">17+</div>
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
                "Công ty Cổ phần Xây dựng Hữu Thành được thành lập năm 2009, chuyên thi công các công trình thủy công, cảng biển, kè sông và hạ tầng giao thông tại khu vực miền Nam Việt Nam.",
                "Huu Thanh Construction Joint Stock Company was established in 2009, specializing in hydraulic engineering, port construction, riverbank reinforcement and transportation infrastructure in Southern Vietnam."
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

            {/* Stats with Counter Animation */}
            <div className="mt-12 grid grid-cols-3 gap-2">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="flex flex-col items-center justify-center py-6 px-4 text-center rounded-xl bg-orange-50/50 hover:bg-orange-50 transition-colors duration-300"
                >
                  <div className="text-4xl font-black text-orange-500 leading-none">
                    <CountUp to={stat.value} suffix={stat.suffix} duration={2000} />
                  </div>
                  <div className="text-xs text-slate-500 mt-3 leading-snug font-medium">{stat.label}</div>
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
