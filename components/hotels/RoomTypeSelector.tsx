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
  const [isSingleDay, setIsSingleDay] = useState(false)
  const [inlineDateRange, setInlineDateRange] = useState<DateRange | undefined>(
    checkIn && checkOut
      ? { from: new Date(checkIn), to: new Date(checkOut) }
      : undefined
  )

  // Use inline dates if URL params not set
  const effectiveCheckIn = inlineDateRange?.from ? format(inlineDateRange.from, 'yyyy-MM-dd') : checkIn
  const effectiveCheckOut = inlineDateRange?.to ? format(inlineDateRange.to, 'yyyy-MM-dd') : checkOut

  const nights = isSingleDay ? 1 : (
    effectiveCheckIn && effectiveCheckOut
      ? Math.max(
          1,
          Math.ceil(
            (new Date(effectiveCheckOut).getTime() - new Date(effectiveCheckIn).getTime()) / (1000 * 60 * 60 * 24)
          )
        )
      : 1
  )

  const handleSelect = (room: RoomType) => {
    const finalCheckOut = isSingleDay ? effectiveCheckIn : effectiveCheckOut;
    
    if (!effectiveCheckIn || !finalCheckOut) {
      setPendingRoomId(room.id)
      setSelectedRoom(room.id)
      setActivePopover(`room-${room.id}`)
      return
    }

    const breakdown = calculatePriceBreakdown({
      basePrice: room.base_price,
      startDate: effectiveCheckIn,
      endDate: finalCheckOut,
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
      endDate: finalCheckOut,
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
    // Only close the popover if both dates are selected. The user can then click Book Now.
    if (range?.from && range?.to) {
      setActivePopover(null)
      setPendingRoomId(null)
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

                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 mt-2 pt-4 border-t border-border/50">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-heading font-bold text-xl text-foreground">
                        ${room.base_price}
                      </span>
                      <span className="text-xs text-muted-foreground">/night</span>
                    </div>
                    {effectiveCheckIn && (isSingleDay || effectiveCheckOut) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        ${totalPrice.toFixed(0)} total for {nights} {nights === 1 ? 'night' : 'nights'}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-end gap-3 w-full xl:w-auto">
                    <div className="flex items-center flex-wrap justify-end gap-3">
                      <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer text-muted-foreground hover:text-foreground transition-colors mr-2">
                        <input
                          type="checkbox"
                          checked={isSingleDay}
                          onChange={(e) => setIsSingleDay(e.target.checked)}
                          className="rounded text-primary focus:ring-primary h-3.5 w-3.5 accent-primary cursor-pointer"
                        />
                        Single Day
                      </label>
                      
                      <div className="flex items-center gap-2">
                        <Popover open={activePopover === `room-${room.id}`} onOpenChange={(open) => setActivePopover(open ? `room-${room.id}` : null)}>
                          <PopoverTrigger render={<Button 
                              variant="outline" 
                              size="sm" 
                              className={cn("h-9 text-xs font-normal border-primary/30", !effectiveCheckIn && "text-muted-foreground")}
                            />}>
                              <Calendar className="w-3.5 h-3.5 mr-1.5" />
                              {effectiveCheckIn ? format(new Date(effectiveCheckIn), 'MMM d') : 'Check-in'}
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl" align="end">
                            <CalendarComponent
                              mode={isSingleDay ? "single" : "range"}
                              selected={isSingleDay ? inlineDateRange?.from : inlineDateRange}
                              onSelect={(val: any) => {
                                if (isSingleDay) {
                                  setInlineDateRange({ from: val, to: undefined })
                                  setActivePopover(null)
                                } else {
                                  setInlineDateRange(val)
                                  if (val?.from && val?.to) setActivePopover(null)
                                }
                              }}
                              disabled={{ before: new Date() }}
                              numberOfMonths={isSingleDay ? 1 : 2}
                              className="rounded-2xl p-3"
                            />
                          </PopoverContent>
                        </Popover>

                        {!isSingleDay && (
                          <>
                            <span className="text-muted-foreground/60 text-xs font-medium">—</span>
                            <Popover open={activePopover === `room-out-${room.id}`} onOpenChange={(open) => setActivePopover(open ? `room-out-${room.id}` : null)}>
                              <PopoverTrigger render={<Button 
                                  variant="outline" 
                                  size="sm" 
                                  className={cn("h-9 text-xs font-normal border-primary/30", !effectiveCheckOut && "text-muted-foreground")}
                                />}>
                                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                  {effectiveCheckOut ? format(new Date(effectiveCheckOut), 'MMM d') : 'Check-out'}
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl" align="end">
                                <CalendarComponent
                                  mode="range"
                                  selected={inlineDateRange}
                                  onSelect={(val: any) => {
                                    setInlineDateRange(val)
                                    if (val?.from && val?.to) setActivePopover(null)
                                  }}
                                  disabled={{ before: new Date() }}
                                  numberOfMonths={2}
                                  className="rounded-2xl p-3"
                                />
                              </PopoverContent>
                            </Popover>
                          </>
                        )}
                      </div>
                    </div>

                    <Button
                      disabled={!effectiveCheckIn || (!isSingleDay && !effectiveCheckOut)}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelect(room)
                      }}
                      size="default"
                      className="rounded-xl bg-primary hover:bg-[#164d37] font-semibold w-full sm:w-auto h-9 px-6 mt-2 sm:mt-0"
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
