"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import SectionTitle from "@/components/SectionTitle";
import { CheckCircle2 } from "lucide-react";

const stats = [
  { value: "15+", label: "Năm kinh nghiệm" },
  { value: "200+", label: "Dự án hoàn thành" },
  { value: "50+", label: "Thiết bị công trình" },
  { value: "300+", label: "Cán bộ nhân viên" },
];

const highlights = [
  "Chuyên gia thi công thủy công và cảng biển",
  "Đội ngũ kỹ sư kinh nghiệm, được đào tạo bài bản",
  "Thiết bị hiện đại, đồng bộ",
  "Cam kết tiến độ và chất lượng",
];

export default function AboutSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
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
                alt="Công trình Hữu Thành"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-navy-900/20 to-transparent" />
            </div>

            {/* Floating badge */}
            <div
              className="absolute -bottom-6 -right-6 rounded-2xl p-6 text-white shadow-2xl"
              style={{ backgroundColor: "#0D1B2A" }}
            >
              <div className="text-4xl font-bold text-orange-400">15+</div>
              <div className="text-sm text-white/70 mt-1">Năm kinh nghiệm</div>
            </div>

            {/* Orange accent box */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-500 rounded-2xl -z-10" />
          </motion.div>

          {/* Content side */}
          <div>
            <SectionTitle
              label="Về chúng tôi"
              title="Xây dựng nền tảng vững chắc cho tương lai"
              subtitle="Công ty TNHH Xây dựng Hữu Thành được thành lập năm 2009, chuyên thi công các công trình thủy công, cảng biển, kè sông và hạ tầng giao thông tại khu vực miền Nam Việt Nam."
            />

            <div className="mt-8 space-y-3">
              {highlights.map((item, i) => (
                <motion.div
                  key={item}
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

            <div className="mt-10 grid grid-cols-2 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="border border-slate-100 rounded-xl p-5"
                >
                  <div className="text-3xl font-bold text-orange-500">{stat.value}</div>
                  <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <Link
              href="/gioi-thieu"
              className="inline-flex items-center gap-2 mt-8 bg-slate-900 hover:bg-orange-500 text-white px-6 py-3 rounded font-semibold text-sm transition-colors duration-200"
            >
              Tìm hiểu thêm
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
