import type { DateRange } from '@/types'

export type PresetKey =
  | 'today'
  | 'yesterday'
  | 'last7'
  | 'last30'
  | 'thisMonth'
  | 'lastMonth'
  | 'last90'
  | 'all'

export function presetRange(key: PresetKey): DateRange {
  const now = new Date()
  const start = (d: Date) => {
    const x = new Date(d)
    x.setHours(0, 0, 0, 0)
    return x
  }
  const end = (d: Date) => {
    const x = new Date(d)
    x.setHours(23, 59, 59, 999)
    return x
  }

  switch (key) {
    case 'today':
      return { from: start(now), to: end(now) }
    case 'yesterday': {
      const y = new Date(now)
      y.setDate(now.getDate() - 1)
      return { from: start(y), to: end(y) }
    }
    case 'last7': {
      const f = new Date(now)
      f.setDate(now.getDate() - 6)
      return { from: start(f), to: end(now) }
    }
    case 'last30': {
      const f = new Date(now)
      f.setDate(now.getDate() - 29)
      return { from: start(f), to: end(now) }
    }
    case 'last90': {
      const f = new Date(now)
      f.setDate(now.getDate() - 89)
      return { from: start(f), to: end(now) }
    }
    case 'thisMonth': {
      const f = new Date(now.getFullYear(), now.getMonth(), 1)
      return { from: start(f), to: end(now) }
    }
    case 'lastMonth': {
      const f = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const t = new Date(now.getFullYear(), now.getMonth(), 0)
      return { from: start(f), to: end(t) }
    }
    case 'all':
    default:
      return { from: null, to: null }
  }
}

export function toInputValue(d: Date | null): string {
  if (!d) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function fromInputValue(value: string): Date | null {
  if (!value) return null
  const d = new Date(value)
  return isNaN(d.getTime()) ? null : d
}

export function formatRange(range: DateRange): string {
  if (!range.from && !range.to) return ''
  const fmt = (d: Date) => d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
  if (range.from && range.to) return `${fmt(range.from)} — ${fmt(range.to)}`
  if (range.from) return `${fmt(range.from)} —`
  return `— ${fmt(range.to!)}`
}
