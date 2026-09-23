'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { format } from 'date-fns'
import {
  Plane, Save, ArrowLeft, Plus, Trash2, Loader2,
  CheckCircle2, XCircle, Edit2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Fare {
  id: string
  cabin_class: string
  fare_type: string
  price: number
  seats_available: number
  baggage_allowance: string | null
  is_refundable: boolean
}

interface Flight {
  id: string
  flight_number: string
  airline_id: string
  origin_airport_id: string
  destination_airport_id: string
  departure_time: string
  arrival_time: string
  duration_minutes: number | null
  stops: number
  aircraft_type: string | null
  is_active: boolean
  airlines: { id: string; name: string; iata_code: string } | null
  origin: { id: string; iata_code: string; city: string; name: string } | null
  destination: { id: string; iata_code: string; city: string; name: string } | null
  flight_fares: Fare[]
}

interface Airport { id: string; iata_code: string; city: string; name: string }
interface Airline { id: string; name: string; iata_code: string }

import {
  getFlightMeta,
  getFlight,
  createFlight,
  updateFlight,
  createFare,
  updateFare,
  deleteFare
} from '@/app/actions/admin-flights'

const CABIN_CLASSES = ['economy', 'premium', 'business']
const FARE_TYPES = ['basic', 'standard', 'flex']

export default function AdminFlightEditPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const isNew = params.id === 'new'

  const [flight, setFlight] = useState<Partial<Flight>>({
    flight_number: '',
    departure_time: '',
    arrival_time: '',
    duration_minutes: null,
    stops: 0,
    aircraft_type: '',
    is_active: true,
    flight_fares: [],
  })
  const [airports, setAirports] = useState<Airport[]>([])
  const [airlines, setAirlines] = useState<Airline[]>([])
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingFare, setEditingFare] = useState<string | null>(null)
  const [newFare, setNewFare] = useState<Partial<Fare> | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const meta = await getFlightMeta()
        setAirports(meta.airports ?? [])
        setAirlines(meta.airlines ?? [])

        if (!isNew) {
          const data = await getFlight(params.id)
          setFlight(data)
        }
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to load flight data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id, isNew])

  const handleFlightChange = (key: keyof Flight, value: any) => {
    setFlight(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveFlight = async () => {
    setSaving(true)
    setError(null)
    try {
      let savedFlight
      if (isNew) {
        savedFlight = await createFlight(flight)
        router.push(`/admin/flights/${savedFlight.id}`)
        return
      } else {
        savedFlight = await updateFlight(params.id, flight)
      }
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: any) {
      setError(e.message || 'Failed to save flight')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveFare = async (fare: Partial<Fare>, isNewFare = false) => {
    try {
      const flightId = params.id
      let updated: Fare
      if (isNewFare) {
        updated = await createFare(flightId, fare)
        setFlight(prev => ({
          ...prev,
          flight_fares: [...(prev.flight_fares ?? []), updated],
        }))
        setNewFare(null)
      } else {
        updated = await updateFare(flightId, fare.id!, fare)
        setFlight(prev => ({
          ...prev,
          flight_fares: (prev.flight_fares ?? []).map(f => f.id === updated.id ? updated : f),
        }))
        setEditingFare(null)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save fare')
    }
  }

  const handleDeleteFare = async (fareId: string) => {
    try {
      await deleteFare(params.id, fareId)
      setFlight(prev => ({
        ...prev,
        flight_fares: (prev.flight_fares ?? []).filter(f => f.id !== fareId),
      }))
    } catch (err: any) {
      setError(err.message || 'Failed to delete fare')
    }
  }

  const cabinLabel: Record<string, string> = {
    economy: 'Economy',
    premium: 'Premium Economy',
    business: 'Business',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/flights">
            <Button variant="ghost" size="sm" className="rounded-xl gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Flights
            </Button>
          </Link>
          <Separator orientation="vertical" className="h-5" />
          <h1 className="font-heading text-xl font-bold flex items-center gap-2">
            <Plane className="w-5 h-5 text-primary" />
            {isNew ? 'New Flight' : `${flight.airlines?.name ?? ''} ${flight.flight_number ?? ''}`}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Saved
            </span>
          )}
          <Button
            onClick={handleSaveFlight}
            disabled={saving}
            className="rounded-xl bg-primary hover:bg-[#164d37] text-white gap-1.5"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isNew ? 'Create Flight' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Flight Details Card */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h2 className="font-semibold text-base mb-5">Flight Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Airline</Label>
            <select
              className="w-full h-10 rounded-xl border border-border px-3 text-sm bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              value={flight.airline_id ?? ''}
              onChange={e => handleFlightChange('airline_id', e.target.value)}
            >
              <option value="">Select airline...</option>
              {airlines.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.iata_code})</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Flight Number</Label>
            <Input
              value={flight.flight_number ?? ''}
              onChange={e => handleFlightChange('flight_number', e.target.value)}
              placeholder="e.g. UL225"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Origin Airport</Label>
            <select
              className="w-full h-10 rounded-xl border border-border px-3 text-sm bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              value={flight.origin_airport_id ?? ''}
              onChange={e => handleFlightChange('origin_airport_id', e.target.value)}
            >
              <option value="">Select origin...</option>
              {airports.map(a => (
                <option key={a.id} value={a.id}>{a.iata_code} – {a.city} ({a.name})</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Destination Airport</Label>
            <select
              className="w-full h-10 rounded-xl border border-border px-3 text-sm bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              value={flight.destination_airport_id ?? ''}
              onChange={e => handleFlightChange('destination_airport_id', e.target.value)}
            >
              <option value="">Select destination...</option>
              {airports.map(a => (
                <option key={a.id} value={a.id}>{a.iata_code} – {a.city} ({a.name})</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Departure Time</Label>
            <Input
              type="datetime-local"
              value={flight.departure_time ? flight.departure_time.slice(0, 16) : ''}
              onChange={e => handleFlightChange('departure_time', new Date(e.target.value).toISOString())}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Arrival Time</Label>
            <Input
              type="datetime-local"
              value={flight.arrival_time ? flight.arrival_time.slice(0, 16) : ''}
              onChange={e => handleFlightChange('arrival_time', new Date(e.target.value).toISOString())}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Duration (minutes)</Label>
            <Input
              type="number"
              value={flight.duration_minutes ?? ''}
              onChange={e => handleFlightChange('duration_minutes', Number(e.target.value))}
              placeholder="e.g. 270"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Stops</Label>
            <select
              className="w-full h-10 rounded-xl border border-border px-3 text-sm bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              value={flight.stops ?? 0}
              onChange={e => handleFlightChange('stops', Number(e.target.value))}
            >
              <option value={0}>Direct (0 stops)</option>
              <option value={1}>1 Stop</option>
              <option value={2}>2 Stops</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Aircraft Type</Label>
            <Input
              value={flight.aircraft_type ?? ''}
              onChange={e => handleFlightChange('aircraft_type', e.target.value)}
              placeholder="e.g. Boeing 777-300ER"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <select
              className="w-full h-10 rounded-xl border border-border px-3 text-sm bg-background focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              value={flight.is_active ? 'true' : 'false'}
              onChange={e => handleFlightChange('is_active', e.target.value === 'true')}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fares Card — only show for existing flights */}
      {!isNew && (
        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-base">Fare Classes</h2>
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl gap-1.5"
              onClick={() => setNewFare({ cabin_class: 'economy', fare_type: 'standard', price: 0, seats_available: 50, is_refundable: false })}
            >
              <Plus className="w-3.5 h-3.5" /> Add Fare
            </Button>
          </div>

          <div className="space-y-3">
            {/* New fare row */}
            {newFare && (
              <div className="p-4 rounded-xl border-2 border-primary/30 bg-primary/5 space-y-3">
                <p className="text-sm font-semibold text-primary">New Fare</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs mb-1">Cabin</Label>
                    <select
                      className="w-full h-9 rounded-lg border border-border px-2 text-xs bg-white outline-none"
                      value={newFare.cabin_class ?? 'economy'}
                      onChange={e => setNewFare(p => ({ ...p!, cabin_class: e.target.value }))}
                    >
                      {CABIN_CLASSES.map(c => <option key={c} value={c}>{cabinLabel[c]}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs mb-1">Fare Type</Label>
                    <select
                      className="w-full h-9 rounded-lg border border-border px-2 text-xs bg-white outline-none"
                      value={newFare.fare_type ?? 'standard'}
                      onChange={e => setNewFare(p => ({ ...p!, fare_type: e.target.value }))}
                    >
                      {FARE_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs mb-1">Price (USD)</Label>
                    <Input
                      type="number"
                      className="h-9 rounded-lg text-xs"
                      value={newFare.price ?? ''}
                      onChange={e => setNewFare(p => ({ ...p!, price: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1">Seats Available</Label>
                    <Input
                      type="number"
                      className="h-9 rounded-lg text-xs"
                      value={newFare.seats_available ?? ''}
                      onChange={e => setNewFare(p => ({ ...p!, seats_available: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label className="text-xs mb-1">Baggage</Label>
                    <Input
                      className="h-9 rounded-lg text-xs"
                      placeholder="e.g. 30kg included"
                      value={newFare.baggage_allowance ?? ''}
                      onChange={e => setNewFare(p => ({ ...p!, baggage_allowance: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <label className="flex items-center gap-1.5 text-xs cursor-pointer pb-1">
                      <input
                        type="checkbox"
                        checked={newFare.is_refundable ?? false}
                        onChange={e => setNewFare(p => ({ ...p!, is_refundable: e.target.checked }))}
                        className="accent-primary"
                      />
                      Refundable
                    </label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="rounded-lg bg-primary hover:bg-[#164d37] text-white" onClick={() => handleSaveFare(newFare, true)}>
                    Save Fare
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-lg" onClick={() => setNewFare(null)}>Cancel</Button>
                </div>
              </div>
            )}

            {/* Existing fares */}
            {(flight.flight_fares ?? []).map(fare => (
              <div key={fare.id} className={cn(
                'p-4 rounded-xl border transition-all',
                editingFare === fare.id ? 'border-primary/30 bg-primary/5' : 'border-border hover:border-border/80'
              )}>
                {editingFare === fare.id ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-primary">Editing Fare</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs mb-1">Cabin</Label>
                        <select
                          className="w-full h-9 rounded-lg border border-border px-2 text-xs bg-white outline-none"
                          value={fare.cabin_class}
                          onChange={e => setFlight(prev => ({
                            ...prev,
                            flight_fares: (prev.flight_fares ?? []).map(f => f.id === fare.id ? { ...f, cabin_class: e.target.value } : f)
                          }))}
                        >
                          {CABIN_CLASSES.map(c => <option key={c} value={c}>{cabinLabel[c]}</option>)}
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs mb-1">Fare Type</Label>
                        <select
                          className="w-full h-9 rounded-lg border border-border px-2 text-xs bg-white outline-none"
                          value={fare.fare_type}
                          onChange={e => setFlight(prev => ({
                            ...prev,
                            flight_fares: (prev.flight_fares ?? []).map(f => f.id === fare.id ? { ...f, fare_type: e.target.value } : f)
                          }))}
                        >
                          {FARE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs mb-1">Price (USD)</Label>
                        <Input
                          type="number"
                          className="h-9 rounded-lg text-xs"
                          value={fare.price}
                          onChange={e => setFlight(prev => ({
                            ...prev,
                            flight_fares: (prev.flight_fares ?? []).map(f => f.id === fare.id ? { ...f, price: Number(e.target.value) } : f)
                          }))}
                        />
                      </div>
                      <div>
                        <Label className="text-xs mb-1">Seats Available</Label>
                        <Input
                          type="number"
                          className="h-9 rounded-lg text-xs"
                          value={fare.seats_available}
                          onChange={e => setFlight(prev => ({
                            ...prev,
                            flight_fares: (prev.flight_fares ?? []).map(f => f.id === fare.id ? { ...f, seats_available: Number(e.target.value) } : f)
                          }))}
                        />
                      </div>
                      <div>
                        <Label className="text-xs mb-1">Baggage</Label>
                        <Input
                          className="h-9 rounded-lg text-xs"
                          value={fare.baggage_allowance ?? ''}
                          onChange={e => setFlight(prev => ({
                            ...prev,
                            flight_fares: (prev.flight_fares ?? []).map(f => f.id === fare.id ? { ...f, baggage_allowance: e.target.value } : f)
                          }))}
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <label className="flex items-center gap-1.5 text-xs cursor-pointer pb-1">
                          <input
                            type="checkbox"
                            checked={fare.is_refundable}
                            onChange={e => setFlight(prev => ({
                              ...prev,
                              flight_fares: (prev.flight_fares ?? []).map(f => f.id === fare.id ? { ...f, is_refundable: e.target.checked } : f)
                            }))}
                            className="accent-primary"
                          />
                          Refundable
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="rounded-lg bg-primary hover:bg-[#164d37] text-white" onClick={() => handleSaveFare(fare)}>
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" className="rounded-lg" onClick={() => setEditingFare(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="capitalize text-xs">
                        {cabinLabel[fare.cabin_class] ?? fare.cabin_class}
                      </Badge>
                      <span className="text-sm text-muted-foreground capitalize">{fare.fare_type}</span>
                      <span className="font-semibold text-foreground">${fare.price}</span>
                      <span className="text-xs text-muted-foreground">{fare.seats_available} seats</span>
                      {fare.is_refundable
                        ? <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle2 className="w-3.5 h-3.5" /> Refundable</span>
                        : <span className="flex items-center gap-1 text-xs text-muted-foreground"><XCircle className="w-3.5 h-3.5" /> Non-refundable</span>
                      }
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 rounded-lg p-0 hover:bg-primary/10 hover:text-primary" onClick={() => setEditingFare(fare.id)}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 rounded-lg p-0 hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteFare(fare.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {(flight.flight_fares ?? []).length === 0 && !newFare && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No fares defined yet. Click "Add Fare" to create fare classes.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
