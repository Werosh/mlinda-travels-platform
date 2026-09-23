import { createClient } from '@/lib/supabase/server'
import type { Hotel, HotelWithRooms, RoomType, RoomTypeWithAvailability } from '@/lib/supabase/types'
import { generateHotelSlug } from '@/lib/slugs'

export interface HotelSearchParams {
  city?: string
  checkIn?: string
  checkOut?: string
  guests?: number
  minPrice?: number
  maxPrice?: number
  starRating?: number
  amenities?: string[]
  sortBy?: 'price_asc' | 'price_desc' | 'rating_desc' | 'name_asc'
  page?: number
  limit?: number
}

export interface HotelSearchResult {
  hotels: (Hotel & { min_price?: number })[]
  total: number
  page: number
  totalPages: number
}

// ── Search Hotels ─────────────────────────────────────────────
export async function searchHotels(params: HotelSearchParams): Promise<HotelSearchResult> {
  const supabase = await createClient()
  const limit = params.limit ?? 9
  const page = params.page ?? 1
  const offset = (page - 1) * limit

  let query = supabase
    .from('hotels')
    .select('*', { count: 'exact' })
    .eq('is_active', true)

  if (params.city && params.city.trim()) {
    query = query.ilike('city', `%${params.city.trim()}%`)
  }

  if (params.starRating) {
    query = query.gte('star_rating', params.starRating)
  }

  if (params.amenities && params.amenities.length > 0) {
    query = query.overlaps('amenities', params.amenities)
  }

  // Sorting
  switch (params.sortBy) {
    case 'rating_desc':
      query = query.order('star_rating', { ascending: false })
      break
    case 'name_asc':
      query = query.order('name', { ascending: true })
      break
    default:
      query = query.order('star_rating', { ascending: false })
  }

  query = query.range(offset, offset + limit - 1)

  const { data, count, error } = await (query as any)

  if (error) throw new Error(error.message)

  // Fetch min prices for each hotel
  const hotelsWithPrice = await Promise.all(
    (data ?? []).map(async (hotel: Hotel) => {
      const { data: rooms } = await (supabase as any)
      .from('room_types')
        .select('base_price')
        .eq('hotel_id', hotel.id)
        .order('base_price', { ascending: true })
        .limit(1)

      return {
        ...hotel,
        min_price: rooms?.[0]?.base_price ?? null,
      }
    })
  )

  // Apply price filter post-join
  const filtered = hotelsWithPrice.filter((h) => {
    if (params.minPrice && (h.min_price ?? 0) < params.minPrice) return false
    if (params.maxPrice && (h.min_price ?? Infinity) > params.maxPrice) return false
    return true
  })

  return {
    hotels: filtered,
    total: count ?? 0,
    page,
    totalPages: Math.ceil((count ?? 0) / limit),
  }
}

// ── Get Hotel by ID ───────────────────────────────────────────
export async function getHotelById(id: string): Promise<HotelWithRooms | null> {
  const supabase = await createClient()

  const { data, error } = await (supabase as any)
      .from('hotels')
    .select(`
      *,
      room_types (*)
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error || !data) return null
  return data as HotelWithRooms
}

// ── Get Hotel by Slug ─────────────────────────────────────────
export async function getHotelBySlug(slug: string): Promise<HotelWithRooms | null> {
  const supabase = await createClient()

  // First fetch all hotels to find the matching slug
  const { data: hotels, error } = await (supabase as any)
      .from('hotels')
    .select('*')
    .eq('is_active', true)

  if (error || !hotels) return null
  
  const hotel = hotels.find((h: Hotel) => generateHotelSlug(h) === slug)
  if (!hotel) return null

  // Fetch full details with room types
  return getHotelById(hotel.id)
}

// ── Get Featured Hotels ───────────────────────────────────────
export async function getFeaturedHotels(limit = 6): Promise<Hotel[]> {
  const supabase = await createClient()

  const { data, error } = await (supabase as any)
      .from('hotels')
    .select('*')
    .eq('is_active', true)
    .order('star_rating', { ascending: false })
    .limit(limit)

  if (error) return []
  return data ?? []
}

// ── Check Room Availability ───────────────────────────────────
export async function checkRoomAvailability(
  roomTypeId: string,
  startDate: string,
  endDate: string
): Promise<{ available: boolean; availableRooms: number; pricePerNight: number | null }> {
  const supabase = await createClient()

  // Get availability for every date in range
  const { data, error } = await (supabase as any)
      .from('room_availability')
    .select('rooms_available, price_override')
    .eq('room_type_id', roomTypeId)
    .gte('date', startDate)
    .lt('date', endDate)

  if (error) return { available: false, availableRooms: 0, pricePerNight: null }

  if (!data || data.length === 0) return { available: false, availableRooms: 0, pricePerNight: null }

  const minAvailable = Math.min(...data.map((d: { rooms_available: number }) => d.rooms_available))
  const priceOverride = data[0]?.price_override ?? null

  return {
    available: minAvailable > 0,
    availableRooms: minAvailable,
    pricePerNight: priceOverride,
  }
}

// ── Get Room Type with Availability ──────────────────────────
export async function getRoomTypeWithAvailability(
  roomTypeId: string,
  startDate: string,
  endDate: string
): Promise<RoomTypeWithAvailability | null> {
  const supabase = await createClient()

  const { data, error } = await (supabase as any)
      .from('room_types')
    .select(`
      *,
      room_availability (*)
    `)
    .eq('id', roomTypeId)
    .gte('room_availability.date', startDate)
    .lt('room_availability.date', endDate)
    .single()

  if (error || !data) return null
  return data as RoomTypeWithAvailability
}

// ── Get Hotel Average Rating ──────────────────────────────────
export async function getHotelAverageRating(hotelId: string): Promise<number | null> {
  const supabase = await createClient()

  const { data } = await (supabase as any)
    .from('reviews')
    .select('rating')
    .eq('hotel_id', hotelId)
    .eq('is_approved', true)

  if (!data || data.length === 0) return null
  const avg = data.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / data.length
  return Math.round(avg * 10) / 10
}

// ── Get Hotel Reviews ─────────────────────────────────────────
export async function getHotelReviews(hotelId: string, limit = 10) {
  const supabase = await createClient()

  const { data } = await (supabase as any)
    .from('reviews')
    .select(`
      *,
      profiles (full_name, avatar_url)
    `)
    .eq('hotel_id', hotelId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  return data ?? []
}

// ── Get Cities (for autocomplete) ────────────────────────────
export async function getHotelCities(): Promise<string[]> {
  const supabase = await createClient()

  const { data } = await (supabase as any)
    .from('hotels')
    .select('city')
    .eq('is_active', true)
    .order('city')

  const cities = Array.from(new Set<string>(data?.map((h: any) => h.city as string) ?? []))
  return cities
}
