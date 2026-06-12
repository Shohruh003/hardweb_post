import type { Branch } from '@/types'

export const branches: Branch[] = [
  {
    id: 'br-1',
    name: 'Chilonzor filiali',
    address: 'Toshkent sh., Chilonzor 9-kvartal, 12-uy',
    phone: '+998 90 123 45 67',
    manager: 'Akmal Tursunov',
    openedAt: '2022-03-15',
    isActive: true,
  },
  {
    id: 'br-2',
    name: 'Yunusobod filiali',
    address: 'Toshkent sh., Yunusobod 4-mavze, 7-uy',
    phone: '+998 90 234 56 78',
    manager: 'Dilnoza Karimova',
    openedAt: '2023-06-01',
    isActive: true,
  },
  {
    id: 'br-3',
    name: 'Samarqand filiali',
    address: 'Samarqand sh., Registon ko‘chasi, 24-uy',
    phone: '+998 91 345 67 89',
    manager: 'Bobur Aliyev',
    openedAt: '2024-11-20',
    isActive: true,
  },
]
