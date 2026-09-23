import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type BookingType = 'hotel' | 'car' | 'flight'

export interface BookingSelection {
  type: BookingType
  itemId: string           // room_type_id, car_id, or flight_fare_id
  itemName: string
  // Hotel fields
  hotelId?: string
  hotelName?: string
  roomTypeName?: string
  // Car fields
  carId?: string
  location?: string
  // Flight fields
  flightId?: string
  fareId?: string
  cabinClass?: string
  fareType?: string
  flightNumber?: string
  airline?: string
  origin?: string          // "CMB - Colombo"
  destination?: string     // "DXB - Dubai"
  departure?: string       // ISO string
  arrival?: string         // ISO string
  // Common
  startDate: string
  endDate: string
  guests: number           // passengers for flights
  basePrice: number        // per night / per day / per passenger
  coverImage?: string
}

export interface PriceBreakdown {
  nights: number           // or days / always 1 for flights
  basePrice: number
  subtotal: number
  taxes: number
  serviceFee: number
  discount: number
  total: number
  currency: string
}

interface BookingStore {
  selection: BookingSelection | null
  priceBreakdown: PriceBreakdown | null
  promoCode: string | null
  discountPercent: number

  // Actions
  setSelection: (selection: BookingSelection) => void
  setPriceBreakdown: (breakdown: PriceBreakdown) => void
  setPromoCode: (code: string, discountPercent: number) => void
  clearPromoCode: () => void
  clearCart: () => void
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set) => ({
      selection: null,
      priceBreakdown: null,
      promoCode: null,
      discountPercent: 0,

      setSelection: (selection) => set({ selection }),
      setPriceBreakdown: (priceBreakdown) => set({ priceBreakdown }),
      setPromoCode: (promoCode, discountPercent) => set({ promoCode, discountPercent }),
      clearPromoCode: () => set({ promoCode: null, discountPercent: 0 }),
      clearCart: () =>
        set({
          selection: null,
          priceBreakdown: null,
          promoCode: null,
          discountPercent: 0,
        }),
    }),
    {
      name: 'Mlinda-booking',
      partialize: (state) => ({
        selection: state.selection,
        priceBreakdown: state.priceBreakdown,
        promoCode: state.promoCode,
        discountPercent: state.discountPercent,
      }),
    }
  )
)
