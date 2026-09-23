'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { SearchWidget } from '@/components/search/SearchWidget'
import { HotelCard } from '@/components/hotels/HotelCard'
import { CarCard } from '@/components/cars/CarCard'
import { Shield, Star, Clock, Headphones, Quote, ArrowRight, ArrowLeft } from 'lucide-react'
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

  const carsScrollRef = useRef<HTMLDivElement>(null)
  const scrollCars = (direction: 'left' | 'right') => {
    if (carsScrollRef.current) {
      const scrollAmount = 420
      carsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

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
                Curated <span className="italic font-light text-muted-foreground ml-2">Escapes</span>
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
                layout
                key={dest.city}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                className="group relative flex-1 hover:flex-[3] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden rounded-[2rem] cursor-pointer shadow-lg will-change-[flex]"
              >
                <Link href={`/hotels?city=${dest.city}`} className="block w-full h-full">
                  <Image
                    src={dest.image}
                    alt={dest.city}
                    fill
                    className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {/* Base gradient and hover darkening */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  {/* Content Container - Fixed width to prevent layout thrashing on expand */}
                  <div className="absolute bottom-0 left-0 p-6 md:p-10 flex flex-col justify-end w-[400px]">
                    
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-white/90 font-mono text-sm tracking-widest bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shrink-0">
                        0{i + 1}
                      </span>
                      <div className="h-[1px] bg-white/30 w-16 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100" />
                    </div>
                    
                    <div className="flex flex-col relative h-[120px] justify-end">
                      <h3 className="font-heading text-3xl md:text-5xl text-white tracking-tight whitespace-nowrap drop-shadow-lg transition-transform duration-700 ease-out group-hover:-translate-y-24">
                        {dest.city}
                      </h3>
                      
                      {/* Subtitle positioned absolutely to avoid affecting layout */}
                      <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-700 ease-out delay-75 pointer-events-none group-hover:pointer-events-auto">
                        <p className="text-white/90 font-serif font-light text-lg pr-4">
                          {dest.subtitle}
                        </p>
                        
                        <div className="mt-4 flex items-center text-white font-medium text-sm tracking-widest uppercase">
                          Explore Location <ArrowRight className="w-4 h-4 ml-2" />
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
      <section className="dark py-32 bg-background relative overflow-hidden">
        {/* Subtle background accent */}
        <div className="absolute -top-40 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container-base relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8"
          >
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-12 bg-primary" />
                <span className="text-primary font-mono tracking-widest uppercase text-sm">Accommodation</span>
              </div>
              <h2 className="font-heading text-5xl md:text-7xl text-foreground tracking-tighter">
                Exquisite <span className="italic font-light text-muted-foreground">Sanctuaries</span>
              </h2>
            </div>
            <Link href="/hotels" className="text-primary hover:text-primary-foreground font-medium flex items-center group border border-primary/20 hover:bg-primary transition-colors px-8 py-4 rounded-full">
              Explore Collection <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-12 gap-6 lg:gap-10">
            {featuredHotels.slice(0, 2).map((hotel, i) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.2, duration: 0.8, ease: "easeOut" }}
                className={cn(
                  i === 0 ? "col-span-12 lg:col-span-7" : "col-span-12 lg:col-span-5"
                )}
              >
                <div className="group h-full shadow-2xl rounded-3xl overflow-hidden hover:shadow-primary/5 transition-all duration-500">
                  <HotelCard hotel={hotel} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Opinionated Listings: Cars ────────────────────────────────────── */}
      <section className="py-32 bg-[#F9F9F8] relative overflow-hidden">
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            
            {/* Sticky Sidebar */}
            <div className="lg:col-span-5 lg:sticky lg:top-32 lg:pr-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-[1px] w-8 bg-primary/40" />
                  <span className="text-primary font-mono tracking-widest uppercase text-xs">Mobility</span>
                </div>
                <h2 className="font-heading text-4xl md:text-5xl xl:text-6xl text-foreground tracking-tighter leading-[1.05]">
                  Uncompromising <br />
                  <span className="italic font-light text-muted-foreground">Journeys.</span>
                </h2>
                <p className="mt-6 text-muted-foreground font-light text-lg">
                  Traverse the island in absolute comfort and unparalleled style with our handpicked fleet of premium vehicles.
                </p>
                <Link href="/cars" className="mt-10 inline-flex items-center justify-center bg-foreground text-background hover:bg-primary transition-colors px-8 py-4 rounded-full font-medium group">
                  View The Full Fleet <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            {/* Horizontal Scroll Gallery */}
            <div className="lg:col-span-7 w-full relative">
              {/* Fade out mask on the right edge to indicate scrollability */}
              <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-[#F9F9F8] to-transparent z-10 pointer-events-none" />
              
              <div ref={carsScrollRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-12 pt-4 no-scrollbar scroll-smooth">
                {featuredCars.map((car, i) => (
                  <motion.div
                    key={car.id}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.15, duration: 0.8, ease: "easeOut" }}
                    className="min-w-[85vw] md:min-w-[420px] snap-start shrink-0"
                  >
                    <div className="group h-full shadow-md rounded-[2rem] overflow-hidden bg-card border border-border/40 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
                      <CarCard car={car} />
                    </div>
                  </motion.div>
                ))}
                
                {/* Spacer block to allow the last item to scroll past the mask */}
                <div className="min-w-[20px] md:min-w-[100px] shrink-0" />
              </div>

              {/* Scroll Indicators */}
              <div className="flex items-center gap-3 mt-2 pr-8 justify-end">
                <button 
                  onClick={() => scrollCars('left')} 
                  className="w-12 h-12 rounded-full border border-border/50 bg-card flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-all shadow-sm group"
                  aria-label="Scroll left"
                >
                  <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-background transition-colors" />
                </button>
                <button 
                  onClick={() => scrollCars('right')} 
                  className="w-12 h-12 rounded-full border border-border/50 bg-card flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-all shadow-sm group"
                  aria-label="Scroll right"
                >
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-background transition-colors" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
