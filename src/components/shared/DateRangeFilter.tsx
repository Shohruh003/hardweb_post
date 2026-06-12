import { useState } from 'react'
import { Calendar, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useTranslation } from '@/contexts/LanguageContext'
import type { TranslationKey } from '@/i18n'
import type { DateRange } from '@/types'
import {
  presetRange,
  toInputValue,
  fromInputValue,
  formatRange,
  type PresetKey,
} from '@/lib/dateRanges'
import { cn } from '@/lib/utils'

interface DateRangeFilterProps {
  value: DateRange
  preset: PresetKey
  onChange: (range: DateRange, preset: PresetKey) => void
}

const presets: { key: PresetKey; label: TranslationKey }[] = [
  { key: 'today', label: 'date.today' },
  { key: 'yesterday', label: 'date.yesterday' },
  { key: 'last7', label: 'date.last7' },
  { key: 'last30', label: 'date.last30' },
  { key: 'last90', label: 'date.last90' },
  { key: 'thisMonth', label: 'date.thisMonth' },
  { key: 'lastMonth', label: 'date.lastMonth' },
  { key: 'all', label: 'date.all' },
]

export function DateRangeFilter({ value, preset, onChange }: DateRangeFilterProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [customFrom, setCustomFrom] = useState(toInputValue(value.from))
  const [customTo, setCustomTo] = useState(toInputValue(value.to))

  const activeLabel =
    preset === 'custom'
      ? formatRange(value) || t('date.custom')
      : t(presets.find((p) => p.key === preset)?.label ?? 'date.last30')

  const applyPreset = (key: PresetKey) => {
    onChange(presetRange(key), key)
    setOpen(false)
  }

  const applyCustom = () => {
    const from = fromInputValue(customFrom)
    const to = fromInputValue(customTo)
    onChange({ from, to }, 'custom')
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="font-medium">{activeLabel}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[300px] p-0">
        <div className="grid grid-cols-2 gap-1 p-2">
          {presets.map((p) => (
            <button
              key={p.key}
              onClick={() => applyPreset(p.key)}
              className={cn(
                'rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent',
                preset === p.key && 'bg-primary text-primary-foreground hover:bg-primary'
              )}
            >
              {t(p.label)}
            </button>
          ))}
        </div>
        <div className="border-t border-border p-3 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t('date.custom')}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">{t('common.from')}</Label>
              <Input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{t('common.to')}</Label>
              <Input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="h-9"
              />
            </div>
          </div>
          <Button size="sm" className="w-full" onClick={applyCustom}>
            {t('common.apply')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
