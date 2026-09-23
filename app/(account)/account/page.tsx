import type { Metadata } from 'next'
import Link from 'next/link'
import { format } from 'date-fns'
import { Calendar, Car, Building2, ArrowRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { getUserBookings } from '@/lib/services/bookings.service'

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Manage your bookings and profile',
}

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [profile, bookings] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single().then((r) => r.data as any),
    getUserBookings(user.id),
  ])

  const upcoming = bookings.filter(
    (b) => b.status !== 'cancelled' && new Date(b.end_date) >= new Date()
  )
  const past = bookings.filter(
    (b) => b.status === 'completed' || new Date(b.end_date) < new Date()
  )

  return (
    <div className="bg-background min-h-screen">
      <div className="container-base py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-1">
            Welcome back, {profile?.full_name?.split(' ')[0] ?? 'Traveller'} 👋
          </h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Bookings', value: bookings.length, icon: Calendar },
            { label: 'Upcoming', value: upcoming.length, icon: Clock },
            { label: 'Hotels Booked', value: bookings.filter((b) => b.type === 'hotel').length, icon: Building2 },
            { label: 'Cars Rented', value: bookings.filter((b) => b.type === 'car').length, icon: Car },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-border p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-heading font-bold text-2xl text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Bookings */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl font-semibold">Upcoming Trips</h2>
            <Button asChild variant="ghost" size="sm" className="text-primary">
              <Link href="/account/bookings">View all <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>

          {upcoming.length === 0 ? (
            <div className="bg-white rounded-2xl border border-border p-10 text-center">
              <p className="text-muted-foreground mb-4">No upcoming trips. Time to plan your next adventure!</p>
              <Button asChild className="rounded-xl bg-primary hover:bg-[#164d37]">
                <Link href="/hotels">Browse Hotels</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.slice(0, 3).map((booking) => {
                const isHotel = booking.type === 'hotel'
                const itemName = isHotel
                  ? (booking as any).room_types?.name
                  : `${(booking as any).cars?.make} ${(booking as any).cars?.model}`
                const location = isHotel
                  ? (booking as any).hotels?.city
                  : (booking as any).cars?.location

                return (
                  <Link
                    key={booking.id}
                    href={`/account/bookings/${booking.id}`}
                    className="flex items-center gap-4 bg-white rounded-2xl border border-border p-4 hover:border-primary/40 hover:shadow-sm transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {isHotel ? (
                        <Building2 className="w-5 h-5 text-primary" />
                      ) : (
                        <Car className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{itemName ?? 'Booking'}</p>
                      <p className="text-xs text-muted-foreground">{location} · {format(new Date(booking.start_date), 'MMM d')} → {format(new Date(booking.end_date), 'MMM d, yyyy')}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Badge className={`${statusColors[booking.status]} border-0 text-xs capitalize`}>
                        {booking.status}
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Find Hotels', href: '/hotels', icon: Building2, desc: 'Search available hotels' },
            { label: 'Rent a Car', href: '/cars', icon: Car, desc: 'Browse vehicle options' },
            { label: 'Edit Profile', href: '/account/profile', icon: Calendar, desc: 'Update your details' },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="bg-white rounded-2xl border border-border p-5 hover:border-primary/40 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                <action.icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
              </div>
              <p className="font-semibold text-sm">{action.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
