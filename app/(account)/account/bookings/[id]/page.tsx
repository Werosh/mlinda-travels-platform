import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { format } from 'date-fns'
import { ArrowLeft, Building2, Car, Calendar, MapPin, CreditCard, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { getBookingById } from '@/lib/services/bookings.service'

export const metadata: Metadata = {
  title: 'Booking Details',
  description: 'View your booking details',
}

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
}

export default async function BookingDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  const booking = await getBookingById(params.id, user.id)

  if (!booking) {
    notFound()
  }

  const isHotel = booking.type === 'hotel'
  const itemName = isHotel
    ? (booking as any).room_types?.name || (booking as any).hotels?.name
    : `${(booking as any).cars?.make} ${(booking as any).cars?.model}`
  const location = isHotel
    ? (booking as any).hotels?.city
    : (booking as any).cars?.location

  return (
    <div className="bg-background min-h-screen">
      <div className="container-base py-10">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4 -ml-4 text-muted-foreground hover:text-foreground">
            <Link href="/account/bookings">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Bookings
            </Link>
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold text-foreground">Booking Details</h1>
              <p className="text-muted-foreground mt-1">Reference: <span className="font-mono font-medium text-foreground">{booking.booking_ref}</span></p>
            </div>
            <Badge className={`${statusColors[booking.status]} border-0 text-sm px-4 py-1.5 capitalize`}>
              {booking.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  {isHotel ? (
                    <Building2 className="w-6 h-6 text-primary" />
                  ) : (
                    <Car className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold font-heading text-foreground">{itemName}</h2>
                  <div className="flex items-center text-muted-foreground mt-1 gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Check-in / Pick-up</p>
                  <p className="font-medium text-foreground">{format(new Date(booking.start_date), 'MMM d, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Check-out / Drop-off</p>
                  <p className="font-medium text-foreground">{format(new Date(booking.end_date), 'MMM d, yyyy')}</p>
                </div>
                {booking.guests && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Guests</p>
                    <p className="font-medium text-foreground">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</p>
                  </div>
                )}
              </div>
            </div>

            {booking.notes && (
              <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Special Requests / Notes</h3>
                <p className="text-muted-foreground text-sm">{booking.notes}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-muted-foreground" />
                Payment Details
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className="capitalize">{booking.payment_status}</Badge>
                </div>
                
                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between items-center font-bold text-base">
                    <span>Total Paid</span>
                    <span>${booking.total_price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {booking.status !== 'cancelled' && booking.status !== 'completed' && (
               <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                  <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">If you need to change or cancel this booking, please contact support.</p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/contact">Contact Support</Link>
                  </Button>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
