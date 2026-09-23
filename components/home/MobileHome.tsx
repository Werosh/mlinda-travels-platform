'use client'

import Image from 'next/image'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import { HotelCard } from '@/components/hotels/HotelCard'
import { CarCard } from '@/components/cars/CarCard'
import { Search, MapPin, Shield, Star } from 'lucide-react'

interface MobileHomeProps {
  destinations: any[]
  featuredHotels: any[]
  featuredCars: any[]
}

export function MobileHome({ destinations, featuredHotels, featuredCars }: MobileHomeProps) {
  const [destRef] = useEmblaCarousel({ dragFree: true, containScroll: 'trimSnaps' })
  const [hotelRef] = useEmblaCarousel({ dragFree: true, containScroll: 'trimSnaps' })
  const [carRef] = useEmblaCarousel({ dragFree: true, containScroll: 'trimSnaps' })

  return (
    <div className="md:hidden bg-background min-h-screen pb-safe">
      {/* ── Native App Hero ─────────────────────────────────────── */}
      <section className="relative h-[60vh] w-full rounded-b-3xl overflow-hidden shadow-sm">
        <Image
          src="https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1000"
          alt="Sri Lanka"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        
        {/* Top minimal bar space (placeholder for status bar area) */}
        <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-black/40 to-transparent pt-safe" />
        
        <div className="absolute bottom-6 left-4 right-4 flex flex-col gap-4">
          <div>
            <h1 className="font-heading text-white text-3xl font-bold leading-tight">
              Explore Sri Lanka
            </h1>
            <p className="text-white/80 text-sm mt-1 font-medium">Find your perfect stay & ride</p>
          </div>

          {/* Fake Search Input Trigger (Would open full-screen search modal) */}
          <Link href="/search" className="w-full bg-white/95 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3 shadow-lg active:scale-[0.98] transition-transform">
            <Search className="w-5 h-5 text-primary" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">Where to?</span>
              <span className="text-xs text-muted-foreground">Anywhere • Any week • Add guests</span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Destinations Carousel ──────────────────────────────── */}
      <section className="pt-8 pb-4">
        <div className="px-4 mb-4 flex justify-between items-end">
          <h2 className="font-heading text-xl font-bold text-foreground tracking-tight">Popular Destinations</h2>
        </div>
        
        <div className="overflow-hidden" ref={destRef}>
          <div className="flex ml-4 gap-3 pr-4" style={{ backfaceVisibility: 'hidden' }}>
            {destinations.map((dest) => (
              <Link
                key={dest.city}
                href={`/hotels?city=${dest.city}`}
                className="relative flex-none w-36 h-48 rounded-2xl overflow-hidden active:opacity-80 transition-opacity"
              >
                <Image
                  src={dest.image}
                  alt={dest.city}
                  fill
                  className="object-cover"
                  sizes="150px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3 pr-2">
                  <p className="font-heading font-semibold text-white text-sm">{dest.city}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Hotels Carousel ────────────────────────────────────── */}
      <section className="pt-6 pb-4">
        <div className="px-4 mb-4 flex justify-between items-end">
          <h2 className="font-heading text-xl font-bold text-foreground tracking-tight">Featured Stays</h2>
          <Link href="/hotels" className="text-primary text-xs font-semibold">See all</Link>
        </div>
        
        <div className="overflow-hidden" ref={hotelRef}>
          <div className="flex ml-4 gap-4 pr-4" style={{ backfaceVisibility: 'hidden' }}>
            {featuredHotels.map((hotel) => (
              <div key={hotel.id} className="flex-none w-[85vw] max-w-[320px]">
                {/* Simplified Mobile Card wrapper */}
                <HotelCard hotel={hotel} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cars Carousel ─────────────────────────────────────── */}
      <section className="pt-6 pb-8">
        <div className="px-4 mb-4 flex justify-between items-end">
          <h2 className="font-heading text-xl font-bold text-foreground tracking-tight">Rent a Ride</h2>
          <Link href="/cars" className="text-primary text-xs font-semibold">See all</Link>
        </div>
        
        <div className="overflow-hidden" ref={carRef}>
          <div className="flex ml-4 gap-4 pr-4" style={{ backfaceVisibility: 'hidden' }}>
            {featuredCars.map((car) => (
              <div key={car.id} className="flex-none w-[85vw] max-w-[320px]">
                {/* Simplified Mobile Card wrapper */}
                <CarCard car={car} />
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
