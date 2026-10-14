-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Target DB: Supabase (PostgreSQL)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retail_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retail_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_enquiry_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wholesale_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wholesale_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------
-- 1. PRODUCT CATEGORIES POLICIES
-- -----------------------------------------------------
-- Anyone can view categories
DROP POLICY IF EXISTS "Public can view product categories" ON public.product_categories;
CREATE POLICY "Public can view product categories"
ON public.product_categories FOR SELECT
TO anon, authenticated
USING (true);

-- Admins and backend service role have full control
DROP POLICY IF EXISTS "Service role full access on product categories" ON public.product_categories;
CREATE POLICY "Service role full access on product categories"
ON public.product_categories FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- -----------------------------------------------------
-- 2. PRODUCTS POLICIES
-- -----------------------------------------------------
-- Anyone can view active products
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products"
ON public.products FOR SELECT
TO anon, authenticated
USING (is_active = 1);

-- Service role full access
DROP POLICY IF EXISTS "Service role full access on products" ON public.products;
CREATE POLICY "Service role full access on products"
ON public.products FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- -----------------------------------------------------
-- 3. PRODUCT IMAGES POLICIES
-- -----------------------------------------------------
DROP POLICY IF EXISTS "Public can view product images" ON public.product_images;
CREATE POLICY "Public can view product images"
ON public.product_images FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Service role full access on product images" ON public.product_images;
CREATE POLICY "Service role full access on product images"
ON public.product_images FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- -----------------------------------------------------
-- 4. RETAIL ORDERS & ITEMS POLICIES
-- -----------------------------------------------------
-- Any customer (even guest) can create a retail order
DROP POLICY IF EXISTS "Public can insert retail orders" ON public.retail_orders;
CREATE POLICY "Public can insert retail orders"
ON public.retail_orders FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert retail order items" ON public.retail_order_items;
CREATE POLICY "Public can insert retail order items"
ON public.retail_order_items FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Customers can view retail order items
DROP POLICY IF EXISTS "Public can view retail order items" ON public.retail_order_items;
CREATE POLICY "Public can view retail order items"
ON public.retail_order_items FOR SELECT
TO anon, authenticated
USING (true);

-- Service role has full control on orders & items
DROP POLICY IF EXISTS "Service role full access on retail orders" ON public.retail_orders;
CREATE POLICY "Service role full access on retail orders"
ON public.retail_orders FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on retail order items" ON public.retail_order_items;
CREATE POLICY "Service role full access on retail order items"
ON public.retail_order_items FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- -----------------------------------------------------
-- 5. BULK ENQUIRIES & ITEMS POLICIES
-- -----------------------------------------------------
-- Anyone can submit a bulk enquiry
DROP POLICY IF EXISTS "Public can submit bulk enquiry" ON public.bulk_enquiries;
CREATE POLICY "Public can submit bulk enquiry"
ON public.bulk_enquiries FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can submit bulk enquiry items" ON public.bulk_enquiry_items;
CREATE POLICY "Public can submit bulk enquiry items"
ON public.bulk_enquiry_items FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Service role full control
DROP POLICY IF EXISTS "Service role full access on bulk enquiries" ON public.bulk_enquiries;
CREATE POLICY "Service role full access on bulk enquiries"
ON public.bulk_enquiries FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on bulk enquiry items" ON public.bulk_enquiry_items;
CREATE POLICY "Service role full access on bulk enquiry items"
ON public.bulk_enquiry_items FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- -----------------------------------------------------
-- 6. QUOTATIONS & WHOLESALE (ADMIN & SERVICE ROLE)
-- -----------------------------------------------------
DROP POLICY IF EXISTS "Service role full access on quotations" ON public.quotations;
CREATE POLICY "Service role full access on quotations"
ON public.quotations FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on quotation items" ON public.quotation_items;
CREATE POLICY "Service role full access on quotation items"
ON public.quotation_items FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on wholesale orders" ON public.wholesale_orders;
CREATE POLICY "Service role full access on wholesale orders"
ON public.wholesale_orders FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on wholesale order items" ON public.wholesale_order_items;
CREATE POLICY "Service role full access on wholesale order items"
ON public.wholesale_order_items FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- -----------------------------------------------------
-- 7. AUDIT LOGS & STATUS HISTORY
-- -----------------------------------------------------
DROP POLICY IF EXISTS "Service role full access on status history" ON public.status_history;
CREATE POLICY "Service role full access on status history"
ON public.status_history FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on audit logs" ON public.audit_logs;
CREATE POLICY "Service role full access on audit logs"
ON public.audit_logs FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- -----------------------------------------------------
-- 8. USERS TABLE
-- -----------------------------------------------------
DROP POLICY IF EXISTS "Service role full access on users" ON public.users;
CREATE POLICY "Service role full access on users"
ON public.users FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
