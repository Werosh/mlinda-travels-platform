'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Star } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const AMENITY_OPTIONS = [
  'free wifi',
  'pool',
  'spa',
  'gym',
  'restaurant',
  'bar',
  'parking',
  'concierge',
  'room service',
  'beachfront',
  'ocean view',
  'safari',
]

const PRICE_RANGES = [
  { label: 'Under $100', min: 0, max: 100 },
  { label: '$100 – $250', min: 100, max: 250 },
  { label: '$250 – $500', min: 250, max: 500 },
  { label: '$500+', min: 500, max: undefined },
]

interface HotelFiltersProps {
  searchParams: Record<string, string | undefined>
}

export function HotelFilters({ searchParams }: HotelFiltersProps) {
  const router = useRouter()
  const currentAmenities = searchParams.amenities?.split(',').filter(Boolean) ?? []
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(currentAmenities)
  const [starRating, setStarRating] = useState<number | undefined>(
    searchParams.starRating ? Number(searchParams.starRating) : undefined
  )
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({
    min: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    max: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
  })

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (searchParams.city) params.set('city', searchParams.city)
    if (searchParams.checkIn) params.set('checkIn', searchParams.checkIn)
    if (searchParams.checkOut) params.set('checkOut', searchParams.checkOut)
    if (searchParams.guests) params.set('guests', searchParams.guests)
    if (selectedAmenities.length) params.set('amenities', selectedAmenities.join(','))
    if (starRating) params.set('starRating', String(starRating))
    if (priceRange.min) params.set('minPrice', String(priceRange.min))
    if (priceRange.max) params.set('maxPrice', String(priceRange.max))
    router.push(`/hotels?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedAmenities([])
    setStarRating(undefined)
    setPriceRange({})
    const params = new URLSearchParams()
    if (searchParams.city) params.set('city', searchParams.city)
    router.push(`/hotels?${params.toString()}`)
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    )
  }

  const hasFilters = selectedAmenities.length > 0 || starRating || priceRange.min || priceRange.max

  return (
    <div className="bg-white rounded-2xl border border-border p-5 sticky top-24 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-base">Filters</h3>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Star Rating */}
      <div>
        <p className="text-sm font-medium mb-3">Star Rating</p>
        <div className="flex flex-col gap-2">
          {[5, 4, 3].map((stars) => (
            <button
              key={stars}
              onClick={() => setStarRating(starRating === stars ? undefined : stars)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors text-left',
                starRating === stars
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'hover:bg-muted border border-transparent'
              )}
              aria-pressed={starRating === stars}
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-muted-foreground">& above</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <p className="text-sm font-medium mb-3">Price per Night</p>
        <div className="flex flex-col gap-2">
          {PRICE_RANGES.map((range) => {
            const isSelected = priceRange.min === range.min && priceRange.max === range.max
            return (
              <button
                key={range.label}
                onClick={() =>
                  setPriceRange(isSelected ? {} : { min: range.min, max: range.max })
                }
                className={cn(
                  'px-3 py-2 rounded-xl text-sm text-left transition-colors',
                  isSelected
                    ? 'bg-primary/10 text-primary border border-primary/30'
                    : 'hover:bg-muted border border-transparent'
                )}
                aria-pressed={isSelected}
              >
                {range.label}
              </button>
            )
          })}
        </div>
      </div>

      <Separator />

      {/* Amenities */}
      <div>
        <p className="text-sm font-medium mb-3">Amenities</p>
        <div className="flex flex-col gap-2.5">
          {AMENITY_OPTIONS.map((amenity) => (
            <div key={amenity} className="flex items-center gap-2">
              <Checkbox
                id={`amenity-${amenity}`}
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`amenity-${amenity}`}
                className="text-sm capitalize cursor-pointer text-muted-foreground hover:text-foreground"
              >
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={applyFilters}
        className="w-full rounded-xl bg-primary hover:bg-[#164d37]"
      >
        Apply Filters
      </Button>
    </div>
  )
}
