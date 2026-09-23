import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function main() {
  const bookingId = '86412f72-9d75-4d2a-a224-1ebe060935d4'
  
  const { data, error } = await supabase
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
    console.error('Error:', error)
  } else {
    console.log('Success!', data.id)
  }
}
main()
