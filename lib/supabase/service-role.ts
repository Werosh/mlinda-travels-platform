import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

/**
 * Service role client — bypasses RLS.
 * ONLY use in server-side code (API routes, Server Actions).
 * NEVER import in client components.
 */
export function createServiceRoleClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Service role client must only be used server-side')
  }
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
