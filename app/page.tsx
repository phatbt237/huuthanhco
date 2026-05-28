import type { Metadata } from "next";
import HeroSection from "@/sections/HeroSection";
import AboutSection from "@/sections/AboutSection";
import ServicesSection from "@/sections/ServicesSection";
import ProjectsSection from "@/sections/ProjectsSection";
import EquipmentSection from "@/sections/EquipmentSection";
import NewsSection from "@/sections/NewsSection";
import PartnersSection from "@/sections/PartnersSection";
import CtaSection from "@/sections/CtaSection";
import { getSettingsMap } from "@/lib/siteApi";

export const metadata: Metadata = {
  title: "Công ty Cổ phần Xây dựng Hữu Thành | Trang chủ",
  alternates: {
    canonical: "https://huuthanh.vn",
  },
};

export default async function HomePage() {
  const settings = await getSettingsMap().catch(() => undefined);

  return (
    <>
      <HeroSection initialSettings={settings} />
      <AboutSection />
      <ServicesSection initialSettings={settings} />
      <ProjectsSection />
      <EquipmentSection initialSettings={settings} />
      <NewsSection />
      <PartnersSection initialSettings={settings} />
      <CtaSection />
    </>
  );
}
