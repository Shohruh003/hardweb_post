import { useMemo, useState } from 'react'
import { Plus, Package, Pencil, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { CategoryDialog } from '@/components/categories/CategoryDialog'
import { categoryIcons } from '@/components/categories/icons'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useData } from '@/contexts/DataContext'
import { useTranslation } from '@/contexts/LanguageContext'
import { formatCurrency, formatNumber } from '@/lib/utils'
import type { Category } from '@/types'

export function Categories() {
  const { t } = useTranslation()
  const { categories, scopedProducts, scopedSales, deleteCategory } = useData()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState<Category | null>(null)

  const stats = useMemo(() => {
    const productCat = new Map(scopedProducts.map((p) => [p.id, p.categoryId]))
    const revenue = new Map<string, number>()
    scopedSales.forEach((s) =>
      s.items.forEach((item) => {
        const cat = productCat.get(item.productId)
        if (cat) revenue.set(cat, (revenue.get(cat) ?? 0) + item.total)
      })
    )
    return categories.map((c) => ({
      ...c,
      products: scopedProducts.filter((p) => p.categoryId === c.id).length,
      revenue: revenue.get(c.id) ?? 0,
    }))
  }, [categories, scopedProducts, scopedSales])

  const openAdd = () => {
    setEditing(null)
    setDialogOpen(true)
  }
  const openEdit = (c: Category) => {
    setEditing(c)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('categories.title')}
        subtitle={t('categories.subtitle')}
        actions={
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('categories.add')}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((c) => {
          const Icon = categoryIcons[c.icon] ?? Package
          return (
            <Card key={c.id} className="group transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: `${c.color}1a`, color: c.color }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(c)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleting(c)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="mt-3 font-semibold">{c.name}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('categories.products')}</span>
                  <span className="font-medium">{formatNumber(c.products)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t('categories.revenue')}</span>
                  <span className="font-semibold" style={{ color: c.color }}>
                    {formatCurrency(c.revenue)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <CategoryDialog open={dialogOpen} onOpenChange={setDialogOpen} category={editing} />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={`${t('common.delete')}: ${deleting?.name}`}
        onConfirm={() => deleting && deleteCategory(deleting.id)}
      />
    </div>
  )
}
