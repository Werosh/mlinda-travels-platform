import { createClient } from '@/lib/supabase/server'
import type { Hotel, Car } from '@/lib/supabase/types'

export async function getUserFavorites() {
  const supabase = await createClient()

  // 1. Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { hotels: [], cars: [] }
  }

  // 2. Fetch favorites with joined hotels and cars
  const { data, error } = await supabase
    .from('favorites')
    .select(`
      id,
      created_at,
      hotels (*),
      cars (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching favorites:', error)
    return { hotels: [], cars: [] }
  }

  // 3. Separate into hotels and cars arrays
  const savedHotels: (Hotel & { min_price?: number | null })[] = []
  const savedCars: Car[] = []

  const favorites = data as any[] || []

  for (const fav of favorites) {
    if (fav.hotels) {
      // NOTE: Base prices would ideally come from room_types join, 
      // but for favorites display we just cast it. 
      // If needed, we can do a secondary fetch for room_types min price.
      savedHotels.push(fav.hotels as Hotel & { min_price?: number | null })
    }
    if (fav.cars) {
      savedCars.push(fav.cars as Car)
    }
  }

  return { hotels: savedHotels, cars: savedCars }
}
