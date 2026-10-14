-- =====================================================
-- SEED DATA: Verified Users & Accounts
-- Target DB: Supabase (PostgreSQL)
--
-- Passwords:
--   jucicooladmin      => juci@cool123
--   admin@jucicool.com => juci@cool123
--   dealer@jucicool.com => dealer123
--   customer@jucicool.com => password123
-- =====================================================

INSERT INTO public.users (
  id, email, password_hash, full_name, phone, role, business_name, customer_type, city, state
)
OVERRIDING SYSTEM VALUE
VALUES
  (
    1,
    'jucicooladmin',
    '$2b$10$KoQ4Zjoc.CGAAUzX48P.COazosre2PPH8w/vx8vQQcF6iixEZO4Q.',
    'Juci Cool Admin Officer',
    '+91 98490 12345',
    'admin',
    'JDM Fruit Products Pvt. Ltd.',
    'Manufacturer',
    'Hyderabad',
    'Telangana'
  ),
  (
    2,
    'admin@jucicool.com',
    '$2b$10$KoQ4Zjoc.CGAAUzX48P.COazosre2PPH8w/vx8vQQcF6iixEZO4Q.',
    'JDM Admin Officer',
    '+91 98490 12345',
    'admin',
    'JDM Fruit Products Pvt. Ltd.',
    'Manufacturer',
    'Hyderabad',
    'Telangana'
  ),
  (
    3,
    'dealer@jucicool.com',
    '$2b$10$m89R7WnX4M.Dx6jQvREJUu8ju39JQdBWKlyYDdIjB.c/iIECHZc4q',
    'Suresh Reddy (Dealer)',
    '+91 94401 56789',
    'customer',
    'Reddy Supermart',
    'Retailer',
    'Secunderabad',
    'Telangana'
  ),
  (
    4,
    'customer@jucicool.com',
    '$2b$10$1cGmPUpaVgkT.5ONsmQHE.45GVHsBIL1L8jRE/mczt/jIAIsOGeGC',
    'Priya Kulkarni (Customer)',
    '+91 98850 43210',
    'customer',
    NULL,
    'Individual',
    'Hyderabad',
    'Telangana'
  )
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  customer_type = EXCLUDED.customer_type;

-- Sync User Sequence
SELECT setval(pg_get_serial_sequence('public.users', 'id'), COALESCE(MAX(id), 1)) FROM public.users;
