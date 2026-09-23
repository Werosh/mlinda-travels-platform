'use server'

import { validatePromoCode as serviceValidatePromoCode } from '@/lib/services/bookings.service'

export async function validatePromoCode(
  code: string,
  bookingType: 'hotel' | 'car',
  amount: number
) {
  return serviceValidatePromoCode(code, bookingType, amount)
}
