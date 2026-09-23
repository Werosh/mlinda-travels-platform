'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceRoleClient } from '@/lib/supabase/service-role'
import { revalidatePath } from 'next/cache'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized: Admins only')
  }
}

export async function getFlightMeta() {
  await checkAdmin()
  const adminSupabase = createServiceRoleClient()

  const [airportsRes, airlinesRes] = await Promise.all([
    (adminSupabase as any).from('airports').select('*').order('name'),
    (adminSupabase as any).from('airlines').select('*').order('name'),
  ])

  return {
    airports: airportsRes.data || [],
    airlines: airlinesRes.data || [],
  }
}

export async function getFlight(id: string) {
  await checkAdmin()
  const adminSupabase = createServiceRoleClient()

  const { data, error } = await (adminSupabase as any)
    .from('flights')
    .select(`
      *,
      airlines (*),
      origin:airports!flights_origin_airport_id_fkey (*),
      destination:airports!flights_destination_airport_id_fkey (*),
      flight_fares (*)
    `)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function createFlight(flightData: any) {
  await checkAdmin()
  const adminSupabase = createServiceRoleClient()

  const { flight_fares, airlines, origin, destination, ...payload } = flightData

  const { data, error } = await (adminSupabase as any)
    .from('flights')
    .insert(payload)
    .select()
    .single()

  if (error) throw new Error(error.message)
  
  revalidatePath('/admin/flights')
  revalidatePath('/flights')
  return data
}

export async function updateFlight(id: string, flightData: any) {
  await checkAdmin()
  const adminSupabase = createServiceRoleClient()

  const { flight_fares, airlines, origin, destination, ...payload } = flightData

  const { data, error } = await (adminSupabase as any)
    .from('flights')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/admin/flights')
  revalidatePath('/flights')
  return data
}

export async function createFare(flightId: string, fareData: any) {
  await checkAdmin()
  const adminSupabase = createServiceRoleClient()

  const { data, error } = await (adminSupabase as any)
    .from('flight_fares')
    .insert({ ...fareData, flight_id: flightId })
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath(`/admin/flights/${flightId}`)
  revalidatePath('/flights')
  return data
}

export async function updateFare(flightId: string, fareId: string, fareData: any) {
  await checkAdmin()
  const adminSupabase = createServiceRoleClient()

  const { data, error } = await (adminSupabase as any)
    .from('flight_fares')
    .update(fareData)
    .eq('id', fareId)
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath(`/admin/flights/${flightId}`)
  revalidatePath('/flights')
  return data
}

export async function deleteFare(flightId: string, fareId: string) {
  await checkAdmin()
  const adminSupabase = createServiceRoleClient()

  const { error } = await (adminSupabase as any)
    .from('flight_fares')
    .delete()
    .eq('id', fareId)

  if (error) throw new Error(error.message)

  revalidatePath(`/admin/flights/${flightId}`)
  revalidatePath('/flights')
  return { success: true }
}
