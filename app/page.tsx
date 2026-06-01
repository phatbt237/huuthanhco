import type { Metadata } from "next";
import HeroSection from "@/sections/HeroSection";
import AboutSection from "@/sections/AboutSection";
import ServicesSection from "@/sections/ServicesSection";
import ProjectsSection from "@/sections/ProjectsSection";
import EquipmentSection from "@/sections/EquipmentSection";
import NewsSection from "@/sections/NewsSection";
import PartnersSection from "@/sections/PartnersSection";
import CtaSection from "@/sections/CtaSection";
import { fetchPublicCmsContent } from "@/lib/cmsContent";
import { getPublicSettingsMap } from "@/lib/siteApi";

export const metadata: Metadata = {
  title: "Công ty Cổ phần Xây dựng Hữu Thành | Trang chủ",
  alternates: {
    canonical: "https://huuthanh.vn",
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
      <EquipmentSection initialSettings={settings} />
      <NewsSection initialContent={cmsContent} />
      <PartnersSection initialSettings={settings} />
      <CtaSection />
    </>
  );
}
