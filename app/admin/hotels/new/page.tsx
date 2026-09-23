import { HotelForm } from '@/components/admin/HotelForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NewHotelPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" className="-ml-4 text-muted-foreground">
          <Link href="/admin/hotels">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Hotels
          </Link>
        </Button>
        <h1 className="text-2xl font-bold font-heading">Add New Hotel</h1>
      </div>
      
      <HotelForm />
    </div>
  )
}
