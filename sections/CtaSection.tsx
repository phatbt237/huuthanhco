"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(13,27,42,0.88)" }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block text-orange-400 text-xs font-bold uppercase tracking-widest mb-6 border border-orange-400/30 px-4 py-2 rounded-full">
            Hợp tác với chúng tôi
          </span>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Đồng hành cùng những
            <br />
            <span className="text-orange-400">công trình bền vững</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
            Với kinh nghiệm 15 năm và hệ thống thiết bị hiện đại, Hữu Thành sẵn sàng đồng hành cùng bạn trong mọi dự án.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/lien-he"
              className="group flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded font-semibold text-base transition-all duration-200"
            >
              Liên hệ tư vấn
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="tel:0901234567"
              className="flex items-center gap-2 border border-white/30 hover:border-white text-white px-8 py-4 rounded font-semibold text-base transition-all duration-200 hover:bg-white/10"
            >
              <Phone size={18} />
              0901 234 567
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
