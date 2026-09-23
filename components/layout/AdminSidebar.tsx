'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard, Hotel, Car, BookOpen, Users, Star,
  Tag, Settings, FileText, ChevronLeft, ChevronRight, Plane
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navSections = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Inventory',
    items: [
      { href: '/admin/hotels', label: 'Hotels', icon: Hotel },
      { href: '/admin/cars', label: 'Cars', icon: Car },
      { href: '/admin/flights', label: 'Flights', icon: Plane },
    ],
  },
  {
    label: 'Operations',
    items: [
      { href: '/admin/bookings', label: 'Bookings', icon: BookOpen },
      { href: '/admin/users', label: 'Users', icon: Users },
      { href: '/admin/reviews', label: 'Reviews', icon: Star },
      { href: '/admin/promotions', label: 'Promotions', icon: Tag },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/settings', label: 'Settings', icon: Settings },
      { href: '/admin/audit-log', label: 'Audit Log', icon: FileText },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'flex-shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-200',
        collapsed ? 'w-16' : 'w-60'
      )}
      aria-label="Admin navigation"
    >
      {/* Logo */}
      <div className={cn(
        'h-16 flex items-center border-b border-sidebar-border px-4',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-border/20 bg-white">
              <Image
                src="/logo.jpeg"
                alt="Mlinda Travels"
                fill
                className="object-cover"
              />
            </div>
            <span className="font-heading font-semibold text-base tracking-tight text-foreground">
              Mlinda<span className="text-primary">.</span>
            </span>
          </Link>
        )}
        {collapsed && (
          <Link href="/admin" aria-label="Mlinda Admin Home">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-sm border border-border/20 bg-white">
              <Image
                src="/logo.jpeg"
                alt="Mlinda Travels"
                fill
                className="object-cover"
              />
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'w-6 h-6 rounded-md flex items-center justify-center hover:bg-sidebar-accent text-muted-foreground flex-shrink-0',
            collapsed && 'absolute left-14 top-5 bg-white border border-border shadow-sm z-10'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 no-scrollbar">
        {navSections.map((section) => (
          <div key={section.label} className="mb-4">
            {!collapsed && (
              <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                {section.label}
              </p>
            )}
            {section.items.map((item) => {
              const isActive = item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-primary'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary',
                    collapsed && 'justify-center px-0'
                  )}
                  aria-label={collapsed ? item.label : undefined}
                  aria-current={isActive ? 'page' : undefined}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            ← Back to Public Site
          </Link>
        </div>
      )}
    </aside>
  )
}

