'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { MapPin, LogIn, User, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useProfile } from '@/lib/auth/hooks'
import { signOut } from '@/lib/auth/actions'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/hotels', label: 'Hotels' },
  { href: '/cars', label: 'Car Rentals' },
  { href: '/about', label: 'About' },
]

export function Header() {
  const pathname = usePathname()
  const { profile, loading } = useProfile()
  const [scrolled, setScrolled] = useState(false)

  const isTransparentPage = pathname === '/'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isTransparentPage && !scrolled
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md border-b border-border shadow-sm'
      )}
    >
      <div className="container-base flex items-center justify-between h-20">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="Mlinda Travels Home"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <MapPin className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span
            className={cn(
              'font-heading font-semibold text-xl tracking-tight transition-colors',
              isTransparentPage && !scrolled ? 'text-white' : 'text-foreground'
            )}
          >
            Mlinda<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="flex items-center gap-2" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-5 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname.startsWith(link.href)
                  ? 'text-primary bg-primary/10'
                  : isTransparentPage && !scrolled
                  ? 'text-white/90 hover:text-white hover:bg-white/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button
                  variant="ghost"
                  className="flex items-center gap-2 px-3 rounded-xl"
                  aria-label="User menu"
                />}>
                  <Avatar className="w-8 h-8 border-2 border-primary/20">
                    <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.full_name ?? 'User'} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      'text-sm font-medium max-w-[100px] truncate',
                      isTransparentPage && !scrolled ? 'text-white' : 'text-foreground'
                    )}
                  >
                    {profile.full_name?.split(' ')[0] ?? 'Account'}
                  </span>
                  <ChevronDown className="w-4 h-4 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-xl p-1">
                <DropdownMenuItem render={<Link href="/account" className="cursor-pointer" />} className="rounded-lg">
                    <User className="w-4 h-4 mr-2" />
                    My Account
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/account/bookings" className="cursor-pointer" />} className="rounded-lg">
                    My Bookings
                </DropdownMenuItem>
                {profile.role === 'admin' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem render={<Link href="/admin" className="cursor-pointer text-primary" />} className="rounded-lg">
                        Admin Panel
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="rounded-lg text-destructive cursor-pointer"
                  onClick={() => signOut()}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className={cn(
                  'rounded-xl px-5',
                  isTransparentPage && !scrolled
                    ? 'text-white hover:bg-white/10'
                    : ''
                )}
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="rounded-xl px-5 bg-primary hover:bg-primary-dark">
                <Link href="/auth/register">
                  <LogIn className="w-4 h-4 mr-1.5" />
                  Register
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

