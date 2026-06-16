'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getSetting, legacyContentFallbackEnabled, type SettingsMap } from '@/lib/siteApi';
import { useSiteSettings } from '@/lib/useSiteSettings';

function localizedSetting(
  settings: SettingsMap,
  lang: 'vi' | 'en',
  keys: { vi: string; en: string },
  fallback: { vi: string; en: string },
) {
  const value = getSetting(settings, lang === 'en' ? keys.en : keys.vi).trim();
  return value || fallback[lang];
}

export default function HeroSection({ initialSettings }: { initialSettings?: SettingsMap }) {
  const { lang, t } = useLanguage();
  const settings = useSiteSettings(undefined, initialSettings);

  const heroEyebrow = localizedSetting(settings, lang, { vi: 'hero.eyebrow', en: 'hero.eyebrowEn' }, {
    vi: legacyContentFallbackEnabled ? 'Công Ty Cổ phần Xây Dựng Hữu Thành' : '',
    en: 'Huu Thanh Construction Joint Stock Company',
  });

  const heroTitle = localizedSetting(settings, lang, { vi: 'hero.title', en: 'hero.titleEn' }, {
    vi: legacyContentFallbackEnabled ? 'Đơn vị thi công công trình chuyên nghiệp' : '',
    en: 'Professional Construction Contractor',
  });

  const heroDescription = localizedSetting(
    settings,
    lang,
    { vi: 'hero.description', en: 'hero.descriptionEn' },
    {
      vi: legacyContentFallbackEnabled
        ? 'Hơn 17 năm kinh nghiệm trong lĩnh vực xây dựng thủy công, cảng biển và hạ tầng giao thông tại Việt Nam'
        : '',
      en: 'Over 17 years of experience in hydraulic engineering, port construction and transportation infrastructure in Vietnam',
    },
  );

  return (
    <section className="relative flex h-screen min-h-[640px] w-full items-center justify-center overflow-hidden pt-20">
      {/* Modern gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy-900 via-navy-800 to-orange-900/20" />

      {/* Accent gradient */}
      <div className="absolute -top-40 -right-40 -z-10 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 -z-10 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center md:text-left">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="inline-block text-orange-400 text-xs font-bold uppercase tracking-widest mb-6">
              {heroEyebrow}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {heroTitle}
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {heroDescription}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Link
              href="/du-an"
              className="group inline-flex items-center justify-center sm:justify-start gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-lg font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              {t('Xem dự án', 'View Projects')}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/lien-he"
              className="inline-flex items-center justify-center sm:justify-start gap-2 border-2 border-white/30 hover:border-white text-white px-8 py-3.5 rounded-lg font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              {t('Liên hệ ngay', 'Contact Us')}
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-6 md:gap-12 pt-8 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {[
              { value: '17+', label: t('Năm kinh nghiệm', 'Years Experience') },
              { value: '200+', label: t('Dự án hoàn thành', 'Projects Completed') },
              { value: '50+', label: t('Thiết bị công trình', 'Equipment Units') },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-orange-400 font-playfair">{stat.value}</div>
                <div className="text-xs md:text-sm text-white/60 mt-2">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
}
