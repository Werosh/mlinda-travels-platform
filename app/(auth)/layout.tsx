import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Mlinda Travels account',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left - Decorative Panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/auth-image.png"
            alt="Authentication background"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Dark shade overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 relative z-10 group" aria-label="Mlinda Travels Home">
          <div className="relative w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center shadow-sm bg-white border border-border/20">
            <Image
              src="/logo.jpeg"
              alt="Mlinda Travels Icon"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-heading font-semibold text-2xl tracking-tight text-white drop-shadow-sm">
            Mlinda<span className="text-white/80">.</span>
          </span>
        </Link>

        {/* Quote */}
        <div className="relative z-10">
          <blockquote className="font-heading text-3xl text-white font-medium leading-snug mb-4 drop-shadow-md">
            &ldquo;Sri Lanka is not just a destination. It&apos;s a feeling.&rdquo;
          </blockquote>
          <p className="text-white/80 text-sm font-medium drop-shadow-md">- Mlinda Travels, est. 2024</p>
          <div className="mt-8 flex items-center gap-4">
            {['50+', '30+', '10K+'].map((stat, i) => (
              <div key={i} className="text-white drop-shadow-md">
                <p className="font-heading text-2xl font-bold">{stat}</p>
                <p className="text-white/80 text-xs font-medium">
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
            <Link href="/" className="flex items-center gap-2 group" aria-label="Mlinda Travels Home">
              <div className="relative w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center shadow-sm bg-white border border-border/20">
                <Image
                  src="/logo.jpeg"
                  alt="Mlinda Travels Icon"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-heading font-semibold text-xl tracking-tight text-foreground">
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

