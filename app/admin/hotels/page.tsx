import type { Metadata } from 'next'
import Link from 'next/link'
import { format } from 'date-fns'
import { Plus, Edit, Eye, ToggleLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Hotels - Admin' }

export default async function AdminHotelsPage() {
  const supabase = await createClient()
  const { data: hotelsRaw } = await supabase
    .from('hotels')
    .select('*, room_types(count)')
    .order('created_at', { ascending: false })

  const hotels = hotelsRaw as any[] | null

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Hotels</h1>
          <p className="text-muted-foreground text-sm">{hotels?.length ?? 0} properties</p>
        </div>
        <Button asChild className="rounded-xl bg-primary hover:bg-[#164d37]">
          <Link href="/admin/hotels/new">
            <Plus className="w-4 h-4 mr-2" /> Add Hotel
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Hotels table">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Hotel</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">City</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Stars</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Rooms</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {hotels?.map((hotel) => (
                <tr key={hotel.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium">{hotel.name}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-xs">{hotel.address}</p>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{hotel.city}</td>
                  <td className="px-5 py-4 text-muted-foreground">{hotel.star_rating}★</td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {(hotel as unknown as { room_types: { count: number }[] }).room_types?.length ?? 0} types
                  </td>
                  <td className="px-5 py-4">
                    <Badge className={`border-0 text-xs ${hotel.is_active ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                      {hotel.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/hotels/${hotel.id}`}>
                        <Button size="sm" variant="ghost" className="rounded-lg h-8 px-2">
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Link href={`/hotels/${hotel.id}`} target="_blank">
                        <Button size="sm" variant="ghost" className="rounded-lg h-8 px-2">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
