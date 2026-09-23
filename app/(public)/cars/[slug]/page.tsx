import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Users, Settings, Fuel, ChevronLeft, CheckCircle2, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getCarBySlug, getCarReviews } from '@/lib/services/cars.service'
import { ReviewList } from '@/components/reviews/ReviewList'
import { CarBookingWidget } from '@/components/cars/CarBookingWidget'
import { SearchWidget } from '@/components/search/SearchWidget'

interface CarDetailPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ pickupDate?: string; returnDate?: string }>
}

export async function generateMetadata({ params }: CarDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const car = await getCarBySlug(slug)
  if (!car) return { title: 'Car Not Found' }
  return {
    title: `${car.make} ${car.model} ${car.year ?? ''}`.trim(),
    description: `Rent the ${car.make} ${car.model} in ${car.location}, Sri Lanka. ${car.category} car, ${car.seats} seats, $${car.price_per_day}/day.`,
  }
}

const categoryColors: Record<string, string> = {
  economy: 'bg-blue-50 text-blue-700',
  hybrid: 'bg-green-50 text-green-700',
  suv: 'bg-orange-50 text-orange-700',
  luxury: 'bg-amber-50 text-amber-700',
}

export default async function CarDetailPage({ params, searchParams }: CarDetailPageProps) {
  const { slug } = await params
  const sp = await searchParams

  const car = await getCarBySlug(slug)
  if (!car) notFound()

  const reviews = await getCarReviews(car.id, 5)

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="bg-white border-b border-border py-4">
        <div className="container-base">
          <SearchWidget variant="inline" />
        </div>
      </div>
      <div className="container-base py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/cars" className="hover:text-primary flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            Car Rentals
          </Link>
          <span>/</span>
          <span className="text-foreground">{car.make} {car.model}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="rounded-2xl overflow-hidden aspect-video relative bg-muted">
              <Image
                src={car.images[0] ?? 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1200'}
                alt={`${car.make} ${car.model}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>

            {car.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {car.images.slice(1, 5).map((img, i) => (
                  <div key={i} className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                    <Image src={img} alt={`${car.make} ${car.model} view ${i + 2}`} fill className="object-cover" sizes="120px" />
                  </div>
                ))}
              </div>
            )}

            {/* Info */}
            <div>
              <div className="flex items-start gap-3 mb-3">
                <Badge className={`capitalize border-0 rounded-full ${categoryColors[car.category] ?? 'bg-muted text-muted-foreground'}`}>
                  {car.category}
                </Badge>
              </div>
              <h1 className="font-heading text-3xl font-bold mb-2">
                {car.make} {car.model} {car.year && <span className="text-muted-foreground font-normal">({car.year})</span>}
              </h1>
              <p className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                Pickup/Return: {car.location}
              </p>
            </div>

            {/* Specs */}
            <div>
              <h2 className="font-heading text-xl font-semibold mb-4">Vehicle Specs</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { icon: Users, label: 'Seats', value: `${car.seats} passengers` },
                  { icon: Settings, label: 'Transmission', value: car.transmission },
                  { icon: Fuel, label: 'Type', value: car.category },
                ].map((spec) => (
                  <div key={spec.label} className="flex items-center gap-3 p-4 rounded-xl bg-muted/40 border border-border">
                    <spec.icon className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">{spec.label}</p>
                      <p className="text-sm font-medium capitalize">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {car.features.length > 0 && (
              <div>
                <h2 className="font-heading text-xl font-semibold mb-4">What&apos;s Included</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {car.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm capitalize">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Reviews */}
            <div>
              <h2 className="font-heading text-xl font-semibold mb-4">Customer Reviews</h2>
              <ReviewList reviews={reviews} />
            </div>
          </div>

          {/* Booking Widget */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <CarBookingWidget
                car={car}
                initialPickupDate={sp.pickupDate}
                initialReturnDate={sp.returnDate}
              />
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground justify-center">
                <Shield className="w-4 h-4 text-primary" />
                Free cancellation up to 24h before pickup
              </div>
            </div>
          </div>
        </div>

        {/* Mobile sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-border p-4 z-40">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-heading font-bold text-lg">${car.price_per_day}<span className="text-sm font-normal text-muted-foreground">/day</span></p>
            </div>
            <Button className="rounded-xl bg-primary hover:bg-[#164d37] px-8 font-semibold">
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
