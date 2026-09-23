import { format } from 'date-fns'
import { Building2, Car } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

interface ActivityFeedProps {
  bookings: {
    id: string
    booking_ref: string
    type: string
    status: string
    total_price: number
    created_at: string
    profiles?: { full_name: string | null } | null
    hotels?: { name: string } | null
    cars?: { make: string; model: string } | null
  }[]
}

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
}

export function ActivityFeed({ bookings }: ActivityFeedProps) {
  return (
    <div className="bg-white rounded-2xl border border-border p-5 h-full">
      <h3 className="font-heading font-semibold text-base mb-4">Recent Bookings</h3>
      <div className="space-y-3 overflow-y-auto max-h-[300px] no-scrollbar">
        {bookings.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No bookings yet</p>
        ) : (
          bookings.map((booking) => {
            const itemName = booking.type === 'hotel'
              ? booking.hotels?.name
              : `${booking.cars?.make} ${booking.cars?.model}`
            return (
              <Link
                key={booking.id}
                href={`/admin/bookings/${booking.id}`}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {booking.type === 'hotel' ? (
                    <Building2 className="w-4 h-4 text-primary" />
                  ) : (
                    <Car className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold truncate">{booking.booking_ref}</p>
                    <Badge className={`${statusColors[booking.status] ?? 'bg-muted text-muted-foreground'} border-0 text-[10px] px-1.5 py-0.5 capitalize flex-shrink-0`}>
                      {booking.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{itemName}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                      {booking.profiles?.full_name ?? 'Guest'}
                    </p>
                    <p className="text-xs font-medium text-foreground">${booking.total_price.toFixed(0)}</p>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
