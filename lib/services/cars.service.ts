import { createClient } from '@/lib/supabase/server'
import type { Car } from '@/lib/supabase/types'
import { generateCarSlug } from '@/lib/slugs'

export interface CarSearchParams {
  location?: string
  pickupDate?: string
  returnDate?: string
  category?: string
  transmission?: string
  minSeats?: number
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price_asc' | 'price_desc' | 'seats_asc' | 'name_asc'
  page?: number
  limit?: number
}

export interface CarSearchResult {
  cars: Car[]
  total: number
  page: number
  totalPages: number
}

// ── Search Cars ───────────────────────────────────────────────
export async function searchCars(params: CarSearchParams): Promise<CarSearchResult> {
  const supabase = await createClient()
  const limit = params.limit ?? 9
  const page = params.page ?? 1
  const offset = (page - 1) * limit

  let query = supabase
    .from('cars')
    .select('*', { count: 'exact' })
    .eq('is_active', true)

  if (params.location && params.location.trim()) {
    query = query.ilike('location', `%${params.location.trim()}%`)
  }

  if (params.category && params.category !== 'all') {
    query = query.eq('category', params.category)
  }

  if (params.transmission && params.transmission !== 'all') {
    query = query.eq('transmission', params.transmission)
  }

  if (params.minSeats) {
    query = query.gte('seats', params.minSeats)
  }

  if (params.minPrice) {
    query = query.gte('price_per_day', params.minPrice)
  }

  if (params.maxPrice) {
    query = query.lte('price_per_day', params.maxPrice)
  }

  switch (params.sortBy) {
    case 'price_asc':
      query = query.order('price_per_day', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price_per_day', { ascending: false })
      break
    case 'seats_asc':
      query = query.order('seats', { ascending: true })
      break
    case 'name_asc':
      query = query.order('make', { ascending: true })
      break
    default:
      query = query.order('price_per_day', { ascending: true })
  }

  query = query.range(offset, offset + limit - 1)

  const { data, count, error } = await (query as any)

  if (error) throw new Error(error.message)

  // Filter by availability if dates provided
  let filtered = data ?? []
  if (params.pickupDate && params.returnDate) {
    const availableCarIds = await getAvailableCarIds(
      filtered.map((c) => c.id),
      params.pickupDate,
      params.returnDate
    )
    filtered = filtered.filter((c) => availableCarIds.includes(c.id))
  }

  return {
    cars: filtered,
    total: count ?? 0,
    page,
    totalPages: Math.ceil((count ?? 0) / limit),
  }
}

// ── Get Available Car IDs for Date Range ──────────────────────
async function getAvailableCarIds(
  carIds: string[],
  startDate: string,
  endDate: string
): Promise<string[]> {
  const supabase = await createClient()

  // Find cars that have ANY unavailable date in range
  const { data: unavailable } = await (supabase as any)
      .from('car_availability')
    .select('car_id')
    .in('car_id', carIds)
    .gte('date', startDate)
    .lt('date', endDate)
    .eq('is_available', false)

  const unavailableIds = new Set(unavailable?.map((r) => r.car_id) ?? [])
  return carIds.filter((id) => !unavailableIds.has(id))
}

// ── Get Car by ID ─────────────────────────────────────────────
export async function getCarById(id: string): Promise<Car | null> {
  const supabase = await createClient()

  const { data, error } = await (supabase as any)
      .from('cars')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error || !data) return null
  return data
}

// ── Get Car by Slug ───────────────────────────────────────────
export async function getCarBySlug(slug: string): Promise<Car | null> {
  const supabase = await createClient()

  // Fetch all active cars to find the matching slug
  // For larger datasets, we would implement a DB-level slug column.
  const { data, error } = await (supabase as any)
      .from('cars')
    .select('*')
    .eq('is_active', true)

  if (error || !data) return null
  
  const car = data.find((c: Car) => generateCarSlug(c) === slug)
  return car || null
}

// ── Get Featured Cars ─────────────────────────────────────────
export async function getFeaturedCars(limit = 6): Promise<Car[]> {
  const supabase = await createClient()

  const { data } = await (supabase as any)
    .from('cars')
    .select('*')
    .eq('is_active', true)
    .order('price_per_day', { ascending: true })
    .limit(limit)

  return data ?? []
}

// ── Check Car Availability ────────────────────────────────────
export async function checkCarAvailability(
  carId: string,
  startDate: string,
  endDate: string
): Promise<{ available: boolean }> {
  const supabase = await createClient()

  const { data } = await (supabase as any)
    .from('car_availability')
    .select('is_available')
    .eq('car_id', carId)
    .gte('date', startDate)
    .lt('date', endDate)
    .eq('is_available', false)
    .limit(1)

  return { available: !data || data.length === 0 }
}

// ── Get Car Reviews ───────────────────────────────────────────
export async function getCarReviews(carId: string, limit = 10) {
  const supabase = await createClient()

  const { data } = await (supabase as any)
    .from('reviews')
    .select(`*, profiles (full_name, avatar_url)`)
    .eq('car_id', carId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  return data ?? []
}

// ── Get Car Locations ─────────────────────────────────────────
export async function getCarLocations(): Promise<string[]> {
  const supabase = await createClient()

  const { data } = await (supabase as any)
    .from('cars')
    .select('location')
    .eq('is_active', true)
    .order('location')

  const locations = [...new Set(data?.map((c) => c.location) ?? [])]
  return locations
}
