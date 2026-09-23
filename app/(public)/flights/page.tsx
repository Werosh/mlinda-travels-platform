import type { Metadata } from 'next'
import { Suspense } from 'react'
import { searchFlights } from '@/lib/services/flights.service'
import { FlightCard } from '@/components/flights/FlightCard'
import { FlightFilters } from '@/components/flights/FlightFilters'
import { EmptyState } from '@/components/shared/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { SearchWidget } from '@/components/search/SearchWidget'
import Link from 'next/link'
import { Plane, ArrowUpDown, Clock, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Flights | Milinda Travels',
  description:
    'Search and book flights worldwide. Compare airlines, fares, and cabin classes. Non-stop and connecting flights available.',
}

interface FlightsPageProps {
  searchParams: Promise<{
    origin?: string
    destination?: string
    departureDate?: string
    returnDate?: string
    passengers?: string
    cabinClass?: string
    stops?: string
    sortBy?: string
    page?: string
  }>
}

const SORT_OPTIONS = [
  { label: 'Cheapest', value: 'price_asc', icon: TrendingUp },
  { label: 'Fastest', value: 'duration_asc', icon: Clock },
  { label: 'Earliest', value: 'departure_asc', icon: ArrowUpDown },
]

function FlightCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 bg-muted/20">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="flex flex-col items-center gap-2 flex-shrink-0 px-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-px w-32" />
            <Skeleton className="h-3 w-14" />
          </div>
          <div className="flex-1 text-right space-y-2">
            <Skeleton className="h-8 w-20 ml-auto" />
            <Skeleton className="h-3 w-12 ml-auto" />
          </div>
        </div>
      </div>
      <div className="px-5 pb-4 flex items-center justify-between">
        <div className="flex gap-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

async function FlightResults({
  searchParams,
}: {
  searchParams: Awaited<FlightsPageProps['searchParams']>
}) {
  const passengers = searchParams.passengers ? Number(searchParams.passengers) : 1

  const result = await searchFlights({
    origin: searchParams.origin,
    destination: searchParams.destination,
    departureDate: searchParams.departureDate,
    cabinClass: searchParams.cabinClass as 'economy' | 'premium' | 'business' | undefined,
    stops: searchParams.stops as '0' | '1' | undefined,
    sortBy:
      (searchParams.sortBy as 'price_asc' | 'price_desc' | 'duration_asc' | 'departure_asc') ??
      'price_asc',
    passengers,
    page: searchParams.page ? Number(searchParams.page) : 1,
  })

  if (result.flights.length === 0) {
    return (
      <EmptyState
        icon="search"
        title="No flights found"
        description={
          searchParams.origin || searchParams.destination
            ? `We couldn't find any flights matching your search. Try adjusting your filters or searching a different route.`
            : 'Use the search bar above to find available flights.'
        }
        action={{ label: 'Browse All Flights', href: '/flights' }}
      />
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{result.total}</span> flight
          {result.total !== 1 ? 's' : ''} found
          {searchParams.origin && ` from ${searchParams.origin.toUpperCase()}`}
          {searchParams.destination && ` to ${searchParams.destination.toUpperCase()}`}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {result.flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} passengers={passengers} />
        ))}
      </div>

      {/* Pagination */}
      {result.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: result.totalPages }).map((_, i) => {
            const p = i + 1
            const isActive = p === result.page
            const params = new URLSearchParams({
              ...(Object.fromEntries(
                Object.entries(searchParams).filter(([, v]) => v !== undefined)
              ) as Record<string, string>),
              page: String(p),
            })
            return (
              <Link
                key={p}
                href={`/flights?${params.toString()}`}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'bg-white border border-border text-muted-foreground hover:border-primary hover:text-primary'
                }`}
                aria-label={`Page ${p}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {p}
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}

export default async function FlightsPage({ searchParams }: FlightsPageProps) {
  const params = await searchParams
  const currentSort = params.sortBy ?? 'price_asc'

  const buildSortHref = (sortValue: string) => {
    const sp = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined)
      ) as Record<string, string>
    )
    sp.set('sortBy', sortValue)
    sp.delete('page')
    return `/flights?${sp.toString()}`
  }

  return (
    <div className="pt-20 min-h-screen bg-background">
      {/* Search bar */}
      <div className="bg-white border-b border-border py-4">
        <div className="container-base">
          <SearchWidget variant="inline" />
        </div>
      </div>

      {/* Hero strip */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-transparent border-b border-border/40 py-4">
        <div className="container-base flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Plane className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {params.origin && params.destination
                  ? `${params.origin.toUpperCase()} → ${params.destination.toUpperCase()}`
                  : 'All Flights'}
              </p>
              {params.departureDate && (
                <p className="text-xs text-muted-foreground">{params.departureDate}</p>
              )}
            </div>
          </div>

          {/* Sort pills */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-1">Sort:</span>
            {SORT_OPTIONS.map((opt) => (
              <Link
                key={opt.value}
                href={buildSortHref(opt.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  currentSort === opt.value
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
                }`}
              >
                <opt.icon className="w-3 h-3" />
                {opt.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container-base py-8">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-56 flex-shrink-0" aria-label="Flight filters">
            <FlightFilters searchParams={params as Record<string, string | undefined>} />
          </aside>

          {/* Results */}
          <main className="flex-1 min-w-0" id="flight-results">
            <Suspense
              fallback={
                <div className="flex flex-col gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <FlightCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <FlightResults searchParams={params} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}
