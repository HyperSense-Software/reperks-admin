import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const mediaBreakPoints = [
  '(max-width: 640px)',
  '(max-width: 1024px)',
  '(min-width: 1025px)',
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
