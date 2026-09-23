import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, ArrowRight } from 'lucide-react'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'

const footerLinks = {
  Explore: [
    { href: '/hotels', label: 'Sanctuaries' },
    { href: '/cars', label: 'The Fleet' },
    { href: '/flights', label: 'Private Aviation' },
    { href: '/about', label: 'Our Story' },
  ],
  Support: [
    { href: '/help', label: 'Concierge' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/account/bookings', label: 'Manage Reservations' },
  ],
  Legal: [
    { href: '/legal/terms', label: 'Terms of Service' },
    { href: '/legal/privacy', label: 'Privacy Policy' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#0A110D] text-[#F0F5F2] pt-32 pb-8 border-t border-white/5 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container-base relative z-10">
        {/* Top CTA */}
        <div className="flex flex-col lg:flex-row items-start justify-between border-b border-white/10 pb-20 mb-20 gap-16">
          <div className="max-w-2xl">
            <h2 className="font-heading text-5xl md:text-7xl font-light tracking-tighter mb-6">
              Begin Your <span className="italic text-white/40">Journey.</span>
            </h2>
            <p className="text-white/50 text-lg font-light max-w-md">
              Join our private dispatch for exclusive access to Sri Lanka's finest sanctuaries and uncompromising mobility.
            </p>
          </div>
          <div className="w-full lg:w-auto flex-1 max-w-md lg:mt-8">
            <form className="relative flex items-center border-b border-white/20 pb-4 focus-within:border-primary transition-colors group">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="bg-transparent w-full outline-none text-white placeholder:text-white/30 font-light text-lg"
              />
              <button type="submit" className="text-white/50 group-focus-within:text-primary hover:text-primary transition-colors p-2">
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">
          {/* Brand & Contact */}
          <div className="lg:col-span-5 pr-8">
            <Link href="/" className="flex items-center gap-2 mb-8 group inline-flex">
              <div className="relative w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center shadow-sm bg-white border border-white/10 opacity-90 group-hover:opacity-100 transition-opacity">
                <Image
                  src="/logo.jpeg"
                  alt="Mlinda Travels Icon"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-heading font-semibold text-2xl tracking-tight text-white">
                Mlinda<span className="text-primary">.</span>
              </span>
            </Link>

            <div className="flex flex-col gap-4">
              <a
                href="mailto:concierge@mlindatravels.lk"
                className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-white/30" />
                concierge@mlindatravels.lk
              </a>
              <a
                href="tel:+94112345678"
                className="flex items-center gap-3 text-sm text-white/50 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-white/30" />
                +94 11 234 5678
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-mono text-white/30 text-xs mb-6 uppercase tracking-[0.2em]">
                  {category}
                </h3>
                <ul className="flex flex-col gap-4">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm font-light text-white/70 hover:text-primary transition-colors inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/10">
          <p className="text-xs text-white/30 font-light tracking-wide">
            © {new Date().getFullYear()} MLINDA TRAVELS. ALL RIGHTS RESERVED.
          </p>
          
          <div className="flex items-center gap-6">
            {[
              { icon: FaFacebook, href: '#', label: 'Facebook' },
              { icon: FaInstagram, href: '#', label: 'Instagram' },
              { icon: FaTwitter, href: '#', label: 'Twitter/X' },
              { icon: FaYoutube, href: '#', label: 'YouTube' },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-white/30 hover:text-white transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

