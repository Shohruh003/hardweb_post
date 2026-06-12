import { useEffect, useState } from 'react'
import { Package } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useData } from '@/contexts/DataContext'
import { useTranslation } from '@/contexts/LanguageContext'
import { genId, cn } from '@/lib/utils'
import { categoryIcons, categoryPalette as palette } from './icons'
import type { Category } from '@/types'

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  category?: Category | null
}

export function CategoryDialog({ open, onOpenChange, category }: CategoryDialogProps) {
  const { t } = useTranslation()
  const { addCategory, updateCategory } = useData()
  const [name, setName] = useState('')
  const [color, setColor] = useState(palette[0])
  const [icon, setIcon] = useState('Package')

  useEffect(() => {
    if (category) {
      setName(category.name)
      setColor(category.color)
      setIcon(category.icon)
    } else {
      setName('')
      setColor(palette[0])
      setIcon('Package')
    }
  }, [category, open])

  const handleSubmit = () => {
    if (category) {
      updateCategory({ ...category, name, color, icon })
    } else {
      addCategory({ id: genId('cat-new'), name, color, icon })
    }
    onOpenChange(false)
  }

  const iconNames = Object.keys(categoryIcons)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? t('common.edit') : t('categories.add')}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Preview */}
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl"
              style={{ background: `${color}1a`, color }}
            >
              {(() => {
                const Icon = categoryIcons[icon] ?? Package
                return <Icon className="h-6 w-6" />
              })()}
            </div>
            <span className="font-medium">{name || t('categories.name')}</span>
          </div>

          <div className="space-y-1.5">
            <Label>{t('categories.name')}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Rang</Label>
            <div className="flex flex-wrap gap-2">
              {palette.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={cn(
                    'h-8 w-8 rounded-full transition-transform',
                    color === c && 'ring-2 ring-offset-2 ring-offset-background scale-110'
                  )}
                  style={{ background: c, boxShadow: color === c ? `0 0 0 2px ${c}` : undefined }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ikonka</Label>
            <div className="grid grid-cols-7 gap-2">
              {iconNames.map((nm) => {
                const Icon = categoryIcons[nm]
                return (
                  <button
                    key={nm}
                    onClick={() => setIcon(nm)}
                    className={cn(
                      'flex h-10 items-center justify-center rounded-lg border transition-colors',
                      icon === nm ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-accent'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            {t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
