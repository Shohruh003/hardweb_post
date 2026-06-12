import { useMemo, useState } from 'react'
import {
  Search,
  Plus,
  Minus,
  ShoppingCart,
  CheckCircle2,
  X,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { useData } from '@/contexts/DataContext'
import { useTranslation } from '@/contexts/LanguageContext'
import { formatCurrency, genId, genReceiptNo, nowIso } from '@/lib/utils'
import type { PaymentMethod, Product, Sale, SaleItem } from '@/types'

interface CartLine {
  product: Product
  qty: number
}

export function POS() {
  const { t } = useTranslation()
  const { products, branches, categories, currentBranch, recordSale } = useData()

  const [saleBranch, setSaleBranch] = useState<string>(
    currentBranch !== 'all' ? currentBranch : branches[0]?.id ?? ''
  )
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [cart, setCart] = useState<CartLine[]>([])
  const [discount, setDiscount] = useState('0')
  const [payment, setPayment] = useState<PaymentMethod>('cash')
  const [success, setSuccess] = useState(false)

  const branchProducts = useMemo(
    () => products.filter((p) => p.branchId === saleBranch),
    [products, saleBranch]
  )

  const filtered = useMemo(() => {
    return branchProducts.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      if (category !== 'all' && p.categoryId !== category) return false
      return true
    })
  }, [branchProducts, search, category])

  const catMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories])

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.product.id === product.id)
      if (existing) {
        return prev.map((l) =>
          l.product.id === product.id ? { ...l, qty: Math.min(l.qty + 1, product.stock) } : l
        )
      }
      return [...prev, { product, qty: 1 }]
    })
  }

  const changeQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((l) =>
          l.product.id === id
            ? { ...l, qty: Math.max(0, Math.min(l.qty + delta, l.product.stock)) }
            : l
        )
        .filter((l) => l.qty > 0)
    )
  }

  const removeLine = (id: string) => setCart((prev) => prev.filter((l) => l.product.id !== id))

  const subtotal = cart.reduce((acc, l) => acc + l.product.salePrice * l.qty, 0)
  const discountPct = Math.min(100, Math.max(0, Number(discount) || 0))
  const discountAmount = Math.round((subtotal * discountPct) / 100)
  const total = subtotal - discountAmount

  const completeSale = () => {
    if (!cart.length) return
    const items: SaleItem[] = cart.map((l) => ({
      productId: l.product.id,
      productName: l.product.name,
      quantity: l.qty,
      unitPrice: l.product.salePrice,
      total: l.product.salePrice * l.qty,
    }))
    const cost = cart.reduce((acc, l) => acc + l.product.costPrice * l.qty, 0)
    const sale: Sale = {
      id: genId('sale-new'),
      receiptNo: genReceiptNo(),
      branchId: saleBranch,
      items,
      subtotal,
      discount: discountAmount,
      total,
      profit: total - cost,
      paymentMethod: payment,
      cashier: 'Shohruh A.',
      createdAt: nowIso(),
    }
    recordSale(sale)
    setCart([])
    setDiscount('0')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('pos.title')}
        subtitle={t('pos.subtitle')}
        actions={
          <Select value={saleBranch} onValueChange={setSaleBranch}>
            <SelectTrigger className="w-52">
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
        }
      />

      {success && (
        <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success animate-fade-in">
          <CheckCircle2 className="h-5 w-5" />
          {t('pos.saleCompleted')}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Product picker */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('pos.searchProduct')}
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
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => {
              const cat = catMap.get(p.categoryId)
              const disabled = p.stock === 0
              return (
                <button
                  key={p.id}
                  disabled={disabled}
                  onClick={() => addToCart(p)}
                  className="group flex flex-col rounded-xl border border-border bg-card p-3 text-left transition-all hover:border-primary hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <div
                    className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold"
                    style={{ background: `${cat?.color}1a`, color: cat?.color }}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <p className="line-clamp-2 text-sm font-medium leading-tight">{p.name}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-primary">{formatCurrency(p.salePrice)}</span>
                  </div>
                  <span className="mt-1 text-xs text-muted-foreground">
                    {p.stock} {t('pos.inStock')}
                  </span>
                </button>
              )
            })}
          </div>
          {!filtered.length && <EmptyState title={t('common.noData')} />}
        </div>

        {/* Cart */}
        <Card className="lg:sticky lg:top-20 h-fit">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              {t('pos.cart')}
              {cart.length > 0 && <Badge>{cart.length}</Badge>}
            </CardTitle>
            {cart.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setCart([])}>
                {t('pos.clear')}
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.length === 0 ? (
              <EmptyState icon={ShoppingCart} title={t('pos.emptyCart')} description={t('pos.emptyCartDesc')} />
            ) : (
              <>
                <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
                  {cart.map((l) => (
                    <div key={l.product.id} className="flex items-center gap-2 rounded-lg border border-border p-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{l.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(l.product.salePrice)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon-sm" className="h-7 w-7" onClick={() => changeQty(l.product.id, -1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-7 text-center text-sm font-semibold">{l.qty}</span>
                        <Button variant="outline" size="icon-sm" className="h-7 w-7" onClick={() => changeQty(l.product.id, 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-7 w-7 text-destructive"
                        onClick={() => removeLine(l.product.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-border pt-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">{t('pos.discount')}</label>
                      <Input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">{t('pos.paymentMethod')}</label>
                      <Select value={payment} onValueChange={(v) => setPayment(v as PaymentMethod)}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">{t('payment.cash')}</SelectItem>
                          <SelectItem value="card">{t('payment.card')}</SelectItem>
                          <SelectItem value="transfer">{t('payment.transfer')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t('sales.subtotal')}</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-destructive">
                        <span>{t('sales.discount')} ({discountPct}%)</span>
                        <span>− {formatCurrency(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-border pt-1.5 text-base font-bold">
                      <span>{t('pos.total')}</span>
                      <span className="text-primary">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <Button variant="success" className="w-full gap-2" size="lg" onClick={completeSale}>
                    <CheckCircle2 className="h-5 w-5" />
                    {t('pos.completeSale')}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
