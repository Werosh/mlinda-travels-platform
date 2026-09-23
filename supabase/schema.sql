-- ============================================================
-- Mlinda Travels - Supabase Database Schema
-- Run this in your Supabase SQL editor (in order)
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  phone       TEXT,
  avatar_url  TEXT,
  role        TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- HOTELS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.hotels (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT,
  address         TEXT,
  city            TEXT NOT NULL,
  country         TEXT NOT NULL DEFAULT 'Sri Lanka',
  lat             DOUBLE PRECISION,
  lng             DOUBLE PRECISION,
  star_rating     NUMERIC(2,1) CHECK (star_rating BETWEEN 1 AND 5),
  amenities       TEXT[] DEFAULT '{}',
  cover_image_url TEXT,
  gallery_urls    TEXT[] DEFAULT '{}',
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS hotels_city_idx ON public.hotels(city);
CREATE INDEX IF NOT EXISTS hotels_active_idx ON public.hotels(is_active);
CREATE INDEX IF NOT EXISTS hotels_star_rating_idx ON public.hotels(star_rating);

-- ============================================================
-- ROOM TYPES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.room_types (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id    UUID NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  max_guests  INT NOT NULL DEFAULT 2,
  base_price  NUMERIC(10,2) NOT NULL,
  total_rooms INT NOT NULL DEFAULT 1,
  images      TEXT[] DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS room_types_hotel_idx ON public.room_types(hotel_id);

-- ============================================================
-- ROOM AVAILABILITY
-- ============================================================
CREATE TABLE IF NOT EXISTS public.room_availability (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_type_id    UUID NOT NULL REFERENCES public.room_types(id) ON DELETE CASCADE,
  date            DATE NOT NULL,
  rooms_available INT NOT NULL,
  price_override  NUMERIC(10,2),
  UNIQUE (room_type_id, date)
);

CREATE INDEX IF NOT EXISTS room_avail_date_idx ON public.room_availability(date);
CREATE INDEX IF NOT EXISTS room_avail_room_type_idx ON public.room_availability(room_type_id);

-- ============================================================
-- CARS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.cars (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make          TEXT NOT NULL,
  model         TEXT NOT NULL,
  year          INT,
  category      TEXT NOT NULL DEFAULT 'economy',
  transmission  TEXT NOT NULL DEFAULT 'automatic' CHECK (transmission IN ('automatic', 'manual')),
  seats         INT NOT NULL DEFAULT 5,
  price_per_day NUMERIC(10,2) NOT NULL,
  location      TEXT NOT NULL,
  images        TEXT[] DEFAULT '{}',
  features      TEXT[] DEFAULT '{}',
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cars_location_idx ON public.cars(location);
CREATE INDEX IF NOT EXISTS cars_category_idx ON public.cars(category);
CREATE INDEX IF NOT EXISTS cars_active_idx ON public.cars(is_active);

-- ============================================================
-- CAR AVAILABILITY
-- ============================================================
CREATE TABLE IF NOT EXISTS public.car_availability (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id       UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  date         DATE NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (car_id, date)
);

CREATE INDEX IF NOT EXISTS car_avail_date_idx ON public.car_availability(date);
CREATE INDEX IF NOT EXISTS car_avail_car_idx ON public.car_availability(car_id);

-- ============================================================
-- BOOKINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref             TEXT UNIQUE NOT NULL,
  user_id                 UUID NOT NULL REFERENCES public.profiles(id),
  type                    TEXT NOT NULL CHECK (type IN ('hotel', 'car')),
  item_id                 UUID NOT NULL,
  room_type_id            UUID REFERENCES public.room_types(id),
  hotel_id                UUID REFERENCES public.hotels(id),
  car_id                  UUID REFERENCES public.cars(id),
  start_date              DATE NOT NULL,
  end_date                DATE NOT NULL,
  guests                  INT DEFAULT 1,
  status                  TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  total_price             NUMERIC(10,2) NOT NULL,
  currency                TEXT NOT NULL DEFAULT 'USD',
  payment_status          TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'partially_refunded')),
  stripe_payment_intent_id TEXT,
  promo_code              TEXT,
  discount_amount         NUMERIC(10,2) DEFAULT 0,
  notes                   TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (end_date > start_date)
);

CREATE INDEX IF NOT EXISTS bookings_user_idx ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON public.bookings(status);
CREATE INDEX IF NOT EXISTS bookings_dates_idx ON public.bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS bookings_ref_idx ON public.bookings(booking_ref);
CREATE INDEX IF NOT EXISTS bookings_type_idx ON public.bookings(type);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id),
  hotel_id    UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  car_id      UUID REFERENCES public.cars(id) ON DELETE CASCADE,
  booking_id  UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    (hotel_id IS NOT NULL AND car_id IS NULL) OR
    (hotel_id IS NULL AND car_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS reviews_hotel_idx ON public.reviews(hotel_id);
CREATE INDEX IF NOT EXISTS reviews_car_idx ON public.reviews(car_id);
CREATE INDEX IF NOT EXISTS reviews_approved_idx ON public.reviews(is_approved);

-- ============================================================
-- PROMOTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.promotions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code             TEXT UNIQUE NOT NULL,
  description      TEXT,
  discount_percent NUMERIC(5,2) NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
  valid_from       DATE,
  valid_to         DATE,
  max_uses         INT,
  current_uses     INT NOT NULL DEFAULT 0,
  min_booking_amount NUMERIC(10,2) DEFAULT 0,
  applies_to       TEXT DEFAULT 'all' CHECK (applies_to IN ('all', 'hotel', 'car')),
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ADMIN AUDIT LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id     UUID NOT NULL REFERENCES public.profiles(id),
  action       TEXT NOT NULL,
  target_table TEXT,
  target_id    UUID,
  old_data     JSONB,
  new_data     JSONB,
  metadata     JSONB,
  ip_address   INET,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS audit_admin_idx ON public.admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS audit_created_idx ON public.admin_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS audit_table_idx ON public.admin_audit_log(target_table);

-- ============================================================
-- FAVORITES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  hotel_id   UUID REFERENCES public.hotels(id) ON DELETE CASCADE,
  car_id     UUID REFERENCES public.cars(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, hotel_id),
  UNIQUE (user_id, car_id),
  CHECK (
    (hotel_id IS NOT NULL AND car_id IS NULL) OR
    (hotel_id IS NULL AND car_id IS NOT NULL)
  )
);

-- ============================================================
-- Helper: updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER hotels_updated_at BEFORE UPDATE ON public.hotels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER cars_updated_at BEFORE UPDATE ON public.cars FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- Helper: generate booking reference
-- ============================================================
CREATE OR REPLACE FUNCTION public.generate_booking_ref()
RETURNS TEXT AS $$
DECLARE
  v_year TEXT;
  v_seq  TEXT;
  v_ref  TEXT;
BEGIN
  v_year := EXTRACT(YEAR FROM NOW())::TEXT;
  v_seq := LPAD((FLOOR(RANDOM() * 999999) + 1)::TEXT, 6, '0');
  v_ref := 'MLT-' || v_year || '-' || v_seq;
  RETURN v_ref;
END;
$$ LANGUAGE plpgsql;
