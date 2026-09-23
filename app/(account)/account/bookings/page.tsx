import type { Metadata } from 'next'
import Link from 'next/link'
import { format } from 'date-fns'
import { Calendar, Car, Building2, ArrowRight, ArrowLeft, Plane } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { getUserBookings } from '@/lib/services/bookings.service'
import { redirect } from 'next/navigation'
import type { BookingWithDetails } from '@/lib/supabase/types'

export const metadata: Metadata = {
  title: 'My Bookings | Mlinda Travels',
  description: 'View and manage all your past and upcoming trips',
}

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
}

function getBookingDisplay(booking: BookingWithDetails) {
  if (booking.type === 'hotel') {
    return {
      icon: <Building2 className="w-6 h-6 text-primary" />,
      name: (booking as any).room_types?.name || (booking as any).hotels?.name || 'Hotel Booking',
      location: (booking as any).hotels?.city || '–',
    }
  }
  if (booking.type === 'car') {
    return {
      icon: <Car className="w-6 h-6 text-primary" />,
      name: `${(booking as any).cars?.make ?? ''} ${(booking as any).cars?.model ?? ''}`.trim() || 'Car Rental',
      location: (booking as any).cars?.location || '–',
    }
  }
  // flight
  const flight = (booking as any).flights
  const origin = flight?.origin?.iata_code ?? ''
  const destination = flight?.destination?.iata_code ?? ''
  const airline = flight?.airlines?.name ?? ''
  const flightNumber = flight?.flight_number ?? ''
  return {
    icon: <Plane className="w-6 h-6 text-primary" />,
    name: [airline, flightNumber].filter(Boolean).join(' ') || 'Flight',
    location: origin && destination ? `${origin} → ${destination}` : '–',
  }
}

export default async function BookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const bookings = await getUserBookings(user.id)

  const upcoming = bookings.filter(
    (b) => b.status !== 'cancelled' && new Date(b.end_date) >= new Date()
  )
  const past = bookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled' || new Date(b.end_date) < new Date()
  )

  const renderBookingGroup = (title: string, group: typeof bookings) => {
    if (group.length === 0) return null
    return (
      <div className="mb-10">
        <h2 className="font-heading text-xl font-semibold mb-4">{title}</h2>
        <div className="space-y-3">
          {group.map((booking) => {
            const { icon, name, location } = getBookingDisplay(booking)

            return (
              <Link
                key={booking.id}
                href={`/account/bookings/${booking.id}`}
                className="flex items-center gap-4 bg-white rounded-2xl border border-border p-4 hover:border-primary/40 hover:shadow-sm transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base truncate">{name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {location} · {format(new Date(booking.start_date), 'MMM d, yyyy')} → {format(new Date(booking.end_date), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <Badge className={`${statusColors[booking.status]} border-0 text-xs capitalize`}>
                    {booking.status}
                  </Badge>
                  <div className="flex items-center text-sm font-medium text-primary">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container-base py-10">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4 -ml-4 text-muted-foreground hover:text-foreground">
            <Link href="/account">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Account
            </Link>
          </Button>
          <h1 className="font-heading text-3xl font-bold text-foreground">My Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage and view all your travel itineraries</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-12 text-center max-w-xl mx-auto mt-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-heading text-xl font-bold mb-2">No bookings yet</h3>
            <p className="text-muted-foreground mb-8">
              You haven&apos;t made any bookings yet. Start exploring Sri Lanka and plan your next adventure!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild className="rounded-xl w-full sm:w-auto">
                <Link href="/hotels">Find Hotels</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl w-full sm:w-auto">
                <Link href="/cars">Rent a Car</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl w-full sm:w-auto">
                <Link href="/flights">Book a Flight</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl">
            {renderBookingGroup('Upcoming Trips', upcoming)}
            {renderBookingGroup('Past Trips', past)}
          </div>
        )}
      </div>
    </div>
  )
}
