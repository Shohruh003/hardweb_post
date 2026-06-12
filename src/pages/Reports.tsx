import { useMemo } from 'react'
import { Download } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { DateRangeFilter } from '@/components/shared/DateRangeFilter'
import { EmptyState } from '@/components/shared/EmptyState'
import { RevenueChart } from '@/components/charts/RevenueChart'
import { CategoryChart } from '@/components/charts/CategoryChart'
import { BranchBarChart } from '@/components/charts/BranchBarChart'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { useDateRange } from '@/hooks/useDateRange'
import {
  dailySeries,
  filterSales,
  revenueByCategory,
  topProducts,
} from '@/lib/analytics'
import { formatCurrency, formatNumber } from '@/lib/utils'

export function Reports() {
  const { t } = useTranslation()
  const { scopedProducts, scopedSales, categories, branches, currentBranch, sales } = useData()
  const { range, preset, onChange } = useDateRange('last30')

  const current = useMemo(() => filterSales(scopedSales, range), [scopedSales, range])
  const series = useMemo(() => dailySeries(current, range), [current, range])
  const catData = useMemo(() => revenueByCategory(current, scopedProducts), [current, scopedProducts])
  const top = useMemo(() => topProducts(current, 10), [current])
  const branchBars = useMemo(() => {
    if (currentBranch !== 'all') return []
    return branches.map((b) => ({
      name: b.name.replace(' filiali', ''),
      revenue: filterSales(sales.filter((s) => s.branchId === b.id), range).reduce(
        (acc, s) => acc + s.total,
        0
      ),
    }))
  }, [branches, sales, range, currentBranch])

  const exportCsv = () => {
    const rows = [['Sana', 'Chek', 'Filial', 'Jami', 'Foyda', "To'lov"]]
    current.forEach((s) => {
      rows.push([
        new Date(s.createdAt).toLocaleString('ru-RU'),
        s.receiptNo,
        branches.find((b) => b.id === s.branchId)?.name ?? '',
        String(s.total),
        String(s.profit),
        s.paymentMethod,
      ])
    })
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hisobot-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('nav.reports')}
        subtitle={t('dashboard.subtitle')}
        actions={
          <div className="flex gap-2">
            <DateRangeFilter value={range} preset={preset} onChange={onChange} />
            <Button variant="outline" className="gap-2" onClick={exportCsv}>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">{t('common.export')}</span>
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.revenueProfit')}</CardTitle>
          <CardDescription>{t('dashboard.revenueProfitDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {current.length ? <RevenueChart data={series} /> : <EmptyState title={t('common.noData')} />}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.salesByCategory')}</CardTitle>
          </CardHeader>
          <CardContent>
            {catData.length ? (
              <CategoryChart data={catData} categories={categories} />
            ) : (
              <EmptyState title={t('common.noData')} />
            )}
          </CardContent>
        </Card>

        {currentBranch === 'all' ? (
          <Card>
            <CardHeader>
              <CardTitle>{t('nav.branches')}</CardTitle>
              <CardDescription>{t('branches.revenue')}</CardDescription>
            </CardHeader>
            <CardContent>
              {branchBars.some((b) => b.revenue > 0) ? (
                <BranchBarChart data={branchBars} />
              ) : (
                <EmptyState title={t('common.noData')} />
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.salesByCategory')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {catData.slice(0, 8).map((c) => {
                const cat = categories.find((x) => x.id === c.categoryId)
                return (
                  <div key={c.categoryId} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: cat?.color }} />
                      {cat?.name}
                    </span>
                    <span className="font-medium">{formatCurrency(c.revenue)}</span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.topProducts')}</CardTitle>
          <CardDescription>{t('dashboard.topProductsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {top.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>{t('products.name')}</TableHead>
                  <TableHead className="text-right">{t('products.sold')}</TableHead>
                  <TableHead className="text-right">{t('kpi.revenue')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {top.map((p, i) => (
                  <TableRow key={p.productId}>
                    <TableCell>
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-right">{formatNumber(p.quantity)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(p.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState title={t('common.noData')} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
