import type { Metadata } from "next";
import HeroSection from "@/sections/HeroSection";
import AboutSection from "@/sections/AboutSection";
import ProjectsSection from "@/sections/ProjectsSection";
import EquipmentSection from "@/sections/EquipmentSection";
import NewsSection from "@/sections/NewsSection";
import CtaSection from "@/sections/CtaSection";

export const metadata: Metadata = {
  title: "Công ty TNHH Xây dựng Hữu Thành | Trang chủ",
  alternates: {
    canonical: "https://huuthanh.vn",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <EquipmentSection />
      <NewsSection />
      <CtaSection />
    </>
  );
}
