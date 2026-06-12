import type { Locale } from '@/types'
import { en, type Translation, type TranslationKey } from './locales/en'
import { ru } from './locales/ru'
import { uzLatn } from './locales/uz-latn'
import { uzCyrl } from './locales/uz-cyrl'

export type { TranslationKey, Translation }

export const translations: Record<Locale, Translation> = {
  'uz-latn': uzLatn,
  'uz-cyrl': uzCyrl,
  ru,
  en,
}

export interface LocaleMeta {
  code: Locale
  label: string
  short: string
  flag: string
}

export const localeList: LocaleMeta[] = [
  { code: 'uz-latn', label: "O'zbekcha", short: 'UZ', flag: '🇺🇿' },
  { code: 'uz-cyrl', label: 'Ўзбекча', short: 'ЎЗ', flag: '🇺🇿' },
  { code: 'ru', label: 'Русский', short: 'RU', flag: '🇷🇺' },
  { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧' },
]

export function translate(locale: Locale, key: TranslationKey): string {
  return translations[locale]?.[key] ?? en[key] ?? key
}
