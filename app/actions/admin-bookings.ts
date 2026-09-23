'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { revalidatePath } from 'next/cache'

export async function getAdminBookingDetails(bookingId: string) {
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

  // Use service role to bypass RLS and fetch all nested details
  const adminSupabase = createServiceRoleClient()
  const { data, error } = await (adminSupabase as any)
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
      profiles (full_name, phone)
    `)
    .eq('id', bookingId)
    .single()

  if (error) {
    console.error('Failed to load admin booking details:', error)
    return null
  }
  
  return data
}

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
