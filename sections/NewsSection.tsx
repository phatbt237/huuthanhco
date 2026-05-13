"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import { news } from "@/data/news";
import { formatDate } from "@/lib/utils";

export default function NewsSection() {
  const latest = news.slice(0, 3);

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <SectionTitle
            label="Tin tức"
            title="Tin tức & Sự kiện"
            subtitle="Cập nhật những thông tin mới nhất từ Hữu Thành."
          />
          <Link
            href="/tin-tuc"
            className="flex items-center gap-2 text-orange-500 font-semibold text-sm hover:gap-3 transition-all duration-200 shrink-0"
          >
            Xem tất cả <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latest.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="group bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {item.category}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                  <Calendar size={12} />
                  {formatDate(item.date)}
                </div>
                <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-orange-500 transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm mt-3 line-clamp-2">{item.excerpt}</p>
                <Link
                  href={`/tin-tuc/${item.slug}`}
                  className="inline-flex items-center gap-1 mt-4 text-orange-500 text-sm font-semibold hover:gap-2 transition-all duration-200"
                >
                  Đọc thêm <ArrowRight size={14} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
