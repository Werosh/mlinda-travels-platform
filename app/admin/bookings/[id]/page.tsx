'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import {
  ArrowLeft, Building2, Car, Plane, MapPin, Calendar, 
  Receipt, Users, Clock, Hash, AlertTriangle, CheckCircle, XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import { adminCancelBooking, adminCompleteBooking } from '@/app/actions/admin-bookings'

const statusColors: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
}

export default function AdminBookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const supabase = createClient()

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    async function loadBooking() {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          hotels (*),
          room_types (*),
          cars (*),
          flights (
            *,
            airlines (*),
            origin:airports!flights_origin_airport_id_fkey (*),
            destination:airports!flights_destination_airport_id_fkey (*)
          ),
          profiles (full_name, phone, email)
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error(error)
      } else {
        setBooking(data)
      }
      setLoading(false)
    }

    loadBooking()
  }, [id, supabase])

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading booking details...</div>
  }

  if (!booking) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Booking Not Found</h2>
        <Button asChild variant="outline">
          <Link href="/admin/bookings">Back to Bookings</Link>
        </Button>
      </div>
    )
  }

  const isHotel = booking.type === 'hotel'
  const isCar = booking.type === 'car'
  const isFlight = booking.type === 'flight'
  const flight = booking.flights

  const itemName = isHotel
    ? booking.room_types?.name || booking.hotels?.name
    : isCar
    ? `${booking.cars?.make ?? ''} ${booking.cars?.model ?? ''}`.trim()
    : flight
    ? `${flight.airlines?.name ?? ''} ${flight.flight_number ?? ''}`.trim()
    : 'Booking'

  const location = isHotel
    ? booking.hotels?.city
    : isCar
    ? booking.cars?.location
    : isFlight && flight
    ? `${flight.origin?.iata_code ?? ''} → ${flight.destination?.iata_code ?? ''}`
    : '–'

  const dateLabel = isHotel
    ? { start: 'Check-in', end: 'Check-out' }
    : isCar
    ? { start: 'Pickup', end: 'Drop-off' }
    : { start: 'Departure', end: 'Return' }

  async function handleCancel() {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return
    setActionLoading(true)
    try {
      await adminCancelBooking(booking.id)
      router.refresh()
      // Reload local state
      setBooking({ ...booking, status: 'cancelled' })
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to cancel booking')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleComplete() {
    if (!confirm('Mark this booking as completed?')) return
    setActionLoading(true)
    try {
      await adminCompleteBooking(booking.id)
      router.refresh()
      setBooking({ ...booking, status: 'completed' })
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to complete booking')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button asChild variant="ghost" className="mb-2 -ml-4 text-muted-foreground hover:text-foreground">
            <Link href="/admin/bookings">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Bookings
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-heading">Booking {booking.booking_ref}</h1>
            <Badge className={`${statusColors[booking.status]} border-0 uppercase`}>
              {booking.status}
            </Badge>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="flex gap-2">
          {booking.status !== 'cancelled' && booking.status !== 'completed' && (
            <>
              <Button 
                variant="outline" 
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleCancel}
                disabled={actionLoading}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancel Booking
              </Button>
              <Button 
                variant="outline" 
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                onClick={handleComplete}
                disabled={actionLoading}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Completed
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Details */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                {isHotel ? <Building2 className="w-6 h-6 text-primary" /> : isCar ? <Car className="w-6 h-6 text-primary" /> : <Plane className="w-6 h-6 text-primary" />}
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  {isHotel ? 'Hotel Room' : isCar ? 'Car Rental' : 'Flight'}
                </p>
                <h2 className="text-xl font-bold font-heading text-foreground">{itemName}</h2>
                <div className="flex items-center text-muted-foreground mt-1 gap-1">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{location}</span>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{dateLabel.start}</p>
                <p className="font-medium">{format(new Date(booking.start_date), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{dateLabel.end}</p>
                <p className="font-medium">{format(new Date(booking.end_date), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Guests/Pass.</p>
                <p className="font-medium">{booking.guests || 1}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Price</p>
                <p className="font-medium">${booking.total_price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              Customer Details
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{booking.profiles?.full_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{booking.profiles?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">{booking.profiles?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-muted-foreground" />
              Payment Status
            </h3>
            <Badge variant="outline" className="capitalize text-sm px-3 py-1">
              {booking.payment_status}
            </Badge>
            {booking.stripe_payment_intent_id && (
              <div className="mt-4 text-xs text-muted-foreground break-all">
                <span className="font-semibold">Stripe ID:</span> <br/>
                {booking.stripe_payment_intent_id}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
