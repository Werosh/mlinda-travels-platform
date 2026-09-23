import { differenceInDays } from 'date-fns'

export function generateBookingRef(): string {
  const year = new Date().getFullYear()
  const seq = String(Math.floor(Math.random() * 999999) + 1).padStart(6, '0')
  return `MLT-${year}-${seq}`
}

export function calculatePriceBreakdown(params: {
  basePrice: number
  startDate: string
  endDate: string
  type: 'hotel' | 'car'
  guests?: number
  discountPercent?: number
}) {
  const nights = differenceInDays(new Date(params.endDate), new Date(params.startDate))
  const subtotal = params.basePrice * Math.max(nights, 1)
  const taxRate = 0.12 // 12% tax
  const serviceFee = subtotal * 0.05 // 5% service fee
  const taxes = subtotal * taxRate
  const discount = params.discountPercent ? subtotal * (params.discountPercent / 100) : 0
  const total = subtotal + taxes + serviceFee - discount

  return {
    nights,
    basePrice: params.basePrice,
    subtotal,
    taxes,
    serviceFee,
    discount,
    total: Math.max(total, 0),
    currency: 'USD',
  }
}
