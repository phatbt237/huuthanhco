import type { Metadata } from "next";
import HeroSection from "@/sections/HeroSection";
import AboutSection from "@/sections/AboutSection";
import ServicesSection from "@/sections/ServicesSection";
import ProjectsSection from "@/sections/ProjectsSection";
import ProjectGalleryStrip from "@/sections/ProjectGalleryStrip";
import EquipmentSection from "@/sections/EquipmentSection";
import NewsSection from "@/sections/NewsSection";
import PartnersSection from "@/sections/PartnersSection";
import CtaSection from "@/sections/CtaSection";
import { fetchPublicCmsContent } from "@/lib/cmsContent";
import { getPublicSettingsMap } from "@/lib/siteApi";
import { SITE_URL } from "@/lib/siteMetadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Công ty Cổ phần Xây dựng Hữu Thành | Trang chủ",
  alternates: {
    canonical: SITE_URL,
  },
};

export default async function HomePage() {
  const [settings, cmsContent] = await Promise.all([
    getPublicSettingsMap(),
    fetchPublicCmsContent(),
  ]);

  return (
    <>
      <HeroSection initialSettings={settings} />
      <AboutSection />
      <ServicesSection initialSettings={settings} />
      <ProjectsSection initialContent={cmsContent} />
      <ProjectGalleryStrip initialContent={cmsContent} />
      <EquipmentSection initialSettings={settings} />
      <NewsSection initialContent={cmsContent} />
      <PartnersSection initialSettings={settings} />
      <CtaSection />
    </>
  );
}
