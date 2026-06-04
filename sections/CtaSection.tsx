"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CtaSection() {
  const { t } = useLanguage();

  return (
    <section className="relative py-28 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80')" }}
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
            {t("Hợp tác với chúng tôi", "Partner With Us")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            {t("Đồng hành cùng những", "Building Together for")}
            <br />
            <span className="text-orange-400">
              {t("công trình bền vững", "a Sustainable Future")}
            </span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10">
            {t(
              "Với kinh nghiệm 15 năm và hệ thống thiết bị hiện đại, Hữu Thành sẵn sàng đồng hành cùng bạn trong mọi dự án.",
              "With 15 years of experience and modern equipment, Huu Thanh is ready to partner with you on any project."
            )}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/lien-he"
              className="group flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded font-semibold text-base transition-all duration-200"
            >
              {t("Liên hệ tư vấn", "Get a Consultation")}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="tel:0981806676"
              className="flex items-center gap-2 border border-white/30 hover:border-white text-white px-8 py-4 rounded font-semibold text-base transition-all duration-200 hover:bg-white/10"
            >
              <Phone size={18} />
              0981 80 66 76
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
