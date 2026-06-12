import { useMemo } from 'react'
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  CreditCard,
  Banknote,
  ArrowLeftRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
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
import { Badge } from '@/components/ui/badge'
import { useData } from '@/contexts/DataContext'
import { useTranslation } from '@/contexts/LanguageContext'
import { useDateRange } from '@/hooks/useDateRange'
import {
  computeKPIs,
  dailySeries,
  filterSales,
  paymentBreakdown,
  previousPeriod,
  revenueByCategory,
  topProducts,
} from '@/lib/analytics'
import { formatCurrency, formatNumber } from '@/lib/utils'

const paymentIcons = {
  cash: Banknote,
  card: CreditCard,
  transfer: ArrowLeftRight,
} as const

export function Dashboard() {
  const { t } = useTranslation()
  const { scopedSales, scopedProducts, categories, branches, currentBranch, sales } = useData()
  const { range, preset, onChange } = useDateRange('last30')

  const current = useMemo(() => filterSales(scopedSales, range), [scopedSales, range])
  const previous = useMemo(
    () => filterSales(scopedSales, previousPeriod(range)),
    [scopedSales, range]
  )
  const kpis = useMemo(() => computeKPIs(current, previous), [current, previous])
  const series = useMemo(() => dailySeries(current, range), [current, range])
  const catData = useMemo(() => revenueByCategory(current, scopedProducts), [current, scopedProducts])
  const top = useMemo(() => topProducts(current, 5), [current])
  const payments = useMemo(() => paymentBreakdown(current), [current])
  const lowStock = useMemo(
    () =>
      scopedProducts
        .filter((p) => p.stock <= p.lowStockThreshold)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5),
    [scopedProducts]
  )
  const branchBars = useMemo(() => {
    if (currentBranch !== 'all') return []
    return branches.map((b) => ({
      name: b.name.replace(' filiali', ''),
      revenue: filterSales(
        sales.filter((s) => s.branchId === b.id),
        range
      ).reduce((acc, s) => acc + s.total, 0),
    }))
  }, [branches, sales, range, currentBranch])

  const recent = current.slice(0, 6)
  const paymentTotal = payments.reduce((acc, p) => acc + p.total, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
        actions={<DateRangeFilter value={range} preset={preset} onChange={onChange} />}
      />

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t('kpi.revenue')}
          value={formatCurrency(kpis.revenue)}
          icon={DollarSign}
          change={kpis.revenueChange}
          changeLabel={t('kpi.vsPrevious')}
          accent="primary"
        />
        <StatCard
          label={t('kpi.profit')}
          value={formatCurrency(kpis.profit)}
          icon={TrendingUp}
          change={kpis.profitChange}
          changeLabel={t('kpi.vsPrevious')}
          accent="success"
        />
        <StatCard
          label={t('kpi.sales')}
          value={formatNumber(kpis.salesCount)}
          icon={ShoppingBag}
          change={kpis.salesChange}
          changeLabel={t('kpi.vsPrevious')}
          accent="warning"
        />
        <StatCard
          label={t('kpi.itemsSold')}
          value={formatNumber(kpis.itemsSold)}
          icon={Package}
          change={kpis.itemsChange}
          changeLabel={t('kpi.vsPrevious')}
          accent="destructive"
        />
      </div>

      {/* Revenue chart + category */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('dashboard.revenueProfit')}</CardTitle>
            <CardDescription>{t('dashboard.revenueProfitDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {current.length ? (
              <RevenueChart data={series} />
            ) : (
              <EmptyState title={t('common.noData')} />
            )}
          </CardContent>
        </Card>

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
      </div>

      {/* Branch comparison (all branches only) */}
      {currentBranch === 'all' && branchBars.some((b) => b.revenue > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>{t('nav.branches')}</CardTitle>
            <CardDescription>{t('branches.revenue')}</CardDescription>
          </CardHeader>
          <CardContent>
            <BranchBarChart data={branchBars} />
          </CardContent>
        </Card>
      )}

      {/* Top products + payments + low stock */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.topProducts')}</CardTitle>
            <CardDescription>{t('dashboard.topProductsDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {top.length ? (
              top.map((p, i) => (
                <div key={p.productId} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(p.quantity)} {t('common.units')}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold">{formatCurrency(p.revenue)}</span>
                </div>
              ))
            ) : (
              <EmptyState title={t('common.noData')} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.paymentMethods')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {payments.length ? (
              payments.map((p) => {
                const Icon = paymentIcons[p.method as keyof typeof paymentIcons]
                const pct = paymentTotal ? Math.round((p.total / paymentTotal) * 100) : 0
                return (
                  <div key={p.method} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        {t(`payment.${p.method}` as 'payment.cash')}
                      </span>
                      <span className="font-medium">{formatCurrency(p.total)}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })
            ) : (
              <EmptyState title={t('common.noData')} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                {t('dashboard.lowStock')}
              </CardTitle>
            </div>
            <Link to="/products" className="text-xs font-medium text-primary hover:underline">
              {t('dashboard.viewAll')}
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStock.length ? (
              lowStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.sku}</p>
                  </div>
                  <Badge variant={p.stock === 0 ? 'destructive' : 'warning'}>
                    {p.stock} {t('common.units')}
                  </Badge>
                </div>
              ))
            ) : (
              <EmptyState title={t('common.noData')} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent sales */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>{t('dashboard.recentSales')}</CardTitle>
          <Link to="/sales" className="text-xs font-medium text-primary hover:underline">
            {t('dashboard.viewAll')}
          </Link>
        </CardHeader>
        <CardContent>
          {recent.length ? (
            <div className="space-y-1">
              {recent.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-lg px-2 py-2.5 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success">
                      <ShoppingBag className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{s.receiptNo}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.cashier} · {s.items.length} {t('sales.itemsCount')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(s.total)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(s.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title={t('common.noData')} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
