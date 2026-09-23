'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, MapPin, LogIn, User, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
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
  const [mobileOpen, setMobileOpen] = useState(false)

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
        isTransparentPage && !scrolled && !mobileOpen
          ? 'bg-transparent'
          : 'bg-white/95 backdrop-blur-md border-b border-border shadow-sm'
      )}
    >
      <div className="container-base flex items-center justify-between h-16 md:h-20">
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
              'font-heading font-semibold text-lg tracking-tight transition-colors',
              isTransparentPage && !scrolled ? 'text-white' : 'text-foreground'
            )}
          >
            Mlinda<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
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
        <div className="hidden md:flex items-center gap-3">
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
                  'rounded-xl',
                  isTransparentPage && !scrolled
                    ? 'text-white hover:bg-white/10'
                    : ''
                )}
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="rounded-xl bg-primary hover:bg-primary-dark">
                <Link href="/auth/register">
                  <LogIn className="w-4 h-4 mr-1.5" />
                  Register
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger render={<Button
              variant="ghost"
              size="icon"
              className={cn(
                'md:hidden rounded-xl',
                isTransparentPage && !scrolled && !mobileOpen
                  ? 'text-white hover:bg-white/10'
                  : ''
              )}
              aria-label="Open mobile menu"
            />}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </SheetTrigger>
          <SheetContent side="right" className="w-72 pt-16">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-base font-medium transition-colors',
                    pathname.startsWith(link.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 pt-6 border-t border-border flex flex-col gap-3">
              {profile ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted"
                  >
                    <Avatar className="w-10 h-10 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{profile.full_name}</p>
                      <p className="text-xs text-muted-foreground">View Account</p>
                    </div>
                  </Link>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => { signOut(); setMobileOpen(false) }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="rounded-xl">
                    <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild className="rounded-xl bg-primary hover:bg-primary-dark">
                    <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                      Register Free
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

