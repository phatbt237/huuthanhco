import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes intelligently
 * Handles class conflicts (e.g., color, spacing) correctly
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
