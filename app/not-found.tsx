import Link from 'next/link'
import { Plane, Home, Search, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 – Page Not Found | Mlinda Travels',
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  return (
    <div className="h-screen overflow-hidden bg-background flex flex-col">
      {/* Subtle gradient bg */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Minimal header */}
      <header className="relative z-10 border-b border-border/50 bg-white/80 backdrop-blur-md">
        <div className="container-base h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.jpeg" alt="Mlinda Travels" className="h-8 w-auto rounded-lg" />
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-xl mx-auto">

          {/* Animated plane icon */}
          <div className="relative inline-flex mb-8">
            <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center">
              <Plane className="w-12 h-12 text-primary" strokeWidth={1.5} />
            </div>
            {/* Orbiting dot */}
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-destructive border-2 border-white" />
          </div>

          {/* 404 Number */}
          <h1 className="text-8xl font-bold text-foreground tracking-tighter leading-none mb-3 font-fraunces">
            4<span className="text-primary">0</span>4
          </h1>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            This destination doesn&apos;t exist
          </h2>

          {/* Description */}
          <p className="text-muted-foreground text-base leading-relaxed mb-10 max-w-sm mx-auto">
            Looks like your flight got rerouted. The page you&apos;re looking for has either been
            moved, deleted, or never existed.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-8 bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20 h-12 w-full sm:w-auto"
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-2xl px-8 h-12 border-border hover:border-primary/40 hover:bg-transparent w-full sm:w-auto"
            >
              <Link href="/hotels">
                <Search className="w-4 h-4 mr-2" />
                Browse Hotels
              </Link>
            </Button>
          </div>

          {/* Quick links */}
          <div className="mt-12 pt-8 border-t border-border/50">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              Or go somewhere we know exists
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { label: 'Hotels', href: '/hotels' },
                { label: 'Car Rentals', href: '/cars' },
                { label: 'Flights', href: '/flights' },
                { label: 'My Bookings', href: '/account/bookings' },
                { label: 'Sign In', href: '/auth/login' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-1.5 rounded-xl text-sm font-medium text-foreground border border-border bg-white hover:border-primary/40 hover:text-primary transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer strip */}
      <footer className="relative z-10 border-t border-border/40 bg-white/50">
        <div className="container-base h-14 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Mlinda Travels · All rights reserved
          </p>
        </div>
      </footer>
    </div>
  )
}
