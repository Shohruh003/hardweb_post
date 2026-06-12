import { useState } from 'react'
import type { DateRange } from '@/types'
import { presetRange, type PresetKey } from '@/lib/dateRanges'

export function useDateRange(initial: PresetKey = 'last30') {
  const [preset, setPreset] = useState<PresetKey>(initial)
  const [range, setRange] = useState<DateRange>(() => presetRange(initial))

  const onChange = (r: DateRange, p: PresetKey) => {
    setRange(r)
    setPreset(p)
  }

  return { range, preset, onChange }
}
