'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { format } from 'date-fns'
import { Calendar, MapPin, Users, Car, Building2, Search, Plane, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { DateRange } from 'react-day-picker'

interface SearchWidgetProps {
  className?: string
  variant?: 'hero' | 'inline'
}

export function SearchWidget({ className, variant = 'hero' }: SearchWidgetProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  const [activeTab, setActiveTab] = useState<'hotels' | 'cars' | 'flights'>(() => {
    if (pathname?.includes('/hotels')) return 'hotels'
    if (pathname?.includes('/cars')) return 'cars'
    return 'flights'
  })

  useEffect(() => {
    if (pathname?.includes('/hotels')) setActiveTab('hotels')
    else if (pathname?.includes('/cars')) setActiveTab('cars')
    else if (pathname?.includes('/flights')) setActiveTab('flights')
  }, [pathname])

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
    } else if (activeTab === 'cars') {
      if (location) params.set('location', location)
      if (dateRange?.from) params.set('pickupDate', format(dateRange.from, 'yyyy-MM-dd'))
      if (dateRange?.to) params.set('returnDate', format(dateRange.to, 'yyyy-MM-dd'))
      router.push(`/cars?${params.toString()}`)
    } else if (activeTab === 'flights') {
      if (location) params.set('origin', location)
      if (dateRange?.from) params.set('departureDate', format(dateRange.from, 'yyyy-MM-dd'))
      if (dateRange?.to) params.set('returnDate', format(dateRange.to, 'yyyy-MM-dd'))
      params.set('passengers', String(guests))
      router.push(`/flights?${params.toString()}`)
    }
  }

  const isHero = variant === 'hero'

  if (isHero) {
    return (
      <div className={cn("w-full max-w-5xl mx-auto flex flex-col items-center", className)}>
        {/* Minimal Tab Toggle */}
        <div className="flex items-center gap-6 mb-6">
          <button
            onClick={() => setActiveTab('flights')}
            className={cn(
              "text-sm tracking-widest uppercase font-semibold transition-all duration-300 pb-1 border-b-2 flex items-center gap-2",
              activeTab === 'flights' ? "border-white text-white drop-shadow-md" : "border-transparent text-white/60 hover:text-white drop-shadow-sm"
            )}
          >
            <Plane className="w-4 h-4" /> Flights
          </button>
          <button
            onClick={() => setActiveTab('hotels')}
            className={cn(
              "text-sm tracking-widest uppercase font-semibold transition-all duration-300 pb-1 border-b-2 flex items-center gap-2",
              activeTab === 'hotels' ? "border-white text-white drop-shadow-md" : "border-transparent text-white/60 hover:text-white drop-shadow-sm"
            )}
          >
            <Building2 className="w-4 h-4" /> Stays
          </button>
          <button
            onClick={() => setActiveTab('cars')}
            className={cn(
              "text-sm tracking-widest uppercase font-semibold transition-all duration-300 pb-1 border-b-2 flex items-center gap-2",
              activeTab === 'cars' ? "border-white text-white drop-shadow-md" : "border-transparent text-white/60 hover:text-white drop-shadow-sm"
            )}
          >
            <Car className="w-4 h-4" /> Vehicles
          </button>
        </div>

        {/* Sleek Pill Bar */}
        <div className="w-full flex items-center bg-white/90 backdrop-blur-xl rounded-full p-2 shadow-2xl border border-white/40">
          
          <div className="flex-1 flex items-center px-6 border-r border-border/60">
            <MapPin className="w-4 h-4 text-primary mr-3" />
            <input
              type="text"
              placeholder={activeTab === 'hotels' ? "Destination" : activeTab === 'cars' ? "Pickup Location" : "Origin / Destination"}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground font-medium text-sm"
            />
          </div>

          <div className="flex-1 flex items-center px-6 border-r border-border/60">
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger className="w-full flex items-center text-left focus:outline-none group">
                <Calendar className="w-4 h-4 text-primary mr-3 group-hover:scale-110 transition-transform" />
                <span className={cn("text-sm font-medium truncate", !dateRange?.from && "text-muted-foreground")}>
                  {dateRange?.from ? (
                    dateRange.to ? (
                      `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}`
                    ) : (
                      format(dateRange.from, 'MMM d, yyyy')
                    )
                  ) : (
                    activeTab === 'hotels' ? 'Dates' : activeTab === 'cars' ? 'Pickup & Return' : 'Departure & Return'
                  )}
                </span>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-3xl shadow-2xl border-none" align="center">
                <CalendarComponent
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(range)
                  }}
                  disabled={{ before: new Date() }}
                  numberOfMonths={2}
                  className="rounded-3xl p-4 bg-white/95 backdrop-blur-xl"
                />
              </PopoverContent>
            </Popover>
          </div>

          {(activeTab === 'hotels' || activeTab === 'flights') && (
            <div className="flex-1 flex items-center px-6">
              <Popover>
                <PopoverTrigger className="w-full flex items-center text-left focus:outline-none group">
                  <Users className="w-4 h-4 text-primary mr-3 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">
                    {guests} {guests === 1 ? 'Guest' : 'Guests'}
                  </span>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4 rounded-3xl shadow-2xl border-none bg-white/95 backdrop-blur-xl" align="center">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-foreground">Guests</div>
                      <div className="text-xs text-muted-foreground">Ages 2 or above</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full border-border/60"
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        disabled={guests <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-4 text-center font-medium">{guests}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full border-border/60"
                        onClick={() => setGuests(Math.min(8, guests + 1))}
                        disabled={guests >= 8}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="pl-2">
            <Button
              onClick={handleSearch}
              className="h-12 w-12 rounded-full bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20 flex items-center justify-center p-0 shrink-0 transition-transform hover:scale-105"
            >
              <Search className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Default Inline Variant
  return (
    <div className={cn('bg-white border border-border shadow-sm rounded-2xl p-4 md:p-6', className)}>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-5">
        <TabsList className="h-10 bg-muted/60 rounded-xl p-1 gap-1">
          <TabsTrigger value="flights" className="rounded-lg flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white text-sm">
            <Plane className="w-3.5 h-3.5" /> Flights
          </TabsTrigger>
          <TabsTrigger value="hotels" className="rounded-lg flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white text-sm">
            <Building2 className="w-3.5 h-3.5" /> Hotels
          </TabsTrigger>
          <TabsTrigger value="cars" className="rounded-lg flex items-center gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white text-sm">
            <Car className="w-3.5 h-3.5" /> Car Rentals
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder={activeTab === 'hotels' ? 'Where are you going?' : activeTab === 'cars' ? 'Pickup location' : 'Origin / Destination'}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-9 h-11 rounded-xl border-border focus:border-primary bg-background/80"
          />
        </div>

        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger render={<Button
              variant="outline"
              className={cn('flex-1 md:w-56 h-11 rounded-xl border-border justify-start font-normal bg-background/80 hover:bg-background', !dateRange?.from && 'text-muted-foreground')}
            />}>
              <Calendar className="mr-2 w-4 h-4 flex-shrink-0 text-muted-foreground" />
              {dateRange?.from ? (
                dateRange.to ? <span className="text-sm truncate">{format(dateRange.from, 'MMM d')} – {format(dateRange.to, 'MMM d')}</span> : <span className="text-sm">{format(dateRange.from, 'MMM d, yyyy')}</span>
              ) : (
                <span className="text-sm">{activeTab === 'hotels' ? 'Check-in → Check-out' : activeTab === 'cars' ? 'Pickup → Return' : 'Departure → Return'}</span>
              )}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl" align="start">
            <CalendarComponent
              mode="range"
              selected={dateRange}
              onSelect={(range) => {
                setDateRange(range)
              }}
              disabled={{ before: new Date() }}
              numberOfMonths={2}
              className="rounded-2xl p-3"
            />
          </PopoverContent>
        </Popover>

        {(activeTab === 'hotels' || activeTab === 'flights') && (
          <Popover>
            <PopoverTrigger render={<Button
                variant="outline"
                className="md:w-40 h-11 rounded-xl border-border justify-start font-normal bg-background/80 hover:bg-background"
              />}>
                <Users className="mr-2 w-4 h-4 flex-shrink-0 text-muted-foreground" />
                <span className="text-sm">
                  {guests} {guests === 1 ? 'Guest' : 'Guests'}
                </span>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4 rounded-2xl shadow-xl" align="end">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-foreground">Guests</div>
                  <div className="text-xs text-muted-foreground">Ages 2 or above</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    disabled={guests <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-4 text-center font-medium">{guests}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setGuests(Math.min(8, guests + 1))}
                    disabled={guests >= 8}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        <Button onClick={handleSearch} size="lg" className="h-11 px-6 rounded-xl bg-primary hover:bg-[#164d37] font-semibold shadow-lg shadow-primary/25 transition-all">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  )
}

