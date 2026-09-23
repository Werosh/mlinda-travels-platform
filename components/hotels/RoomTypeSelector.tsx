'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Users, Bed, CheckCircle, Calendar, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { useBookingStore } from '@/lib/store/booking-store'
import { calculatePriceBreakdown } from '@/lib/utils/pricing'
import type { RoomType } from '@/lib/supabase/types'
import type { DateRange } from 'react-day-picker'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface RoomTypeSelectorProps {
  rooms: RoomType[]
  hotelId: string
  hotelName?: string
  checkIn?: string
  checkOut?: string
  guests?: number
}

export function RoomTypeSelector({
  rooms,
  hotelId,
  hotelName,
  checkIn,
  checkOut,
  guests = 2,
}: RoomTypeSelectorProps) {
  const router = useRouter()
  const { setSelection, setPriceBreakdown } = useBookingStore()
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [pendingRoomId, setPendingRoomId] = useState<string | null>(null)
  const [activePopover, setActivePopover] = useState<string | null>(null)
  const [inlineDateRange, setInlineDateRange] = useState<DateRange | undefined>(
    checkIn && checkOut
      ? { from: new Date(checkIn), to: new Date(checkOut) }
      : undefined
  )

  // Use inline dates if URL params not set
  const effectiveCheckIn = inlineDateRange?.from ? format(inlineDateRange.from, 'yyyy-MM-dd') : checkIn
  const effectiveCheckOut = inlineDateRange?.to ? format(inlineDateRange.to, 'yyyy-MM-dd') : checkOut

  const nights =
    effectiveCheckIn && effectiveCheckOut
      ? Math.max(
          1,
          Math.ceil(
            (new Date(effectiveCheckOut).getTime() - new Date(effectiveCheckIn).getTime()) / (1000 * 60 * 60 * 24)
          )
        )
      : 1

  const handleSelect = (room: RoomType) => {
    if (!effectiveCheckIn || !effectiveCheckOut) {
      // No dates — mark this room as pending and pop the date picker
      setPendingRoomId(room.id)
      setSelectedRoom(room.id)
      setActivePopover(`room-${room.id}`)
      return
    }

    const breakdown = calculatePriceBreakdown({
      basePrice: room.base_price,
      startDate: effectiveCheckIn,
      endDate: effectiveCheckOut,
      type: 'hotel',
      guests,
    })

    setSelection({
      type: 'hotel',
      itemId: room.id,
      itemName: room.name,
      hotelId,
      hotelName,
      startDate: effectiveCheckIn,
      endDate: effectiveCheckOut,
      guests,
      basePrice: room.base_price,
      coverImage: room.images[0],
    })

    setPriceBreakdown(breakdown)
    router.push('/checkout')
  }

  // Called when dates are selected from the inline picker
  const onDateRangeSelected = (range: DateRange | undefined, pendingRoom?: RoomType) => {
    setInlineDateRange(range)
    if (range?.from && range?.to) {
      setActivePopover(null)
      // If there was a pending room, immediately proceed to checkout
      if (pendingRoom) {
        const start = format(range.from, 'yyyy-MM-dd')
        const end = format(range.to, 'yyyy-MM-dd')
        const breakdown = calculatePriceBreakdown({
          basePrice: pendingRoom.base_price,
          startDate: start,
          endDate: end,
          type: 'hotel',
          guests,
        })
        setSelection({
          type: 'hotel',
          itemId: pendingRoom.id,
          itemName: pendingRoom.name,
          hotelId,
          hotelName,
          startDate: start,
          endDate: end,
          guests,
          basePrice: pendingRoom.base_price,
          coverImage: pendingRoom.images[0],
        })
        setPriceBreakdown(breakdown)
        setPendingRoomId(null)
        router.push('/checkout')
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Inline Date Banner — shown when no dates are set */}
      {(!effectiveCheckIn || !effectiveCheckOut) && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20">
          <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Select your dates to see pricing</p>
            <p className="text-xs text-muted-foreground">Prices shown are per night estimates</p>
          </div>
          <Popover open={activePopover === 'banner'} onOpenChange={(open) => setActivePopover(open ? 'banner' : null)}>
            <PopoverTrigger render={
              <Button size="sm" variant="outline" className="rounded-xl border-primary/30 text-primary hover:bg-primary/5 gap-1.5" />
            }>
                <Calendar className="w-3.5 h-3.5" />
                {inlineDateRange?.from
                  ? inlineDateRange.to
                    ? `${format(inlineDateRange.from, 'MMM d')} – ${format(inlineDateRange.to, 'MMM d')}`
                    : format(inlineDateRange.from, 'MMM d')
                  : 'Choose dates'}
                <ChevronDown className="w-3.5 h-3.5" />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl" align="end">
              <CalendarComponent
                mode="range"
                selected={inlineDateRange}
                onSelect={(range) => onDateRangeSelected(range, undefined)}
                disabled={{ before: new Date() }}
                numberOfMonths={2}
                className="rounded-2xl p-3"
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Date display when dates are set */}
      {effectiveCheckIn && effectiveCheckOut && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
          <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="text-sm text-muted-foreground flex-1">
            {format(new Date(effectiveCheckIn), 'MMM d')} →{' '}
            {format(new Date(effectiveCheckOut), 'MMM d, yyyy')}
            <span className="ml-1 font-medium text-foreground">({nights} nights)</span>
          </span>
          <Popover open={activePopover === 'change'} onOpenChange={(open) => setActivePopover(open ? 'change' : null)}>
            <PopoverTrigger render={
              <Button size="sm" variant="ghost" className="rounded-lg h-7 text-xs text-primary hover:bg-primary/5" />
            }>
                Change
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl" align="end">
              <CalendarComponent
                mode="range"
                selected={inlineDateRange ?? (checkIn && checkOut ? { from: new Date(checkIn), to: new Date(checkOut) } : undefined)}
                onSelect={(range) => onDateRangeSelected(range, undefined)}
                disabled={{ before: new Date() }}
                numberOfMonths={2}
                className="rounded-2xl p-3"
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Room list */}
      {rooms.length === 0 ? (
        <p className="text-muted-foreground text-sm">No room types available at the moment.</p>
      ) : (
        rooms.map((room) => {
          const isSelected = selectedRoom === room.id
          const isPending = pendingRoomId === room.id
          const totalPrice = room.base_price * nights

          return (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(room.id)}
              className={cn(
                'flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all',
                isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 bg-white'
              )}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedRoom(room.id)}
            >
              {/* Image */}
              {room.images[0] && (
                <div className="relative w-full sm:w-40 h-32 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={room.images[0]}
                    alt={room.name}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
              )}

              {/* Details */}
              <div className="flex-1 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading font-semibold text-base">{room.name}</h3>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                  </div>
                  {room.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{room.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="w-3.5 h-3.5 text-primary/70" />
                      Up to {room.max_guests} guests
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Bed className="w-3.5 h-3.5 text-primary/70" />
                      {room.total_rooms} rooms
                    </span>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-heading font-bold text-xl text-foreground">
                        ${room.base_price}
                      </span>
                      <span className="text-xs text-muted-foreground">/night</span>
                    </div>
                    {effectiveCheckIn && effectiveCheckOut && nights > 1 && (
                      <p className="text-xs text-muted-foreground">
                        ${totalPrice.toFixed(0)} total for {nights} nights
                      </p>
                    )}
                  </div>

                  {/* Book / Date Picker trigger */}
                  {isPending && (!effectiveCheckIn || !effectiveCheckOut) ? (
                    <Popover open={activePopover === `room-${room.id}`} onOpenChange={(open) => setActivePopover(open ? `room-${room.id}` : null)}>
                      <PopoverTrigger render={
                        <Button
                          size="sm"
                          className="rounded-xl bg-primary hover:bg-[#164d37] gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        />
                      }>
                          <Calendar className="w-3.5 h-3.5" />
                          Pick dates
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl" align="end">
                        <CalendarComponent
                          mode="range"
                          selected={inlineDateRange}
                          onSelect={(range) => onDateRangeSelected(range, room)}
                          disabled={{ before: new Date() }}
                          numberOfMonths={2}
                          className="rounded-2xl p-3"
                        />
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelect(room)
                      }}
                      size="sm"
                      className="rounded-xl bg-primary hover:bg-[#164d37]"
                    >
                      Book Now
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
