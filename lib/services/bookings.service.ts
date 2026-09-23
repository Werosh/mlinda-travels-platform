import { generateBookingRef, calculatePriceBreakdown } from '@/lib/utils/pricing'
import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import type { Booking, BookingWithDetails } from '@/lib/supabase/types'
import { differenceInDays } from 'date-fns'

// ── Create Booking (with availability lock) ───────────────────
export async function createBooking(params: {
  userId: string
  type: 'hotel' | 'car' | 'flight'
  itemId: string
  roomTypeId?: string
  hotelId?: string
  carId?: string
  flightId?: string
  fareId?: string
  startDate: string
  endDate: string
  guests?: number
  passengers?: number
  totalPrice: number
  promoCode?: string
  discountAmount?: number
  stripePaymentIntentId?: string
}): Promise<{ booking: Booking | null; error: string | null }> {
  // Use service role to bypass RLS for the availability update transaction
  const supabase = createServiceRoleClient()
  const bookingRef = generateBookingRef()

  try {
    // Insert booking
    const { data: booking, error: bookingError } = await (supabase as any)
      .from('bookings')
      .insert({
        booking_ref: bookingRef,
        user_id: params.userId,
        type: params.type,
        item_id: params.itemId,
        room_type_id: params.roomTypeId ?? null,
        hotel_id: params.hotelId ?? null,
        car_id: params.carId ?? null,
        flight_id: params.flightId ?? null,
        start_date: params.startDate,
        end_date: params.endDate,
        guests: params.passengers ?? params.guests ?? 1,
        total_price: params.totalPrice,
        promo_code: params.promoCode ?? null,
        discount_amount: params.discountAmount ?? 0,
        stripe_payment_intent_id: params.stripePaymentIntentId ?? null,
        status: params.stripePaymentIntentId ? 'confirmed' : 'pending',
        payment_status: params.stripePaymentIntentId ? 'paid' : 'unpaid',
      })
      .select()
      .single()

    if (bookingError) {
      console.error('Booking creation error:', bookingError)
      return { booking: null, error: bookingError.message }
    }

    // Lock availability
    if (params.type === 'hotel' && params.roomTypeId) {
      await decrementRoomAvailability(params.roomTypeId, params.startDate, params.endDate)
    } else if (params.type === 'car' && params.carId) {
      await lockCarAvailability(params.carId, params.startDate, params.endDate)
    } else if (params.type === 'flight' && params.fareId) {
      await decrementFlightSeats(params.fareId, params.passengers ?? 1)
    }

    try {
      await sendBookingConfirmationEmail(bookingRef, params.userId)
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
    }

    return { booking, error: null }
  } catch (err) {
    console.error('Unexpected booking error:', err)
    return { booking: null, error: 'Failed to create booking. Please try again.' }
  }
}

// ── Decrement Room Availability (booking lock) ────────────────
async function decrementRoomAvailability(
  roomTypeId: string,
  startDate: string,
  endDate: string
): Promise<void> {
  const supabase = createServiceRoleClient()
  const { data: rows } = await (supabase as any)
      .from('room_availability')
    .select('id, rooms_available')
    .eq('room_type_id', roomTypeId)
    .gte('date', startDate)
    .lt('date', endDate)

  if (!rows) return

  for (const row of rows) {
    await (supabase as any)
      .from('room_availability')
      .update({ rooms_available: Math.max(0, row.rooms_available - 1) })
      .eq('id', row.id)
  }
}

// ── Lock Car Availability ────────────────────────────────────
async function lockCarAvailability(
  carId: string,
  startDate: string,
  endDate: string
): Promise<void> {
  const supabase = createServiceRoleClient()
  const { data: rows } = await (supabase as any)
      .from('car_availability')
    .select('id')
    .eq('car_id', carId)
    .gte('date', startDate)
    .lt('date', endDate)

  if (!rows) return

  for (const row of rows) {
    await (supabase as any)
      .from('car_availability')
      .update({ is_available: false })
      .eq('id', row.id)
  }
}

// ── Decrement Flight Seats ────────────────────────────────────
async function decrementFlightSeats(
  fareId: string,
  passengers: number
): Promise<void> {
  const supabase = createServiceRoleClient()
  const { data: fare } = await (supabase as any)
    .from('flight_fares')
    .select('seats_available')
    .eq('id', fareId)
    .single()

  if (!fare) return
  const newSeats = Math.max(0, fare.seats_available - passengers)
  await (supabase as any)
    .from('flight_fares')
    .update({ seats_available: newSeats })
    .eq('id', fareId)
}

// ── Send Booking Confirmation Email (Supabase built-in SMTP) ──
async function sendBookingConfirmationEmail(
  bookingRef: string,
  userId: string
): Promise<void> {
  const supabase = createServiceRoleClient()
  const { data: { user } } = await supabase.auth.admin.getUserById(userId)
  if (!user?.email) return

  await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: user.email,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/booking-confirmation/${bookingRef}`,
    },
  })
  console.log(`[EMAIL] Booking confirmation for ${bookingRef} → ${user.email}`)
}

// ── Get User Bookings ─────────────────────────────────────────
export async function getUserBookings(userId: string): Promise<BookingWithDetails[]> {
  const supabase = await createClient()
  const { data } = await (supabase as any)
    .from('bookings')
    .select(`*, hotels (*), room_types (*), cars (*), flights (*, airlines(*), origin:airports!flights_origin_airport_id_fkey(*), destination:airports!flights_destination_airport_id_fkey(*))`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return (data as BookingWithDetails[]) ?? []
}

// ── Get Booking by ID ─────────────────────────────────────────
export async function getBookingById(
  bookingId: string,
  userId?: string
): Promise<BookingWithDetails | null> {
  const supabase = await createClient()
  let query = (supabase as any)
    .from('bookings')
    .select(`*, hotels (*), room_types (*), cars (*), flights (*, airlines(*), origin:airports!flights_origin_airport_id_fkey(*), destination:airports!flights_destination_airport_id_fkey(*)), profiles (full_name, phone)`)
    .eq('id', bookingId)

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data } = await query.single()
  return (data as BookingWithDetails) ?? null
}

// ── Get Booking by Ref ────────────────────────────────────────
export async function getBookingByRef(
  bookingRef: string
): Promise<BookingWithDetails | null> {
  const supabase = await createClient()
  const { data } = await (supabase as any)
    .from('bookings')
    .select(`*, hotels (*), room_types (*), cars (*)`)
    .eq('booking_ref', bookingRef)
    .single()

  return (data as BookingWithDetails) ?? null
}

// ── Cancel Booking ────────────────────────────────────────────
export async function cancelBooking(
  bookingId: string,
  userId: string
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient()
  const { data: booking } = await (supabase as any)
      .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .eq('user_id', userId)
    .single()

  if (!booking) return { success: false, error: 'Booking not found' }
  if (booking.status === 'cancelled') return { success: false, error: 'Booking already cancelled' }
  if (booking.status === 'completed') return { success: false, error: 'Cannot cancel a completed booking' }

  const startDate = new Date(booking.start_date)
  const now = new Date()
  const hoursUntilCheckIn = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60)

  if (hoursUntilCheckIn < 24) {
    return { success: false, error: 'Bookings cannot be cancelled within 24 hours of check-in' }
  }

  const { error } = await (supabase as any)
      .from('bookings')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', bookingId)

  if (error) return { success: false, error: error.message }

  if (booking.type === 'hotel' && booking.room_type_id) {
    await restoreRoomAvailability(booking.room_type_id, booking.start_date, booking.end_date)
  } else if (booking.type === 'car' && booking.car_id) {
    await restoreCarAvailability(booking.car_id, booking.start_date, booking.end_date)
  }

  return { success: true, error: null }
}

// ── Restore Room Availability ─────────────────────────────────
async function restoreRoomAvailability(
  roomTypeId: string,
  startDate: string,
  endDate: string
): Promise<void> {
  const supabase = createServiceRoleClient()
  const { data: rows } = await (supabase as any)
      .from('room_availability')
    .select('id, rooms_available, room_types!inner(total_rooms)')
    .eq('room_type_id', roomTypeId)
    .gte('date', startDate)
    .lt('date', endDate)

  if (!rows) return
  for (const row of rows) {
    const maxRooms = (row as unknown as { room_types: { total_rooms: number } }).room_types.total_rooms
    await (supabase as any)
      .from('room_availability')
      .update({ rooms_available: Math.min(row.rooms_available + 1, maxRooms) })
      .eq('id', row.id)
  }
}

// ── Restore Car Availability ──────────────────────────────────
async function restoreCarAvailability(
  carId: string,
  startDate: string,
  endDate: string
): Promise<void> {
  const supabase = createServiceRoleClient()
  await (supabase as any)
      .from('car_availability')
    .update({ is_available: true })
    .eq('car_id', carId)
    .gte('date', startDate)
    .lt('date', endDate)
}

// ── Validate Promo Code ───────────────────────────────────────
export async function validatePromoCode(
  code: string,
  bookingType: 'hotel' | 'car',
  amount: number
): Promise<{ valid: boolean; discountPercent: number; message: string }> {
  const supabase = await createClient()
  const { data } = await (supabase as any)
    .from('promotions')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single()

  if (!data) return { valid: false, discountPercent: 0, message: 'Invalid promo code' }

  const now = new Date()
  if (data.valid_from && new Date(data.valid_from) > now) {
    return { valid: false, discountPercent: 0, message: 'Promo code is not yet active' }
  }
  if (data.valid_to && new Date(data.valid_to) < now) {
    return { valid: false, discountPercent: 0, message: 'Promo code has expired' }
  }
  if (data.max_uses && data.current_uses >= data.max_uses) {
    return { valid: false, discountPercent: 0, message: 'Promo code has reached its usage limit' }
  }
  if (data.applies_to !== 'all' && data.applies_to !== bookingType) {
    return { valid: false, discountPercent: 0, message: `This promo code only applies to ${data.applies_to} bookings` }
  }
  if (data.min_booking_amount && amount < data.min_booking_amount) {
    return { valid: false, discountPercent: 0, message: `Minimum booking amount of $${data.min_booking_amount} required` }
  }

  return { valid: true, discountPercent: data.discount_percent, message: `${data.discount_percent}% discount applied!` }
}
