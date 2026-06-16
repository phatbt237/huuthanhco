import { Inter, Playfair_Display } from 'next/font/google';

/**
 * Playfair Display - Premium serif font for headings
 * Weights: 400, 500, 600, 700, 800, 900
 */
export const playfairDisplay = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  weights: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-playfair',
  fallback: ['Georgia', 'serif'],
});

/**
 * Inter - Modern, clean sans-serif for body & UI
 * Weights: 300, 400, 500, 600, 700, 800, 900
 */
export const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weights: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter',
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
});
