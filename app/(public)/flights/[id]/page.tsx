import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getFlightById } from '@/lib/services/flights.service'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { format } from 'date-fns'
import {
  Plane,
  Clock,
  Luggage,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  Users,
} from 'lucide-react'
import { cn, formatDuration } from '@/lib/utils'
import { SearchWidget } from '@/components/search/SearchWidget'

interface FlightDetailPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ passengers?: string }>
}

export async function generateMetadata({ params }: FlightDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const flight = await getFlightById(id)
  if (!flight) return { title: 'Flight Not Found' }
  return {
    title: `${flight.flight_number} · ${flight.origin?.city} → ${flight.destination?.city} | Milinda Travels`,
    description: `Book ${flight.airlines?.name ?? ''} flight ${flight.flight_number} from ${flight.origin?.city} to ${flight.destination?.city}.`,
  }
}

const CABIN_STYLES: Record<string, { badge: string; card: string; title: string }> = {
  economy: {
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
    card: 'border-sky-200 hover:border-sky-400',
    title: 'Economy',
  },
  premium: {
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    card: 'border-purple-200 hover:border-purple-400',
    title: 'Premium Economy',
  },
  business: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    card: 'border-amber-200 hover:border-amber-400',
    title: 'Business',
  },
}

export default async function FlightDetailPage({
  params,
  searchParams,
}: FlightDetailPageProps) {
  const { id } = await params
  const { passengers: passengersStr } = await searchParams
  const passengers = passengersStr ? Number(passengersStr) : 1

  const flight = await getFlightById(id)
  if (!flight) notFound()

  const departure = new Date(flight.departure_time)
  const arrival = new Date(flight.arrival_time)

  // Group fares by cabin class
  const faresByCabin = flight.flight_fares.reduce(
    (acc, fare) => {
      if (!acc[fare.cabin_class]) acc[fare.cabin_class] = []
      acc[fare.cabin_class].push(fare)
      return acc
    },
    {} as Record<string, typeof flight.flight_fares>
  )

  const cabinOrder: Array<'economy' | 'premium' | 'business'> = ['economy', 'premium', 'business']

  return (
    <div className="pt-20 min-h-screen bg-background">
      {/* Search bar */}
      <div className="bg-white border-b border-border py-4">
        <div className="container-base">
          <SearchWidget variant="inline" />
        </div>
      </div>
      
      {/* Back */}
      <div className="bg-white border-b border-border">
        <div className="container-base py-3">
          <Link
            href={`/flights?passengers=${passengers}`}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to results
          </Link>
        </div>
      </div>

      <div className="container-base py-8 max-w-4xl">
        {/* Flight Summary Card */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden mb-8">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/5 to-transparent px-6 py-4 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {flight.airlines?.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={flight.airlines.logo_url}
                  alt={flight.airlines.name}
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {flight.airlines?.iata_code ?? '??'}
                </div>
              )}
              <div>
                <h1 className="font-bold text-lg text-foreground">{flight.airlines?.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {flight.flight_number} · {flight.aircraft_type}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {flight.stops === 0 ? (
                <Badge className="bg-green-50 text-green-700 border-green-200 border text-xs font-medium">
                  Non-stop
                </Badge>
              ) : (
                <Badge variant="outline" className="text-orange-600 border-orange-200 text-xs">
                  {flight.stops} stop{flight.stops > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>

          {/* Route */}
          <div className="px-6 py-6">
            <div className="flex items-center justify-between gap-8">
              {/* Origin */}
              <div>
                <p className="text-4xl font-bold text-foreground">{format(departure, 'HH:mm')}</p>
                <p className="text-base font-semibold text-primary mt-1">{flight.origin?.iata_code}</p>
                <p className="text-sm text-muted-foreground">{flight.origin?.name}</p>
                <p className="text-sm text-muted-foreground">{format(departure, 'EEE, MMM d, yyyy')}</p>
              </div>

              {/* Duration */}
              <div className="flex-1 flex flex-col items-center gap-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {flight.duration_minutes ? formatDuration(flight.duration_minutes) : '—'}
                </span>
                <div className="w-full flex items-center gap-2">
                  <div className="flex-1 h-px bg-border" />
                  <Plane className="w-4 h-4 text-primary rotate-0" />
                  <div className="flex-1 h-px bg-border" />
                </div>
                <span className="text-xs text-muted-foreground">{flight.stops === 0 ? 'Direct' : `${flight.stops} stop`}</span>
              </div>

              {/* Destination */}
              <div className="text-right">
                <p className="text-4xl font-bold text-foreground">{format(arrival, 'HH:mm')}</p>
                <p className="text-base font-semibold text-primary mt-1">{flight.destination?.iata_code}</p>
                <p className="text-sm text-muted-foreground">{flight.destination?.name}</p>
                <p className="text-sm text-muted-foreground">{format(arrival, 'EEE, MMM d, yyyy')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Passengers Strip */}
        {passengers > 1 && (
          <div className="flex items-center gap-2 mb-6 px-1">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Prices shown for{' '}
              <span className="font-semibold text-foreground">{passengers} passengers</span>
            </span>
          </div>
        )}

        {/* Fares */}
        <h2 className="text-xl font-bold text-foreground mb-4">Choose your fare</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cabinOrder.map((cabin) => {
            const fares = faresByCabin[cabin]
            if (!fares || fares.length === 0) return null
            const fare = fares[0] // best fare per cabin
            const styles = CABIN_STYLES[cabin]
            const totalPrice = fare.price * passengers

            return (
              <div
                key={cabin}
                className={cn(
                  'bg-white rounded-2xl border-2 p-5 transition-all duration-200 flex flex-col',
                  styles.card
                )}
              >
                {/* Cabin Badge */}
                <Badge
                  variant="outline"
                  className={cn('w-fit text-xs font-semibold mb-4', styles.badge)}
                >
                  {styles.title}
                </Badge>

                {/* Price */}
                <p className="text-3xl font-bold text-foreground mb-1">
                  ${totalPrice.toLocaleString()}
                </p>
                {passengers > 1 && (
                  <p className="text-xs text-muted-foreground mb-4">
                    ${fare.price.toLocaleString()} per passenger
                  </p>
                )}

                {/* Features */}
                <ul className="space-y-2.5 flex-1 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <Luggage className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground">
                      {fare.baggage_allowance ?? 'Baggage included'}
                    </span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    {fare.is_refundable ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-green-700 font-medium">Fully refundable</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">Non-refundable</span>
                      </>
                    )}
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-foreground">{fare.seats_available} seats left</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-foreground capitalize">{fare.fare_type} fare</span>
                  </li>
                </ul>

                <Button
                  asChild
                  className="w-full rounded-xl bg-primary hover:bg-primary-dark text-white shadow-sm shadow-primary/20"
                >
                  <Link
                    href={`/flights/${flight.id}/checkout?fareId=${fare.id}&passengers=${passengers}`}
                  >
                    Select {styles.title}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
