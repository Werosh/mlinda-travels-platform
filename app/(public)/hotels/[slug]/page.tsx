import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, Users, Wifi, Shield, ChevronLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getHotelBySlug, getHotelById, getHotelAverageRating, getHotelReviews, checkRoomAvailability } from '@/lib/services/hotels.service'
import { RoomTypeSelector } from '@/components/hotels/RoomTypeSelector'
import { ReviewList } from '@/components/reviews/ReviewList'
import { SearchWidget } from '@/components/search/SearchWidget'

interface HotelDetailPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ checkIn?: string; checkOut?: string; guests?: string }>
}

export async function generateMetadata({ params }: HotelDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const hotel = await getHotelBySlug(slug)
  if (!hotel) return { title: 'Hotel Not Found' }
  return {
    title: hotel.name,
    description: hotel.description ?? `Book ${hotel.name} in ${hotel.city}, Sri Lanka.`,
  }
}

export default async function HotelDetailPage({ params, searchParams }: HotelDetailPageProps) {
  const { slug } = await params
  const sp = await searchParams

  const hotel = await getHotelBySlug(slug)
  if (!hotel) notFound()

  const [avgRating, reviews] = await Promise.all([
    getHotelAverageRating(hotel.id),
    getHotelReviews(hotel.id, 5),
  ])

  const allImages = [
    hotel.cover_image_url,
    ...hotel.gallery_urls,
  ].filter(Boolean) as string[]

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="bg-white border-b border-border py-4">
        <div className="container-base">
          <SearchWidget variant="inline" />
        </div>
      </div>
      <div className="container-base py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
          <Link href="/hotels" className="hover:text-primary flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            Hotels
          </Link>
          <span>/</span>
          <span className="text-foreground">{hotel.name}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden h-80 md:h-[440px]">
              <div className="relative col-span-1 row-span-2">
                <Image
                  src={allImages[0] ?? ''}
                  alt={hotel.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 50vw, 400px"
                />
              </div>
              <div className="relative">
                <Image
                  src={allImages[1] ?? allImages[0] ?? ''}
                  alt={`${hotel.name} gallery`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 300px"
                />
              </div>
              <div className="relative">
                <Image
                  src={allImages[2] ?? allImages[0] ?? ''}
                  alt={`${hotel.name} gallery`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 300px"
                />
                {allImages.length > 3 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">+{allImages.length - 3} more</span>
                  </div>
                )}
              </div>
            </div>

            {/* Hotel Info */}
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  {hotel.star_rating && (
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: Math.floor(hotel.star_rating) }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">{hotel.star_rating}-Star Hotel</span>
                    </div>
                  )}
                  <h1 className="font-heading text-3xl font-bold text-foreground">{hotel.name}</h1>
                  <p className="flex items-center gap-1.5 text-muted-foreground mt-1">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    {hotel.address ? `${hotel.address}, ` : ''}{hotel.city}, {hotel.country}
                  </p>
                </div>
                {avgRating && (
                  <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-xl">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-foreground">{avgRating}</span>
                    <span className="text-muted-foreground text-sm">({reviews.length} reviews)</span>
                  </div>
                )}
              </div>

              {hotel.description && (
                <p className="text-muted-foreground leading-relaxed">{hotel.description}</p>
              )}
            </div>

            {/* Amenities */}
            {hotel.amenities.length > 0 && (
              <div>
                <h2 className="font-heading text-xl font-semibold mb-4">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.map((amenity) => (
                    <Badge
                      key={amenity}
                      variant="secondary"
                      className="capitalize px-3 py-1.5 rounded-xl bg-primary/8 text-primary border-0 text-sm"
                    >
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Room Types */}
            <div id="rooms" aria-label="Available rooms">
              <h2 className="font-heading text-xl font-semibold mb-4">Choose Your Room</h2>
              <RoomTypeSelector
                rooms={hotel.room_types}
                hotelId={hotel.id}
                checkIn={sp.checkIn}
                checkOut={sp.checkOut}
                guests={sp.guests ? Number(sp.guests) : 2}
              />
            </div>

            <Separator />

            {/* Reviews */}
            <div aria-label="Guest reviews">
              <h2 className="font-heading text-xl font-semibold mb-4">Guest Reviews</h2>
              <ReviewList reviews={reviews} />
            </div>
          </div>

          {/* Sticky Sidebar (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-white rounded-2xl border border-border p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <p className="text-sm font-medium">Free cancellation up to 24h before</p>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <p className="text-sm font-medium">Select guests when choosing room</p>
              </div>
              <div className="flex items-center gap-3">
                <Wifi className="w-5 h-5 text-primary" />
                <p className="text-sm font-medium">Instant booking confirmation</p>
              </div>
              <Separator />
              <Button
                asChild
                className="w-full rounded-xl bg-primary hover:bg-[#164d37] h-12 text-base font-semibold"
              >
                <a href="#rooms">Select a Room</a>
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                No charges until checkout. Secure payment via Stripe.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-border p-4 z-40">
          <Button
            asChild
            className="w-full rounded-xl bg-primary hover:bg-[#164d37] h-12 font-semibold"
          >
            <a href="#rooms">Select a Room</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
