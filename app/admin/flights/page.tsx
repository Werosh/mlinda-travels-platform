import type { Metadata } from 'next'
import Link from 'next/link'
import { format } from 'date-fns'
import { Plus, Edit, Eye, Plane } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Flights - Admin' }

export default async function AdminFlightsPage() {
  const supabase = await createClient()

  const { data: flightsRaw } = await (supabase as any)
    .from('flights')
    .select(`
      *,
      airlines (id, name, iata_code, logo_url),
      origin:airports!flights_origin_airport_id_fkey (id, iata_code, city),
      destination:airports!flights_destination_airport_id_fkey (id, iata_code, city),
      flight_fares (id, cabin_class, price, seats_available)
    `)
    .order('departure_time', { ascending: true })

  const flights = flightsRaw as any[] | null

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Flights</h1>
          <p className="text-muted-foreground text-sm">{flights?.length ?? 0} flights scheduled</p>
        </div>
        <Link href="/admin/flights/new">
          <Button className="rounded-xl bg-primary hover:bg-[#164d37] text-white">
            <Plus className="w-4 h-4 mr-2" /> Add Flight
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Flights table">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Flight</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Route</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Departure</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Duration</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Fares</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {flights?.map((flight) => {
                const cheapestFare = flight.flight_fares?.reduce((min: any, f: any) =>
                  (!min || f.price < min.price) ? f : min, null)
                const durationH = Math.floor((flight.duration_minutes ?? 0) / 60)
                const durationM = (flight.duration_minutes ?? 0) % 60

                return (
                  <tr key={flight.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Plane className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{flight.flight_number}</p>
                          <p className="text-xs text-muted-foreground">{flight.airlines?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium">
                        {flight.origin?.iata_code} → {flight.destination?.iata_code}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {flight.origin?.city} → {flight.destination?.city}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground text-sm">
                      {flight.departure_time
                        ? format(new Date(flight.departure_time), 'MMM d, HH:mm')
                        : '—'}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground text-sm">
                      {durationH}h {durationM > 0 ? `${durationM}m` : ''}
                      <span className="text-xs ml-1">
                        ({flight.stops === 0 ? 'Direct' : `${flight.stops} stop`})
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {cheapestFare ? (
                        <div>
                          <p className="font-semibold text-foreground">from ${cheapestFare.price}</p>
                          <p className="text-xs text-muted-foreground">
                            {flight.flight_fares?.length ?? 0} fare{flight.flight_fares?.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">No fares</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <Badge className={`border-0 text-xs font-medium ${flight.is_active ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                        {flight.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/flights/${flight.id}`}>
                          <Button size="sm" variant="ghost" className="rounded-lg h-8 px-2 hover:bg-primary/10 hover:text-primary">
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <Link href={`/flights/${flight.id}`} target="_blank">
                          <Button size="sm" variant="ghost" className="rounded-lg h-8 px-2 hover:bg-primary/10 hover:text-primary">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {(!flights || flights.length === 0) && (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                    No flights found. Click "Add Flight" to add inventory.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
