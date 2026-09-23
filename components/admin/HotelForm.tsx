'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { addHotel, updateHotel } from '@/app/actions/admin-inventory'
import { Loader2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

export function HotelForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const amenitiesStr = formData.get('amenities') as string
    const imagesStr = formData.get('images') as string

    const data = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      address: formData.get('address'),
      city: formData.get('city'),
      country: formData.get('country'),
      star_rating: parseInt(formData.get('star_rating') as string) || 3,
      cover_image_url: formData.get('cover_image_url') || null,
      is_active: formData.get('is_active') === 'on',
      amenities: amenitiesStr ? amenitiesStr.split(',').map(s => s.trim()).filter(Boolean) : [],
      images: imagesStr ? imagesStr.split(',').map(s => s.trim()).filter(Boolean) : [],
    }

    try {
      if (initialData?.id) {
        await updateHotel(initialData.id, data)
      } else {
        await addHotel(data)
      }
      router.push('/admin/hotels')
    } catch (err: any) {
      setError(err.message || 'Failed to save hotel')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl border border-border shadow-sm max-w-2xl">
      {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Hotel Name</label>
          <Input name="name" defaultValue={initialData?.name} required placeholder="Grand Plaza" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">URL Slug (Optional)</label>
          <Input name="slug" defaultValue={initialData?.slug} placeholder="grand-plaza" />
        </div>
        <div className="space-y-2 col-span-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea name="description" defaultValue={initialData?.description} rows={3} />
        </div>
        <div className="space-y-2 col-span-2">
          <label className="text-sm font-medium">Address</label>
          <Input name="address" defaultValue={initialData?.address} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">City</label>
          <Input name="city" defaultValue={initialData?.city} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Country</label>
          <Input name="country" defaultValue={initialData?.country} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Star Rating (1-5)</label>
          <Input name="star_rating" type="number" min="1" max="5" defaultValue={initialData?.star_rating || 3} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Cover Image URL</label>
          <Input name="cover_image_url" defaultValue={initialData?.cover_image_url} placeholder="https://example.com/cover.jpg" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Amenities (Comma-separated)</label>
        <Textarea name="amenities" defaultValue={initialData?.amenities?.join(', ')} placeholder="Free WiFi, Pool, Spa" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Additional Image URLs (Comma-separated)</label>
        <Textarea name="images" defaultValue={initialData?.images?.join(', ')} placeholder="https://example.com/room1.jpg, https://example.com/lobby.jpg" />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox name="is_active" id="is_active" defaultChecked={initialData ? initialData.is_active : true} />
        <label htmlFor="is_active" className="text-sm font-medium">Active (Visible to users)</label>
      </div>

      <div className="pt-4 flex gap-4">
        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {initialData ? 'Update Hotel' : 'Add Hotel'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading} className="w-full">
          Cancel
        </Button>
      </div>
    </form>
  )
}
