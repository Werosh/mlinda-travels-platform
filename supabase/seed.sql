-- ============================================================
-- Mlinda Travels - Seed Data
-- Run AFTER schema.sql and rls.sql
-- NOTE: The demo admin user must be created manually in Supabase
-- Auth dashboard first, then update their profile role below.
-- Demo admin: admin@mlindatravels.com / Admin@1234!
-- ============================================================

-- ============================================================
-- HOTELS
-- ============================================================
INSERT INTO public.hotels (id, name, description, address, city, country, lat, lng, star_rating, amenities, cover_image_url, gallery_urls, is_active) VALUES

('10000000-0000-0000-0000-000000000001',
 'The Galle Face Grand',
 'A landmark colonial-era hotel overlooking the Indian Ocean, blending timeless heritage with modern luxury. Wake up to panoramic ocean views and indulge in world-class dining.',
 'Galle Face, Colombo 3',
 'Colombo', 'Sri Lanka',
 6.9108, 79.8471,
 5.0,
 ARRAY['ocean view','free wifi','pool','spa','gym','restaurant','bar','concierge','valet parking','business center','room service'],
 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
 ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800','https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800','https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800','https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800'],
 TRUE),

('10000000-0000-0000-0000-000000000002',
 'Jetwing Blue',
 'A sophisticated oceanfront resort in Negombo with stunning blue-toned interiors that mirror the sea outside. Perfect for beach lovers and water-sports enthusiasts.',
 'Ethukala, Negombo',
 'Negombo', 'Sri Lanka',
 7.2273, 79.8440,
 4.5,
 ARRAY['beachfront','pool','spa','free wifi','restaurant','bar','water sports','kids club','room service','airport shuttle'],
 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
 ARRAY['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800','https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800','https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'],
 TRUE),

('10000000-0000-0000-0000-000000000003',
 'Wild Coast Tented Lodge',
 'An extraordinary eco-luxury experience in Yala with safari-style tented suites nestled in the wilderness. Elephants roam freely just meters from your private plunge pool.',
 'Yala National Park Buffer Zone',
 'Yala', 'Sri Lanka',
 6.3831, 81.5167,
 5.0,
 ARRAY['safari','wildlife','private plunge pool','all inclusive','stargazing','nature walks','yoga','organic dining'],
 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200',
 ARRAY['https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800','https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800','https://images.unsplash.com/photo-1533760881669-80db4d7b341c?w=800'],
 TRUE),

('10000000-0000-0000-0000-000000000004',
 'Amangalla',
 'A fortress-turned-sanctuary within the walls of Galle Dutch Fort. This iconic hotel blends Dutch colonial architecture with serene tropical gardens and exceptional service.',
 '10 Church Street, Galle Fort',
 'Galle', 'Sri Lanka',
 6.0296, 80.2168,
 5.0,
 ARRAY['heritage property','spa','pool','free wifi','restaurant','bar','colonial architecture','unesco world heritage','butler service'],
 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200',
 ARRAY['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800','https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800','https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800'],
 TRUE),

('10000000-0000-0000-0000-000000000005',
 'Heritance Tea Factory',
 'An iconic hotel built within a restored Victorian tea factory high in the Nuwara Eliya hills. Surrounded by lush tea estates with misty mountain views and cool highland air.',
 'Kandapola, Nuwara Eliya',
 'Nuwara Eliya', 'Sri Lanka',
 6.9823, 80.7830,
 4.5,
 ARRAY['tea estate','mountain view','fireplace','spa','free wifi','restaurant','bar','tea tasting','hiking','colonial charm'],
 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=1200',
 ARRAY['https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800','https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800','https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800'],
 TRUE),

('10000000-0000-0000-0000-000000000006',
 'Cinnamon Grand Colombo',
 'The heartbeat of Colombo city - a contemporary luxury hotel combining business efficiency with leisure elegance. Walking distance from Colombo''s top attractions and shopping.',
 '77 Galle Road, Colombo 3',
 'Colombo', 'Sri Lanka',
 6.8914, 79.8551,
 5.0,
 ARRAY['city center','pool','spa','gym','free wifi','multiple restaurants','bar','business center','valet parking','concierge','room service'],
 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200',
 ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800','https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800','https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'],
 TRUE);

-- ============================================================
-- ROOM TYPES
-- ============================================================
INSERT INTO public.room_types (id, hotel_id, name, description, max_guests, base_price, total_rooms, images) VALUES

-- Galle Face Grand rooms
('20000001-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001',
 'Ocean View Deluxe', 'Sweeping views of the Indian Ocean with a king bed, marble bathroom, and private balcony.',
 2, 280.00, 15,
 ARRAY['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800','https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800']),

('20000001-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001',
 'Heritage Suite', 'Expansive suite with colonial furnishings, separate living room, and panoramic ocean terrace.',
 3, 520.00, 6,
 ARRAY['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800','https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800']),

('20000001-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001',
 'Standard Garden View', 'Comfortable room with garden views and all modern amenities.',
 2, 175.00, 30,
 ARRAY['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800']),

-- Jetwing Blue rooms
('20000002-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002',
 'Superior Sea View', 'Bright room with direct sea view and private balcony, steps from the beach.',
 2, 195.00, 20,
 ARRAY['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800']),

('20000002-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002',
 'Family Beach Suite', 'Spacious suite accommodating up to 4 guests with bunk beds and ocean-facing patio.',
 4, 340.00, 8,
 ARRAY['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800']),

-- Wild Coast rooms
('20000003-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003',
 'Bubble Suite', 'Transparent curved tent with 270° wildlife views, private plunge pool, and butler service.',
 2, 850.00, 4,
 ARRAY['https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800']),

('20000003-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003',
 'Tented Bush Villa', 'Luxury canvas villa with wraparound deck overlooking a waterhole visited by elephants at dawn.',
 2, 620.00, 8,
 ARRAY['https://images.unsplash.com/photo-1533760881669-80db4d7b341c?w=800']),

-- Amangalla rooms
('20000004-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004',
 'Galle Suite', 'A spacious suite in the historic fort building with courtyard garden access and four-poster bed.',
 2, 680.00, 5,
 ARRAY['https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800']),

('20000004-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000004',
 'Garden Room', 'Elegant colonial-style room with direct garden access and private verandah.',
 2, 420.00, 10,
 ARRAY['https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800']),

-- Heritance Tea Factory rooms
('20000005-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005',
 'Planters Suite', 'The most coveted suite in the factory building with Victorian fireplace and sweeping tea estate views.',
 2, 380.00, 4,
 ARRAY['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800']),

('20000005-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000005',
 'Standard Luxury Room', 'Charming room with tea estate views and working fireplace, reclaimed factory decor.',
 2, 220.00, 18,
 ARRAY['https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=800']),

-- Cinnamon Grand rooms
('20000006-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000006',
 'City View Deluxe', 'Contemporary deluxe room with city skyline views, king bed, and rainfall shower.',
 2, 210.00, 40,
 ARRAY['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800']),

('20000006-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000006',
 'Executive Club Floor', 'Upgraded room on the executive floor with lounge access, breakfast, and evening cocktails.',
 2, 310.00, 20,
 ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800']),

('20000006-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000006',
 'Grand Suite', 'The pinnacle of city luxury - a massive suite with separate dining, home theater, and Colombo skyline terrace.',
 4, 580.00, 5,
 ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800']);

-- ============================================================
-- ROOM AVAILABILITY (next 90 days)
-- ============================================================
INSERT INTO public.room_availability (room_type_id, date, rooms_available)
SELECT
  rt.id AS room_type_id,
  (CURRENT_DATE + s.i) AS date,
  -- Randomize slightly to make it realistic
  GREATEST(0, rt.total_rooms - FLOOR(RANDOM() * (rt.total_rooms * 0.4))::INT) AS rooms_available
FROM public.room_types rt
CROSS JOIN generate_series(0, 90) AS s(i)
ON CONFLICT (room_type_id, date) DO NOTHING;

-- ============================================================
-- CARS
-- ============================================================
INSERT INTO public.cars (id, make, model, year, category, transmission, seats, price_per_day, location, images, features, is_active) VALUES

('30000000-0000-0000-0000-000000000001',
 'Toyota', 'Aqua', 2022, 'economy', 'automatic', 5, 45.00, 'Colombo',
 ARRAY['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800'],
 ARRAY['bluetooth','backup camera','fuel efficient','usb charging','air conditioning'],
 TRUE),

('30000000-0000-0000-0000-000000000002',
 'Honda', 'Fit', 2021, 'economy', 'automatic', 5, 42.00, 'Negombo',
 ARRAY['https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800'],
 ARRAY['bluetooth','air conditioning','usb charging','good fuel economy'],
 TRUE),

('30000000-0000-0000-0000-000000000003',
 'Toyota', 'Prius', 2023, 'hybrid', 'automatic', 5, 65.00, 'Colombo',
 ARRAY['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800'],
 ARRAY['hybrid','lane assist','adaptive cruise','apple carplay','android auto','360 camera','sunroof'],
 TRUE),

('30000000-0000-0000-0000-000000000004',
 'Toyota', 'Land Cruiser', 2022, 'suv', 'automatic', 7, 120.00, 'Colombo',
 ARRAY['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800'],
 ARRAY['4WD','7 seats','roof rack','off-road','bluetooth','leather seats','sunroof','apple carplay'],
 TRUE),

('30000000-0000-0000-0000-000000000005',
 'Mitsubishi', 'Outlander', 2021, 'suv', 'automatic', 7, 95.00, 'Kandy',
 ARRAY['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'],
 ARRAY['7 seats','bluetooth','backup camera','air conditioning','roof rails','cruise control'],
 TRUE),

('30000000-0000-0000-0000-000000000006',
 'BMW', '5 Series', 2023, 'luxury', 'automatic', 5, 180.00, 'Colombo',
 ARRAY['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800'],
 ARRAY['leather seats','sunroof','harman kardon audio','adaptive cruise','lane assist','parking assist','apple carplay','heated seats'],
 TRUE),

('30000000-0000-0000-0000-000000000007',
 'Mercedes-Benz', 'E-Class', 2022, 'luxury', 'automatic', 5, 195.00, 'Colombo',
 ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800'],
 ARRAY['leather seats','panoramic sunroof','burmester audio','massage seats','ambient lighting','apple carplay','driver assistance package'],
 TRUE),

('30000000-0000-0000-0000-000000000008',
 'Suzuki', 'Jimny', 2022, 'suv', 'manual', 4, 70.00, 'Nuwara Eliya',
 ARRAY['https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800'],
 ARRAY['4WD','compact','off-road','bluetooth','easy to park','great for mountains'],
 TRUE);

-- ============================================================
-- CAR AVAILABILITY (next 90 days)
-- ============================================================
INSERT INTO public.car_availability (car_id, date, is_available)
SELECT
  c.id AS car_id,
  (CURRENT_DATE + s.i) AS date,
  -- ~85% chance of being available
  (RANDOM() > 0.15) AS is_available
FROM public.cars c
CROSS JOIN generate_series(0, 90) AS s(i)
ON CONFLICT (car_id, date) DO NOTHING;

-- ============================================================
-- PROMOTIONS
-- ============================================================
INSERT INTO public.promotions (code, description, discount_percent, valid_from, valid_to, max_uses, min_booking_amount, applies_to, is_active) VALUES
('WELCOME10', 'Welcome discount for new customers', 10.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '90 days', 100, 50.00, 'all', TRUE),
('HOTEL20', 'Exclusive hotel deal - 20% off hotel bookings', 20.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 50, 100.00, 'hotel', TRUE),
('CAR15', 'Road trip special - 15% off car rentals', 15.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days', 75, 80.00, 'car', TRUE),
('SUMMER25', 'Summer travel bonanza - 25% off everything', 25.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '45 days', 30, 200.00, 'all', TRUE),
('EARLYBIRD', 'Early bird special - 12% off when booking 2 weeks ahead', 12.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '120 days', NULL, 75.00, 'all', TRUE);

-- ============================================================
-- AIRPORTS
-- ============================================================
INSERT INTO public.airports (id, iata_code, name, city, country) VALUES
('40000000-0000-0000-0000-000000000001', 'CMB', 'Bandaranaike International Airport', 'Colombo', 'Sri Lanka'),
('40000000-0000-0000-0000-000000000002', 'HRI', 'Mattala Rajapaksa International Airport', 'Hambantota', 'Sri Lanka'),
('40000000-0000-0000-0000-000000000003', 'DXB', 'Dubai International Airport', 'Dubai', 'UAE'),
('40000000-0000-0000-0000-000000000004', 'LHR', 'Heathrow Airport', 'London', 'UK');

-- ============================================================
-- AIRLINES
-- ============================================================
INSERT INTO public.airlines (id, name, iata_code, logo_url) VALUES
('50000000-0000-0000-0000-000000000001', 'SriLankan Airlines', 'UL', 'https://images.pexels.com/photos/17801597/pexels-photo-17801597/free-photo-of-srilankan-airlines-airplane.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
('50000000-0000-0000-0000-000000000002', 'Emirates', 'EK', 'https://tse1.mm.bing.net/th/id/OIP.DFSk_wdkESPFKgUzLtMVKwHaEm?r=0&pid=Api&h=220&P=0'),
('50000000-0000-0000-0000-000000000003', 'British Airways', 'BA', 'https://tse3.mm.bing.net/th?id=OIF.WBhpH4aR7pHV8acQMUf2%2bg&r=0&pid=Api&h=220&P=0');

-- ============================================================
-- FLIGHTS
-- ============================================================
INSERT INTO public.flights (id, flight_number, airline_id, origin_airport_id, destination_airport_id, departure_time, arrival_time, duration_minutes, stops, aircraft_type, is_active) VALUES
('60000000-0000-0000-0000-000000000001', 'UL225', '50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000003', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '18 hours', CURRENT_DATE + INTERVAL '1 day' + INTERVAL '22 hours' + INTERVAL '30 minutes', 270, 0, 'A330-300', TRUE),
('60000000-0000-0000-0000-000000000002', 'EK654', '50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '10 hours', CURRENT_DATE + INTERVAL '2 days' + INTERVAL '16 hours', 270, 0, 'B777-300ER', TRUE),
('60000000-0000-0000-0000-000000000003', 'BA119', '50000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000001', CURRENT_DATE + INTERVAL '3 days' + INTERVAL '21 hours', CURRENT_DATE + INTERVAL '4 days' + INTERVAL '12 hours' + INTERVAL '45 minutes', 645, 1, 'B787-9', TRUE);

-- ============================================================
-- FLIGHT FARES
-- ============================================================
INSERT INTO public.flight_fares (id, flight_id, cabin_class, fare_type, price, seats_available, baggage_allowance, is_refundable) VALUES
('70000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', 'economy', 'standard', 350.00, 150, '30kg', FALSE),
('70000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000001', 'business', 'flex', 1200.00, 20, '40kg', TRUE),
('70000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000002', 'economy', 'basic', 320.00, 180, '25kg', FALSE),
('70000000-0000-0000-0000-000000000004', '60000000-0000-0000-0000-000000000002', 'business', 'flex', 1350.00, 24, '40kg', TRUE),
('70000000-0000-0000-0000-000000000005', '60000000-0000-0000-0000-000000000003', 'economy', 'standard', 850.00, 160, '23kg', FALSE),
('70000000-0000-0000-0000-000000000006', '60000000-0000-0000-0000-000000000003', 'premium', 'flex', 1400.00, 30, '2x23kg', TRUE);

-- ============================================================
-- FLIGHT SEATS (A small subset of seats for the demo)
-- ============================================================
INSERT INTO public.flight_seats (id, flight_id, seat_number, cabin_class, is_available) VALUES
-- Flight 1 (UL225)
('80000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', '1A', 'business', FALSE),
('80000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000001', '1B', 'business', TRUE),
('80000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000001', '12A', 'economy', TRUE),
('80000000-0000-0000-0000-000000000004', '60000000-0000-0000-0000-000000000001', '12B', 'economy', TRUE),
('80000000-0000-0000-0000-000000000005', '60000000-0000-0000-0000-000000000001', '12C', 'economy', FALSE),
-- Flight 2 (EK654)
('80000000-0000-0000-0000-000000000006', '60000000-0000-0000-0000-000000000002', '14A', 'economy', TRUE),
('80000000-0000-0000-0000-000000000007', '60000000-0000-0000-0000-000000000002', '14B', 'economy', TRUE);

-- ============================================================
-- SAMPLE APPROVED REVIEWS
-- ============================================================
-- NOTE: These are seeded without user_id for display purposes.
-- In production, all reviews are tied to a real user booking.
-- After creating your admin user, you can update these with the real UUID.

-- ============================================================
-- ADMIN USER SETUP INSTRUCTIONS
-- ============================================================
-- 1. Go to Supabase Dashboard → Authentication → Users → Add User
-- 2. Create: admin@mlindatravels.com / Admin@1234!
-- 3. Copy the UUID from the users list
-- 4. Run this query (replace YOUR-ADMIN-UUID):
--    UPDATE public.profiles SET role = 'admin', full_name = 'Mlinda Admin'
--    WHERE id = 'YOUR-ADMIN-UUID';
