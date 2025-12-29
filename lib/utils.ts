import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string, locale: string = 'en') {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.]/g, '')) : amount;

  if (locale === 'bn') {
    return `৳ ${numericAmount.toLocaleString('bn-BD')}`;
  }

  return `৳ ${numericAmount.toLocaleString('en-US')}`;
}


export function formatPrice(price: number) {
  return new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export const colorMap: Record<string, string> = {
  "Black": "#000000",
  "Brown": "#8B4513",
  "Golden": "#FFD700",
  "Silver": "#C0C0C0",
  "Shining Gold": "#FFD700",
  "Shining Silver": "#E8E8E8",
  "Gunmetal": "#4a4a4a",
  "Blue": "#0000FF",
  "Red": "#FF0000",
  "Rose Gold": "#B76E79",
};
