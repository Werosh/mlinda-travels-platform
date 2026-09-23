'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { MapPin, LogIn, User, LogOut, ChevronDown, Heart, Calendar, Shield } from 'lucide-react'
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
  { href: '/hotels', label: 'Stays' },
  { href: '/cars', label: 'Vehicles' },
  { href: '/flights', label: 'Flights' },
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
          ? 'bg-transparent backdrop-blur-[4px]'
          : 'bg-white/95 backdrop-blur-md shadow-sm'
      )}
    >
      <div className="container-base flex items-center justify-between h-20">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="Mlinda Travels Home"
        >
          <div className="relative w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center shadow-sm bg-white border border-border/20">
            <Image
              src="/logo.jpeg"
              alt="Mlinda Travels Icon"
              fill
              className="object-cover"
            />
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
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Quick Favorites Link */}
          <Button
            asChild
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full transition-colors",
              isTransparentPage && !scrolled
                ? 'text-white hover:bg-white/10 hover:text-white'
                : 'text-muted-foreground hover:bg-muted'
            )}
            aria-label="Favorites"
          >
            <Link href="/favorites">
              <Heart className="w-5 h-5" />
            </Link>
          </Button>

          {loading ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2 px-1.5 py-1.5 h-auto rounded-full border shadow-sm transition-all duration-300",
                    isTransparentPage && !scrolled 
                      ? "border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/30" 
                      : "border-border/50 bg-background hover:bg-muted/50 hover:shadow-md"
                  )}
                  aria-label="User menu"
                />}>
                  <Avatar className="w-8 h-8 border border-primary/10 shadow-sm">
                    <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.full_name ?? 'User'} />
                    <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      'text-sm font-semibold max-w-[100px] truncate pl-0.5',
                      isTransparentPage && !scrolled ? 'text-white' : 'text-foreground'
                    )}
                  >
                    {profile.full_name?.split(' ')[0] ?? 'Account'}
                  </span>
                  <ChevronDown className={cn("w-4 h-4 opacity-70 pr-1", isTransparentPage && !scrolled ? 'text-white' : 'text-foreground')} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2 shadow-2xl border border-border/50 bg-white/98 backdrop-blur-xl">
                {/* User info */}
                <div className="flex items-center gap-3 p-3 mb-1 rounded-xl bg-muted/40">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{profile.full_name || 'My Account'}</p>
                    <p className="text-xs text-muted-foreground capitalize">{profile.role || 'User'}</p>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <DropdownMenuItem render={<Link href="/account" className="cursor-pointer" />} className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground border border-transparent hover:border-border hover:bg-transparent focus:border-border focus:bg-transparent outline-none">
                    <User className="w-4 h-4 mr-2.5 text-muted-foreground flex-shrink-0" />
                    My Account
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/account/bookings" className="cursor-pointer" />} className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground border border-transparent hover:border-border hover:bg-transparent focus:border-border focus:bg-transparent outline-none">
                    <Calendar className="w-4 h-4 mr-2.5 text-muted-foreground flex-shrink-0" />
                    My Bookings
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/favorites" className="cursor-pointer" />} className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground border border-transparent hover:border-border hover:bg-transparent focus:border-border focus:bg-transparent outline-none">
                    <Heart className="w-4 h-4 mr-2.5 text-muted-foreground flex-shrink-0" />
                    My Favorites
                  </DropdownMenuItem>
                </div>

                {profile.role === 'admin' && (
                  <>
                    <DropdownMenuSeparator className="my-2 bg-border/60" />
                    <DropdownMenuItem render={<Link href="/admin" className="cursor-pointer" />} className="rounded-xl px-3 py-2.5 text-sm font-medium text-primary border border-transparent hover:border-primary/30 hover:bg-transparent focus:border-primary/30 focus:bg-transparent outline-none">
                      <Shield className="w-4 h-4 mr-2.5 flex-shrink-0" />
                      Admin Panel
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator className="my-2 bg-border/60" />
                <DropdownMenuItem
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-destructive cursor-pointer border border-transparent hover:border-destructive/30 hover:bg-transparent focus:border-destructive/30 focus:bg-transparent outline-none"
                  onClick={() => signOut()}
                >
                  <LogOut className="w-4 h-4 mr-2.5 flex-shrink-0" />
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
                  'rounded-xl px-5 transition-colors',
                  isTransparentPage && !scrolled
                    ? 'text-white hover:bg-white/10 hover:text-white'
                    : ''
                )}
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="rounded-xl px-5 bg-primary hover:bg-primary-dark border border-transparent shadow-lg shadow-primary/20">
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

