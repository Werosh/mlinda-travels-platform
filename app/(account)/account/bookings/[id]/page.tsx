import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { format, differenceInDays } from 'date-fns'
import {
  ArrowLeft, Building2, Car, Calendar, MapPin, Receipt,
  Users, Plane, Tag, Clock, Hash
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/server'
import { getBookingById } from '@/lib/services/bookings.service'
import { LeaveReviewDialog } from '@/components/reviews/LeaveReviewDialog'

export const metadata: Metadata = {
  title: 'Booking Details | Mlinda Travels',
  description: 'View your booking details',
}

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
}

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const booking = await getBookingById(id, user.id)

  if (!booking) {
    notFound()
  }

  const isHotel = booking.type === 'hotel'
  const isCar = booking.type === 'car'
  const isFlight = booking.type === 'flight'

  const flight = (booking as any).flights

  const itemName = isHotel
    ? (booking as any).room_types?.name || (booking as any).hotels?.name
    : isCar
    ? `${(booking as any).cars?.make ?? ''} ${(booking as any).cars?.model ?? ''}`.trim()
    : flight
    ? `${flight.airlines?.name ?? ''} ${flight.flight_number ?? ''}`.trim()
    : 'Booking'

  const location = isHotel
    ? (booking as any).hotels?.city
    : isCar
    ? (booking as any).cars?.location
    : isFlight && flight
    ? `${flight.origin?.iata_code ?? ''} → ${flight.destination?.iata_code ?? ''}`
    : '–'

  const nights = !isFlight
    ? differenceInDays(new Date(booking.end_date), new Date(booking.start_date))
    : null

  const dateLabel = isHotel
    ? { start: 'Check-in', end: 'Check-out' }
    : isCar
    ? { start: 'Pickup', end: 'Drop-off' }
    : { start: 'Departure', end: 'Return' }

  // Check if reviewed
  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id')
    .eq('booking_id', id)
    .maybeSingle()

  const hasReviewed = !!existingReview

  // For flights, check arrival_time. For hotels/cars, check end_date.
  let isPast = false
  if (isFlight && flight?.arrival_time) {
    isPast = new Date(flight.arrival_time) < new Date()
  } else {
    isPast = new Date(booking.end_date) < new Date()
  }

  const canReview = booking.status === 'completed' || (booking.status === 'confirmed' && isPast)

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
              <p className="text-muted-foreground mt-1">
                Reference: <span className="font-mono font-medium text-foreground">{booking.booking_ref}</span>
              </p>
            </div>
            <Badge className={`${statusColors[booking.status]} border-0 text-sm px-4 py-1.5 capitalize w-fit`}>
              {booking.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Item summary card */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  {isHotel ? (
                    <Building2 className="w-6 h-6 text-primary" />
                  ) : isCar ? (
                    <Car className="w-6 h-6 text-primary" />
                  ) : (
                    <Plane className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    {isHotel ? 'Hotel Room' : isCar ? 'Car Rental' : 'Flight'}
                  </p>
                  <h2 className="text-xl font-bold font-heading text-foreground">{itemName}</h2>
                  {isHotel && (booking as any).hotels?.name && (
                    <p className="text-muted-foreground text-sm mt-0.5">{(booking as any).hotels.name}</p>
                  )}
                  <div className="flex items-center text-muted-foreground mt-1 gap-1">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{location}</span>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Dates & details grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> {dateLabel.start}
                  </p>
                  <p className="font-medium text-foreground">{format(new Date(booking.start_date), 'MMM d, yyyy')}</p>
                  {isFlight && flight?.departure_time && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {format(new Date(flight.departure_time), 'HH:mm')}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> {dateLabel.end}
                  </p>
                  <p className="font-medium text-foreground">{format(new Date(booking.end_date), 'MMM d, yyyy')}</p>
                  {isFlight && flight?.arrival_time && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {format(new Date(flight.arrival_time), 'HH:mm')}
                    </p>
                  )}
                </div>

                {nights !== null && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Duration
                    </p>
                    <p className="font-medium text-foreground">
                      {nights} {isHotel ? (nights === 1 ? 'night' : 'nights') : (nights === 1 ? 'day' : 'days')}
                    </p>
                  </div>
                )}

                {booking.guests != null && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> {isFlight ? 'Passengers' : 'Guests'}
                    </p>
                    <p className="font-medium text-foreground">
                      {booking.guests} {isFlight
                        ? (booking.guests === 1 ? 'Passenger' : 'Passengers')
                        : (booking.guests === 1 ? 'Guest' : 'Guests')}
                    </p>
                  </div>
                )}

                {isFlight && flight?.duration_minutes && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Flight Duration
                    </p>
                    <p className="font-medium text-foreground">
                      {Math.floor(flight.duration_minutes / 60)}h {flight.duration_minutes % 60}m
                    </p>
                  </div>
                )}

                {isFlight && flight?.stops !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5">
                      <Plane className="w-3.5 h-3.5" /> Stops
                    </p>
                    <p className="font-medium text-foreground">
                      {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                    </p>
                  </div>
                )}
              </div>

              {/* Hotel-specific */}
              {isHotel && (booking as any).hotels?.address && (
                <>
                  <Separator className="my-4" />
                  <p className="text-sm text-muted-foreground flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {(booking as any).hotels.address}, {(booking as any).hotels.city}, {(booking as any).hotels.country}
                  </p>
                </>
              )}

              {/* Car-specific */}
              {isCar && (
                <>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {(booking as any).cars?.category && (
                      <div>
                        <p className="text-muted-foreground">Category</p>
                        <p className="font-medium capitalize">{(booking as any).cars.category}</p>
                      </div>
                    )}
                    {(booking as any).cars?.transmission && (
                      <div>
                        <p className="text-muted-foreground">Transmission</p>
                        <p className="font-medium capitalize">{(booking as any).cars.transmission}</p>
                      </div>
                    )}
                    {(booking as any).cars?.seats && (
                      <div>
                        <p className="text-muted-foreground">Seats</p>
                        <p className="font-medium">{(booking as any).cars.seats} seats</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Special requests */}
            {booking.notes && (
              <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Special Requests / Notes</h3>
                <p className="text-muted-foreground text-sm">{booking.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking reference */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Hash className="w-5 h-5 text-muted-foreground" />
                Booking Reference
              </h3>
              <p className="font-mono text-xl font-bold text-primary tracking-wider">{booking.booking_ref}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Booked on {format(new Date(booking.created_at), 'MMM d, yyyy')}
              </p>
            </div>

            {/* Payment details */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-muted-foreground" />
                Payment Details
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Payment Status</span>
                  <Badge variant="outline" className="capitalize">{booking.payment_status}</Badge>
                </div>

                {booking.promo_code && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" /> Promo Applied
                    </span>
                    <span className="font-mono font-medium text-green-600">{booking.promo_code}</span>
                  </div>
                )}

                {booking.discount_amount != null && booking.discount_amount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount</span>
                    <span>-${booking.discount_amount.toFixed(2)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between items-center font-bold text-base">
                    <span>Total Paid</span>
                    <span className="text-primary">${booking.total_price.toFixed(2)} USD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review */}
            {canReview && (
              <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Rate Your Experience</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Share your thoughts about this {isHotel ? 'hotel' : isCar ? 'car' : 'flight'} to help other travelers.
                </p>
                <LeaveReviewDialog 
                  bookingId={booking.id}
                  type={booking.type}
                  itemId={isHotel ? (booking.hotel_id as string) : isCar ? (booking.car_id as string) : (booking.flight_id as string)}
                  hasReviewed={hasReviewed}
                />
              </div>
            )}

            {/* Help */}
            {booking.status !== 'cancelled' && booking.status !== 'completed' && (
              <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  If you need to change or cancel this booking, please contact our support team.
                </p>
                <Button asChild variant="outline" className="w-full rounded-xl">
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
