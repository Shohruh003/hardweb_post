import { Boxes } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useData } from '@/contexts/DataContext'
import { useTranslation } from '@/contexts/LanguageContext'
import { formatCurrency } from '@/lib/utils'
import type { Sale } from '@/types'

interface ReceiptDialogProps {
  sale: Sale | null
  onClose: () => void
}

export function ReceiptDialog({ sale, onClose }: ReceiptDialogProps) {
  const { t } = useTranslation()
  const { branches } = useData()
  if (!sale) return null

  const branch = branches.find((b) => b.id === sale.branchId)

  return (
    <Dialog open={!!sale} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="sr-only">{t('sales.receiptDetails')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Receipt header */}
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
              <Boxes className="h-6 w-6" />
            </div>
            <p className="mt-2 font-bold">HardWeb POS</p>
            <p className="text-xs text-muted-foreground">{branch?.name}</p>
            <p className="text-xs text-muted-foreground">{branch?.address}</p>
          </div>

          <Separator />

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('sales.receipt')}</span>
            <span className="font-semibold">{sale.receiptNo}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('common.date')}</span>
            <span>{new Date(sale.createdAt).toLocaleString('ru-RU')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('sales.cashier')}</span>
            <span>{sale.cashier}</span>
          </div>
          {sale.customer && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t('sales.customer')}</span>
              <span>{sale.customer}</span>
            </div>
          )}

          <Separator />

          {/* Items */}
          <div className="space-y-2">
            {sale.items.map((item, i) => (
              <div key={i} className="flex items-start justify-between gap-2 text-sm">
                <div className="min-w-0">
                  <p className="truncate">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} × {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                <span className="shrink-0 font-medium">{formatCurrency(item.total)}</span>
              </div>
            ))}
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>{t('sales.subtotal')}</span>
              <span>{formatCurrency(sale.subtotal)}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between text-destructive">
                <span>{t('sales.discount')}</span>
                <span>− {formatCurrency(sale.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold">
              <span>{t('sales.total')}</span>
              <span className="text-primary">{formatCurrency(sale.total)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t('sales.payment')}</span>
            <Badge>{t(`payment.${sale.paymentMethod}` as 'payment.cash')}</Badge>
          </div>

          <p className="pt-2 text-center text-xs text-muted-foreground">Rahmat! · Спасибо! · Thank you!</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
