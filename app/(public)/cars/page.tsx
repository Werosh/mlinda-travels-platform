import type { Metadata } from 'next'
import { Suspense } from 'react'
import { searchCars } from '@/lib/services/cars.service'
import { CarCard } from '@/components/cars/CarCard'
import { CarFilters } from '@/components/cars/CarFilters'
import { EmptyState } from '@/components/shared/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { SearchWidget } from '@/components/search/SearchWidget'

export const metadata: Metadata = {
  title: 'Car Rentals in Sri Lanka',
  description: 'Find and book the perfect rental car across Sri Lanka - economy, hybrid, SUV, and luxury options with real-time availability.',
}

interface CarsPageProps {
  searchParams: Promise<{
    location?: string
    pickupDate?: string
    returnDate?: string
    category?: string
    transmission?: string
    minSeats?: string
    minPrice?: string
    maxPrice?: string
    sortBy?: string
    page?: string
  }>
}

function CarCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <Skeleton className="h-44 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <div className="flex gap-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-16 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

async function CarResults({ searchParams }: { searchParams: Awaited<CarsPageProps['searchParams']> }) {
  const result = await searchCars({
    location: searchParams.location,
    pickupDate: searchParams.pickupDate,
    returnDate: searchParams.returnDate,
    category: searchParams.category,
    transmission: searchParams.transmission,
    minSeats: searchParams.minSeats ? Number(searchParams.minSeats) : undefined,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    sortBy: (searchParams.sortBy as 'price_asc' | 'price_desc' | 'seats_asc' | 'name_asc') ?? 'price_asc',
    page: searchParams.page ? Number(searchParams.page) : 1,
  })

  if (result.cars.length === 0) {
    return (
      <EmptyState
        icon="car"
        title="No cars available"
        description={
          searchParams.location
            ? `No cars found in "${searchParams.location}" for your dates. Try a different location or adjust your filters.`
            : 'Try adjusting your search filters to find available cars.'
        }
        action={{ label: 'Browse All Cars', href: '/cars' }}
      />
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{result.cars.length}</span> cars available
          {searchParams.location && ` in ${searchParams.location}`}
        </p>
        <select
          className="h-9 px-3 rounded-xl border border-border text-sm bg-white focus:outline-none"
          defaultValue={searchParams.sortBy ?? 'price_asc'}
          aria-label="Sort cars"
        >
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="seats_asc">Fewest Seats First</option>
          <option value="name_asc">Brand A–Z</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {result.cars.map((car) => (
          <CarCard
            key={car.id}
            car={car}
            pickupDate={searchParams.pickupDate}
            returnDate={searchParams.returnDate}
          />
        ))}
      </div>
    </>
  )
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const params = await searchParams

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="bg-white border-b border-border py-4">
        <div className="container-base">
          <SearchWidget variant="inline" />
        </div>
      </div>

      <div className="container-base py-8">
        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 flex-shrink-0" aria-label="Car filters">
            <CarFilters searchParams={params} />
          </aside>

          <main className="flex-1 min-w-0">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => <CarCardSkeleton key={i} />)}
                </div>
              }
            >
              <CarResults searchParams={params} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}
