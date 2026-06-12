import type { Product } from '@/types'
import { branches } from './branches'

// Base catalog (name, categoryId, cost, sale, unit) — replicated across branches
const catalog: Array<{
  name: string
  categoryId: string
  cost: number
  sale: number
  unit: Product['unit']
}> = [
  { name: 'Coca-Cola 1.5L', categoryId: 'cat-1', cost: 8000, sale: 12000, unit: 'dona' },
  { name: 'Fanta 1L', categoryId: 'cat-1', cost: 6000, sale: 9000, unit: 'dona' },
  { name: 'Pepsi 0.5L', categoryId: 'cat-1', cost: 4000, sale: 6500, unit: 'dona' },
  { name: 'Suv "Hayot" 1L', categoryId: 'cat-1', cost: 2000, sale: 3500, unit: 'dona' },
  { name: 'Sok "Yummy" 1L', categoryId: 'cat-1', cost: 9000, sale: 14000, unit: 'dona' },
  { name: 'Shokolad "Snickers"', categoryId: 'cat-2', cost: 5000, sale: 8000, unit: 'dona' },
  { name: 'Pechenye "Yubileynoe"', categoryId: 'cat-2', cost: 7000, sale: 11000, unit: 'paket' },
  { name: 'Konfet "Mars"', categoryId: 'cat-2', cost: 4500, sale: 7500, unit: 'dona' },
  { name: 'Vafli "Artek"', categoryId: 'cat-2', cost: 6000, sale: 9500, unit: 'paket' },
  { name: 'Non oddiy', categoryId: 'cat-3', cost: 2500, sale: 4000, unit: 'dona' },
  { name: 'Baton', categoryId: 'cat-3', cost: 3000, sale: 5000, unit: 'dona' },
  { name: 'Lavash non', categoryId: 'cat-3', cost: 2000, sale: 3500, unit: 'dona' },
  { name: 'Sut "Nestle" 1L', categoryId: 'cat-4', cost: 10000, sale: 15000, unit: 'litr' },
  { name: 'Qatiq "Epica" 0.5L', categoryId: 'cat-4', cost: 7000, sale: 11000, unit: 'dona' },
  { name: 'Sariyog‘ 200g', categoryId: 'cat-4', cost: 18000, sale: 26000, unit: 'dona' },
  { name: 'Tvorog 250g', categoryId: 'cat-4', cost: 12000, sale: 18000, unit: 'dona' },
  { name: 'Guruch "Lazer" 1kg', categoryId: 'cat-5', cost: 13000, sale: 19000, unit: 'kg' },
  { name: 'Makaron "Makfa" 450g', categoryId: 'cat-5', cost: 8000, sale: 12000, unit: 'paket' },
  { name: 'Shakar 1kg', categoryId: 'cat-5', cost: 11000, sale: 15000, unit: 'kg' },
  { name: 'Tuz 1kg', categoryId: 'cat-5', cost: 2000, sale: 3500, unit: 'kg' },
  { name: 'O‘simlik yog‘i 1L', categoryId: 'cat-5', cost: 19000, sale: 27000, unit: 'litr' },
  { name: 'Kir yuvish kukuni "Ariel" 3kg', categoryId: 'cat-6', cost: 45000, sale: 62000, unit: 'dona' },
  { name: 'Idish yuvish "Fairy"', categoryId: 'cat-6', cost: 22000, sale: 31000, unit: 'dona' },
  { name: 'Oqartiruvchi "Beloye"', categoryId: 'cat-6', cost: 9000, sale: 14000, unit: 'dona' },
  { name: 'Shampun "Head&Shoulders"', categoryId: 'cat-7', cost: 35000, sale: 49000, unit: 'dona' },
  { name: 'Sovun "Safeguard"', categoryId: 'cat-7', cost: 6000, sale: 9500, unit: 'dona' },
  { name: 'Tish pastasi "Colgate"', categoryId: 'cat-7', cost: 14000, sale: 21000, unit: 'dona' },
  { name: 'Salfetka 100x', categoryId: 'cat-7', cost: 8000, sale: 13000, unit: 'paket' },
  { name: 'Tushonka "Glavprodukt"', categoryId: 'cat-8', cost: 28000, sale: 39000, unit: 'dona' },
  { name: 'Sardina konserva', categoryId: 'cat-8', cost: 16000, sale: 24000, unit: 'dona' },
  { name: 'No‘xat konserva', categoryId: 'cat-8', cost: 9000, sale: 14000, unit: 'dona' },
  { name: 'Makkajo‘xori konserva', categoryId: 'cat-8', cost: 10000, sale: 15500, unit: 'dona' },
]

// Simple seeded PRNG for deterministic stock/sold values
function makeRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function pad(n: number, len = 4) {
  return String(n).padStart(len, '0')
}

export const products: Product[] = (() => {
  const rng = makeRng(42)
  const list: Product[] = []
  let counter = 1

  branches.forEach((branch, bIdx) => {
    // Newer branches stock a subset of the catalog
    const count = bIdx === 0 ? catalog.length : bIdx === 1 ? 26 : 18
    catalog.slice(0, count).forEach((item, i) => {
      const initialStock = Math.floor(rng() * 200) + 40
      const sold = Math.floor(rng() * initialStock * 0.75)
      const stock = initialStock - sold
      list.push({
        id: `pr-${pad(counter)}`,
        name: item.name,
        sku: `SKU-${branch.id.toUpperCase()}-${pad(i + 1, 3)}`,
        categoryId: item.categoryId,
        branchId: branch.id,
        costPrice: item.cost,
        salePrice: item.sale,
        stock,
        initialStock,
        sold,
        unit: item.unit,
        lowStockThreshold: 25,
        createdAt: branch.openedAt,
      })
      counter++
    })
  })

  return list
})()

export function getProductsByBranch(branchId: string | 'all'): Product[] {
  if (branchId === 'all') return products
  return products.filter((p) => p.branchId === branchId)
}
