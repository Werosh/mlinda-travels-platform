'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { addCar, updateCar } from '@/app/actions/admin-inventory'
import { Loader2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

export function CarForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const featuresStr = formData.get('features') as string
    const imagesStr = formData.get('images') as string

    const data = {
      make: formData.get('make'),
      model: formData.get('model'),
      year: parseInt(formData.get('year') as string) || new Date().getFullYear(),
      category: formData.get('category'),
      transmission: formData.get('transmission'),
      seats: parseInt(formData.get('seats') as string) || 4,
      price_per_day: parseFloat(formData.get('price_per_day') as string) || 0,
      location: formData.get('location'),
      is_active: formData.get('is_active') === 'on',
      features: featuresStr ? featuresStr.split(',').map(s => s.trim()).filter(Boolean) : [],
      images: imagesStr ? imagesStr.split(',').map(s => s.trim()).filter(Boolean) : [],
    }

    try {
      if (initialData?.id) {
        await updateCar(initialData.id, data)
      } else {
        await addCar(data)
      }
      router.push('/admin/cars')
    } catch (err: any) {
      setError(err.message || 'Failed to save car')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl border border-border shadow-sm max-w-2xl">
      {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Make</label>
          <Input name="make" defaultValue={initialData?.make} required placeholder="Toyota" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Model</label>
          <Input name="model" defaultValue={initialData?.model} required placeholder="Camry" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Year</label>
          <Input name="year" type="number" defaultValue={initialData?.year} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Input name="category" defaultValue={initialData?.category} placeholder="suv, sedan, luxury" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Transmission</label>
          <Input name="transmission" defaultValue={initialData?.transmission} placeholder="automatic, manual" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Seats</label>
          <Input name="seats" type="number" defaultValue={initialData?.seats || 4} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Price per Day ($)</label>
          <Input name="price_per_day" type="number" step="0.01" defaultValue={initialData?.price_per_day} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <Input name="location" defaultValue={initialData?.location} required placeholder="City, Country" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Features (Comma-separated)</label>
        <Textarea name="features" defaultValue={initialData?.features?.join(', ')} placeholder="Bluetooth, GPS, Leather Seats" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Image URLs (Comma-separated)</label>
        <Textarea name="images" defaultValue={initialData?.images?.join(', ')} placeholder="https://example.com/car1.jpg, https://example.com/car2.jpg" />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox name="is_active" id="is_active" defaultChecked={initialData ? initialData.is_active : true} />
        <label htmlFor="is_active" className="text-sm font-medium">Active (Visible to users)</label>
      </div>

      <div className="pt-4 flex gap-4">
        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {initialData ? 'Update Car' : 'Add Car'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading} className="w-full">
          Cancel
        </Button>
      </div>
    </form>
  )
}
