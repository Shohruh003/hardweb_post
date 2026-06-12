import type { Sale, SaleItem, PaymentMethod } from '@/types'
import { branches } from './branches'
import { products } from './products'

function makeRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

const cashiers = ['Aziza N.', 'Jahongir T.', 'Malika S.', 'Sardor R.', 'Nigora X.']
const customers = ['', '', '', 'Doimiy mijoz', 'Oltin karta', '', 'Korporativ']
const payments: PaymentMethod[] = ['cash', 'cash', 'card', 'card', 'transfer']

function pad(n: number, len = 5) {
  return String(n).padStart(len, '0')
}

// Generate sales for the last N days ending today (deterministic)
export const sales: Sale[] = (() => {
  const rng = makeRng(7)
  const list: Sale[] = []
  let receipt = 1000

  const DAYS = 150
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let d = DAYS; d >= 0; d--) {
    const day = new Date(today)
    day.setDate(today.getDate() - d)
    const dow = day.getDay()
    // Weekends busier
    const weekendBoost = dow === 0 || dow === 6 ? 1.5 : 1

    branches.forEach((branch) => {
      // Branch only generates sales after it opened
      if (new Date(branch.openedAt) > day) return
      const branchProducts = products.filter((p) => p.branchId === branch.id)
      if (branchProducts.length === 0) return

      const baseSales = branch.id === 'br-1' ? 14 : branch.id === 'br-2' ? 9 : 5
      const salesToday = Math.max(1, Math.floor(baseSales * weekendBoost * (0.6 + rng() * 0.8)))

      for (let s = 0; s < salesToday; s++) {
        const itemCount = 1 + Math.floor(rng() * 5)
        const items: SaleItem[] = []
        let subtotal = 0
        let cost = 0

        for (let it = 0; it < itemCount; it++) {
          const p = branchProducts[Math.floor(rng() * branchProducts.length)]
          const qty = 1 + Math.floor(rng() * 4)
          const total = p.salePrice * qty
          items.push({
            productId: p.id,
            productName: p.name,
            quantity: qty,
            unitPrice: p.salePrice,
            total,
          })
          subtotal += total
          cost += p.costPrice * qty
        }

        const discount = rng() > 0.85 ? Math.round(subtotal * 0.05) : 0
        const total = subtotal - discount
        const profit = total - cost

        const hour = 9 + Math.floor(rng() * 12)
        const minute = Math.floor(rng() * 60)
        const dt = new Date(day)
        dt.setHours(hour, minute, 0, 0)

        list.push({
          id: `sale-${receipt}`,
          receiptNo: `#${pad(receipt)}`,
          branchId: branch.id,
          items,
          subtotal,
          discount,
          total,
          profit,
          paymentMethod: payments[Math.floor(rng() * payments.length)],
          cashier: cashiers[Math.floor(rng() * cashiers.length)],
          customer: customers[Math.floor(rng() * customers.length)] || undefined,
          createdAt: dt.toISOString(),
        })
        receipt++
      }
    })
  }

  return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
})()

export function getSalesByBranch(branchId: string | 'all'): Sale[] {
  if (branchId === 'all') return sales
  return sales.filter((s) => s.branchId === branchId)
}
