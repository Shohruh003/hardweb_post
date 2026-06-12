export type Locale = 'uz-latn' | 'uz-cyrl' | 'ru' | 'en'
export type Theme = 'light' | 'dark'

export interface Branch {
  id: string
  name: string
  address: string
  phone: string
  manager: string
  openedAt: string // ISO date
  isActive: boolean
}

export interface Category {
  id: string
  name: string
  icon: string // lucide icon name
  color: string // hex / tailwind token
}

export interface Product {
  id: string
  name: string
  sku: string
  categoryId: string
  branchId: string
  costPrice: number // tannarx
  salePrice: number // sotuv narxi
  stock: number // qoldiq
  initialStock: number // boshlang'ich kirim
  sold: number // sotilgan soni
  unit: 'dona' | 'kg' | 'litr' | 'metr' | 'paket'
  lowStockThreshold: number
  createdAt: string
  image?: string
}

export type PaymentMethod = 'cash' | 'card' | 'transfer'

export interface SaleItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Sale {
  id: string
  receiptNo: string
  branchId: string
  items: SaleItem[]
  subtotal: number
  discount: number
  total: number
  profit: number
  paymentMethod: PaymentMethod
  cashier: string
  customer?: string
  createdAt: string // ISO datetime
}

export interface KPISnapshot {
  revenue: number
  profit: number
  salesCount: number
  itemsSold: number
  revenueChange: number // % vs previous period
  profitChange: number
  salesChange: number
  itemsChange: number
}

export interface DateRange {
  from: Date | null
  to: Date | null
}
