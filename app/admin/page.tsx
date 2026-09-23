import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { format, subDays } from 'date-fns'
import {
  BookOpen, DollarSign, Users, Building2, TrendingUp, CheckCircle
} from 'lucide-react'
import { StatCard } from '@/components/admin/dashboard/StatCard'
import { RevenueChart } from '@/components/admin/dashboard/RevenueChart'
import { ActivityFeed } from '@/components/admin/dashboard/ActivityFeed'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Mlinda Travels administration dashboard',
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const today = format(new Date(), 'yyyy-MM-dd')
  const weekAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd')

  const [
    { count: totalBookings },
    { count: todayBookings },
    { count: totalUsers },
    { count: pendingReviews },
    { data: recentBookings },
    { data: revenueData },
  ] = await (Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${today}T00:00:00`),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('is_approved', false),
    supabase
      .from('bookings')
      .select('*, profiles(full_name), hotels(name), cars(make, model)')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('bookings')
      .select('created_at, total_price, status')
      .gte('created_at', `${weekAgo}T00:00:00`)
      .eq('status', 'confirmed'),
  ]) as unknown as Promise<[
    { count: number | null },
    { count: number | null },
    { count: number | null },
    { count: number | null },
    { data: any[] | null },
    { data: any[] | null }
  ]>)

  // Calculate revenue
  const totalRevenue = revenueData?.reduce((sum, b) => sum + (b.total_price ?? 0), 0) ?? 0
  const todayRevenue = revenueData
    ?.filter((b) => b.created_at.startsWith(today))
    .reduce((sum, b) => sum + (b.total_price ?? 0), 0) ?? 0

  const stats = [
    {
      label: 'Total Bookings',
      value: String(totalBookings ?? 0),
      sub: `${todayBookings ?? 0} today`,
      icon: BookOpen,
      trend: '+12%',
    },
    {
      label: 'Revenue (7d)',
      value: `$${totalRevenue.toFixed(0)}`,
      sub: `$${todayRevenue.toFixed(0)} today`,
      icon: DollarSign,
      trend: '+8%',
    },
    {
      label: 'Total Users',
      value: String(totalUsers ?? 0),
      sub: 'Registered accounts',
      icon: Users,
      trend: '+5%',
    },
    {
      label: 'Pending Reviews',
      value: String(pendingReviews ?? 0),
      sub: 'Awaiting approval',
      icon: CheckCircle,
      trend: null,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome to the Mlinda Travels admin panel</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RevenueChart data={revenueData ?? []} />
        </div>
        <div>
          <ActivityFeed bookings={recentBookings ?? []} />
        </div>
      </div>
    </div>
  )
}

