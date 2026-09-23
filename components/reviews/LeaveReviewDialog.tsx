'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { submitReview } from '@/app/actions/review'

export function LeaveReviewDialog({ 
  bookingId, 
  type, 
  itemId,
  hasReviewed
}: { 
  bookingId: string
  type: string
  itemId: string
  hasReviewed: boolean
}) {
  const [rating, setRating] = useState(5)
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  if (hasReviewed) {
    return (
      <Button variant="outline" className="w-full rounded-xl" disabled>
        Review Submitted
      </Button>
    )
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      formData.append('bookingId', bookingId)
      formData.append('type', type)
      formData.append('itemId', itemId)
      formData.append('rating', rating.toString())
      
      await submitReview(formData)
      setIsOpen(false)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger 
        render={
          <Button className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
            Leave a Review
          </Button>
        } 
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How was your experience?</DialogTitle>
          <DialogDescription>
            Your feedback helps others make better travel decisions.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-6 pt-4">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <Textarea
              name="comment"
              placeholder="Tell us what you liked (or didn't like)..."
              className="min-h-[100px] resize-none"
              required
            />
          </div>
          <Button type="submit" className="w-full rounded-xl" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
