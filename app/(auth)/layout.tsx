import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Mlinda Travels account',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left - Decorative Panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden flex-col justify-between p-12">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white" />
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-white" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-white" />
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-heading font-semibold text-2xl text-white">
            Mlinda<span className="text-white/60">.</span>
          </span>
        </Link>

        {/* Quote */}
        <div className="relative z-10">
          <blockquote className="font-heading text-3xl text-white font-medium leading-snug mb-4">
            &ldquo;Sri Lanka is not just a destination. It&apos;s a feeling.&rdquo;
          </blockquote>
          <p className="text-white/70 text-sm">- Mlinda Travels, est. 2024</p>
          <div className="mt-8 flex items-center gap-4">
            {['50+', '30+', '10K+'].map((stat, i) => (
              <div key={i} className="text-white">
                <p className="font-heading text-2xl font-bold">{stat}</p>
                <p className="text-white/60 text-xs">
                  {['Hotels', 'Vehicles', 'Guests'][i]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-heading font-semibold text-xl text-foreground">
                Mlinda<span className="text-primary">.</span>
              </span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

