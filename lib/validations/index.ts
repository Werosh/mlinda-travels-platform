import { z } from 'zod'

// ── Auth Schemas ──────────────────────────────────────────────
export const signUpSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
})

// ── Profile Schema ────────────────────────────────────────────
export const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
})

// ── Hotel Search Schema ───────────────────────────────────────
export const hotelSearchSchema = z.object({
  city: z.string().min(1, 'Please enter a destination'),
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  guests: z.coerce.number().min(1).max(20).default(2),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  starRating: z.coerce.number().min(1).max(5).optional(),
  amenities: z.array(z.string()).optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'rating_desc', 'name_asc']).default('rating_desc'),
  page: z.coerce.number().min(1).default(1),
})

// ── Car Search Schema ─────────────────────────────────────────
export const carSearchSchema = z.object({
  location: z.string().min(1, 'Please enter a pickup location'),
  pickupDate: z.string().min(1, 'Pickup date is required'),
  returnDate: z.string().min(1, 'Return date is required'),
  category: z.enum(['economy', 'hybrid', 'suv', 'luxury', 'all']).default('all'),
  transmission: z.enum(['automatic', 'manual', 'all']).default('all'),
  minSeats: z.coerce.number().min(1).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'seats_asc', 'name_asc']).default('price_asc'),
  page: z.coerce.number().min(1).default(1),
})

// ── Booking Guest Details Schema ──────────────────────────────
export const guestDetailsSchema = z.object({
  firstName: z.string().min(2, 'First name is required').max(50),
  lastName: z.string().min(2, 'Last name is required').max(50),
  email: z.string().email('Please enter a valid email'),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, 'Please enter a valid phone number'),
  specialRequests: z.string().max(500).optional(),
  promoCode: z.string().max(20).optional(),
})

// ── Review Schema ─────────────────────────────────────────────
export const reviewSchema = z.object({
  rating: z.coerce.number().min(1, 'Please select a rating').max(5),
  comment: z
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(1000, 'Review must be less than 1000 characters'),
})

// ── Admin: Hotel Form Schema ──────────────────────────────────
export const hotelFormSchema = z.object({
  name: z.string().min(2, 'Hotel name is required').max(200),
  description: z.string().max(2000).optional(),
  address: z.string().max(300).optional(),
  city: z.string().min(2, 'City is required').max(100),
  country: z.string().min(2, 'Country is required').max(100),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  star_rating: z.coerce.number().min(1).max(5).optional(),
  amenities: z.array(z.string()).default([]),
  cover_image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  is_active: z.boolean().default(true),
})

// ── Admin: Room Type Form Schema ──────────────────────────────
export const roomTypeFormSchema = z.object({
  name: z.string().min(2, 'Room name is required').max(100),
  description: z.string().max(1000).optional(),
  max_guests: z.coerce.number().min(1, 'Must accommodate at least 1 guest').max(20),
  base_price: z.coerce.number().min(1, 'Price must be at least $1'),
  total_rooms: z.coerce.number().min(1, 'Must have at least 1 room'),
})

// ── Admin: Car Form Schema ────────────────────────────────────
export const carFormSchema = z.object({
  make: z.string().min(2, 'Make is required').max(50),
  model: z.string().min(1, 'Model is required').max(50),
  year: z.coerce.number().min(2000).max(2030).optional(),
  category: z.enum(['economy', 'hybrid', 'suv', 'luxury']),
  transmission: z.enum(['automatic', 'manual']),
  seats: z.coerce.number().min(2).max(12),
  price_per_day: z.coerce.number().min(1, 'Price must be at least $1'),
  location: z.string().min(2, 'Location is required').max(100),
  features: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
})

// ── Admin: Promo Form Schema ──────────────────────────────────
export const promoFormSchema = z.object({
  code: z
    .string()
    .min(3, 'Code must be at least 3 characters')
    .max(20)
    .regex(/^[A-Z0-9_-]+$/, 'Code can only contain uppercase letters, numbers, hyphens, underscores'),
  description: z.string().max(200).optional(),
  discount_percent: z.coerce.number().min(1, 'Discount must be at least 1%').max(100),
  valid_from: z.string().optional(),
  valid_to: z.string().optional(),
  max_uses: z.coerce.number().min(1).optional().nullable(),
  min_booking_amount: z.coerce.number().min(0).default(0),
  applies_to: z.enum(['all', 'hotel', 'car']).default('all'),
  is_active: z.boolean().default(true),
})

// ── Contact Form Schema ───────────────────────────────────────
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(5, 'Subject is required').max(200),
  message: z
    .string()
    .min(20, 'Message must be at least 20 characters')
    .max(2000),
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type HotelSearchInput = z.infer<typeof hotelSearchSchema>
export type CarSearchInput = z.infer<typeof carSearchSchema>
export type GuestDetailsInput = z.infer<typeof guestDetailsSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type HotelFormInput = z.infer<typeof hotelFormSchema>
export type RoomTypeFormInput = z.infer<typeof roomTypeFormSchema>
export type CarFormInput = z.infer<typeof carFormSchema>
export type PromoFormInput = z.infer<typeof promoFormSchema>
export type ContactFormInput = z.infer<typeof contactFormSchema>
