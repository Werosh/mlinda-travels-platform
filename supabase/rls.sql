-- ============================================================
-- Mlinda Travels - Row Level Security Policies
-- Run AFTER schema.sql
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Helper function: check if current user is admin
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- PROFILES POLICIES
-- ============================================================
-- Users can read their own profile; admins can read all
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

-- Users can update their own profile; admins can update any
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- Profile is inserted via trigger (service role)
CREATE POLICY "profiles_insert_trigger" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================================
-- HOTELS POLICIES
-- ============================================================
-- Public can read active hotels
CREATE POLICY "hotels_public_select" ON public.hotels
  FOR SELECT USING (is_active = TRUE OR public.is_admin());

-- Only admins can modify hotels
CREATE POLICY "hotels_admin_insert" ON public.hotels
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "hotels_admin_update" ON public.hotels
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "hotels_admin_delete" ON public.hotels
  FOR DELETE USING (public.is_admin());

-- ============================================================
-- ROOM TYPES POLICIES
-- ============================================================
-- Public can read room types of active hotels
CREATE POLICY "room_types_public_select" ON public.room_types
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.hotels h
      WHERE h.id = hotel_id AND (h.is_active = TRUE OR public.is_admin())
    )
  );

CREATE POLICY "room_types_admin_insert" ON public.room_types
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "room_types_admin_update" ON public.room_types
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "room_types_admin_delete" ON public.room_types
  FOR DELETE USING (public.is_admin());

-- ============================================================
-- ROOM AVAILABILITY POLICIES
-- ============================================================
CREATE POLICY "room_avail_public_select" ON public.room_availability
  FOR SELECT USING (TRUE);

CREATE POLICY "room_avail_admin_insert" ON public.room_availability
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "room_avail_admin_update" ON public.room_availability
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "room_avail_admin_delete" ON public.room_availability
  FOR DELETE USING (public.is_admin());

-- ============================================================
-- CARS POLICIES
-- ============================================================
CREATE POLICY "cars_public_select" ON public.cars
  FOR SELECT USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "cars_admin_insert" ON public.cars
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "cars_admin_update" ON public.cars
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "cars_admin_delete" ON public.cars
  FOR DELETE USING (public.is_admin());

-- ============================================================
-- CAR AVAILABILITY POLICIES
-- ============================================================
CREATE POLICY "car_avail_public_select" ON public.car_availability
  FOR SELECT USING (TRUE);

CREATE POLICY "car_avail_admin_insert" ON public.car_availability
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "car_avail_admin_update" ON public.car_availability
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "car_avail_admin_delete" ON public.car_availability
  FOR DELETE USING (public.is_admin());

-- ============================================================
-- BOOKINGS POLICIES
-- ============================================================
-- Users see their own bookings; admins see all
CREATE POLICY "bookings_select_own" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

-- Auth users can create bookings for themselves
CREATE POLICY "bookings_insert_own" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only admins can update booking status/payment
CREATE POLICY "bookings_admin_update" ON public.bookings
  FOR UPDATE USING (public.is_admin());

-- ============================================================
-- REVIEWS POLICIES
-- ============================================================
-- Public can see approved reviews; admins see all
CREATE POLICY "reviews_public_select" ON public.reviews
  FOR SELECT USING (is_approved = TRUE OR public.is_admin());

-- Authenticated users can submit reviews
CREATE POLICY "reviews_auth_insert" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- Users can update their own unapproved reviews; admins can update any
CREATE POLICY "reviews_update" ON public.reviews
  FOR UPDATE USING (
    (auth.uid() = user_id AND is_approved = FALSE)
    OR public.is_admin()
  );

-- Admins can delete reviews
CREATE POLICY "reviews_admin_delete" ON public.reviews
  FOR DELETE USING (public.is_admin());

-- ============================================================
-- PROMOTIONS POLICIES
-- ============================================================
-- Active promos are publicly readable (to validate codes)
CREATE POLICY "promotions_public_select" ON public.promotions
  FOR SELECT USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "promotions_admin_insert" ON public.promotions
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "promotions_admin_update" ON public.promotions
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "promotions_admin_delete" ON public.promotions
  FOR DELETE USING (public.is_admin());

-- ============================================================
-- ADMIN AUDIT LOG POLICIES
-- ============================================================
CREATE POLICY "audit_admin_select" ON public.admin_audit_log
  FOR SELECT USING (public.is_admin());

CREATE POLICY "audit_admin_insert" ON public.admin_audit_log
  FOR INSERT WITH CHECK (public.is_admin());

-- ============================================================
-- FAVORITES POLICIES
-- ============================================================
CREATE POLICY "favorites_select_own" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "favorites_insert_own" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "favorites_delete_own" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);
