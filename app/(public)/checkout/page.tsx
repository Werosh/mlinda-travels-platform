'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format, differenceInDays } from 'date-fns'
import {
  CheckCircle2, User, CreditCard, ChevronRight, Loader2,
  Building2, Car, Calendar, Users, Tag, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useBookingStore } from '@/lib/store/booking-store'
import { guestDetailsSchema, type GuestDetailsInput } from '@/lib/validations'
import { validatePromoCode, confirmMockPayment } from '@/app/actions/booking'
import Image from 'next/image'

const STEPS = ['Review', 'Guest Details', 'Payment', 'Confirm']

// ── Step Indicator ────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div className={`
            flex items-center gap-2
            ${i < current ? 'text-primary' : i === current ? 'text-foreground' : 'text-muted-foreground'}
          `}>
            <div className={`
              w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2
              ${i < current
                ? 'border-primary bg-primary text-white'
                : i === current
                  ? 'border-primary text-primary'
                  : 'border-muted-foreground/30 text-muted-foreground/50'}
            `}>
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

// ── Booking Summary Card ──────────────────────────────────────
function BookingSummaryCard() {
  const { selection, priceBreakdown, promoCode, discountPercent, setPromoCode, clearPromoCode } = useBookingStore()
  const [promoInput, setPromoInput] = useState('')
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoMessage, setPromoMessage] = useState<{ text: string; valid: boolean } | null>(null)

  if (!selection || !priceBreakdown) return null

  const nights = differenceInDays(new Date(selection.endDate), new Date(selection.startDate))

  const applyPromo = async () => {
    if (!promoInput.trim()) return
    setPromoLoading(true)
    const result = await validatePromoCode(promoInput.trim(), selection.type, priceBreakdown.subtotal)
    setPromoMessage({ text: result.message, valid: result.valid })
    if (result.valid) {
      setPromoCode(promoInput.trim().toUpperCase(), result.discountPercent)
    }
    setPromoLoading(false)
  }

  const discount = promoBreakdown(priceBreakdown.subtotal, discountPercent)

  return (
    <div className="bg-white rounded-2xl border border-border p-5 sticky top-24 space-y-4">
      {/* Item */}
      <div className="flex gap-3">
        {selection.coverImage && (
          <div className="relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0">
            <Image src={selection.coverImage} alt={selection.itemName} fill className="object-cover" sizes="80px" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            {selection.type === 'hotel' ? <Building2 className="w-3.5 h-3.5" /> : <Car className="w-3.5 h-3.5" />}
            {selection.type === 'hotel' ? 'Hotel Room' : 'Car Rental'}
          </div>
          <p className="font-semibold text-sm">{selection.itemName}</p>
          {selection.hotelName && <p className="text-xs text-muted-foreground">{selection.hotelName}</p>}
          {selection.location && <p className="text-xs text-muted-foreground">{selection.location}</p>}
        </div>
      </div>

      <Separator />

      {/* Dates */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            {format(new Date(selection.startDate), 'MMM d')} → {format(new Date(selection.endDate), 'MMM d, yyyy')}
            <span className="ml-1 text-xs">({nights} {nights === 1 ? 'night' : nights} {selection.type === 'hotel' ? 'nights' : 'days'})</span>
          </span>
        </div>
        {selection.type === 'hotel' && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{selection.guests} {selection.guests === 1 ? 'Guest' : 'Guests'}</span>
          </div>
        )}
      </div>

      <Separator />

      {/* Price breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>${priceBreakdown.basePrice} × {priceBreakdown.nights} {selection.type === 'hotel' ? 'nights' : 'days'}</span>
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

      {/* Promo Code */}
      <Separator />
      <div className="space-y-2">
        <p className="text-xs font-medium">Promo Code</p>
        {promoCode ? (
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-700 border-0 flex items-center gap-1">
              <Tag className="w-3 h-3" /> {promoCode}
            </Badge>
            <button onClick={clearPromoCode} className="text-muted-foreground hover:text-destructive">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
              placeholder="WELCOME10"
              className="h-9 rounded-xl text-sm uppercase"
              aria-label="Promo code"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={applyPromo}
              disabled={promoLoading || !promoInput}
              className="rounded-xl"
            >
              {promoLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
            </Button>
          </div>
        )}
        {promoMessage && (
          <p className={`text-xs ${promoMessage.valid ? 'text-green-600' : 'text-destructive'}`}>
            {promoMessage.text}
          </p>
        )}
      </div>
    </div>
  )
}

function promoBreakdown(subtotal: number, discountPercent: number): number {
  if (!discountPercent) return 0
  return subtotal * (discountPercent / 100)
}

// ── Mock Payment Form ───────────────────────────────────────────
function MockPaymentForm({
  onSuccess,
  guestDetails,
  totalAmount,
}: {
  onSuccess: (bookingId: string) => void
  guestDetails: GuestDetailsInput
  totalAmount: number
}) {
  const { selection, priceBreakdown, promoCode, discountPercent, clearCart } = useBookingStore()
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
        type: selection.type,
        itemId: selection.itemId,
        roomTypeId: selection.itemId,
        hotelId: selection.hotelId ?? '',
        carId: selection.carId ?? '',
        startDate: selection.startDate,
        endDate: selection.endDate,
        guests: String(selection.guests),
        totalPrice: totalAmount,
        promoCode: promoCode ?? '',
        discountAmount: String(discount),
      })

      clearCart()
      onSuccess(result.bookingId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
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
        id="pay-submit"
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

// ── Main Checkout Page ────────────────────────────────────────
export default function CheckoutPage() {
  const router = useRouter()
  const { selection, priceBreakdown, promoCode, discountPercent, clearCart } = useBookingStore()
  const [step, setStep] = useState(0)
  const [guestDetails, setGuestDetails] = useState<GuestDetailsInput | null>(null)
  const [completedBookingRef, setCompletedBookingRef] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestDetailsInput>({
    resolver: zodResolver(guestDetailsSchema),
  })

  // Redirect if no booking in store
  useEffect(() => {
    if (!selection) {
      router.replace('/')
    }
  }, [selection, router])

  if (!selection || !priceBreakdown) {
    return (
      <div className="pt-20 min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const discount = promoBreakdown(priceBreakdown.subtotal, discountPercent)
  const totalAmount = Math.max(priceBreakdown.total - discount, 0)

  const onGuestSubmit = (data: GuestDetailsInput) => {
    setGuestDetails(data)
    setStep(2)
  }

  const onPaymentSuccess = (bookingId: string) => {
    router.push(`/booking-confirmation/${bookingId}`)
  }

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="container-base py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading text-3xl font-bold mb-2">Complete Your Booking</h1>
          <p className="text-muted-foreground mb-8">You&apos;re almost there - review your selection and complete payment.</p>

          <StepIndicator current={step} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form steps */}
            <div className="lg:col-span-2">
              {/* Step 0 - Review */}
              {step === 0 && (
                <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
                  <h2 className="font-heading text-xl font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    Review Your Booking
                  </h2>
                  <div className="rounded-xl bg-muted/30 p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium capitalize">{selection.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Item</span>
                      <span className="font-medium">{selection.itemName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-in / Pickup</span>
                      <span className="font-medium">{format(new Date(selection.startDate), 'PPP')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-out / Return</span>
                      <span className="font-medium">{format(new Date(selection.endDate), 'PPP')}</span>
                    </div>
                    {selection.type === 'hotel' && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Guests</span>
                        <span className="font-medium">{selection.guests}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total to Pay</span>
                      <span className="text-primary">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="rounded-xl" onClick={() => router.back()}>
                      Edit Selection
                    </Button>
                    <Button
                      className="flex-1 rounded-xl bg-primary hover:bg-[#164d37]"
                      onClick={() => setStep(1)}
                      id="checkout-next-step1"
                    >
                      Continue <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 1 - Guest Details */}
              {step === 1 && (
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h2 className="font-heading text-xl font-semibold flex items-center gap-2 mb-5">
                    <User className="w-5 h-5 text-primary" />
                    {selection.type === 'hotel' ? 'Guest Details' : 'Driver Details'}
                  </h2>
                  <form onSubmit={handleSubmit(onGuestSubmit)} className="space-y-4">
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
                      <Label htmlFor="specialRequests">Special Requests (optional)</Label>
                      <Textarea
                        id="specialRequests"
                        placeholder="Early check-in, high floor, dietary requirements..."
                        className="rounded-xl resize-none"
                        rows={3}
                        {...register('specialRequests')}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="rounded-xl" onClick={() => setStep(0)} type="button">
                        Back
                      </Button>
                      <Button type="submit" className="flex-1 rounded-xl bg-primary hover:bg-[#164d37]" id="checkout-guest-submit">
                        Continue to Payment <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Step 2 - Payment */}
              {step === 2 && guestDetails && (
                <div className="bg-white rounded-2xl border border-border p-6">
                  <h2 className="font-heading text-xl font-semibold flex items-center gap-2 mb-5">
                    <CreditCard className="w-5 h-5 text-primary" />
                    Secure Payment
                  </h2>
                  <MockPaymentForm
                    onSuccess={onPaymentSuccess}
                    guestDetails={guestDetails}
                    totalAmount={totalAmount}
                  />
                  <Button variant="ghost" className="mt-4 rounded-xl w-full text-muted-foreground" onClick={() => setStep(1)}>
                    ← Back to Details
                  </Button>
                </div>
              )}
            </div>

            {/* Summary sidebar */}
            <div>
              <BookingSummaryCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
