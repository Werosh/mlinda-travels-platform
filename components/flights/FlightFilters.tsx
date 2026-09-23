'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface FlightFiltersProps {
  searchParams: Record<string, string | undefined>
}

const STOPS_OPTIONS = [
  { label: 'Any', value: '' },
  { label: 'Non-stop only', value: '0' },
  { label: '1 stop or fewer', value: '1' },
]

const CABIN_OPTIONS = [
  { label: 'All Cabins', value: '' },
  { label: 'Economy', value: 'economy' },
  { label: 'Premium Economy', value: 'premium' },
  { label: 'Business', value: 'business' },
]

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        {title}
      </h3>
      {children}
    </div>
  )
}

function FilterChip({
  label,
  active,
  href,
}: {
  label: string
  active: boolean
  href: string
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
        active
          ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
          : 'bg-white border-border text-foreground hover:border-primary/40 hover:text-primary'
      }`}
    >
      {label}
    </Link>
  )
}

export function FlightFilters({ searchParams }: FlightFiltersProps) {
  const buildHref = (key: string, value: string) => {
    const params = new URLSearchParams(
      Object.entries(searchParams).filter(([, v]) => v !== undefined) as [string, string][]
    )
    if (value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    params.delete('page')
    return `/flights?${params.toString()}`
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-5 space-y-6 sticky top-24">
      <h2 className="font-semibold text-foreground text-base">Filters</h2>

      <FilterSection title="Stops">
        <div className="flex flex-col gap-2">
          {STOPS_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              label={opt.label}
              active={(searchParams.stops ?? '') === opt.value}
              href={buildHref('stops', opt.value)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Cabin Class">
        <div className="flex flex-col gap-2">
          {CABIN_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              label={opt.label}
              active={(searchParams.cabinClass ?? '') === opt.value}
              href={buildHref('cabinClass', opt.value)}
            />
          ))}
        </div>
      </FilterSection>
    </div>
  )
}
