/**
 * Centralized design tokens
 * Used across the application for consistency
 */

export const colors = {
  // Primary orange
  orange: {
    50: '#FFF5EE',
    100: '#FFE5D4',
    200: '#FFCBA8',
    300: '#FFB17D',
    400: '#FF8C52',
    500: '#FF6B35', // primary
    600: '#E85A2B',
    700: '#CC4A22',
    800: '#B33D1A',
    900: '#8B2E13',
    950: '#5A1D0C',
  },
  // Dark navy
  navy: {
    50: '#F0F4F8',
    100: '#E1E8F0',
    200: '#C3D1E0',
    300: '#A5BAD0',
    400: '#7A96B8',
    500: '#4F73A0',
    600: '#3A5585',
    700: '#2D3F66',
    800: '#1F2C47',
    900: '#0D1B2A', // primary dark
    950: '#070E17',
  },
  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
} as const;

export const spacing = {
  xs: '0.5rem', // 8px
  sm: '1rem', // 16px
  md: '1.5rem', // 24px
  lg: '2rem', // 32px
  xl: '2.5rem', // 40px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
  '4xl': '6rem', // 96px
} as const;

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const transitions = {
  fastest: '100ms',
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  slower: '500ms',
} as const;

export const timingFunctions = {
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
} as const;

// Common animation durations
export const animationDurations = {
  micro: 100,
  fast: 150,
  standard: 200,
  slow: 300,
  slower: 500,
} as const;

// Layout
export const layout = {
  container: {
    maxWidth: '80rem', // max-w-7xl
    paddingX: {
      mobile: '1rem',
      tablet: '1.5rem',
      desktop: '2rem',
    },
  },
  header: {
    height: '5rem', // 80px
  },
  navbar: {
    height: '5rem',
    backgroundColor: colors.navy[900],
  },
  footer: {
    backgroundColor: colors.navy[900],
  },
} as const;
