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

// ==============================
// CARS
// ==============================

export async function addCar(data: any) {
  await checkAdmin()
  const adminSupabase = createServiceRoleClient()

  const { data: result, error } = await (adminSupabase as any)
    .from('cars')
    .insert(data)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/cars')
  revalidatePath('/cars')
  return result
}

export async function updateCar(id: string, data: any) {
  await checkAdmin()
  const adminSupabase = createServiceRoleClient()

  const { data: result, error } = await (adminSupabase as any)
    .from('cars')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/cars')
  revalidatePath('/cars')
  return result
}

// ==============================
// HOTELS
// ==============================

export async function addHotel(data: any) {
  await checkAdmin()
  const adminSupabase = createServiceRoleClient()

  // Generate a random slug if none provided, or base it on name
  const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  const { data: result, error } = await (adminSupabase as any)
    .from('hotels')
    .insert({ ...data, slug })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/hotels')
  revalidatePath('/hotels')
  return result
}

export async function updateHotel(id: string, data: any) {
  await checkAdmin()
  const adminSupabase = createServiceRoleClient()

  const { data: result, error } = await (adminSupabase as any)
    .from('hotels')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/hotels')
  revalidatePath('/hotels')
  return result
}
