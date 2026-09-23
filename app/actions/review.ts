'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitReview(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to leave a review')
  }

  const bookingId = formData.get('bookingId') as string
  const type = formData.get('type') as string
  const itemId = formData.get('itemId') as string
  const rating = parseInt(formData.get('rating') as string, 10)
  const comment = formData.get('comment') as string

  if (!rating || rating < 1 || rating > 5) {
    throw new Error('Invalid rating')
  }

  const hotelId = type === 'hotel' ? itemId : null
  const carId = type === 'car' ? itemId : null

  // Ensure this booking actually belongs to the user
  const { data: booking } = await supabase
    .from('bookings')
    .select('id')
    .eq('id', bookingId)
    .eq('user_id', user.id)
    .single()

  if (!booking) {
    throw new Error('Booking not found')
  }

  // Check if review already exists
  const { data: existingReview } = await (supabase as any)
    .from('reviews')
    .select('id')
    .eq('booking_id', bookingId)
    .maybeSingle()

  if (existingReview) {
    throw new Error('You have already reviewed this booking')
  }

  const { error } = await (supabase as any)
    .from('reviews')
    .insert({
      user_id: user.id,
      booking_id: bookingId,
      hotel_id: hotelId,
      car_id: carId,
      rating,
      comment: comment || null,
      is_approved: false // requires admin approval
    })

  if (error) {
    console.error('Failed to submit review:', error)
    throw new Error('Failed to submit review')
  }

  revalidatePath(`/account/bookings/${bookingId}`)
  return { success: true }
}
