import { HotelForm } from '@/components/admin/HotelForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function EditHotelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: hotel } = await supabase
    .from('hotels')
    .select('*')
    .eq('id', id)
    .single()

  if (!hotel) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" className="-ml-4 text-muted-foreground">
          <Link href="/admin/hotels">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Hotels
          </Link>
        </Button>
        <h1 className="text-2xl font-bold font-heading">Edit Hotel</h1>
      </div>
      
      <HotelForm initialData={hotel} />
    </div>
  )
}
