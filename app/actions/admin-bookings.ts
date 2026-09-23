'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function adminCancelBooking(bookingId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  // Check if admin
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized: Admins only')
  }

  const { data: booking, error: fetchError } = await (supabase as any)
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single()

  if (fetchError || !booking) {
    throw new Error('Booking not found')
  }

  if (booking.status === 'cancelled') {
    throw new Error('Booking is already cancelled')
  }

  const { error } = await (supabase as any)
    .from('bookings')
    .update({ 
      status: 'cancelled', 
      updated_at: new Date().toISOString() 
    })
    .eq('id', bookingId)

  if (error) {
    throw new Error('Failed to cancel booking: ' + error.message)
  }

  revalidatePath('/admin/bookings')
  revalidatePath(`/admin/bookings/${bookingId}`)
  revalidatePath(`/account/bookings/${bookingId}`)

  return { success: true }
}

export async function adminCompleteBooking(bookingId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  // Check if admin
  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized: Admins only')
  }

  const { error } = await (supabase as any)
    .from('bookings')
    .update({ 
      status: 'completed', 
      updated_at: new Date().toISOString() 
    })
    .eq('id', bookingId)

  if (error) {
    throw new Error('Failed to complete booking: ' + error.message)
  }

  revalidatePath('/admin/bookings')
  revalidatePath(`/admin/bookings/${bookingId}`)
  revalidatePath(`/account/bookings/${bookingId}`)

  return { success: true }
}
