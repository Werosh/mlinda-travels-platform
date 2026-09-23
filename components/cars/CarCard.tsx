import Link from 'next/link'
import Image from 'next/image'
import { Users, Fuel, Settings, MapPin, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Car } from '@/lib/supabase/types'

interface CarCardProps {
  car: Car
  className?: string
  variant?: 'grid' | 'list'
  pickupDate?: string
  returnDate?: string
}

const categoryColors: Record<string, string> = {
  economy: 'bg-blue-50 text-blue-700',
  hybrid: 'bg-green-50 text-green-700',
  suv: 'bg-orange-50 text-orange-700',
  luxury: 'bg-amber-50 text-amber-700',
}

export function CarCard({ car, className, variant = 'grid', pickupDate, returnDate }: CarCardProps) {
  const bookingParams = new URLSearchParams()
  if (pickupDate) bookingParams.set('pickupDate', pickupDate)
  if (returnDate) bookingParams.set('returnDate', returnDate)
  const detailUrl = `/cars/${car.id}${bookingParams.toString() ? `?${bookingParams.toString()}` : ''}`

  if (variant === 'list') {
    return (
      <article
        className={cn(
          'bg-white rounded-2xl border border-border overflow-hidden flex flex-col sm:flex-row hover:shadow-lg transition-shadow duration-200',
          className
        )}
      >
        {/* Image */}
        <div className="relative sm:w-56 h-44 sm:h-auto flex-shrink-0 overflow-hidden bg-muted">
          <Image
            src={car.images[0] ?? 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600'}
            alt={`${car.make} ${car.model}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 224px"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <Badge className={cn('text-xs rounded-full capitalize border-0 mb-1', categoryColors[car.category] ?? 'bg-muted text-muted-foreground')}>
                  {car.category}
                </Badge>
                <h3 className="font-heading font-semibold text-lg">
                  {car.make} {car.model} {car.year && `(${car.year})`}
                </h3>
                <p className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  {car.location}
                </p>
              </div>
            </div>
            {/* Specs */}
            <div className="flex flex-wrap gap-3 mt-3">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="w-4 h-4 text-primary/70" />
                {car.seats} seats
              </span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Settings className="w-4 h-4 text-primary/70" />
                {car.transmission}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground capitalize">
                <Fuel className="w-4 h-4 text-primary/70" />
                {car.category}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div>
              <span className="text-xs text-muted-foreground">From</span>
              <p className="font-heading text-xl font-bold">
                ${car.price_per_day}
                <span className="text-xs font-normal text-muted-foreground ml-1">/day</span>
              </p>
            </div>
            <Button asChild size="sm" className="rounded-xl bg-primary hover:bg-[#164d37]">
              <Link href={detailUrl}>View Car</Link>
            </Button>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article
      className={cn(
        'group bg-white rounded-2xl border border-border overflow-hidden card-hover',
        className
      )}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-muted">
        <Image
          src={car.images[0] ?? 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600'}
          alt={`${car.make} ${car.model}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <Badge
            className={cn(
              'text-xs rounded-full capitalize border-0 shadow-sm',
              categoryColors[car.category] ?? 'bg-muted text-muted-foreground'
            )}
          >
            {car.category}
          </Badge>
        </div>
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-sm opacity-0 group-hover:opacity-100"
          aria-label={`Save ${car.make} ${car.model} to favorites`}
        >
          <Heart className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          {car.location}
        </p>
        <h3 className="font-heading font-semibold text-base leading-tight mb-3">
          {car.make} {car.model}
          {car.year && <span className="font-normal text-muted-foreground text-sm ml-1">({car.year})</span>}
        </h3>

        {/* Specs */}
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5 text-primary/70" />
            {car.seats}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground capitalize">
            <Settings className="w-3.5 h-3.5 text-primary/70" />
            {car.transmission}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground capitalize">
            <Fuel className="w-3.5 h-3.5 text-primary/70" />
            {car.category}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <span className="text-xs text-muted-foreground">From</span>
            <p className="font-heading font-bold text-foreground">
              ${car.price_per_day}
              <span className="text-xs font-normal text-muted-foreground ml-0.5">/day</span>
            </p>
          </div>
          <Button
            asChild
            size="sm"
            className="rounded-xl bg-primary hover:bg-[#164d37] text-xs h-8 px-4"
          >
            <Link href={detailUrl} aria-label={`View ${car.make} ${car.model} details`}>
              View
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
