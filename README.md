# HardWeb POS — Do'kon boshqaruv tizimi

Do'kon egasi uchun **POS (kassa) + Admin panel** tizimi. Mahsulotlar, sotuvlar, omborni nazorat qilish, sana bo'yicha hisobotlar va ko'p filialli (multi-branch) boshqaruv.

> ⚙️ Hozircha **faqat frontend + mock data** (prezentatsiya uchun). Backend keyinroq qo'shiladi.

---

## ✨ Imkoniyatlar

- 📊 **Dashboard** — tushum, foyda, sotuvlar soni, sotilgan mahsulotlar KPI'lari (o'tgan davrga nisbatan o'zgarish bilan), grafiklar
- 🧾 **POS (Kassa)** — mahsulot tanlash, savatcha, chegirma, to'lov usuli, sotuvni yakunlash (qoldiq avtomatik kamayadi)
- 📦 **Mahsulotlar** — ro'yxat, qidiruv, kategoriya/holat filtri, qoldiq nazorati, qo'shish/tahrirlash/o'chirish
- 🧮 **Sotuvlar tarixi** — sana oralig'i filtri, to'lov filtri, chek (receipt) ko'rinishi
- 🏪 **Filiallar** — ko'p filialli boshqaruv, yangi filial qo'shish (masshtablanadi)
- 🗂 **Kategoriyalar** — har bir kategoriya bo'yicha mahsulot soni va tushum
- 📈 **Hisobotlar** — kengaytirilgan analitika + CSV eksport
- 🎨 **2 ta mavzu** — yorug' / qorong'i (light/dark)
- 🌐 **4 til** — O'zbek lotin, O'zbek krill, Rus, Ingliz
- 📅 **Sana filtrlari** — bugun, kecha, 7/30/90 kun, oy, maxsus oraliq (dan–gacha)

---

## 🛠 Texnologiyalar

| Qatlam | Texnologiya |
|--------|-------------|
| Build | Vite |
| Til | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS + shadcn/ui (Radix) |
| Grafiklar | Recharts |
| Routing | React Router |
| Ikonkalar | Lucide React |

---

## 🚀 Ishga tushirish

```bash
npm install      # bog'liqliklarni o'rnatish
npm run dev      # dev server (http://localhost:5173)
npm run build    # production build
npm run preview  # build natijasini ko'rish
```

---

## 📁 Struktura

```
src/
├── components/
│   ├── ui/         # shadcn/ui primitivlari (button, card, dialog, ...)
│   ├── layout/     # Sidebar, Header, Layout
│   ├── shared/     # StatCard, DateRangeFilter, switcherlar, ...
│   ├── charts/     # Recharts grafiklari
│   ├── products/   # ProductDialog
│   ├── branches/   # BranchDialog
│   └── sales/      # ReceiptDialog
├── contexts/       # Theme, Language, Data (markaziy holat)
├── data/           # mock data (branches, categories, products, sales)
├── i18n/           # 4 til tarjimalari
├── lib/            # analytics, dateRanges, utils
├── hooks/          # useDateRange
├── pages/          # Dashboard, POS, Products, Sales, Categories, Branches, Reports, Settings
└── types/          # TypeScript tiplari
```

---

## 🔮 Keyingi bosqich (backend)

Markaziy `DataContext` API'ga ulanishga tayyor: REST/GraphQL + React Query qo'shilsa, mock datalar real backend bilan almashtiriladi.
