import { Sun, Moon, Palette, Languages, Store, Info, Check } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useTheme } from '@/contexts/ThemeContext'
import { useTranslation } from '@/contexts/LanguageContext'
import { localeList } from '@/i18n'
import type { Theme } from '@/types'
import { cn } from '@/lib/utils'

export function Settings() {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const { locale, setLocale } = useTranslation()

  const themeOptions: { key: Theme; label: string; icon: typeof Sun }[] = [
    { key: 'light', label: t('settings.light'), icon: Sun },
    { key: 'dark', label: t('settings.dark'), icon: Moon },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title={t('settings.title')} subtitle={t('settings.subtitle')} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              {t('settings.appearance')}
            </CardTitle>
            <CardDescription>{t('settings.appearanceDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>{t('settings.theme')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.themeDesc')}</p>
              <div className="grid grid-cols-2 gap-3">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setTheme(opt.key)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border-2 p-4 transition-all',
                      theme === opt.key
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-lg',
                        theme === opt.key ? 'bg-primary text-white' : 'bg-muted'
                      )}
                    >
                      <opt.icon className="h-5 w-5" />
                    </span>
                    <span className="font-medium">{opt.label}</span>
                    {theme === opt.key && <Check className="ml-auto h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-primary" />
              {t('settings.language')}
            </CardTitle>
            <CardDescription>{t('settings.languageDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {localeList.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLocale(l.code)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg border p-3 transition-all',
                    locale === l.code
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-accent'
                  )}
                >
                  <span className="text-2xl">{l.flag}</span>
                  <span className="font-medium">{l.label}</span>
                  <span className="ml-auto text-xs font-semibold text-muted-foreground">
                    {l.short}
                  </span>
                  {locale === l.code && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Store profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              {t('settings.profile')}
            </CardTitle>
            <CardDescription>{t('settings.profileDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>{t('settings.storeName')}</Label>
              <Input defaultValue="HardWeb Market" />
            </div>
            <div className="space-y-1.5">
              <Label>{t('settings.owner')}</Label>
              <Input defaultValue="Shohruh Azimov" />
            </div>
            <div className="space-y-1.5">
              <Label>{t('branches.phone')}</Label>
              <Input defaultValue="+998 90 123 45 67" />
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              {t('settings.about')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{t('settings.aboutDesc')}</p>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t('settings.version')}</span>
              <span className="font-medium">1.0.0 — demo</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Stack</span>
              <span className="font-medium">React · Vite · Tailwind</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
