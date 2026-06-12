import { Languages } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/contexts/LanguageContext'
import { localeList } from '@/i18n'
import { cn } from '@/lib/utils'

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation()
  const active = localeList.find((l) => l.code === locale)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{active?.short}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {localeList.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLocale(l.code)}
            className={cn('justify-between', locale === l.code && 'bg-accent font-semibold')}
          >
            <span className="flex items-center gap-2">
              <span className="text-base">{l.flag}</span>
              {l.label}
            </span>
            {locale === l.code && <span className="text-primary">●</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
