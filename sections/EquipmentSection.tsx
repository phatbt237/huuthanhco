'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';
import { equipment } from '@/data/equipment';
import type { Equipment } from '@/data/equipment';
import { useLanguage } from '@/contexts/LanguageContext';
import { settingJson, type SettingsMap } from '@/lib/siteApi';
import { useSiteSettings } from '@/lib/useSiteSettings';

export default function EquipmentSection({ initialSettings }: { initialSettings?: SettingsMap }) {
  const { lang, t } = useLanguage();
  const settings = useSiteSettings('equipment', initialSettings);
  const equipmentItems = settingJson<Equipment[]>(settings, 'equipment.items', equipment);
  const featured = equipmentItems.slice(0, 4);

  return (
    <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <SectionTitle
            label={t('Thiết bị', 'Equipment')}
            title={t('Hệ thống thiết bị hiện đại', 'Modern Equipment Fleet')}
            subtitle={t(
              'Đội ngũ phương tiện và máy móc đồng bộ, đáp ứng mọi yêu cầu thi công.',
              'A synchronized fleet of vehicles and machinery meeting all construction requirements.'
            )}
          />
          <Link
            href="/thiet-bi"
            className="flex items-center gap-2 text-orange-500 font-semibold text-sm hover:gap-3 transition-all duration-200 shrink-0"
          >
            {t('Xem tất cả', 'View All')} <ArrowRight size={16} />
          </Link>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <Link href={`/thiet-bi#thiet-bi-${item.id}`} className="block">
                <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <img
                    src={item.image}
                    alt={lang === 'vi' ? item.name : item.nameEn}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-playfair font-bold text-slate-900 dark:text-white text-base mb-2 group-hover:text-orange-500 transition-colors">
                    {lang === 'vi' ? item.name : item.nameEn}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 mb-3">
                    {lang === 'vi' ? item.description : item.descriptionEn}
                  </p>
                  <div className="space-y-1">
                    {(lang === 'vi' ? item.specs : item.specsEn)
                      .slice(0, 2)
                      .map((spec) => (
                        <div key={spec} className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                          <span className="w-1 h-1 rounded-full bg-orange-500 shrink-0" />
                          {spec}
                        </div>
                      ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
