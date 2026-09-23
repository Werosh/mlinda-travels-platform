'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Calendar, MapPin, Users, Car, Building2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import type { DateRange } from 'react-day-picker'

interface SearchWidgetProps {
  className?: string
  variant?: 'hero' | 'inline'
}

export function SearchWidget({ className, variant = 'hero' }: SearchWidgetProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'hotels' | 'cars'>('hotels')
  const [location, setLocation] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [guests, setGuests] = useState(2)
  const [dateOpen, setDateOpen] = useState(false)

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (activeTab === 'hotels') {
      if (location) params.set('city', location)
      if (dateRange?.from) params.set('checkIn', format(dateRange.from, 'yyyy-MM-dd'))
      if (dateRange?.to) params.set('checkOut', format(dateRange.to, 'yyyy-MM-dd'))
      params.set('guests', String(guests))
      router.push(`/hotels?${params.toString()}`)
    } else {
      if (location) params.set('location', location)
      if (dateRange?.from) params.set('pickupDate', format(dateRange.from, 'yyyy-MM-dd'))
      if (dateRange?.to) params.set('returnDate', format(dateRange.to, 'yyyy-MM-dd'))
      router.push(`/cars?${params.toString()}`)
    }
  }

  const isHero = variant === 'hero'

  return (
    <div
      className={cn(
        'rounded-2xl p-4 md:p-6',
        isHero ? 'glass shadow-2xl' : 'bg-white border border-border shadow-sm',
        className
      )}
    >
      {/* Tab Toggle */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'hotels' | 'cars')}
        className="mb-5"
      >
        <TabsList className="h-10 bg-muted/60 rounded-xl p-1 gap-1">
          <TabsTrigger
            value="hotels"
            className="rounded-lg flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white text-sm"
          >
            <Building2 className="w-3.5 h-3.5" />
            Hotels
          </TabsTrigger>
          <TabsTrigger
            value="cars"
            className="rounded-lg flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white text-sm"
          >
            <Car className="w-3.5 h-3.5" />
            Car Rentals
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search Fields */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Location */}
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            id="search-location"
            placeholder={activeTab === 'hotels' ? 'Where are you going?' : 'Pickup location'}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-9 h-11 rounded-xl border-border focus:border-primary bg-background/80"
            aria-label="Location"
          />
        </div>

        {/* Date Range */}
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="search-dates"
              className={cn(
                'flex-1 md:w-56 h-11 rounded-xl border-border justify-start font-normal bg-background/80 hover:bg-background',
                !dateRange?.from && 'text-muted-foreground'
              )}
              aria-label="Select dates"
            >
              <Calendar className="mr-2 w-4 h-4 flex-shrink-0 text-muted-foreground" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <span className="text-sm truncate">
                    {format(dateRange.from, 'MMM d')} – {format(dateRange.to, 'MMM d')}
                  </span>
                ) : (
                  <span className="text-sm">{format(dateRange.from, 'MMM d, yyyy')}</span>
                )
              ) : (
                <span className="text-sm">{activeTab === 'hotels' ? 'Check-in → Check-out' : 'Pickup → Return'}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl" align="start">
            <CalendarComponent
              mode="range"
              selected={dateRange}
              onSelect={(range) => {
                setDateRange(range)
                if (range?.from && range?.to) setDateOpen(false)
              }}
              disabled={{ before: new Date() }}
              numberOfMonths={2}
              className="rounded-2xl p-3"
            />
          </PopoverContent>
        </Popover>

        {/* Guests (hotels only) */}
        {activeTab === 'hotels' && (
          <div className="relative md:w-40">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <select
              id="search-guests"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full h-11 pl-9 pr-4 rounded-xl border border-border bg-background/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none cursor-pointer"
              aria-label="Number of guests"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          id="search-submit"
          size="lg"
          className="h-11 px-6 rounded-xl bg-primary hover:bg-[#164d37] font-semibold shadow-lg shadow-primary/25 transition-all"
          aria-label={`Search ${activeTab}`}
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  )
}
