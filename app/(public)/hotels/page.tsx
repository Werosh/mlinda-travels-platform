import type { Metadata } from 'next'
import { Suspense } from 'react'
import { searchHotels } from '@/lib/services/hotels.service'
import { HotelCard } from '@/components/hotels/HotelCard'
import { HotelFilters } from '@/components/hotels/HotelFilters'
import { EmptyState } from '@/components/shared/EmptyState'
import { Skeleton } from '@/components/ui/skeleton'
import { SearchWidget } from '@/components/search/SearchWidget'
import { HotelSortSelect } from '@/components/hotels/HotelSortSelect'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { SlidersHorizontal, List, Grid3X3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hotels in Sri Lanka',
  description: 'Search and compare premium hotels across Sri Lanka. Filter by price, rating, amenities, and more.',
}

interface HotelsPageProps {
  searchParams: Promise<{
    city?: string
    checkIn?: string
    checkOut?: string
    guests?: string
    minPrice?: string
    maxPrice?: string
    starRating?: string
    amenities?: string
    sortBy?: string
    page?: string
    view?: string
  }>
}

function HotelCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <Skeleton className="h-52 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-16 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

async function HotelResults({
  searchParams,
}: {
  searchParams: Awaited<HotelsPageProps['searchParams']>
}) {
  const result = await searchHotels({
    city: searchParams.city,
    checkIn: searchParams.checkIn,
    checkOut: searchParams.checkOut,
    guests: searchParams.guests ? Number(searchParams.guests) : undefined,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    starRating: searchParams.starRating ? Number(searchParams.starRating) : undefined,
    amenities: searchParams.amenities ? searchParams.amenities.split(',') : undefined,
    sortBy: (searchParams.sortBy as 'price_asc' | 'price_desc' | 'rating_desc' | 'name_asc') ?? 'rating_desc',
    page: searchParams.page ? Number(searchParams.page) : 1,
  })

  const isListView = searchParams.view === 'list'

  if (result.hotels.length === 0) {
    return (
      <EmptyState
        icon="search"
        title="No hotels found"
        description={
          searchParams.city
            ? `We couldn't find any hotels in "${searchParams.city}" matching your filters. Try a different city or adjust your filters.`
            : 'Try adjusting your search filters to find available hotels.'
        }
        action={{ label: 'Browse All Hotels', href: '/hotels' }}
      />
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{result.total}</span> hotels found
          {searchParams.city && ` in ${searchParams.city}`}
        </p>
        <div className="flex items-center gap-2">
          <HotelSortSelect defaultValue={searchParams.sortBy ?? 'rating_desc'} />
          {/* View toggle */}
          <div className="flex border border-border rounded-xl overflow-hidden">
            <Link
              href={{ query: { ...searchParams, view: 'grid' } }}
              className={`p-2 ${!isListView ? 'bg-primary text-white' : 'bg-white text-muted-foreground hover:bg-muted'}`}
              aria-label="Grid view"
            >
              <Grid3X3 className="w-4 h-4" />
            </Link>
            <Link
              href={{ query: { ...searchParams, view: 'list' } }}
              className={`p-2 ${isListView ? 'bg-primary text-white' : 'bg-white text-muted-foreground hover:bg-muted'}`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className={isListView ? 'flex flex-col gap-4' : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'}>
        {result.hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} variant={isListView ? 'list' : 'grid'} />
        ))}
      </div>

      {/* Pagination */}
      {result.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: result.totalPages }).map((_, i) => {
            const p = i + 1
            const isActive = p === result.page
            const params = new URLSearchParams({ ...searchParams, page: String(p) })
            return (
              <Link
                key={p}
                href={`/hotels?${params.toString()}`}
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

export default async function HotelsPage({ searchParams }: HotelsPageProps) {
  const params = await searchParams

  return (
    <div className="pt-20 min-h-screen bg-background">
      {/* Search bar */}
      <div className="bg-white border-b border-border py-4">
        <div className="container-base">
          <SearchWidget variant="inline" />
        </div>
      </div>

      <div className="container-base py-8">
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0" aria-label="Hotel filters">
            <HotelFilters searchParams={params} />
          </aside>

          {/* Results */}
          <main className="flex-1 min-w-0">
            {/* Mobile filter trigger */}
            <div className="lg:hidden mb-4">
              <Button variant="outline" className="rounded-xl flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
            </div>

            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <HotelCardSkeleton key={i} />
                  ))}
                </div>
              }
            >
              <HotelResults searchParams={params} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}
