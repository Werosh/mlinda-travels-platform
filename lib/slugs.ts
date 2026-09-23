import type { Car, Hotel } from '@/lib/supabase/types'
import type { FlightWithDetails } from '@/lib/supabase/types'

/**
 * Creates a URL-safe slug from an arbitrary string.
 */
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w-]+/g, '')    // Remove all non-word chars
    .replace(/--+/g, '-')       // Replace multiple - with single -
    .replace(/^-+/, '')         // Trim - from start of text
    .replace(/-+$/, '')         // Trim - from end of text
}

export function generateCarSlug(car: Car): string {
  // e.g., toyota-prius-economy
  return slugify(`${car.make}-${car.model}-${car.category}`)
}

export function generateHotelSlug(hotel: Hotel): string {
  // e.g., the-grand-hotel-colombo
  return slugify(`${hotel.name}-${hotel.city}`)
}

export function generateFlightSlug(flight: FlightWithDetails): string {
  // e.g., ul101-cmb-to-mle
  const airlineCode = flight.airlines?.iata_code ?? flight.airlines?.name ?? 'flight'
  const origin = flight.origin?.iata_code ?? 'origin'
  const dest = flight.destination?.iata_code ?? 'dest'
  
  return slugify(`${airlineCode}-${flight.flight_number}-${origin}-to-${dest}`)
}
