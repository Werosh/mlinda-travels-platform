import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type BookingType = 'hotel' | 'car'

export interface BookingSelection {
  type: BookingType
  itemId: string           // room_type_id or car_id
  itemName: string
  hotelId?: string
  hotelName?: string
  carId?: string
  location?: string
  startDate: string
  endDate: string
  guests: number
  basePrice: number        // per night or per day
  coverImage?: string
}

export interface PriceBreakdown {
  nights: number
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

