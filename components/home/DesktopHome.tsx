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
              <p className="text-white/90 text-base md:text-xl lg:text-2xl mt-8 max-w-xl font-serif font-light leading-snug drop-shadow-lg">
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

      {/* ── The Portfolio (Expanding Gallery) ──────────────────────────────── */}
      <section className="py-32 bg-background overflow-hidden">
        <div className="container-base mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div className="max-w-2xl">
              <h2 className="font-heading text-5xl md:text-7xl leading-[0.9] text-foreground tracking-tighter">
                The <span className="italic font-light text-muted-foreground ml-2">Portfolio</span>
              </h2>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground font-light max-w-sm leading-relaxed">
              Discover Sri Lanka’s most iconic locations, curated exclusively for you.
            </p>
          </motion.div>
        </div>

        {/* Expanding Accordion Gallery */}
        <div className="w-full px-4 md:px-8 mx-auto max-w-[1600px]">
          <div className="flex h-[60vh] md:h-[75vh] w-full gap-4">
            {destinations.slice(0, 5).map((dest, i) => (
              <motion.div
                key={dest.city}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex-1 hover:flex-[4] transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden rounded-[2rem] cursor-pointer shadow-lg"
              >
                <Link href={`/hotels?city=${dest.city}`} className="block w-full h-full">
                  <Image
                    src={dest.image}
                    alt={dest.city}
                    fill
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {/* Base gradient and hover darkening */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  {/* Content Container */}
                  <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
                    
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-white/90 font-mono text-sm tracking-widest bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        0{i + 1}
                      </span>
                      <div className="h-[1px] bg-white/30 flex-1 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100" />
                    </div>
                    
                    <div className="flex flex-col">
                      <h3 className="font-heading text-3xl md:text-5xl text-white tracking-tight whitespace-nowrap origin-left transition-transform duration-700 drop-shadow-lg">
                        {dest.city}
                      </h3>
                      
                      {/* Subtitle reveals by expanding grid-rows */}
                      <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                        <div className="overflow-hidden">
                          <p className="text-white/80 font-serif font-light text-lg mt-3 pr-4 md:pr-12 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-300">
                            {dest.subtitle}
                          </p>
                          
                          <div className="mt-6 flex items-center text-white font-medium text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all duration-700 delay-400 translate-y-4 group-hover:translate-y-0">
                            Explore Location <ArrowRight className="w-4 h-4 ml-2" />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
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
