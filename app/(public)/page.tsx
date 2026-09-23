import type { Metadata } from 'next'
import { getFeaturedHotels } from '@/lib/services/hotels.service'
import { getFeaturedCars } from '@/lib/services/cars.service'
import { DesktopHome } from '@/components/home/DesktopHome'
import { MobileHome } from '@/components/home/MobileHome'
import { Shield, Star, Clock, Headphones } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mlinda Travels - Premium Hotels & Car Rentals in Sri Lanka',
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
    text: 'From Colombo to Galle in a stunning BMW - the booking took 5 minutes and the car was exactly as described. Will use Mlinda for every future trip.',
  },
  {
    name: 'Priya R.',
    location: 'Toronto, Canada',
    rating: 5,
    text: 'As a solo traveller, I needed to trust the service completely. Mlinda delivered on every promise - wonderful hotel recommendations and reliable vehicles.',
  },
]

export default async function HomePage() {
  const [featuredHotels, featuredCars] = await Promise.all([
    getFeaturedHotels(6),
    getFeaturedCars(6),
  ])

  return (
    <>
      <DesktopHome 
        destinations={destinations}
        featuredHotels={featuredHotels}
        featuredCars={featuredCars}
        trustPoints={trustPoints}
        testimonials={testimonials}
      />
      <MobileHome
        destinations={destinations}
        featuredHotels={featuredHotels}
        featuredCars={featuredCars}
      />
    </>
  )
}
