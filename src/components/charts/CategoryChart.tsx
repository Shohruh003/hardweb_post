import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { CategorySlice } from '@/lib/analytics'
import type { Category } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface CategoryChartProps {
  data: CategorySlice[]
  categories: Category[]
}

export function CategoryChart({ data, categories }: CategoryChartProps) {
  const catMap = new Map(categories.map((c) => [c.id, c]))
  const chartData = data.map((s) => ({
    name: catMap.get(s.categoryId)?.name ?? '—',
    color: catMap.get(s.categoryId)?.color ?? '#94a3b8',
    value: s.revenue,
  }))

  const total = chartData.reduce((acc, x) => acc + x.value, 0)

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <ResponsiveContainer width="100%" height={220} className="!w-[55%] max-w-[220px]">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            stroke="none"
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 12,
              fontSize: 13,
              color: 'hsl(var(--popover-foreground))',
            }}
            formatter={(value) => formatCurrency(Number(value))}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1 space-y-2 w-full">
        {chartData.slice(0, 6).map((entry, i) => (
          <div key={i} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2 min-w-0">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: entry.color }} />
              <span className="truncate">{entry.name}</span>
            </span>
            <span className="font-medium text-muted-foreground shrink-0">
              {total ? Math.round((entry.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
