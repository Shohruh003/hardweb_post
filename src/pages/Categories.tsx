import { useMemo } from 'react'
import {
  CupSoda,
  Candy,
  Croissant,
  Milk,
  Wheat,
  SprayCan,
  Sparkles,
  Package,
  type LucideIcon,
} from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { useData } from '@/contexts/DataContext'
import { useTranslation } from '@/contexts/LanguageContext'
import { formatCurrency, formatNumber } from '@/lib/utils'

const iconMap: Record<string, LucideIcon> = {
  CupSoda,
  Candy,
  Croissant,
  Milk,
  Wheat,
  SprayCan,
  Sparkles,
  Package,
}

export function Categories() {
  const { t } = useTranslation()
  const { categories, scopedProducts, scopedSales } = useData()

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

  return (
    <div className="space-y-6">
      <PageHeader title={t('categories.title')} subtitle={t('categories.subtitle')} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {stats.map((c) => {
          const Icon = iconMap[c.icon] ?? Package
          return (
            <Card key={c.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ background: `${c.color}1a`, color: c.color }}
                >
                  <Icon className="h-6 w-6" />
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
    </div>
  )
}
