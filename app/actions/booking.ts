'use server'

import { validatePromoCode as serviceValidatePromoCode } from '@/lib/services/bookings.service'

export async function validatePromoCode(
  code: string,
  bookingType: 'hotel' | 'car',
  amount: number
) {
  return serviceValidatePromoCode(code, bookingType, amount)
}

export async function confirmMockPayment(metadata: any) {
  const { createBooking } = await import('@/lib/services/bookings.service')
  
  // Note: we can use a mock user ID for the demo if none is provided,
  // but let's assume the user is logged in and we have the user ID in the metadata,
  // or we can just fetch the user session here if needed.
  // Wait, the webhook used `metadata.userId`. Let's get the user ID from the server session.
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to book.')
  }

  const result = await createBooking({
    userId: user.id,
    type: metadata.type as 'hotel' | 'car' | 'flight',
    itemId: metadata.itemId,
    roomTypeId: metadata.roomTypeId || (metadata.type === 'hotel' ? metadata.itemId : undefined),
    hotelId: metadata.hotelId || undefined,
    carId: metadata.carId || (metadata.type === 'car' ? metadata.itemId : undefined),
    flightId: metadata.flightId || undefined,
    fareId: metadata.fareId || (metadata.type === 'flight' ? metadata.itemId : undefined),
    startDate: metadata.startDate,
    endDate: metadata.endDate,
    guests: metadata.guests ? Number(metadata.guests) : 1,
    passengers: metadata.passengers ? Number(metadata.passengers) : undefined,
    totalPrice: Number(metadata.totalPrice),
    promoCode: metadata.promoCode || undefined,
    discountAmount: metadata.discountAmount ? Number(metadata.discountAmount) : undefined,
    // We pass a mock stripe ID so `createBooking` marks it as confirmed
    stripePaymentIntentId: `mock_pi_${Math.random().toString(36).substr(2, 9)}`
  })

  if (result.error) {
    throw new Error(result.error)
  }

  return { bookingId: result.booking?.id }
}
