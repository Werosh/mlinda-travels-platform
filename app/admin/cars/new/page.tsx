import { CarForm } from '@/components/admin/CarForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NewCarPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" className="-ml-4 text-muted-foreground">
          <Link href="/admin/cars">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cars
          </Link>
        </Button>
        <h1 className="text-2xl font-bold font-heading">Add New Car</h1>
      </div>
      
      <CarForm />
    </div>
  )
}
