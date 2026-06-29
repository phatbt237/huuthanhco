"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import groundbreakingImage from "@/public/images/gioi-thieu/le-khoi-cong-cang-dong-nai.jpg";

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  return <span>{to}{suffix}</span>;
}

export default function AboutSection() {
  const { t } = useLanguage();

  const stats = [
    { value: 50, suffix: "+", label: t("Dự án hoàn thành", "Projects Completed") },
    { value: 200, suffix: "+", label: t("Thiết bị công trình", "Equipment Units") },
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
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-sky-600 rounded-2xl -z-10" />
          </motion.div>

          {/* Content */}
          <div>
            <SectionTitle
              label={t("Về chúng tôi", "About Us")}
              title={t("XÂY DỰNG NỀN TẢNG VỮNG CHẮC CHO TƯƠNG LAI", "BUILDING A SOLID FOUNDATION FOR THE FUTURE")}
              subtitle={t(
                "Công ty Cổ phần Xây dựng Hữu Thành được thành lập năm 2009, chuyên thi công các công trình thủy công, cảng biển, kè sông và hạ tầng giao thông trải dài từ Bắc vào Nam.",
                "Huu Thanh Construction Joint Stock Company was established in 2009, specializing in hydraulic engineering, port construction, riverbank reinforcement and transportation infrastructure projects across Vietnam from North to South."
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
                  <CheckCircle2 className="text-sky-600 shrink-0" size={20} />
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
                  <div className="text-4xl font-black text-sky-600 leading-none">
                    <CountUp to={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-slate-500 mt-2 leading-snug">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <Link
              href="/gioi-thieu"
              className="mt-8 inline-flex items-center gap-2 rounded bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-sky-600"
            >
              {t("Tìm hiểu thêm", "Learn More")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
