const fs = require('fs');

const code = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\\.0$/, '') + 'M';
  if (num >= 10000) return (num / 1000).toFixed(1).replace(/\\.0$/, '') + 'k';
  return num.toString();
}

export function formatShortNumber(num: number): string {
  if (typeof num !== 'number' || isNaN(num)) return '0.00';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\\.0$/, '') + 'M';
  if (num >= 10000) return (num / 1000).toFixed(1).replace(/\\.0$/, '') + 'k';
  return num.toFixed(2);
}
`;
fs.writeFileSync('src/lib/utils.ts', code);
