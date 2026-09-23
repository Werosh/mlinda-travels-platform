import { Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'

interface Review {
  id: string
  rating: number
  comment: string | null
  created_at: string
  profiles?: { full_name: string | null; avatar_url: string | null } | null
}

interface ReviewListProps {
  reviews: Review[]
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  )
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No reviews yet. Be the first to review!
      </div>
    )
  }

  return (
    <div className="space-y-4" role="list" aria-label="Guest reviews">
      {reviews.map((review) => {
        const name = review.profiles?.full_name ?? 'Anonymous Guest'
        const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

        return (
          <div
            key={review.id}
            className="flex gap-3 p-4 rounded-2xl bg-muted/30 border border-border"
            role="listitem"
          >
            <Avatar className="w-10 h-10 flex-shrink-0 border-2 border-primary/20">
              <AvatarImage src={review.profiles?.avatar_url ?? undefined} alt={name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <p className="font-medium text-sm">{name}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(review.created_at), 'MMMM yyyy')}
                  </p>
                </div>
                <StarRating rating={review.rating} />
              </div>
              {review.comment && (
                <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
