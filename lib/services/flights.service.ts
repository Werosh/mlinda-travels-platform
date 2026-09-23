import { createClient } from '@/lib/supabase/server'
import type { FlightWithDetails } from '@/lib/supabase/types'

export interface FlightSearchParams {
  origin?: string
  destination?: string
  departureDate?: string
  returnDate?: string
  passengers?: number
  cabinClass?: 'economy' | 'premium' | 'business'
  stops?: '0' | '1'
  sortBy?: 'price_asc' | 'price_desc' | 'duration_asc' | 'departure_asc'
  page?: number
  limit?: number
}

export interface FlightSearchResult {
  flights: FlightWithDetails[]
  total: number
  page: number
  totalPages: number
}

// Format duration as "Xh Ym"
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

// ── Search Flights ─────────────────────────────────────────────
export async function searchFlights(params: FlightSearchParams): Promise<FlightSearchResult> {
  const supabase = await createClient()
  const limit = params.limit ?? 10
  const page = params.page ?? 1
  const offset = (page - 1) * limit

  // Build the base query with all joins
  let query = (supabase as any)
    .from('flights')
    .select(
      `
      *,
      airlines ( id, name, iata_code, logo_url ),
      origin:airports!flights_origin_airport_id_fkey ( id, iata_code, name, city, country ),
      destination:airports!flights_destination_airport_id_fkey ( id, iata_code, name, city, country ),
      flight_fares ( id, cabin_class, fare_type, price, seats_available, baggage_allowance, is_refundable )
      `,
      { count: 'exact' }
    )
    .eq('is_active', true)

  // Filter by stops
  if (params.stops === '0') {
    query = query.eq('stops', 0)
  } else if (params.stops === '1') {
    query = query.lte('stops', 1)
  }

  // Sorting
  switch (params.sortBy) {
    case 'duration_asc':
      query = query.order('duration_minutes', { ascending: true })
      break
    case 'departure_asc':
      query = query.order('departure_time', { ascending: true })
      break
    case 'price_desc':
      query = query.order('departure_time', { ascending: true })
      break
    default:
      // price_asc - default, sort by departure time
      query = query.order('departure_time', { ascending: true })
  }

  query = query.range(offset, offset + limit - 1)

  const { data, count, error } = await query

  if (error) throw new Error(error.message)

  let flights = (data ?? []) as FlightWithDetails[]

  // Filter by cabin class availability in-memory
  if (params.cabinClass) {
    flights = flights.filter((f) =>
      f.flight_fares.some(
        (fare) => fare.cabin_class === params.cabinClass && fare.seats_available > 0
      )
    )
  }

  // Filter by origin city/airport code
  if (params.origin) {
    const originSearch = params.origin.trim().toLowerCase()
    flights = flights.filter(
      (f) =>
        f.origin?.city?.toLowerCase().includes(originSearch) ||
        f.origin?.iata_code?.toLowerCase().includes(originSearch)
    )
  }

  // Filter by destination city/airport code
  if (params.destination) {
    const destSearch = params.destination.trim().toLowerCase()
    flights = flights.filter(
      (f) =>
        f.destination?.city?.toLowerCase().includes(destSearch) ||
        f.destination?.iata_code?.toLowerCase().includes(destSearch)
    )
  }

  // Sort by price in-memory if needed
  if (params.sortBy === 'price_asc') {
    flights.sort((a, b) => {
      const aMin = Math.min(...a.flight_fares.map((f) => f.price))
      const bMin = Math.min(...b.flight_fares.map((f) => f.price))
      return aMin - bMin
    })
  } else if (params.sortBy === 'price_desc') {
    flights.sort((a, b) => {
      const aMin = Math.min(...a.flight_fares.map((f) => f.price))
      const bMin = Math.min(...b.flight_fares.map((f) => f.price))
      return bMin - aMin
    })
  }

  const total = count ?? flights.length
  return {
    flights,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

// ── Get Flight By ID ────────────────────────────────────────────
export async function getFlightById(id: string): Promise<FlightWithDetails | null> {
  const supabase = await createClient()

  const { data, error } = await (supabase as any)
    .from('flights')
    .select(
      `
      *,
      airlines ( id, name, iata_code, logo_url ),
      origin:airports!flights_origin_airport_id_fkey ( id, iata_code, name, city, country ),
      destination:airports!flights_destination_airport_id_fkey ( id, iata_code, name, city, country ),
      flight_fares ( id, cabin_class, fare_type, price, seats_available, baggage_allowance, is_refundable )
      `
    )
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) return null
  return data as FlightWithDetails
}

// ── Get All Airports ────────────────────────────────────────────
export async function getAirports() {
  const supabase = await createClient()
  const { data } = await (supabase as any)
    .from('airports')
    .select('id, iata_code, name, city, country')
    .order('city', { ascending: true })
  return data ?? []
}
