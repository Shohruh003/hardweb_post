import { useEffect, useState } from 'react'
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
import { toInputValue } from '@/lib/dateRanges'
import type { Branch } from '@/types'

interface BranchDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  branch?: Branch | null
}

const empty = { name: '', address: '', phone: '', manager: '', openedAt: '' }

export function BranchDialog({ open, onOpenChange, branch }: BranchDialogProps) {
  const { t } = useTranslation()
  const { addBranch, updateBranch } = useData()
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (branch) {
      setForm({
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        manager: branch.manager,
        openedAt: branch.openedAt.slice(0, 10),
      })
    } else {
      setForm({ ...empty, openedAt: toInputValue(new Date()) })
    }
  }, [branch, open])

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }))

  const handleSubmit = () => {
    if (branch) {
      updateBranch({ ...branch, ...form })
    } else {
      addBranch({
        id: `br-new-${Date.now()}`,
        ...form,
        openedAt: form.openedAt || new Date().toISOString().slice(0, 10),
        isActive: true,
      })
    }
    onOpenChange(false)
  }

  const valid = form.name.trim() && form.manager.trim()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{branch ? t('branches.editBranch') : t('branches.addBranch')}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <Label>{t('branches.name')}</Label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t('branches.address')}</Label>
            <Input value={form.address} onChange={(e) => set('address', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{t('branches.phone')}</Label>
              <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>{t('branches.openedAt')}</Label>
              <Input type="date" value={form.openedAt} onChange={(e) => set('openedAt', e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>{t('branches.manager')}</Label>
            <Input value={form.manager} onChange={(e) => set('manager', e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={!valid}>
            {t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
