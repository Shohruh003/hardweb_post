import { useMemo, useState } from 'react'
import { Search, Receipt, DollarSign, TrendingUp, ShoppingBag, Eye } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { DateRangeFilter } from '@/components/shared/DateRangeFilter'
import { ReceiptDialog } from '@/components/sales/ReceiptDialog'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
import { useDateRange } from '@/hooks/useDateRange'
import { filterSales } from '@/lib/analytics'
import { formatCurrency, formatNumber } from '@/lib/utils'
import type { Sale } from '@/types'

const paymentVariant = {
  cash: 'success',
  card: 'default',
  transfer: 'warning',
} as const

export function Sales() {
  const { t } = useTranslation()
  const { scopedSales } = useData()
  const { range, preset, onChange } = useDateRange('last30')
  const [search, setSearch] = useState('')
  const [payment, setPayment] = useState('all')
  const [selected, setSelected] = useState<Sale | null>(null)

  const filtered = useMemo(() => {
    let list = filterSales(scopedSales, range)
    if (search) list = list.filter((s) => s.receiptNo.toLowerCase().includes(search.toLowerCase()))
    if (payment !== 'all') list = list.filter((s) => s.paymentMethod === payment)
    return list
  }, [scopedSales, range, search, payment])

  const stats = useMemo(() => {
    const revenue = filtered.reduce((acc, s) => acc + s.total, 0)
    const profit = filtered.reduce((acc, s) => acc + s.profit, 0)
    const items = filtered.reduce((acc, s) => acc + s.items.reduce((a, i) => a + i.quantity, 0), 0)
    return { revenue, profit, count: filtered.length, items }
  }, [filtered])

  // Cap rendered rows for performance; note the cap to the user
  const visible = filtered.slice(0, 100)

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('sales.title')}
        subtitle={t('sales.subtitle')}
        actions={<DateRangeFilter value={range} preset={preset} onChange={onChange} />}
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label={t('kpi.revenue')} value={formatCurrency(stats.revenue)} icon={DollarSign} accent="primary" />
        <StatCard label={t('kpi.profit')} value={formatCurrency(stats.profit)} icon={TrendingUp} accent="success" />
        <StatCard label={t('kpi.sales')} value={formatNumber(stats.count)} icon={Receipt} accent="warning" />
        <StatCard label={t('kpi.itemsSold')} value={formatNumber(stats.items)} icon={ShoppingBag} accent="destructive" />
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={`${t('sales.receipt')} №...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={payment} onValueChange={setPayment}>
              <SelectTrigger className="sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('sales.payment')}: {t('common.all')}</SelectItem>
                <SelectItem value="cash">{t('payment.cash')}</SelectItem>
                <SelectItem value="card">{t('payment.card')}</SelectItem>
                <SelectItem value="transfer">{t('payment.transfer')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {visible.length ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('sales.receipt')}</TableHead>
                    <TableHead className="hidden md:table-cell">{t('common.date')}</TableHead>
                    <TableHead className="hidden sm:table-cell">{t('sales.cashier')}</TableHead>
                    <TableHead className="text-center">{t('sales.items')}</TableHead>
                    <TableHead>{t('sales.payment')}</TableHead>
                    <TableHead className="text-right">{t('sales.total')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((s) => (
                    <TableRow key={s.id} className="cursor-pointer" onClick={() => setSelected(s)}>
                      <TableCell className="font-semibold text-primary">{s.receiptNo}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {new Date(s.createdAt).toLocaleString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm">{s.cashier}</TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {s.items.length}
                      </TableCell>
                      <TableCell>
                        <Badge variant={paymentVariant[s.paymentMethod]}>
                          {t(`payment.${s.paymentMethod}` as 'payment.cash')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{formatCurrency(s.total)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon-sm" onClick={(e) => { e.stopPropagation(); setSelected(s) }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filtered.length > visible.length && (
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  {visible.length} / {formatNumber(filtered.length)}
                </p>
              )}
            </>
          ) : (
            <EmptyState icon={Receipt} title={t('common.noData')} />
          )}
        </CardContent>
      </Card>

      <ReceiptDialog sale={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
