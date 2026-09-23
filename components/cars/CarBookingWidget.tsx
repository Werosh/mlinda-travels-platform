'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format, differenceInDays } from 'date-fns'
import { Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Separator } from '@/components/ui/separator'
import { useBookingStore } from '@/lib/store/booking-store'
import { calculatePriceBreakdown } from '@/lib/utils/pricing'
import type { Car } from '@/lib/supabase/types'
import type { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'

interface CarBookingWidgetProps {
  car: Car
  initialPickupDate?: string
  initialReturnDate?: string
}

export function CarBookingWidget({ car, initialPickupDate, initialReturnDate }: CarBookingWidgetProps) {
  const router = useRouter()
  const { setSelection, setPriceBreakdown } = useBookingStore()
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    initialPickupDate && initialReturnDate
      ? { from: new Date(initialPickupDate), to: new Date(initialReturnDate) }
      : undefined
  )
  const [dateOpen, setDateOpen] = useState(false)

  const days = dateRange?.from && dateRange?.to
    ? Math.max(1, differenceInDays(dateRange.to, dateRange.from))
    : 0

  const total = days * car.price_per_day

  const handleBook = () => {
    if (!dateRange?.from || !dateRange?.to) {
      setDateOpen(true)
      return
    }

    const startDate = format(dateRange.from, 'yyyy-MM-dd')
    const endDate = format(dateRange.to, 'yyyy-MM-dd')

    const breakdown = calculatePriceBreakdown({
      basePrice: car.price_per_day,
      startDate,
      endDate,
      type: 'car',
    })

    setSelection({
      type: 'car',
      itemId: car.id,
      itemName: `${car.make} ${car.model}`,
      carId: car.id,
      location: car.location,
      startDate,
      endDate,
      guests: 1,
      basePrice: car.price_per_day,
      coverImage: car.images[0],
    })

    setPriceBreakdown(breakdown)
    router.push('/checkout')
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-baseline gap-1 mb-6">
        <span className="font-heading text-3xl font-bold text-foreground">${car.price_per_day}</span>
        <span className="text-muted-foreground text-sm">/day</span>
      </div>

      {/* Date Selection */}
      <Popover open={dateOpen} onOpenChange={setDateOpen}>
        <PopoverTrigger render={<Button
            variant="outline"
            className={cn(
              'w-full h-auto py-3 px-4 rounded-xl border-border justify-start font-normal mb-3',
              !dateRange?.from && 'text-muted-foreground'
            )}
            aria-label="Select rental dates"
          />}>
            <Calendar className="mr-2 w-4 h-4 text-muted-foreground flex-shrink-0" />
            {dateRange?.from ? (
              <div className="text-left">
                <p className="text-xs text-muted-foreground mb-0.5">Rental Period</p>
                <p className="text-sm font-medium">
                  {format(dateRange.from, 'MMM d')}
                  {dateRange.to && ` → ${format(dateRange.to, 'MMM d, yyyy')}`}
                </p>
              </div>
            ) : (
              <span className="text-sm">Select pickup → return date</span>
            )}
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

      {/* Location */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-muted/40 border border-border mb-4">
        <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
        <div>
          <p className="text-xs text-muted-foreground">Pickup & Return</p>
          <p className="text-sm font-medium">{car.location}</p>
        </div>
      </div>

      {/* Price Breakdown */}
      {days > 0 && (
        <div className="mb-4 space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>${car.price_per_day} × {days} {days === 1 ? 'day' : 'days'}</span>
            <span>${(car.price_per_day * days).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Service fee (5%)</span>
            <span>${(car.price_per_day * days * 0.05).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Taxes (12%)</span>
            <span>${(car.price_per_day * days * 0.12).toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-foreground">
            <span>Total</span>
            <span>${(car.price_per_day * days * 1.17).toFixed(2)}</span>
          </div>
        </div>
      )}

      <Button
        onClick={handleBook}
        className="w-full rounded-xl bg-primary hover:bg-[#164d37] h-12 text-base font-semibold shadow-lg shadow-primary/25"
        aria-label={`Book ${car.make} ${car.model}`}
      >
        {dateRange?.from && dateRange?.to ? 'Book Now' : 'Select Dates to Book'}
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-3">
        You won&apos;t be charged until next step
      </p>
    </div>
  )
}
