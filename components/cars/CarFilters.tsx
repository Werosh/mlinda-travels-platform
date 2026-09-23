'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const CATEGORIES = ['economy', 'hybrid', 'suv', 'luxury']
const TRANSMISSIONS = ['automatic', 'manual']

interface CarFiltersProps {
  searchParams: Record<string, string | undefined>
}

export function CarFilters({ searchParams }: CarFiltersProps) {
  const router = useRouter()
  const [category, setCategory] = useState(searchParams.category ?? 'all')
  const [transmission, setTransmission] = useState(searchParams.transmission ?? 'all')
  const [priceMax, setPriceMax] = useState(searchParams.maxPrice ?? '')

  const apply = () => {
    const params = new URLSearchParams()
    if (searchParams.location) params.set('location', searchParams.location)
    if (searchParams.pickupDate) params.set('pickupDate', searchParams.pickupDate)
    if (searchParams.returnDate) params.set('returnDate', searchParams.returnDate)
    if (category !== 'all') params.set('category', category)
    if (transmission !== 'all') params.set('transmission', transmission)
    if (priceMax) params.set('maxPrice', priceMax)
    router.push(`/cars?${params.toString()}`)
  }

  const clear = () => {
    setCategory('all')
    setTransmission('all')
    setPriceMax('')
    const params = new URLSearchParams()
    if (searchParams.location) params.set('location', searchParams.location)
    router.push(`/cars?${params.toString()}`)
  }

  const hasFilters = category !== 'all' || transmission !== 'all' || priceMax

  return (
    <div className="bg-white rounded-2xl border border-border p-5 sticky top-24 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-base">Filters</h3>
        {hasFilters && (
          <button onClick={clear} className="text-xs text-primary hover:underline">
            Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <p className="text-sm font-medium mb-3">Category</p>
        <div className="flex flex-col gap-1.5">
          {['all', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'px-3 py-2 rounded-xl text-sm capitalize text-left transition-colors',
                category === cat
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'hover:bg-muted border border-transparent text-muted-foreground'
              )}
              aria-pressed={category === cat}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Transmission */}
      <div>
        <p className="text-sm font-medium mb-3">Transmission</p>
        <div className="flex flex-col gap-1.5">
          {['all', ...TRANSMISSIONS].map((t) => (
            <button
              key={t}
              onClick={() => setTransmission(t)}
              className={cn(
                'px-3 py-2 rounded-xl text-sm capitalize text-left transition-colors',
                transmission === t
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'hover:bg-muted border border-transparent text-muted-foreground'
              )}
              aria-pressed={transmission === t}
            >
              {t === 'all' ? 'Any Transmission' : t}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Max Price */}
      <div>
        <p className="text-sm font-medium mb-3">Max Price / Day</p>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
          <input
            type="number"
            placeholder="e.g. 150"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full h-10 pl-7 pr-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Maximum price per day"
          />
        </div>
      </div>

      <Button onClick={apply} className="w-full rounded-xl bg-primary hover:bg-[#164d37]">
        Apply Filters
      </Button>
    </div>
  )
}
