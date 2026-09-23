// Database type definitions for Mlinda Travels
// These mirror the Supabase schema exactly

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: 'customer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'admin'
          updated_at?: string
        }
      }
      hotels: {
        Row: {
          id: string
          name: string
          description: string | null
          address: string | null
          city: string
          country: string
          lat: number | null
          lng: number | null
          star_rating: number | null
          amenities: string[]
          cover_image_url: string | null
          gallery_urls: string[]
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          address?: string | null
          city: string
          country?: string
          lat?: number | null
          lng?: number | null
          star_rating?: number | null
          amenities?: string[]
          cover_image_url?: string | null
          gallery_urls?: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          address?: string | null
          city?: string
          country?: string
          lat?: number | null
          lng?: number | null
          star_rating?: number | null
          amenities?: string[]
          cover_image_url?: string | null
          gallery_urls?: string[]
          is_active?: boolean
          updated_at?: string
        }
      }
      room_types: {
        Row: {
          id: string
          hotel_id: string
          name: string
          description: string | null
          max_guests: number
          base_price: number
          total_rooms: number
          images: string[]
          created_at: string
        }
        Insert: {
          id?: string
          hotel_id: string
          name: string
          description?: string | null
          max_guests?: number
          base_price: number
          total_rooms?: number
          images?: string[]
          created_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          max_guests?: number
          base_price?: number
          total_rooms?: number
          images?: string[]
        }
      }
      room_availability: {
        Row: {
          id: string
          room_type_id: string
          date: string
          rooms_available: number
          price_override: number | null
        }
        Insert: {
          id?: string
          room_type_id: string
          date: string
          rooms_available: number
          price_override?: number | null
        }
        Update: {
          rooms_available?: number
          price_override?: number | null
        }
      }
      cars: {
        Row: {
          id: string
          make: string
          model: string
          year: number | null
          category: string
          transmission: 'automatic' | 'manual'
          seats: number
          price_per_day: number
          location: string
          images: string[]
          features: string[]
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          make: string
          model: string
          year?: number | null
          category?: string
          transmission?: 'automatic' | 'manual'
          seats?: number
          price_per_day: number
          location: string
          images?: string[]
          features?: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          make?: string
          model?: string
          year?: number | null
          category?: string
          transmission?: 'automatic' | 'manual'
          seats?: number
          price_per_day?: number
          location?: string
          images?: string[]
          features?: string[]
          is_active?: boolean
          updated_at?: string
        }
      }
      car_availability: {
        Row: {
          id: string
          car_id: string
          date: string
          is_available: boolean
        }
        Insert: {
          id?: string
          car_id: string
          date: string
          is_available?: boolean
        }
        Update: {
          is_available?: boolean
        }
      }
      bookings: {
        Row: {
          id: string
          booking_ref: string
          user_id: string
          type: 'hotel' | 'car'
          item_id: string
          room_type_id: string | null
          hotel_id: string | null
          car_id: string | null
          start_date: string
          end_date: string
          guests: number | null
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_price: number
          currency: string
          payment_status: 'unpaid' | 'paid' | 'refunded' | 'partially_refunded'
          stripe_payment_intent_id: string | null
          promo_code: string | null
          discount_amount: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_ref: string
          user_id: string
          type: 'hotel' | 'car'
          item_id: string
          room_type_id?: string | null
          hotel_id?: string | null
          car_id?: string | null
          start_date: string
          end_date: string
          guests?: number | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_price: number
          currency?: string
          payment_status?: 'unpaid' | 'paid' | 'refunded' | 'partially_refunded'
          stripe_payment_intent_id?: string | null
          promo_code?: string | null
          discount_amount?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          payment_status?: 'unpaid' | 'paid' | 'refunded' | 'partially_refunded'
          stripe_payment_intent_id?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          hotel_id: string | null
          car_id: string | null
          booking_id: string | null
          rating: number
          comment: string | null
          is_approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          hotel_id?: string | null
          car_id?: string | null
          booking_id?: string | null
          rating: number
          comment?: string | null
          is_approved?: boolean
          created_at?: string
        }
        Update: {
          rating?: number
          comment?: string | null
          is_approved?: boolean
        }
      }
      promotions: {
        Row: {
          id: string
          code: string
          description: string | null
          discount_percent: number
          valid_from: string | null
          valid_to: string | null
          max_uses: number | null
          current_uses: number
          min_booking_amount: number | null
          applies_to: 'all' | 'hotel' | 'car'
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          description?: string | null
          discount_percent: number
          valid_from?: string | null
          valid_to?: string | null
          max_uses?: number | null
          current_uses?: number
          min_booking_amount?: number | null
          applies_to?: 'all' | 'hotel' | 'car'
          is_active?: boolean
          created_at?: string
        }
        Update: {
          code?: string
          description?: string | null
          discount_percent?: number
          valid_from?: string | null
          valid_to?: string | null
          max_uses?: number | null
          current_uses?: number
          min_booking_amount?: number | null
          applies_to?: 'all' | 'hotel' | 'car'
          is_active?: boolean
        }
      }
      admin_audit_log: {
        Row: {
          id: string
          admin_id: string
          action: string
          target_table: string | null
          target_id: string | null
          old_data: Json | null
          new_data: Json | null
          metadata: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          action: string
          target_table?: string | null
          target_id?: string | null
          old_data?: Json | null
          new_data?: Json | null
          metadata?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: never
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          hotel_id: string | null
          car_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          hotel_id?: string | null
          car_id?: string | null
          created_at?: string
        }
        Update: never
      }
      airports: {
        Row: {
          id: string
          iata_code: string
          name: string
          city: string
          country: string
        }
        Insert: {
          id?: string
          iata_code: string
          name: string
          city: string
          country: string
        }
        Update: {
          name?: string
          city?: string
          country?: string
        }
      }
      airlines: {
        Row: {
          id: string
          name: string
          iata_code: string | null
          logo_url: string | null
        }
        Insert: {
          id?: string
          name: string
          iata_code?: string | null
          logo_url?: string | null
        }
        Update: {
          name?: string
          iata_code?: string | null
          logo_url?: string | null
        }
      }
      flights: {
        Row: {
          id: string
          flight_number: string
          airline_id: string | null
          origin_airport_id: string | null
          destination_airport_id: string | null
          departure_time: string
          arrival_time: string
          duration_minutes: number | null
          stops: number
          aircraft_type: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          flight_number: string
          airline_id?: string | null
          origin_airport_id?: string | null
          destination_airport_id?: string | null
          departure_time: string
          arrival_time: string
          duration_minutes?: number | null
          stops?: number
          aircraft_type?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          is_active?: boolean
          updated_at?: string
        }
      }
      flight_fares: {
        Row: {
          id: string
          flight_id: string | null
          cabin_class: 'economy' | 'premium' | 'business'
          fare_type: string
          price: number
          seats_available: number
          baggage_allowance: string | null
          is_refundable: boolean
        }
        Insert: {
          id?: string
          flight_id?: string | null
          cabin_class: 'economy' | 'premium' | 'business'
          fare_type: string
          price: number
          seats_available: number
          baggage_allowance?: string | null
          is_refundable?: boolean
        }
        Update: {
          seats_available?: number
          price?: number
        }
      }
    }
    Views: {}
    Functions: {
      is_admin: {
        Args: {}
        Returns: boolean
      }
      generate_booking_ref: {
        Args: {}
        Returns: string
      }
    }
    Enums: {}
  }
}

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Hotel = Database['public']['Tables']['hotels']['Row']
export type RoomType = Database['public']['Tables']['room_types']['Row']
export type RoomAvailability = Database['public']['Tables']['room_availability']['Row']
export type Car = Database['public']['Tables']['cars']['Row']
export type CarAvailability = Database['public']['Tables']['car_availability']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Promotion = Database['public']['Tables']['promotions']['Row']
export type AdminAuditLog = Database['public']['Tables']['admin_audit_log']['Row']
export type Favorite = Database['public']['Tables']['favorites']['Row']
export type Airport = Database['public']['Tables']['airports']['Row']
export type Airline = Database['public']['Tables']['airlines']['Row']
export type Flight = Database['public']['Tables']['flights']['Row']
export type FlightFare = Database['public']['Tables']['flight_fares']['Row']

// Extended types with joins
export type HotelWithRooms = Hotel & {
  room_types: RoomType[]
}

export type RoomTypeWithAvailability = RoomType & {
  room_availability: RoomAvailability[]
}

export type BookingWithDetails = Booking & {
  profiles?: Profile
  hotels?: Hotel | null
  room_types?: RoomType | null
  cars?: Car | null
}

export type ReviewWithProfile = Review & {
  profiles: { full_name: string | null; avatar_url: string | null }
}

export type FlightWithDetails = Flight & {
  airlines: Airline | null
  origin: Airport | null
  destination: Airport | null
  flight_fares: FlightFare[]
}
