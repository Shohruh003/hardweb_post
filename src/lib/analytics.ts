import type { Sale, Product, DateRange, KPISnapshot } from '@/types'

export function inRange(dateStr: string, range: DateRange): boolean {
  const d = new Date(dateStr)
  if (range.from) {
    const from = new Date(range.from)
    from.setHours(0, 0, 0, 0)
    if (d < from) return false
  }
  if (range.to) {
    const to = new Date(range.to)
    to.setHours(23, 59, 59, 999)
    if (d > to) return false
  }
  return true
}

export function filterSales(sales: Sale[], range: DateRange): Sale[] {
  if (!range.from && !range.to) return sales
  return sales.filter((s) => inRange(s.createdAt, range))
}

function sum<T>(arr: T[], fn: (x: T) => number): number {
  return arr.reduce((acc, x) => acc + fn(x), 0)
}

export function computeKPIs(current: Sale[], previous: Sale[]): KPISnapshot {
  const revenue = sum(current, (s) => s.total)
  const profit = sum(current, (s) => s.profit)
  const salesCount = current.length
  const itemsSold = sum(current, (s) => sum(s.items, (i) => i.quantity))

  const pRevenue = sum(previous, (s) => s.total)
  const pProfit = sum(previous, (s) => s.profit)
  const pSales = previous.length
  const pItems = sum(previous, (s) => sum(s.items, (i) => i.quantity))

  const pct = (now: number, prev: number) =>
    prev === 0 ? (now > 0 ? 100 : 0) : ((now - prev) / prev) * 100

  return {
    revenue,
    profit,
    salesCount,
    itemsSold,
    revenueChange: pct(revenue, pRevenue),
    profitChange: pct(profit, pProfit),
    salesChange: pct(salesCount, pSales),
    itemsChange: pct(itemsSold, pItems),
  }
}

/** Get the previous comparable period for a given range */
export function previousPeriod(range: DateRange): DateRange {
  if (!range.from || !range.to) return { from: null, to: null }
  const from = new Date(range.from)
  const to = new Date(range.to)
  const span = to.getTime() - from.getTime()
  const prevTo = new Date(from.getTime() - 1)
  const prevFrom = new Date(prevTo.getTime() - span)
  return { from: prevFrom, to: prevTo }
}

export interface DailyPoint {
  date: string // YYYY-MM-DD
  label: string
  revenue: number
  profit: number
  sales: number
}

export function dailySeries(sales: Sale[], range: DateRange): DailyPoint[] {
  const map = new Map<string, DailyPoint>()
  const from = range.from ? new Date(range.from) : null
  const to = range.to ? new Date(range.to) : null

  // Seed every day in the range with zeros so the chart is continuous
  if (from && to) {
    const cur = new Date(from)
    cur.setHours(0, 0, 0, 0)
    while (cur <= to) {
      const key = cur.toISOString().slice(0, 10)
      map.set(key, { date: key, label: formatDayLabel(cur), revenue: 0, profit: 0, sales: 0 })
      cur.setDate(cur.getDate() + 1)
    }
  }

  sales.forEach((s) => {
    const key = s.createdAt.slice(0, 10)
    const existing =
      map.get(key) ??
      ({
        date: key,
        label: formatDayLabel(new Date(key)),
        revenue: 0,
        profit: 0,
        sales: 0,
      } as DailyPoint)
    existing.revenue += s.total
    existing.profit += s.profit
    existing.sales += 1
    map.set(key, existing)
  })

  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date))
}

function formatDayLabel(d: Date): string {
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
}

export interface CategorySlice {
  categoryId: string
  revenue: number
  quantity: number
}

export function revenueByCategory(
  sales: Sale[],
  products: Product[]
): CategorySlice[] {
  const productCat = new Map(products.map((p) => [p.id, p.categoryId]))
  const map = new Map<string, CategorySlice>()
  sales.forEach((s) => {
    s.items.forEach((item) => {
      const catId = productCat.get(item.productId) ?? 'unknown'
      const slice = map.get(catId) ?? { categoryId: catId, revenue: 0, quantity: 0 }
      slice.revenue += item.total
      slice.quantity += item.quantity
      map.set(catId, slice)
    })
  })
  return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue)
}

export interface ProductRank {
  productId: string
  name: string
  quantity: number
  revenue: number
}

export function topProducts(sales: Sale[], limit = 5): ProductRank[] {
  const map = new Map<string, ProductRank>()
  sales.forEach((s) => {
    s.items.forEach((item) => {
      const r =
        map.get(item.productId) ??
        ({ productId: item.productId, name: item.productName, quantity: 0, revenue: 0 } as ProductRank)
      r.quantity += item.quantity
      r.revenue += item.total
      map.set(item.productId, r)
    })
  })
  return Array.from(map.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit)
}

export interface PaymentBreakdown {
  method: string
  count: number
  total: number
}

export function paymentBreakdown(sales: Sale[]): PaymentBreakdown[] {
  const map = new Map<string, PaymentBreakdown>()
  sales.forEach((s) => {
    const b = map.get(s.paymentMethod) ?? { method: s.paymentMethod, count: 0, total: 0 }
    b.count += 1
    b.total += s.total
    map.set(s.paymentMethod, b)
  })
  return Array.from(map.values())
}
