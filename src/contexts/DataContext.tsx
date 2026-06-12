import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Branch, Category, Product, Sale } from '@/types'
import {
  branches as seedBranches,
  categories as seedCategories,
  products as seedProducts,
  sales as seedSales,
} from '@/data'

export type BranchFilter = string | 'all'

interface DataContextValue {
  // raw collections
  branches: Branch[]
  categories: Category[]
  products: Product[]
  sales: Sale[]

  // current branch selection
  currentBranch: BranchFilter
  setCurrentBranch: (b: BranchFilter) => void

  // branch-scoped views
  scopedProducts: Product[]
  scopedSales: Sale[]

  // mutations
  addProduct: (p: Product) => void
  updateProduct: (p: Product) => void
  deleteProduct: (id: string) => void
  addBranch: (b: Branch) => void
  updateBranch: (b: Branch) => void
  deleteBranch: (id: string) => void
  recordSale: (s: Sale) => void
}

const DataContext = createContext<DataContextValue | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [branches, setBranches] = useState<Branch[]>(seedBranches)
  const [categories] = useState<Category[]>(seedCategories)
  const [products, setProducts] = useState<Product[]>(seedProducts)
  const [sales, setSales] = useState<Sale[]>(seedSales)
  const [currentBranch, setCurrentBranch] = useState<BranchFilter>('all')

  const scopedProducts = useMemo(
    () => (currentBranch === 'all' ? products : products.filter((p) => p.branchId === currentBranch)),
    [products, currentBranch]
  )
  const scopedSales = useMemo(
    () => (currentBranch === 'all' ? sales : sales.filter((s) => s.branchId === currentBranch)),
    [sales, currentBranch]
  )

  const value: DataContextValue = {
    branches,
    categories,
    products,
    sales,
    currentBranch,
    setCurrentBranch,
    scopedProducts,
    scopedSales,
    addProduct: (p) => setProducts((prev) => [p, ...prev]),
    updateProduct: (p) => setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x))),
    deleteProduct: (id) => setProducts((prev) => prev.filter((x) => x.id !== id)),
    addBranch: (b) => setBranches((prev) => [...prev, b]),
    updateBranch: (b) => setBranches((prev) => prev.map((x) => (x.id === b.id ? b : x))),
    deleteBranch: (id) => setBranches((prev) => prev.filter((x) => x.id !== id)),
    recordSale: (s) => {
      setSales((prev) => [s, ...prev])
      // decrement stock / bump sold
      setProducts((prev) =>
        prev.map((p) => {
          const line = s.items.find((i) => i.productId === p.id)
          if (!line) return p
          return { ...p, stock: Math.max(0, p.stock - line.quantity), sold: p.sold + line.quantity }
        })
      )
    },
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
