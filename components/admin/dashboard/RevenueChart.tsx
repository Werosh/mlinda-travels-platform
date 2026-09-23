'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, eachDayOfInterval, subDays } from 'date-fns'

interface RevenueChartProps {
  data: { created_at: string; total_price: number; status: string }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  // Aggregate by day for last 7 days
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  })

  const chartData = last7Days.map((day) => {
    const dayStr = format(day, 'yyyy-MM-dd')
    const dayRevenue = data
      .filter((b) => b.created_at.startsWith(dayStr))
      .reduce((sum, b) => sum + b.total_price, 0)
    return {
      date: format(day, 'MMM d'),
      revenue: Math.round(dayRevenue),
    }
  })

  return (
    <div className="bg-white rounded-2xl border border-border p-5">
      <h3 className="font-heading font-semibold text-base mb-5">Revenue (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1F6B4C" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#1F6B4C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E9E6" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fontSize: 12, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            formatter={(value: number) => [`$${value}`, 'Revenue']}
            contentStyle={{ borderRadius: '12px', border: '1px solid #E5E9E6', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#1F6B4C"
            strokeWidth={2.5}
            fill="url(#revenueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
