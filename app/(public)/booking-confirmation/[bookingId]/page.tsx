import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format, differenceInDays } from 'date-fns'
import {
  CheckCircle2, Calendar, MapPin, Users, ArrowRight, Building2, Car, Plane
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Booking Confirmed',
  description: 'Your Mlinda Travels booking has been confirmed.',
}

interface ConfirmationPageProps {
  params: Promise<{ bookingId: string }>
}

export default async function BookingConfirmationPage({ params }: ConfirmationPageProps) {
  const { bookingId } = await params
  const supabase = await createClient()

  // Try to find booking by Stripe PaymentIntent ID or booking ID
  let booking: any = null

  // First try by Stripe PI ID (comes from webhook flow)
  const { data: byPI } = await supabase
    .from('bookings')
    .select(`*, hotels(*), room_types(*), cars(*), flights(*, airlines(*), origin:airports!flights_origin_airport_id_fkey(*), destination:airports!flights_destination_airport_id_fkey(*))`)
    .eq('stripe_payment_intent_id', bookingId)
    .single()

  if (byPI) {
    booking = byPI
  } else {
    // Try by booking UUID
    const { data: byId } = await supabase
      .from('bookings')
      .select(`*, hotels(*), room_types(*), cars(*), flights(*, airlines(*), origin:airports!flights_origin_airport_id_fkey(*), destination:airports!flights_destination_airport_id_fkey(*))`)
      .eq('id', bookingId)
      .single()
    booking = byId
  }

  // For demo/dev - show a success page even if webhook hasn't fired yet
  const isProcessing = !booking

  if (!isProcessing && booking?.status === 'cancelled') {
    notFound()
  }

  const itemName = booking?.type === 'hotel'
    ? (booking as any).room_types?.name
    : booking?.type === 'car'
    ? `${(booking as any).cars?.make} ${(booking as any).cars?.model}`
    : booking?.type === 'flight'
    ? `${(booking as any).flights?.airlines?.name} ${(booking as any).flights?.flight_number}`
    : 'Booking'

  const locationName = booking?.type === 'hotel'
    ? (booking as any).hotels?.city
    : booking?.type === 'car'
    ? (booking as any).cars?.location
    : booking?.type === 'flight'
    ? `${(booking as any).flights?.origin?.iata_code} → ${(booking as any).flights?.destination?.iata_code}`
    : '-'

  const nights = booking && booking.type !== 'flight'
    ? differenceInDays(new Date(booking.end_date), new Date(booking.start_date))
    : null

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="container-base py-16">
        <div className="max-w-xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5 ring-8 ring-green-50">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
              {isProcessing ? 'Payment Received!' : 'Booking Confirmed!'}
            </h1>
            <p className="text-muted-foreground">
              {isProcessing
                ? 'Your payment was successful. Your booking confirmation will arrive in your email shortly.'
                : `Your booking reference is `}
              {!isProcessing && booking?.booking_ref && (
                <span className="font-bold text-primary">{booking.booking_ref}</span>
              )}
            </p>
          </div>

          {/* Booking Details Card */}
          {booking && (
            <div className="bg-white rounded-2xl border border-border overflow-hidden mb-6 shadow-sm">
              {/* Header */}
              <div className="bg-primary/5 border-b border-border p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Booking Reference</p>
                    <p className="font-heading font-bold text-xl text-primary">{booking.booking_ref}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  {booking.type === 'hotel' ? (
                    <Building2 className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : booking.type === 'car' ? (
                    <Car className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : (
                    <Plane className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {booking.type === 'hotel' ? 'Room' : booking.type === 'car' ? 'Vehicle' : 'Flight'}
                    </p>
                    <p className="font-semibold text-sm">{itemName ?? 'Your booking'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-semibold text-sm">{locationName ?? '-'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {booking.type === 'hotel' ? 'Check-in → Check-out' : booking.type === 'car' ? 'Pickup → Return' : 'Departure → Arrival'}
                    </p>
                    <p className="font-semibold text-sm">
                      {format(new Date(booking.start_date), 'MMM d, yyyy')} →{' '}
                      {format(new Date(booking.end_date), 'MMM d, yyyy')}
                      {nights && <span className="text-muted-foreground font-normal ml-1">({nights} {booking.type === 'hotel' ? 'nights' : 'days'})</span>}
                    </p>
                  </div>
                </div>

                {booking.guests && (
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {booking.type === 'flight' ? 'Passengers' : 'Guests'}
                      </p>
                      <p className="font-semibold text-sm">{booking.guests} {booking.type === 'flight' ? (booking.guests === 1 ? 'Passenger' : 'Passengers') : (booking.guests === 1 ? 'Guest' : 'Guests')}</p>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <p className="font-semibold">Total Paid</p>
                  <p className="font-heading font-bold text-lg text-primary">${booking.total_price.toFixed(2)} USD</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1 rounded-xl bg-primary hover:bg-[#164d37]">
              <Link href="/account/bookings">
                View My Bookings <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 rounded-xl">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>

          {/* Cancellation note */}
          <p className="text-xs text-muted-foreground text-center mt-6">
            Free cancellation is available up to 24 hours before your{' '}
            {booking?.type === 'hotel' ? 'check-in' : 'pickup'} date.
            Manage your booking from your{' '}
            <Link href="/account/bookings" className="text-primary hover:underline">account</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
