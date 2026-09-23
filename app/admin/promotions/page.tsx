import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { Plus, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Promotions — Admin' }

export default async function AdminPromotionsPage() {
  const supabase = await createClient()
  const { data: promosRaw } = await supabase
    .from('promotions')
    .select('*')
    .order('created_at', { ascending: false })
  
  const promos = promosRaw as any[] | null

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Promotions</h1>
          <p className="text-muted-foreground text-sm">{promos?.length ?? 0} promo codes</p>
        </div>
        <Button className="rounded-xl bg-primary hover:bg-[#164d37]">
          <Plus className="w-4 h-4 mr-2" /> Create Promo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {promos?.map((promo) => (
          <div key={promo.id} className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Tag className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="font-mono font-bold text-sm">{promo.code}</p>
                  <p className="text-xs text-muted-foreground capitalize">{promo.applies_to}</p>
                </div>
              </div>
              <Badge className={`border-0 text-xs ${promo.is_active ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                {promo.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="font-heading text-2xl font-bold text-foreground mb-1">
              {promo.discount_percent}% off
            </p>
            {promo.description && (
              <p className="text-xs text-muted-foreground mb-3">{promo.description}</p>
            )}
            <div className="space-y-1 text-xs text-muted-foreground">
              {promo.min_booking_amount && (
                <p>Min. booking: ${promo.min_booking_amount}</p>
              )}
              {promo.valid_from && promo.valid_to && (
                <p>Valid: {format(new Date(promo.valid_from), 'MMM d')} → {format(new Date(promo.valid_to), 'MMM d, yyyy')}</p>
              )}
              <p>Uses: {promo.current_uses}{promo.max_uses ? ` / ${promo.max_uses}` : ' (unlimited)'}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 rounded-lg h-8 text-xs">Edit</Button>
              <Button size="sm" variant="outline" className="rounded-lg h-8 text-xs text-destructive border-red-200 hover:bg-red-50">Deactivate</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
