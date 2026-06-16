'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import SectionTitle from '@/components/SectionTitle';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCmsContent } from '@/lib/useCmsContent';
import { mergeById, type CmsContent } from '@/lib/cmsContent';
import { getProjectDetailHref, sortProjectsByYearDesc } from '@/lib/projects';
import { mediaFileUrl } from '@/lib/siteApi';
import { projects } from '@/data/projects';

export default function ProjectsSection({ initialContent }: { initialContent?: CmsContent }) {
  const { lang, t } = useLanguage();
  const cmsContent = useCmsContent(initialContent);
  const projectItems = sortProjectsByYearDesc(mergeById(projects, cmsContent.projects));
  const featured = projectItems.slice(0, 4);


  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <SectionTitle
            label={t('Dự án nổi bật', 'Featured Projects')}
            title={t('Những công trình tiêu biểu', 'Our Landmark Works')}
            subtitle={t(
              'Chúng tôi tự hào với danh mục dự án đa dạng trải dài khắp khu vực miền Nam.',
              'We take pride in a diverse project portfolio spanning across Southern Vietnam.'
            )}
          />
          <Link
            href="/du-an"
            className="flex items-center gap-2 text-orange-500 font-semibold text-sm hover:gap-3 transition-all duration-200 shrink-0"
          >
            {t('Xem tất cả', 'View All')} <ArrowRight size={16} />
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <Link href={getProjectDetailHref(project)} className="block flex-1 flex flex-col">
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                  <img
                    src={mediaFileUrl(project.image)}
                    alt={lang === 'vi' ? project.name : project.nameEn}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {lang === 'vi' ? project.category : project.categoryEn}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-playfair font-bold text-slate-900 dark:text-white text-base mb-3 line-clamp-2 group-hover:text-orange-500 transition-colors">
                    {lang === 'vi' ? project.name : project.nameEn}
                  </h3>
                  <div className="flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-400 mt-auto">
                    <span className="flex items-center gap-2">
                      <MapPin size={14} className="shrink-0" />
                      <span className="line-clamp-1">{project.location}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar size={14} className="shrink-0" />
                      {project.year}
                    </span>
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
