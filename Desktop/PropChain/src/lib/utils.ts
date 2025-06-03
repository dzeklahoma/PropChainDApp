import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(timestamp));
}

export function truncateAddress(address: string, length = 6): string {
  if (!address) return '';
  return `${address.substring(0, length)}...${address.substring(address.length - 4)}`;
}

export function truncateString(str: string, length = 100): string {
  if (!str) return '';
  return str.length > length ? `${str.substring(0, length)}...` : str;
}