import { useMemo, useState } from 'react'
import {
  Plus,
  Store,
  MapPin,
  Phone,
  User,
  Calendar,
  Package,
  Pencil,
  Trash2,
  TrendingUp,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { BranchDialog } from '@/components/branches/BranchDialog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useData } from '@/contexts/DataContext'
import { useTranslation } from '@/contexts/LanguageContext'
import { formatCurrency, formatNumber } from '@/lib/utils'
import type { Branch } from '@/types'

export function Branches() {
  const { t } = useTranslation()
  const { branches, products, sales, deleteBranch, setCurrentBranch } = useData()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Branch | null>(null)
  const [deleting, setDeleting] = useState<Branch | null>(null)

  const statsByBranch = useMemo(() => {
    const map = new Map<string, { products: number; revenue: number; sales: number }>()
    branches.forEach((b) => {
      const bProducts = products.filter((p) => p.branchId === b.id).length
      const bSales = sales.filter((s) => s.branchId === b.id)
      map.set(b.id, {
        products: bProducts,
        revenue: bSales.reduce((acc, s) => acc + s.total, 0),
        sales: bSales.length,
      })
    })
    return map
  }, [branches, products, sales])

  const openAdd = () => {
    setEditing(null)
    setDialogOpen(true)
  }
  const openEdit = (b: Branch) => {
    setEditing(b)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('branches.title')}
        subtitle={t('branches.subtitle')}
        actions={
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('branches.add')}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {branches.map((b) => {
          const st = statsByBranch.get(b.id)!
          return (
            <Card key={b.id} className="flex flex-col transition-shadow hover:shadow-md">
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Store className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold leading-tight">{b.name}</p>
                      <Badge variant={b.isActive ? 'success' : 'secondary'} className="mt-1">
                        {b.isActive ? t('branches.active') : t('branches.inactive')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(b)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleting(b)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{b.address}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0" />
                    {b.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <User className="h-4 w-4 shrink-0" />
                    {b.manager}
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0" />
                    {new Date(b.openedAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
                  <div className="text-center">
                    <Package className="mx-auto h-4 w-4 text-muted-foreground" />
                    <p className="mt-1 text-sm font-bold">{formatNumber(st.products)}</p>
                    <p className="text-[11px] text-muted-foreground">{t('branches.products')}</p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="mx-auto h-4 w-4 text-muted-foreground" />
                    <p className="mt-1 text-sm font-bold">{formatNumber(st.sales)}</p>
                    <p className="text-[11px] text-muted-foreground">{t('nav.sales')}</p>
                  </div>
                  <div className="text-center">
                    <Store className="mx-auto h-4 w-4 text-muted-foreground" />
                    <p className="mt-1 text-sm font-bold">{formatCurrency(st.revenue).replace(" so'm", '')}</p>
                    <p className="text-[11px] text-muted-foreground">{t('branches.revenue')}</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => setCurrentBranch(b.id)}
                >
                  {t('dashboard.viewAll')}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <BranchDialog open={dialogOpen} onOpenChange={setDialogOpen} branch={editing} />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(v) => !v && setDeleting(null)}
        title={t('branches.deleteConfirm')}
        description={deleting?.name}
        onConfirm={() => deleting && deleteBranch(deleting.id)}
      />
    </div>
  )
}
