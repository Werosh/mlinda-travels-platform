'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowRight, Clock, Luggage, RotateCcw, Wifi, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { FlightWithDetails } from '@/lib/supabase/types'
import { cn, formatDuration } from '@/lib/utils'

interface FlightCardProps {
  flight: FlightWithDetails
  passengers?: number
}

const CABIN_COLORS: Record<string, string> = {
  economy: 'bg-sky-50 text-sky-700 border-sky-200',
  premium: 'bg-purple-50 text-purple-700 border-purple-200',
  business: 'bg-amber-50 text-amber-700 border-amber-200',
}

export function FlightCard({ flight, passengers = 1 }: FlightCardProps) {
  const departure = new Date(flight.departure_time)
  const arrival = new Date(flight.arrival_time)

  // Cheapest fare
  const sortedFares = [...flight.flight_fares].sort((a, b) => a.price - b.price)
  const cheapestFare = sortedFares[0]
  const hasBusinessFare = flight.flight_fares.some((f) => f.cabin_class === 'business')
  const hasPremiumFare = flight.flight_fares.some((f) => f.cabin_class === 'premium')

  if (!cheapestFare) return null

  return (
    <article className="group bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300">
      {/* Airline Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 bg-muted/20">
        <div className="flex items-center gap-3">
          {flight.airlines?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={flight.airlines.logo_url}
              alt={flight.airlines.name}
              className="h-6 w-auto object-contain"
            />
          ) : (
            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
              {flight.airlines?.iata_code ?? '??'}
            </div>
          )}
          <div>
            <span className="text-sm font-semibold text-foreground">{flight.airlines?.name ?? 'Unknown Airline'}</span>
            <span className="text-xs text-muted-foreground ml-2">· {flight.flight_number}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {hasBusinessFare && (
            <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0.5 font-medium', CABIN_COLORS.business)}>
              Business
            </Badge>
          )}
          {hasPremiumFare && (
            <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0.5 font-medium', CABIN_COLORS.premium)}>
              Premium
            </Badge>
          )}
          <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0.5 font-medium', CABIN_COLORS.economy)}>
            Economy
          </Badge>
        </div>
      </div>

      {/* Main Flight Info */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Origin */}
          <div className="flex-1 min-w-0">
            <p className="text-2xl font-bold text-foreground">{format(departure, 'HH:mm')}</p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-0.5">
              {flight.origin?.iata_code}
            </p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{flight.origin?.city}</p>
          </div>

          {/* Duration + Line */}
          <div className="flex flex-col items-center flex-shrink-0 px-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
              <Clock className="w-3 h-3" />
              <span>{flight.duration_minutes ? formatDuration(flight.duration_minutes) : '—'}</span>
            </div>
            <div className="relative flex items-center w-28 sm:w-36">
              <div className="flex-1 h-px bg-border" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary mx-1 flex-shrink-0" />
              {flight.stops === 0 ? (
                <div className="flex-1 h-px bg-border" />
              ) : (
                <div className="flex-1 flex items-center gap-0.5">
                  <div className="flex-1 h-px bg-border border-dashed" />
                </div>
              )}
            </div>
            <span className={cn('text-[10px] mt-1 font-medium', flight.stops === 0 ? 'text-green-600' : 'text-orange-500')}>
              {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
            </span>
          </div>

          {/* Destination */}
          <div className="flex-1 min-w-0 text-right">
            <p className="text-2xl font-bold text-foreground">{format(arrival, 'HH:mm')}</p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-0.5">
              {flight.destination?.iata_code}
            </p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{flight.destination?.city}</p>
          </div>
        </div>

        {/* Date + Aircraft */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/40">
          <span className="text-xs text-muted-foreground">{format(departure, 'EEE, MMM d, yyyy')}</span>
          {flight.aircraft_type && (
            <>
              <span className="text-border">·</span>
              <span className="text-xs text-muted-foreground">{flight.aircraft_type}</span>
            </>
          )}
        </div>
      </div>

      {/* Fare Breakdown + CTA */}
      <div className="px-5 pb-4 flex items-center justify-between gap-4">
        {/* Fare Info */}
        <div className="flex items-center gap-3 flex-wrap">
          {cheapestFare.baggage_allowance && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Luggage className="w-3.5 h-3.5" />
              <span>{cheapestFare.baggage_allowance}</span>
            </div>
          )}
          {cheapestFare.is_refundable && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Refundable</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Wifi className="w-3.5 h-3.5" />
            <span>In-flight Wi-Fi</span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground">from</p>
            <p className="text-xl font-bold text-foreground">
              ${(cheapestFare.price * passengers).toLocaleString()}
            </p>
            {passengers > 1 && (
              <p className="text-[10px] text-muted-foreground">{passengers} passengers</p>
            )}
          </div>
          <Button
            asChild
            size="sm"
            className="rounded-xl bg-primary hover:bg-primary-dark shadow-sm shadow-primary/20 text-white px-4 h-10 group-hover:shadow-md group-hover:shadow-primary/30 transition-all"
          >
            <Link href={`/flights/${flight.id}?passengers=${passengers}`}>
              Select
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
