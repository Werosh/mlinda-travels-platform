import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function main() {
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id, item_id, type, hotel_id, car_id, flight_id, room_type_id')

  if (error) {
    console.error('Error fetching bookings:', error)
    return
  }

  console.log('All bookings:')
  console.dir(bookings, { depth: null })
}

main().catch(console.error)
