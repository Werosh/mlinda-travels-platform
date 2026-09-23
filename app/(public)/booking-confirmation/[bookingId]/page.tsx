import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format, differenceInDays } from 'date-fns'
import {
  CheckCircle2, Calendar, MapPin, Users, ArrowRight,
  Building2, Car, Plane, Tag, BookOpen, Home
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Booking Confirmed | Mlinda Travels',
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

  // For demo/dev - show a success page even if booking isn't found yet
  const isProcessing = !booking

  if (!isProcessing && booking?.status === 'cancelled') {
    notFound()
  }

  const flight = booking?.flights
  const isHotel = booking?.type === 'hotel'
  const isCar = booking?.type === 'car'
  const isFlight = booking?.type === 'flight'

  const itemName = isHotel
    ? booking?.room_types?.name
    : isCar
    ? `${booking?.cars?.make ?? ''} ${booking?.cars?.model ?? ''}`.trim()
    : isFlight && flight
    ? `${flight.airlines?.name ?? ''} ${flight.flight_number ?? ''}`.trim()
    : 'Booking'

  const locationName = isHotel
    ? booking?.hotels?.city
    : isCar
    ? booking?.cars?.location
    : isFlight && flight
    ? `${flight.origin?.iata_code ?? ''} → ${flight.destination?.iata_code ?? ''}`
    : '–'

  const nights = booking && !isFlight
    ? differenceInDays(new Date(booking.end_date), new Date(booking.start_date))
    : null

  const dateLabel = isHotel
    ? { start: 'Check-in', end: 'Check-out' }
    : isCar
    ? { start: 'Pickup', end: 'Return' }
    : { start: 'Departure', end: 'Arrival' }

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-b from-green-50/60 to-background">
      <div className="container-base py-16">
        <div className="max-w-xl mx-auto">
          {/* ── Success Header ── */}
          <div className="text-center mb-10">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-green-100 ring-8 ring-green-50 animate-ping opacity-30" />
              <div className="relative w-24 h-24 rounded-full bg-green-100 flex items-center justify-center ring-8 ring-green-50">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
              {isProcessing ? 'Payment Received!' : 'Booking Confirmed!'}
            </h1>
            <p className="text-muted-foreground">
              {isProcessing
                ? 'Your payment was successful. Your booking confirmation will arrive in your email shortly.'
                : (
                  <>
                    Your booking reference is{' '}
                    <span className="font-bold text-primary font-mono">{booking.booking_ref}</span>
                  </>
                )}
            </p>
          </div>

          {/* ── Booking Details Card ── */}
          {booking && (
            <div className="bg-white rounded-2xl border border-border overflow-hidden mb-6 shadow-md">
              {/* Header band */}
              <div className="bg-primary/5 border-b border-border p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Booking Reference</p>
                    <p className="font-heading font-bold text-2xl text-primary font-mono tracking-wider">{booking.booking_ref}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details body */}
              <div className="p-5 space-y-4">
                {/* Type + item */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {isHotel ? (
                      <Building2 className="w-5 h-5 text-primary" />
                    ) : isCar ? (
                      <Car className="w-5 h-5 text-primary" />
                    ) : (
                      <Plane className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {isHotel ? 'Room' : isCar ? 'Vehicle' : 'Flight'}
                    </p>
                    <p className="font-semibold text-sm">{itemName ?? 'Your booking'}</p>
                    {isHotel && booking.hotels?.name && (
                      <p className="text-xs text-muted-foreground">{booking.hotels.name}</p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {isFlight ? 'Route' : 'Location'}
                    </p>
                    <p className="font-semibold text-sm">{locationName ?? '–'}</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {dateLabel.start} → {dateLabel.end}
                    </p>
                    <p className="font-semibold text-sm">
                      {format(new Date(booking.start_date), 'MMM d, yyyy')} →{' '}
                      {format(new Date(booking.end_date), 'MMM d, yyyy')}
                      {nights != null && (
                        <span className="text-muted-foreground font-normal ml-1.5 text-xs">
                          ({nights} {isHotel ? 'nights' : 'days'})
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Guests / Passengers */}
                {booking.guests != null && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {isFlight ? 'Passengers' : 'Guests'}
                      </p>
                      <p className="font-semibold text-sm">
                        {booking.guests}{' '}
                        {isFlight
                          ? (booking.guests === 1 ? 'Passenger' : 'Passengers')
                          : (booking.guests === 1 ? 'Guest' : 'Guests')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Promo code */}
                {booking.promo_code && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                      <Tag className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Promo Applied</p>
                      <p className="font-semibold text-sm text-green-600 font-mono">{booking.promo_code}</p>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Total */}
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Total Paid</p>
                  <p className="font-heading font-bold text-xl text-primary">
                    ${booking.total_price.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">USD</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Actions ── */}
          <div className="space-y-3 mb-8">
            <Button asChild className="w-full h-12 rounded-xl bg-primary hover:bg-[#164d37] font-semibold text-base gap-2" id="view-bookings-cta">
              <Link href="/account/bookings">
                <BookOpen className="w-4 h-4" />
                View All My Bookings
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Link>
            </Button>
            {booking && (
              <Button asChild variant="outline" className="w-full h-11 rounded-xl gap-2">
                <Link href={`/account/bookings/${booking.id}`}>
                  View This Booking Details
                </Link>
              </Button>
            )}
            <Button asChild variant="ghost" className="w-full h-11 rounded-xl text-muted-foreground gap-2">
              <Link href="/">
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* ── Cancellation note ── */}
          <p className="text-xs text-muted-foreground text-center">
            Free cancellation is available up to 24 hours before your{' '}
            {booking?.type === 'hotel' ? 'check-in' : booking?.type === 'flight' ? 'departure' : 'pickup'} date.
            Manage your booking from your{' '}
            <Link href="/account/bookings" className="text-primary hover:underline font-medium">
              Bookings page
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
