import { useMemo, useState } from 'react'
import { Plus, Search, Package, Boxes, TrendingUp, AlertTriangle, Pencil, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { ProductDialog } from '@/components/products/ProductDialog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useData } from '@/contexts/DataContext'
import { useTranslation } from '@/contexts/LanguageContext'
import { formatCurrency, formatNumber } from '@/lib/utils'
import type { Product } from '@/types'
import type { TranslationKey } from '@/i18n'

function stockStatus(p: Product): { label: TranslationKey; variant: 'success' | 'warning' | 'destructive' } {
  if (p.stock === 0) return { label: 'products.outOfStock', variant: 'destructive' }
  if (p.stock <= p.lowStockThreshold) return { label: 'products.lowStock', variant: 'warning' }
  return { label: 'products.inStock', variant: 'success' }
}

export function Products() {
  const { t } = useTranslation()
  const { scopedProducts, categories, deleteProduct } = useData()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [status, setStatus] = useState<string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)

  const catMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories])

  const filtered = useMemo(() => {
    return scopedProducts.filter((p) => {
      if (
        search &&
        !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !p.sku.toLowerCase().includes(search.toLowerCase())
      )
        return false
      if (category !== 'all' && p.categoryId !== category) return false
      if (status !== 'all') {
        const s = stockStatus(p)
        if (status === 'in' && s.variant !== 'success') return false
        if (status === 'low' && s.variant !== 'warning') return false
        if (status === 'out' && s.variant !== 'destructive') return false
      }
      return true
    })
  }, [scopedProducts, search, category, status])

  const stats = useMemo(() => {
    const stockValue = scopedProducts.reduce((acc, p) => acc + p.stock * p.costPrice, 0)
    const totalSold = scopedProducts.reduce((acc, p) => acc + p.sold, 0)
    const lowCount = scopedProducts.filter((p) => p.stock <= p.lowStockThreshold).length
    return { count: scopedProducts.length, stockValue, totalSold, lowCount }
  }, [scopedProducts])

  const openAdd = () => {
    setEditing(null)
    setDialogOpen(true)
  }
  const openEdit = (p: Product) => {
    setEditing(p)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('products.title')}
        subtitle={t('products.subtitle')}
        actions={
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('products.add')}
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label={t('products.totalProducts')} value={formatNumber(stats.count)} icon={Package} accent="primary" />
        <StatCard label={t('products.totalStockValue')} value={formatCurrency(stats.stockValue)} icon={Boxes} accent="success" />
        <StatCard label={t('products.totalSold')} value={formatNumber(stats.totalSold)} icon={TrendingUp} accent="warning" />
        <StatCard label={t('products.lowStockCount')} value={formatNumber(stats.lowCount)} icon={AlertTriangle} accent="destructive" />
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('common.search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.allCategories')}</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="in">{t('products.inStock')}</SelectItem>
                <SelectItem value="low">{t('products.lowStock')}</SelectItem>
                <SelectItem value="out">{t('products.outOfStock')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('products.name')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('products.category')}</TableHead>
                  <TableHead className="text-right">{t('products.price')}</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">{t('products.stock')}</TableHead>
                  <TableHead className="text-right hidden lg:table-cell">{t('products.sold')}</TableHead>
                  <TableHead>{t('products.status')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => {
                  const cat = catMap.get(p.categoryId)
                  const s = stockStatus(p)
                  return (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                            style={{ background: `${cat?.color}1a`, color: cat?.color }}
                          >
                            {p.name.charAt(0)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.sku}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">{cat?.name}</span>
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(p.salePrice)}</TableCell>
                      <TableCell className="text-right hidden sm:table-cell">
                        <span className="font-medium">{p.stock}</span>
                        <span className="text-muted-foreground"> {t(`unit.${p.unit}` as 'unit.dona')}</span>
                      </TableCell>
                      <TableCell className="text-right hidden lg:table-cell text-muted-foreground">
                        {formatNumber(p.sold)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={s.variant}>{t(s.label)}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon-sm" onClick={() => openEdit(p)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleting(p)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <EmptyState icon={Package} title={t('common.noData')} />
          )}
        </CardContent>
      </Card>

      <ProductDialog open={dialogOpen} onOpenChange={setDialogOpen} product={editing} />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={t('products.deleteConfirm')}
        description={deleting?.name}
        onConfirm={() => deleting && deleteProduct(deleting.id)}
      />
    </div>
  )
}
