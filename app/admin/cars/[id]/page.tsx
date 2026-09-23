import { CarForm } from '@/components/admin/CarForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function EditCarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: car } = await supabase
    .from('cars')
    .select('*')
    .eq('id', id)
    .single()

  if (!car) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" className="-ml-4 text-muted-foreground">
          <Link href="/admin/cars">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cars
          </Link>
        </Button>
        <h1 className="text-2xl font-bold font-heading">Edit Car</h1>
      </div>
      
      <CarForm initialData={car} />
    </div>
  )
}
