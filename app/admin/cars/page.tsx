import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Edit, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Cars - Admin' }

export default async function AdminCarsPage() {
  const supabase = await createClient()
  const { data: carsRaw } = await supabase
    .from('cars')
    .select('*')
    .order('created_at', { ascending: false })

  const cars = carsRaw as any[] | null

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Cars</h1>
          <p className="text-muted-foreground text-sm">{cars?.length ?? 0} vehicles</p>
        </div>
        <Button className="rounded-xl bg-primary hover:bg-[#164d37] text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Car
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" aria-label="Cars table">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Vehicle</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Category</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Specs</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Price / Day</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Location</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {cars?.map((car) => (
                <tr key={car.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-foreground">
                      {car.make} {car.model} {car.year ? `(${car.year})` : ''}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant="outline" className="text-xs font-medium capitalize border-primary/20 text-primary bg-primary/5">
                      {car.category}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground text-xs space-y-0.5">
                    <p className="capitalize">{car.transmission} · {car.seats} Seats</p>
                  </td>
                  <td className="px-5 py-4 font-semibold text-foreground">
                    ${car.price_per_day}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground text-sm">
                    {car.location}
                  </td>
                  <td className="px-5 py-4">
                    <Badge className={`border-0 text-xs font-medium ${car.is_active ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                      {car.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/cars/${car.id}`}>
                        <Button size="sm" variant="ghost" className="rounded-lg h-8 px-2 hover:bg-primary/10 hover:text-primary">
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Link href={`/cars/${car.id}`} target="_blank">
                        <Button size="sm" variant="ghost" className="rounded-lg h-8 px-2 hover:bg-primary/10 hover:text-primary">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              
              {(!cars || cars.length === 0) && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">
                    No cars found. Click "Add Car" to add inventory.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
