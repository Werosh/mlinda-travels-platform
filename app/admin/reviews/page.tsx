import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { Star, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = { title: 'Reviews - Admin' }

async function approveReview(id: string) {
  'use server'
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  await (supabase as any).from('reviews').update({ is_approved: true }).eq('id', id)
}

async function rejectReview(id: string) {
  'use server'
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  await supabase.from('reviews').delete().eq('id', id)
}

export default async function AdminReviewsPage() {
  const supabase = await createClient()
  const { data: reviewsRaw } = await supabase
    .from('reviews')
    .select(`
      *,
      profiles (full_name),
      hotels (name),
      cars (make, model)
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  const reviews = reviewsRaw as any[] | null

  const pending = reviews?.filter((r) => !r.is_approved) ?? []
  const approved = reviews?.filter((r) => r.is_approved) ?? []

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl font-bold">Review Moderation</h1>
        <p className="text-muted-foreground text-sm">{pending.length} pending · {approved.length} approved</p>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div>
          <h2 className="font-heading font-semibold text-lg mb-3">Pending Approval</h2>
          <div className="space-y-3">
            {pending.map((review) => {
              const itemName = review.hotel_id
                ? (review as any).hotels?.name
                : `${(review as any).cars?.make} ${(review as any).cars?.model}`
              return (
                <div key={review.id} className="bg-white rounded-2xl border border-amber-200 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-medium text-sm">{(review as any).profiles?.full_name ?? 'Anonymous'}</p>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{itemName} · {format(new Date(review.created_at), 'MMM d, yyyy')}</p>
                      <p className="text-sm">{review.comment}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <form action={approveReview.bind(null, review.id)}>
                        <Button size="sm" type="submit" className="rounded-lg bg-green-600 hover:bg-green-700 h-8 text-xs gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </Button>
                      </form>
                      <form action={rejectReview.bind(null, review.id)}>
                        <Button size="sm" type="submit" variant="outline" className="rounded-lg border-red-200 text-red-600 hover:bg-red-50 h-8 text-xs gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Approved */}
      <div>
        <h2 className="font-heading font-semibold text-lg mb-3">Approved Reviews ({approved.length})</h2>
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">User</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Item</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Rating</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Comment</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {approved.map((review) => {
                  const itemName = review.hotel_id
                    ? (review as any).hotels?.name
                    : `${(review as any).cars?.make} ${(review as any).cars?.model}`
                  return (
                    <tr key={review.id} className="hover:bg-muted/20">
                      <td className="px-5 py-3 font-medium">{(review as any).profiles?.full_name ?? '-'}</td>
                      <td className="px-5 py-3 text-muted-foreground text-xs">{itemName}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground text-xs max-w-xs truncate">{review.comment}</td>
                      <td className="px-5 py-3 text-muted-foreground text-xs">{format(new Date(review.created_at), 'MMM d, yy')}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
