import Link from 'next/link'
import { MapPin, Mail, Phone, Globe, MessageCircle } from 'lucide-react'
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'

const footerLinks = {
  Explore: [
    { href: '/hotels', label: 'Find Hotels' },
    { href: '/cars', label: 'Car Rentals' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ],
  Support: [
    { href: '/help', label: 'Help & FAQ' },
    { href: '/contact', label: 'Customer Support' },
    { href: '/account/bookings', label: 'Manage Bookings' },
  ],
  Legal: [
    { href: '/legal/terms', label: 'Terms of Service' },
    { href: '/legal/privacy', label: 'Privacy Policy' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-foreground text-white">
      {/* Main Footer */}
      <div className="container-base py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-heading font-semibold text-xl text-white">
                Mlinda<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-6">
              Your trusted travel companion in Sri Lanka. Discover world-class hotels and seamless car rentals, curated for the discerning traveller.
            </p>

            {/* Contact */}
            <div className="flex flex-col gap-2 mb-6">
              <a
                href="mailto:hello@mlindatravels.lk"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-primary" />
                hello@mlindatravels.lk
              </a>
              <a
                href="tel:+94112345678"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-primary" />
                +94 11 234 5678
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
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
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-heading font-semibold text-white text-sm mb-4 uppercase tracking-wider">
                {category}
              </h3>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
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
      <div className="border-t border-white/10">
        <div className="container-base py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Mlinda Travels. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-white/40">
            <span>Made with</span>
            <span className="text-red-400">♥</span>
            <span>for Sri Lanka</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

