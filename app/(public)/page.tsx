import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Shield, Star, Clock, Headphones, ChevronRight, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchWidget } from '@/components/search/SearchWidget'
import { HotelCard } from '@/components/hotels/HotelCard'
import { CarCard } from '@/components/cars/CarCard'
import { getFeaturedHotels } from '@/lib/services/hotels.service'
import { getFeaturedCars } from '@/lib/services/cars.service'

export const metadata: Metadata = {
  title: 'Mlinda Travels — Premium Hotels & Car Rentals in Sri Lanka',
  description:
    'Book world-class hotels and car rentals across Sri Lanka. Real-time availability, seamless checkout, and exceptional service. Your journey begins here.',
}

const destinations = [
  {
    city: 'Colombo',
    subtitle: 'The Vibrant Capital',
    image: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=600',
  },
  {
    city: 'Galle',
    subtitle: 'Colonial Charm & Beaches',
    image: 'https://images.unsplash.com/photo-1588464009076-6f19a3d0d17c?w=600',
  },
  {
    city: 'Nuwara Eliya',
    subtitle: 'Tea Country Highlands',
    image: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=600',
  },
  {
    city: 'Yala',
    subtitle: 'Wildlife & Wilderness',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600',
  },
  {
    city: 'Kandy',
    subtitle: 'Cultural Heart',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600',
  },
  {
    city: 'Negombo',
    subtitle: 'Coastal Gateway',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600',
  },
]

const trustPoints = [
  {
    icon: Shield,
    title: 'Secure Booking',
    desc: 'Bank-level SSL encryption and Stripe-powered payments. Your data is always protected.',
  },
  {
    icon: Star,
    title: 'Curated Quality',
    desc: 'Every hotel and vehicle is personally vetted for quality, cleanliness, and service.',
  },
  {
    icon: Clock,
    title: 'Instant Confirmation',
    desc: 'Real-time availability means your booking is confirmed the moment you pay.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    desc: 'Our local team is always available to ensure your journey goes perfectly.',
  },
]

const testimonials = [
  {
    name: 'Sarah M.',
    location: 'London, UK',
    rating: 5,
    text: 'Mlinda Travels made our Sri Lanka trip absolutely seamless. The hotel selection was exquisite and the car rental process was the smoothest I have ever experienced.',
  },
  {
    name: 'James K.',
    location: 'Sydney, Australia',
    rating: 5,
    text: 'From Colombo to Galle in a stunning BMW — the booking took 5 minutes and the car was exactly as described. Will use Mlinda for every future trip.',
  },
  {
    name: 'Priya R.',
    location: 'Toronto, Canada',
    rating: 5,
    text: 'As a solo traveller, I needed to trust the service completely. Mlinda delivered on every promise — wonderful hotel recommendations and reliable vehicles.',
  },
]

export default async function HomePage() {
  const [featuredHotels, featuredCars] = await Promise.all([
    getFeaturedHotels(6),
    getFeaturedCars(6),
  ])

  return (
    <>
      {/* ── Hero Section ─────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden" aria-label="Hero">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=2000"
            alt="Sri Lanka aerial view"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>

        <div className="relative z-10 container-base pt-28 pb-16 w-full">
          <div className="max-w-2xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm mb-5 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Real-time availability · Sri Lanka
            </div>
            <h1 className="font-heading text-white font-bold leading-tight mb-4">
              Discover
              <br />
              <span className="text-green-300">Sri Lanka</span>
              <br />
              Your Way
            </h1>
            <p className="text-white/85 text-lg leading-relaxed max-w-lg">
              Premium hotels and curated car rentals across the island&apos;s most breathtaking destinations. One platform, seamless booking.
            </p>
          </div>

          {/* Search Widget */}
          <div className="max-w-3xl">
            <SearchWidget variant="hero" />
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-6 mt-10">
            {[
              { value: '50+', label: 'Premium Hotels' },
              { value: '30+', label: 'Vehicles' },
              { value: '10K+', label: 'Happy Guests' },
              { value: '4.9★', label: 'Average Rating' },
            ].map((stat) => (
              <div key={stat.label} className="text-white">
                <p className="font-heading text-2xl font-bold">{stat.value}</p>
                <p className="text-white/70 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Destinations ──────────────────────────────── */}
      <section className="section-padding bg-background" aria-labelledby="destinations-heading">
        <div className="container-base">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Explore</p>
              <h2 id="destinations-heading" className="font-heading text-foreground">
                Popular Destinations
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {destinations.map((dest) => (
              <Link
                key={dest.city}
                href={`/hotels?city=${dest.city}`}
                className="group relative rounded-2xl overflow-hidden aspect-[3/4] block"
                aria-label={`Explore ${dest.city}`}
              >
                <Image
                  src={dest.image}
                  alt={dest.city}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 17vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="font-heading font-semibold text-white text-sm">{dest.city}</p>
                  <p className="text-white/70 text-xs">{dest.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Hotels ────────────────────────────────────── */}
      <section className="section-padding bg-primary-light/40" aria-labelledby="hotels-heading">
        <div className="container-base">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Stay</p>
              <h2 id="hotels-heading" className="font-heading text-foreground">
                Exceptional Hotels
              </h2>
              <p className="text-muted-foreground mt-2 max-w-lg">
                From colonial heritage properties to eco-luxury lodges — every stay is a story.
              </p>
            </div>
            <Button asChild variant="outline" className="hidden sm:flex rounded-xl border-primary text-primary hover:bg-primary hover:text-white">
              <Link href="/hotels">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button asChild variant="outline" className="rounded-xl border-primary text-primary">
              <Link href="/hotels">View All Hotels</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Featured Cars ─────────────────────────────────────── */}
      <section className="section-padding bg-background" aria-labelledby="cars-heading">
        <div className="container-base">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Drive</p>
              <h2 id="cars-heading" className="font-heading text-foreground">
                Explore by Road
              </h2>
              <p className="text-muted-foreground mt-2 max-w-lg">
                From nimble city cars to rugged 4WDs — the perfect vehicle for every journey.
              </p>
            </div>
            <Button asChild variant="outline" className="hidden sm:flex rounded-xl border-primary text-primary hover:bg-primary hover:text-white">
              <Link href="/cars">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button asChild variant="outline" className="rounded-xl border-primary text-primary">
              <Link href="/cars">View All Cars</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Why Mlinda ───────────────────────────────────────── */}
      <section className="section-padding bg-foreground" aria-labelledby="trust-heading">
        <div className="container-base">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Why Choose Us</p>
            <h2 id="trust-heading" className="font-heading text-white">
              Travel with Confidence
            </h2>
            <p className="text-white/60 mt-3 max-w-md mx-auto">
              Every aspect of Mlinda Travels is designed to give you peace of mind, from the first search to the final drop-off.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPoints.map((point) => (
              <div key={point.title} className="flex flex-col items-start p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <point.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-white mb-2">{point.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section className="section-padding bg-primary-light/30" aria-labelledby="testimonials-heading">
        <div className="container-base">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Reviews</p>
            <h2 id="testimonials-heading" className="font-heading text-foreground">
              Loved by Travellers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((review, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <Quote className="w-6 h-6 text-primary/30 mb-4" />
                <p className="text-muted-foreground text-sm leading-relaxed mb-5 italic">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.location}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter CTA ─────────────────────────────────────── */}
      <section className="section-padding bg-primary" aria-labelledby="newsletter-heading">
        <div className="container-base">
          <div className="max-w-xl mx-auto text-center">
            <h2 id="newsletter-heading" className="font-heading text-white mb-3">
              Get Exclusive Deals
            </h2>
            <p className="text-white/80 text-sm mb-6">
              Subscribe to our newsletter and be the first to receive special offers, curated itineraries, and travel inspiration.
            </p>
            <form
              className="flex gap-3"
              aria-label="Newsletter subscription"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 h-11 px-4 rounded-xl bg-white/15 border border-white/30 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
                aria-label="Email for newsletter"
              />
              <Button
                type="submit"
                className="bg-white text-primary hover:bg-white/90 rounded-xl h-11 px-5 font-semibold shrink-0"
              >
                Subscribe
              </Button>
            </form>
            <p className="text-white/50 text-xs mt-3">
              No spam. Unsubscribe any time.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

