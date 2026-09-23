'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Users, Bed, DollarSign, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useBookingStore } from '@/lib/store/booking-store'
import { calculatePriceBreakdown } from '@/lib/utils/pricing'
import type { RoomType } from '@/lib/supabase/types'
import Image from 'next/image'

interface RoomTypeSelectorProps {
  rooms: RoomType[]
  hotelId: string
  checkIn?: string
  checkOut?: string
  guests?: number
}

export function RoomTypeSelector({
  rooms,
  hotelId,
  checkIn,
  checkOut,
  guests = 2,
}: RoomTypeSelectorProps) {
  const router = useRouter()
  const { setSelection, setPriceBreakdown } = useBookingStore()
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)

  const nights =
    checkIn && checkOut
      ? Math.max(
        1,
        Math.ceil(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
        )
      )
      : 1

  const handleSelect = (room: RoomType) => {
    if (!checkIn || !checkOut) {
      // No dates - prompt user
      router.push(`/hotels?city=&checkIn=&checkOut=&scroll=dates`)
      return
    }

    const breakdown = calculatePriceBreakdown({
      basePrice: room.base_price,
      startDate: checkIn,
      endDate: checkOut,
      type: 'hotel',
      guests,
    })

    setSelection({
      type: 'hotel',
      itemId: room.id,
      itemName: room.name,
      hotelId,
      startDate: checkIn,
      endDate: checkOut,
      guests,
      basePrice: room.base_price,
      coverImage: room.images[0],
    })

    setPriceBreakdown(breakdown)
    router.push('/checkout')
  }

  return (
    <div className="space-y-4">
      {rooms.length === 0 ? (
        <p className="text-muted-foreground text-sm">No room types available at the moment.</p>
      ) : (
        rooms.map((room) => {
          const isSelected = selectedRoom === room.id
          const totalPrice = room.base_price * nights

          return (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(room.id)}
              className={`
                flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all
                ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 bg-white'}
              `}
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
                    {nights > 1 && (
                      <p className="text-xs text-muted-foreground">
                        ${totalPrice.toFixed(0)} total for {nights} nights
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelect(room)
                    }}
                    size="sm"
                    className={`rounded-xl ${isSelected
                        ? 'bg-primary hover:bg-[#164d37]'
                        : 'bg-primary hover:bg-[#164d37]'
                      }`}
                  >
                    {checkIn && checkOut ? 'Book Now' : 'Select Dates First'}
                  </Button>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
