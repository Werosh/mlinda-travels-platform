import type { Metadata } from 'next'
import Link from 'next/link'
import { format } from 'date-fns'
import { Filter, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Bookings - Admin' }

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
}

interface AdminBookingsPageProps {
  searchParams: Promise<{ status?: string; type?: string; page?: string }>
}

export default async function AdminBookingsPage({ searchParams }: AdminBookingsPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('bookings')
    .select(`
      *,
      profiles (full_name, phone),
      hotels (name, city),
      cars (make, model)
    `, { count: 'exact' })
    .order('created_at', { ascending: false })

  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status)
  }
  if (params.type && params.type !== 'all') {
    query = query.eq('type', params.type)
  }

  const { data: bookingsRaw, count } = await query.limit(25)
  const bookings = bookingsRaw as any[] | null

  const statuses = ['all', 'confirmed', 'pending', 'cancelled', 'completed']

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Bookings</h1>
          <p className="text-muted-foreground text-sm">{count ?? 0} total bookings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1">
          {statuses.map((s) => (
            <Link
              key={s}
              href={`/admin/bookings${s !== 'all' ? `?status=${s}` : ''}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors ${(params.status ?? 'all') === s
                  ? 'bg-primary text-white'
                  : 'bg-white border border-border text-muted-foreground hover:border-primary hover:text-primary'
                }`}
            >
              {s}
            </Link>
          ))}
        </div>
        <div className="flex gap-1 ml-auto">
          <Link
            href="/admin/bookings?type=hotel"
            className={`px-3 py-1.5 rounded-xl text-xs border ${params.type === 'hotel' ? 'bg-primary text-white border-primary' : 'bg-white border-border text-muted-foreground'}`}
          >Hotel</Link>
          <Link
            href="/admin/bookings?type=car"
            className={`px-3 py-1.5 rounded-xl text-xs border ${params.type === 'car' ? 'bg-primary text-white border-primary' : 'bg-white border-border text-muted-foreground'}`}
          >Car</Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Bookings table">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Ref</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Guest</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Item</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Dates</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Total</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings?.map((booking) => {
                const itemName = booking.type === 'hotel'
                  ? (booking as any).hotels?.name
                  : `${(booking as any).cars?.make} ${(booking as any).cars?.model}`
                const guestName = (booking as any).profiles?.full_name

                return (
                  <tr key={booking.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-mono text-xs font-medium text-primary">{booking.booking_ref}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-sm">{guestName ?? 'Guest'}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm">{itemName ?? '-'}</p>
                      <p className="text-xs text-muted-foreground capitalize">{booking.type}</p>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground text-xs">
                      {format(new Date(booking.start_date), 'MMM d')} → {format(new Date(booking.end_date), 'MMM d, yy')}
                    </td>
                    <td className="px-5 py-4 font-semibold">${booking.total_price.toFixed(0)}</td>
                    <td className="px-5 py-4">
                      <Badge className={`border-0 text-xs capitalize ${statusColors[booking.status]}`}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/admin/bookings/${booking.id}`}>
                        <Button size="sm" variant="outline" className="rounded-lg h-8 text-xs">
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
