import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ru-RU').format(value)
}

/** Format a number as UZS currency (e.g. "1 250 000 so'm") */
export function formatCurrency(value: number): string {
  return `${formatNumber(Math.round(value))} so'm`
}

export function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return String(value)
}

/** Generate a unique id with a prefix (used for new mock records) */
export function genId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}`
}

/** Generate a receipt number from the current time */
export function genReceiptNo(): string {
  return `#${Math.floor(Date.now() / 1000) % 100000}`
}

/** Current timestamp as ISO string */
export function nowIso(): string {
  return new Date().toISOString()
}

/** Current date as YYYY-MM-DD */
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}
