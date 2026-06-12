import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Locale } from '@/types'
import { translate, type TranslationKey } from '@/i18n'

interface LanguageContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

const STORAGE_KEY = 'hardweb.locale'

function getInitialLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
  if (stored && ['uz-latn', 'uz-cyrl', 'ru', 'en'].includes(stored)) return stored
  return 'uz-latn'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale)
    document.documentElement.lang = locale.startsWith('uz') ? 'uz' : locale
  }, [locale])

  const setLocale = (l: Locale) => setLocaleState(l)
  const t = (key: TranslationKey) => translate(locale, key)

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTranslation() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useTranslation must be used within LanguageProvider')
  return ctx
}
