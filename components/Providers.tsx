'use client';

import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ScrollToTop from '@/components/ScrollToTop';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        {children}
        <ScrollToTop />
      </LanguageProvider>
    </ThemeProvider>
  );
}
