'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import {
  Plane, CheckCircle2, User, CreditCard, ChevronRight,
  Loader2, Tag, X, Clock, ArrowRight, Luggage, Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useBookingStore } from '@/lib/store/booking-store'
import { formatDuration } from '@/lib/utils'
import { confirmMockPayment } from '@/app/actions/booking'

const passengerSchema = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().min(1, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(7, 'Phone number required'),
  passportNumber: z.string().optional(),
  specialRequests: z.string().optional(),
})
type PassengerInput = z.infer<typeof passengerSchema>

const STEPS = ['Review Flight', 'Passenger Details', 'Payment']

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div className={`flex items-center gap-2 ${i < current ? 'text-primary' : i === current ? 'text-foreground' : 'text-muted-foreground'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 ${
              i < current ? 'border-primary bg-primary text-white'
              : i === current ? 'border-primary text-primary'
              : 'border-muted-foreground/30 text-muted-foreground/50'
            }`}>
              {i < current ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            <span className="hidden sm:block text-sm font-medium">{step}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-px w-6 sm:w-12 ${i < current ? 'bg-primary' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function promoBreakdown(subtotal: number, discountPercent: number): number {
  if (!discountPercent) return 0
  return subtotal * (discountPercent / 100)
}

function FlightSummaryCard() {
  const { selection, priceBreakdown, promoCode, discountPercent } = useBookingStore()
  if (!selection || !priceBreakdown) return null

  const discount = promoBreakdown(priceBreakdown.subtotal, discountPercent)

  return (
    <div className="bg-white rounded-2xl border border-border p-5 sticky top-24 space-y-4">
      {/* Flight Info */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
          <Plane className="w-3.5 h-3.5" />
          Flight
          {selection.cabinClass && (
            <Badge variant="outline" className="text-xs ml-1 capitalize">
              {selection.cabinClass}
            </Badge>
          )}
        </div>
        <p className="font-semibold text-sm">{selection.airline}</p>
        <p className="text-xs text-muted-foreground">{selection.flightNumber}</p>
      </div>

      <Separator />

      {/* Route */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-bold">{selection.origin?.split(' – ')[0]}</p>
          <p className="text-xs text-muted-foreground">{selection.origin?.split(' – ')[1]}</p>
          {selection.departure && (
            <p className="text-xs text-muted-foreground mt-1">{format(new Date(selection.departure), 'EEE, MMM d · HH:mm')}</p>
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <div className="text-right">
          <p className="text-lg font-bold">{selection.destination?.split(' – ')[0]}</p>
          <p className="text-xs text-muted-foreground">{selection.destination?.split(' – ')[1]}</p>
          {selection.arrival && (
            <p className="text-xs text-muted-foreground mt-1">{format(new Date(selection.arrival), 'EEE, MMM d · HH:mm')}</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Passengers */}
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Passengers</span>
        <span className="font-medium text-foreground">{selection.guests}</span>
      </div>

      {/* Price */}
      <Separator />
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>${priceBreakdown.basePrice} × {selection.guests} {selection.guests === 1 ? 'passenger' : 'passengers'}</span>
          <span>${priceBreakdown.subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" />{promoCode} ({discountPercent}% off)</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-muted-foreground">
          <span>Service fee (5%)</span>
          <span>${priceBreakdown.serviceFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Taxes (12%)</span>
          <span>${priceBreakdown.taxes.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-base">
          <span>Total</span>
          <span>${(priceBreakdown.total - discount).toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

function MockPaymentForm({
  onSuccess,
  passengerDetails,
  totalAmount,
}: {
  onSuccess: (bookingId: string) => void
  passengerDetails: PassengerInput
  totalAmount: number
}) {
  const { selection, priceBreakdown, promoCode, discountPercent } = useBookingStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selection) return

    setLoading(true)
    setError(null)

    try {
      const discount = promoBreakdown(priceBreakdown?.subtotal ?? 0, discountPercent)

      const result = await confirmMockPayment({
        type: 'flight',
        itemId: selection.fareId ?? selection.itemId,
        flightId: selection.flightId ?? '',
        fareId: selection.fareId ?? '',
        startDate: selection.startDate,
        endDate: selection.endDate,
        passengers: String(selection.guests),
        promoCode: promoCode ?? '',
        discountAmount: String(discount),
        passengerName: `${passengerDetails.firstName} ${passengerDetails.lastName}`,
        passengerEmail: passengerDetails.email,
        passengerPhone: passengerDetails.phone,
        passportNumber: passengerDetails.passportNumber ?? '',
        totalPrice: totalAmount,
      })

      // Notify parent — clearCart() is handled by parent AFTER navigation is set
      onSuccess(result.bookingId!)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-6 rounded-xl border border-border bg-muted/20 text-center">
        <CreditCard className="w-8 h-8 text-primary mx-auto mb-2 opacity-80" />
        <h3 className="font-semibold mb-1">Demo Mode Active</h3>
        <p className="text-sm text-muted-foreground">
          No actual payment gateway is integrated. Click below to simulate a successful payment and complete the booking.
        </p>
      </div>
      
      {error && (
        <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive" role="alert">
          {error}
        </div>
      )}
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-xl bg-primary hover:bg-[#164d37] font-semibold text-base shadow-lg shadow-primary/25"
        id="flight-pay-submit"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
        ) : (
          `Simulate Payment of $${totalAmount.toFixed(2)}`
        )}
      </Button>
    </form>
  )
}

export default function FlightCheckoutPage() {
  const router = useRouter()
  const { selection, priceBreakdown, promoCode, discountPercent, clearCart } = useBookingStore()
  const [step, setStep] = useState(0)
  const [passengerDetails, setPassengerDetails] = useState<PassengerInput | null>(null)
  // Guard against redirect when booking just completed
  const [completedBookingId, setCompletedBookingId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PassengerInput>({ resolver: zodResolver(passengerSchema) })

  useEffect(() => {
    if ((!selection || selection.type !== 'flight') && !completedBookingId) {
      router.replace('/flights')
    }
  }, [selection, completedBookingId, router])

  if ((!selection || selection.type !== 'flight') && !completedBookingId) {
    return (
      <div className="pt-20 min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!selection || selection.type !== 'flight' || !priceBreakdown) {
    return (
      <div className="pt-20 min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-muted-foreground">Booking confirmed! Redirecting…</p>
        </div>
      </div>
    )
  }

  const discount = promoBreakdown(priceBreakdown.subtotal, discountPercent)
  const totalAmount = Math.max(priceBreakdown.total - discount, 0)

  const onPassengerSubmit = (data: PassengerInput) => {
    setPassengerDetails(data)
    setStep(2)
  }

  const onPaymentSuccess = (bookingId: string) => {
    setCompletedBookingId(bookingId)
    clearCart()
    router.push(`/booking-confirmation/${bookingId}`)
  }

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="container-base py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading text-3xl font-bold mb-2">Complete Your Booking</h1>
          <p className="text-muted-foreground mb-8">Review your flight and complete payment.</p>

          <StepIndicator current={step} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">

              {/* Step 0 – Review Flight */}
              {step === 0 && (
                <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
                  <h2 className="font-heading text-xl font-semibold flex items-center gap-2">
                    <Plane className="w-5 h-5 text-primary" />
                    Review Your Flight
                  </h2>

                  <div className="rounded-xl bg-muted/30 p-5 space-y-4">
                    {/* Airline + cabin */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{selection.airline}</p>
                        <p className="text-sm text-muted-foreground">{selection.flightNumber}</p>
                      </div>
                      <Badge variant="outline" className="capitalize">{selection.cabinClass}</Badge>
                    </div>

                    <Separator />

                    {/* Route */}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-2xl font-bold">{selection.origin?.split(' – ')[0]}</p>
                        <p className="text-sm text-muted-foreground">{selection.origin?.split(' – ')[1]}</p>
                        {selection.departure && (
                          <p className="text-sm font-medium mt-1">{format(new Date(selection.departure), 'EEE, MMM d, HH:mm')}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-center gap-1 text-muted-foreground">
                        <ArrowRight className="w-5 h-5" />
                        <span className="text-xs">Direct</span>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{selection.destination?.split(' – ')[0]}</p>
                        <p className="text-sm text-muted-foreground">{selection.destination?.split(' – ')[1]}</p>
                        {selection.arrival && (
                          <p className="text-sm font-medium mt-1">{format(new Date(selection.arrival), 'EEE, MMM d, HH:mm')}</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Passengers</span>
                      <span className="font-medium">{selection.guests}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Fare type</span>
                      <span className="font-medium capitalize">{selection.fareType}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total to Pay</span>
                      <span className="text-primary">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl" onClick={() => router.back()}>
                      Change Fare
                    </Button>
                    <Button
                      className="flex-1 rounded-xl bg-primary hover:bg-[#164d37]"
                      onClick={() => setStep(1)}
                      id="flight-checkout-step1"
                    >
                      Continue <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 1 – Passenger Details */}
              {step === 1 && (
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h2 className="font-heading text-xl font-semibold flex items-center gap-2 mb-5">
                    <User className="w-5 h-5 text-primary" />
                    Lead Passenger Details
                  </h2>
                  <form onSubmit={handleSubmit(onPassengerSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" className="rounded-xl" {...register('firstName')} />
                        {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" className="rounded-xl" {...register('lastName')} />
                        {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" className="rounded-xl" {...register('email')} />
                      {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+94 77 123 4567" className="rounded-xl" {...register('phone')} />
                      {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="passportNumber">Passport Number <span className="text-muted-foreground text-xs">(optional)</span></Label>
                      <Input id="passportNumber" placeholder="N1234567" className="rounded-xl" {...register('passportNumber')} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="specialRequests">Special Requests <span className="text-muted-foreground text-xs">(optional)</span></Label>
                      <Input id="specialRequests" placeholder="Aisle seat, vegetarian meal..." className="rounded-xl" {...register('specialRequests')} />
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="rounded-xl" onClick={() => setStep(0)} type="button">Back</Button>
                      <Button type="submit" className="flex-1 rounded-xl bg-primary hover:bg-[#164d37]" id="flight-passenger-submit">
                        Continue to Payment <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Step 2 – Payment */}
              {step === 2 && passengerDetails && (
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h2 className="font-heading text-xl font-semibold flex items-center gap-2 mb-5">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Secure Payment
                  </h2>
                  <MockPaymentForm
                    onSuccess={onPaymentSuccess}
                    passengerDetails={passengerDetails}
                    totalAmount={totalAmount}
                  />
                  <Button variant="ghost" className="mt-4 rounded-xl w-full text-muted-foreground" onClick={() => setStep(1)}>
                    ← Back to Passenger Details
                  </Button>
                </div>
              )}

            </div>

            {/* Sidebar Summary */}
            <div>
              <FlightSummaryCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
