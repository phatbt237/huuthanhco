import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Button component variants
 * Usage: className={buttonVariants({ intent: 'primary', size: 'md' })}
 */
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      intent: {
        primary: 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700',
        secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 active:bg-slate-400',
        ghost: 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
        outline: 'border-2 border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950',
        danger: 'bg-error text-white hover:bg-red-600 active:bg-red-700',
      },
      size: {
        xs: 'px-3 py-1.5 text-xs',
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg',
        xl: 'px-8 py-4 text-lg',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md',
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

/**
 * Badge component variants
 */
export const badgeVariants = cva(
  'inline-flex items-center rounded-full text-xs font-semibold px-3 py-1',
  {
    variants: {
      intent: {
        primary: 'bg-orange-100 text-orange-900 dark:bg-orange-900/30 dark:text-orange-300',
        secondary: 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-300',
        success: 'bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300',
        warning: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-300',
        error: 'bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-300',
      },
    },
    defaultVariants: {
      intent: 'primary',
    },
  }
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;

/**
 * Card component variants
 */
export const cardVariants = cva(
  'rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800',
  {
    variants: {
      hover: {
        true: 'transition-shadow duration-200 hover:shadow-lg',
      },
      padding: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      padding: 'md',
    },
  }
);

export type CardVariants = VariantProps<typeof cardVariants>;

/**
 * Text variants for semantic typography
 */
export const textVariants = cva('', {
  variants: {
    variant: {
      h1: 'font-playfair text-5xl font-bold leading-tight',
      h2: 'font-playfair text-4xl font-bold leading-snug',
      h3: 'font-playfair text-3xl font-bold leading-snug',
      h4: 'font-playfair text-2xl font-bold leading-snug',
      h5: 'font-playfair text-xl font-semibold leading-snug',
      h6: 'font-playfair text-lg font-semibold leading-snug',
      body: 'text-base leading-relaxed',
      'body-sm': 'text-sm leading-relaxed',
      caption: 'text-xs uppercase tracking-wider',
    },
    color: {
      primary: 'text-slate-900 dark:text-white',
      secondary: 'text-slate-600 dark:text-slate-400',
      muted: 'text-slate-500 dark:text-slate-500',
      accent: 'text-orange-500',
    },
  },
  defaultVariants: {
    variant: 'body',
    color: 'primary',
  },
});

export type TextVariants = VariantProps<typeof textVariants>;

/**
 * Section container variants
 */
export const sectionVariants = cva('relative py-24', {
  variants: {
    background: {
      white: 'bg-white',
      light: 'bg-slate-50 dark:bg-slate-900',
      dark: 'bg-navy-900 text-white',
      gradient: 'bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900',
    },
  },
  defaultVariants: {
    background: 'white',
  },
});

export type SectionVariants = VariantProps<typeof sectionVariants>;

/**
 * Input variants
 */
export const inputVariants = cva(
  'w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-base transition-colors duration-200 placeholder:text-slate-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'text-sm py-1.5',
        md: 'text-base py-2.5',
        lg: 'text-lg py-3',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export type InputVariants = VariantProps<typeof inputVariants>;
