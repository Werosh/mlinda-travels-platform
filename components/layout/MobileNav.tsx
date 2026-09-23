'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Calendar, Heart, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProfile } from '@/lib/auth/hooks'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/account/bookings', label: 'Bookings', icon: Calendar },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/account', label: 'Profile', icon: User, requiresAuth: true },
]

export function MobileNav() {
  const pathname = usePathname()
  const { profile } = useProfile()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-border pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          const Icon = item.icon
          
          // Redirect to login if requires auth and not logged in
          const href = item.requiresAuth && !profile ? '/auth/login' : item.href

          return (
            <Link
              key={item.label}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full space-y-1',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "fill-primary/20")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
