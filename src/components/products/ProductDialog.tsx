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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useData } from '@/contexts/DataContext'
import { useTranslation } from '@/contexts/LanguageContext'
import type { Product } from '@/types'

interface ProductDialogProps {
  open: boolean
  onOpenChange: (v: boolean) => void
  product?: Product | null
}

const units: Product['unit'][] = ['dona', 'kg', 'litr', 'metr', 'paket']

const empty = {
  name: '',
  sku: '',
  categoryId: '',
  branchId: '',
  costPrice: '',
  salePrice: '',
  stock: '',
  lowStockThreshold: '25',
  unit: 'dona' as Product['unit'],
}

export function ProductDialog({ open, onOpenChange, product }: ProductDialogProps) {
  const { t } = useTranslation()
  const { categories, branches, currentBranch, addProduct, updateProduct } = useData()
  const [form, setForm] = useState(empty)

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        sku: product.sku,
        categoryId: product.categoryId,
        branchId: product.branchId,
        costPrice: String(product.costPrice),
        salePrice: String(product.salePrice),
        stock: String(product.stock),
        lowStockThreshold: String(product.lowStockThreshold),
        unit: product.unit,
      })
    } else {
      setForm({
        ...empty,
        categoryId: categories[0]?.id ?? '',
        branchId: currentBranch !== 'all' ? currentBranch : branches[0]?.id ?? '',
      })
    }
  }, [product, open, categories, branches, currentBranch])

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = () => {
    const stock = Number(form.stock) || 0
    if (product) {
      updateProduct({
        ...product,
        name: form.name,
        sku: form.sku,
        categoryId: form.categoryId,
        branchId: form.branchId,
        costPrice: Number(form.costPrice) || 0,
        salePrice: Number(form.salePrice) || 0,
        stock,
        lowStockThreshold: Number(form.lowStockThreshold) || 0,
        unit: form.unit,
      })
    } else {
      addProduct({
        id: `pr-new-${Date.now()}`,
        name: form.name,
        sku: form.sku || `SKU-${Date.now().toString().slice(-6)}`,
        categoryId: form.categoryId,
        branchId: form.branchId,
        costPrice: Number(form.costPrice) || 0,
        salePrice: Number(form.salePrice) || 0,
        stock,
        initialStock: stock,
        sold: 0,
        unit: form.unit,
        lowStockThreshold: Number(form.lowStockThreshold) || 0,
        createdAt: new Date().toISOString(),
      })
    }
    onOpenChange(false)
  }

  const valid = form.name.trim() && form.salePrice && form.categoryId && form.branchId

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{product ? t('products.editProduct') : t('products.addProduct')}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-1.5">
            <Label>{t('products.name')}</Label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{t('products.sku')}</Label>
              <Input value={form.sku} onChange={(e) => set('sku', e.target.value)} placeholder="auto" />
            </div>
            <div className="space-y-1.5">
              <Label>{t('products.category')}</Label>
              <Select value={form.categoryId} onValueChange={(v) => set('categoryId', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{t('products.branch')}</Label>
            <Select value={form.branchId} onValueChange={(v) => set('branchId', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{t('products.cost')}</Label>
              <Input
                type="number"
                value={form.costPrice}
                onChange={(e) => set('costPrice', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t('products.price')}</Label>
              <Input
                type="number"
                value={form.salePrice}
                onChange={(e) => set('salePrice', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>{t('products.stock')}</Label>
              <Input
                type="number"
                value={form.stock}
                onChange={(e) => set('stock', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t('products.unit')}</Label>
              <Select value={form.unit} onValueChange={(v) => set('unit', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((u) => (
                    <SelectItem key={u} value={u}>
                      {t(`unit.${u}` as 'unit.dona')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('products.threshold')}</Label>
              <Input
                type="number"
                value={form.lowStockThreshold}
                onChange={(e) => set('lowStockThreshold', e.target.value)}
              />
            </div>
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
