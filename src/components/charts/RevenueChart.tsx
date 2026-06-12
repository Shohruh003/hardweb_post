import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DailyPoint } from '@/lib/analytics'
import { formatCompact, formatCurrency } from '@/lib/utils'
import { useTranslation } from '@/contexts/LanguageContext'

export function RevenueChart({ data }: { data: DailyPoint[] }) {
  const { t } = useTranslation()
  // Thin out x-axis labels when there are many points
  const interval = data.length > 31 ? Math.floor(data.length / 12) : data.length > 14 ? 2 : 0

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" vertical={false} />
        <XAxis
          dataKey="label"
          interval={interval}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickFormatter={(v) => formatCompact(v as number)}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickLine={false}
          axisLine={false}
          width={48}
        />
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 12,
            fontSize: 13,
            color: 'hsl(var(--popover-foreground))',
          }}
          formatter={(value, name) => [
            formatCurrency(Number(value)),
            name === 'revenue' ? t('kpi.revenue') : t('kpi.profit'),
          ]}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#revGrad)"
        />
        <Area
          type="monotone"
          dataKey="profit"
          stroke="#22c55e"
          strokeWidth={2}
          fill="url(#profitGrad)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
