import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin, Wifi, Waves, Dumbbell, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Hotel } from '@/lib/supabase/types'

interface HotelCardProps {
  hotel: Hotel & { min_price?: number | null }
  className?: string
  variant?: 'grid' | 'list'
}

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'free wifi': Wifi,
  wifi: Wifi,
  pool: Waves,
  gym: Dumbbell,
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} star rating`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'w-3 h-3',
            i < Math.floor(rating)
              ? 'fill-amber-400 text-amber-400'
              : i < rating
              ? 'fill-amber-200 text-amber-300'
              : 'text-muted-foreground/30'
          )}
        />
      ))}
    </div>
  )
}

export function HotelCard({ hotel, className, variant = 'grid' }: HotelCardProps) {
  const topAmenities = hotel.amenities.slice(0, 3)

  if (variant === 'list') {
    return (
      <article
        className={cn(
          'bg-white rounded-2xl border border-border overflow-hidden flex flex-col sm:flex-row hover:shadow-lg transition-shadow duration-200',
          className
        )}
      >
        {/* Image */}
        <div className="relative sm:w-64 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
          <Image
            src={hotel.cover_image_url ?? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600'}
            alt={hotel.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 256px"
          />
          <button
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
            aria-label={`Save ${hotel.name} to favorites`}
          >
            <Heart className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                {hotel.star_rating && <StarRating rating={hotel.star_rating} />}
                <h3 className="font-heading font-semibold text-lg text-foreground mt-1">{hotel.name}</h3>
                <p className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  {hotel.city}, {hotel.country}
                </p>
              </div>
            </div>
            {hotel.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{hotel.description}</p>
            )}
            {/* Amenities */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {topAmenities.map((amenity) => (
                <Badge key={amenity} variant="secondary" className="text-xs rounded-full px-2 capitalize bg-primary/10 text-primary border-0">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div>
              {hotel.min_price ? (
                <>
                  <span className="text-xs text-muted-foreground">From</span>
                  <p className="font-heading text-xl font-bold text-foreground">
                    ${hotel.min_price}
                    <span className="text-xs font-normal text-muted-foreground ml-1">/night</span>
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Check availability</p>
              )}
            </div>
            <Button asChild size="sm" className="rounded-full bg-foreground text-background hover:bg-primary transition-colors">
              <Link href={`/hotels/${hotel.id}`}>View Hotel</Link>
            </Button>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article
      className={cn(
        'group bg-card rounded-[2rem] border border-border/40 overflow-hidden transition-all duration-500',
        className
      )}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={hotel.cover_image_url ?? 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600'}
          alt={hotel.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {hotel.star_rating && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-background/95 backdrop-blur-md text-foreground border-0 shadow-sm text-xs font-semibold gap-1 px-2.5 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {hotel.star_rating}-star
            </Badge>
          </div>
        )}

        <button
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-background/95 backdrop-blur-md flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm opacity-0 group-hover:opacity-100"
          aria-label={`Save ${hotel.name} to favorites`}
        >
          <Heart className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          {hotel.city}, {hotel.country}
        </p>
        <h3 className="font-heading font-semibold text-base text-foreground leading-tight mb-2">
          {hotel.name}
        </h3>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {topAmenities.map((amenity) => (
            <span
              key={amenity}
              className="px-2.5 py-1 rounded-full border border-border/60 text-muted-foreground text-[11px] font-medium tracking-wide capitalize"
            >
              {amenity}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            {hotel.min_price ? (
              <>
                <span className="text-xs text-muted-foreground">From</span>
                <p className="font-heading font-bold text-foreground">
                  ${hotel.min_price}
                  <span className="text-xs font-normal text-muted-foreground ml-0.5">/night</span>
                </p>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">Check availability</p>
            )}
          </div>
          <Button
            asChild
            size="sm"
            className="rounded-full bg-foreground text-background hover:bg-primary transition-colors text-xs h-8 px-5"
          >
            <Link href={`/hotels/${hotel.id}`} aria-label={`View ${hotel.name} details`}>
              View
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
