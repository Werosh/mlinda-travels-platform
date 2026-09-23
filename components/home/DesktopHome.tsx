'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { SearchWidget } from '@/components/search/SearchWidget'
import { HotelCard } from '@/components/hotels/HotelCard'
import { CarCard } from '@/components/cars/CarCard'
import { Shield, Star, Clock, Headphones, Quote, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DesktopHomeProps {
  destinations: any[]
  featuredHotels: any[]
  featuredCars: any[]
}

export function DesktopHome({ destinations, featuredHotels, featuredCars }: DesktopHomeProps) {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  // Parallax effects
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div className="hidden md:block bg-background min-h-screen pb-24" ref={containerRef}>
      {/* ── Editorial Hero ─────────────────────────────────────── */}
      <section className="relative min-h-[95vh] flex flex-col justify-center overflow-hidden pt-24 pb-12">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/hero-fallback.jpeg"
            className="object-cover w-full h-full"
          >
            <source src="/Hero-bg-video.mp4" type="video/mp4" />
          </video>
          {/* Sophisticated Gradient Overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
        </div>

        <div className="container-base relative z-10 flex-1 flex flex-col justify-center">

          <div className="grid grid-cols-12 gap-8 items-center h-full relative">

            {/* Massive Typography - Left */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-12 lg:col-span-10 z-20"
            >
              <h1 className="font-heading text-[11vw] lg:text-[8vw] leading-[0.85] tracking-tighter text-white drop-shadow-2xl">
                The Island
                <br />
                <span className="italic font-light text-white/90">Curated.</span>
              </h1>
              <p className="text-white/90 text-[20px] md:text-[26px] lg:text-[30px] mt-8 max-w-2xl font-serif font-light leading-snug drop-shadow-lg">
                An exclusive collection of Sri Lanka's finest stays, premium vehicles, and exceptional flights designed for the discerning traveler.
              </p>
            </motion.div>
          </div>

          {/* Integrated Search Widget Pill at the Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
            className="w-full mt-16 relative z-30"
          >
            <SearchWidget variant="hero" />
          </motion.div>

        </div>
      </section>

      {/* ── Asymmetric Destinations ──────────────────────────────── */}
      <section className="py-32 container-base relative z-20 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex items-end justify-between mb-20"
        >
          <div className="max-w-2xl">
            <h2 className="font-heading text-[4rem] leading-none text-foreground tracking-tight">
              The <span className="italic font-light text-muted-foreground">Portfolio</span>
            </h2>
            <p className="text-xl text-muted-foreground mt-6 font-light">
              Iconic locations across the island, presented through an editorial lens.
            </p>
          </div>
        </motion.div>

        {/* Masonry / Asymmetric Grid */}
        <div className="grid grid-cols-12 gap-6">
          {destinations.slice(0, 5).map((dest, i) => (
            <motion.div
              key={dest.city}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "group relative rounded-none overflow-hidden cursor-pointer",
                i === 0 ? "col-span-8 aspect-[16/9]" :
                  i === 1 ? "col-span-4 aspect-[3/4]" :
                    i === 2 ? "col-span-4 aspect-[4/5] mt-[-10%]" :
                      i === 3 ? "col-span-4 aspect-[4/5]" :
                        "col-span-4 aspect-[4/5] mt-[10%]"
              )}
            >
              <Link href={`/hotels?city=${dest.city}`} className="block w-full h-full">
                <Image
                  src={dest.image}
                  alt={dest.city}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale-[20%] group-hover:grayscale-0"
                  sizes="50vw"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                  <div>
                    <h3 className="font-heading text-4xl text-white tracking-tight">{dest.city}</h3>
                    <p className="text-white/80 font-light mt-2 tracking-wide uppercase text-sm">{dest.subtitle}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Opinionated Listings: Hotels ────────────────────────────────────── */}
      <section className="py-24 bg-primary-light/10">
        <div className="container-base">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="border-b border-foreground/10 pb-10 mb-16 flex justify-between items-end"
          >
            <h2 className="font-heading text-5xl text-foreground">Featured Stays</h2>
            <Link href="/hotels" className="text-primary hover:text-primary-dark font-medium flex items-center group">
              View Collection <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-12 gap-8">
            {featuredHotels.slice(0, 3).map((hotel, i) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={cn(
                  i === 0 ? "col-span-8" : "col-span-4"
                )}
              >
                <HotelCard hotel={hotel} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Opinionated Listings: Cars ────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container-base">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="border-b border-foreground/10 pb-10 mb-16 flex justify-between items-end"
          >
            <h2 className="font-heading text-5xl text-foreground">The Fleet</h2>
            <Link href="/cars" className="text-primary hover:text-primary-dark font-medium flex items-center group">
              View All Vehicles <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-12 gap-8">
            {featuredCars.slice(0, 3).map((car, i) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={cn(
                  i === 2 ? "col-span-8" : "col-span-4"
                )}
              >
                <CarCard car={car} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
