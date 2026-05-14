"use client";

import { LanguageProvider } from "@/contexts/LanguageContext";
import ScrollToTop from "@/components/ScrollToTop";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      {children}
      <ScrollToTop />
    </LanguageProvider>
  );
}
