'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useBookingStore } from '@/lib/store/booking-store'
import { calculatePriceBreakdown } from '@/lib/utils/pricing'

interface FareSelectButtonProps {
  fareId: string
  flightId: string
  price: number
  passengers: number
  cabinClass: string
  fareType: string
  cabinTitle: string
  flightNumber: string
  airline: string
  origin: string       // "CMB – Colombo"
  destination: string  // "DXB – Dubai"
  departure: string    // ISO
  arrival: string      // ISO
}

export function FareSelectButton({
  fareId,
  flightId,
  price,
  passengers,
  cabinClass,
  fareType,
  cabinTitle,
  flightNumber,
  airline,
  origin,
  destination,
  departure,
  arrival,
}: FareSelectButtonProps) {
  const router = useRouter()
  const { setSelection, setPriceBreakdown } = useBookingStore()

  const handleSelect = () => {
    const totalPrice = price * passengers
    const departureDate = departure.split('T')[0]
    const arrivalDate = arrival.split('T')[0]

    // Price breakdown: treat as 1 "night" (it's a one-off flight fare)
    const breakdown = calculatePriceBreakdown({
      basePrice: price,
      startDate: departureDate,
      endDate: arrivalDate === departureDate
        ? new Date(new Date(departure).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        : arrivalDate,
      type: 'hotel', // reuse same fee logic (5% service + 12% tax)
      guests: passengers,
    })

    // Override subtotal to be per-passenger × passengers
    const subtotal = price * passengers
    const serviceFee = subtotal * 0.05
    const taxes = subtotal * 0.12
    const total = subtotal + serviceFee + taxes

    setSelection({
      type: 'flight',
      itemId: fareId,
      itemName: `${airline} ${flightNumber} – ${cabinTitle}`,
      flightId,
      fareId,
      cabinClass,
      fareType,
      flightNumber,
      airline,
      origin,
      destination,
      departure,
      arrival,
      startDate: departureDate,
      endDate: arrivalDate === departureDate
        ? new Date(new Date(departure).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        : arrivalDate,
      guests: passengers,
      basePrice: price,
    })

    setPriceBreakdown({
      nights: passengers,
      basePrice: price,
      subtotal,
      serviceFee,
      taxes,
      discount: 0,
      total,
      currency: 'USD',
    })

    router.push(`/flights/${flightId}/checkout?fareId=${fareId}&passengers=${passengers}`)
  }

  return (
    <Button
      onClick={handleSelect}
      className="w-full rounded-xl bg-primary hover:bg-primary-dark text-white shadow-sm shadow-primary/20"
      id={`fare-select-${fareId}`}
    >
      Select {cabinTitle}
      <ArrowRight className="w-4 h-4 ml-2" />
    </Button>
  )
}
