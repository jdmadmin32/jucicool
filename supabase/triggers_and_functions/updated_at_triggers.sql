-- =====================================================
-- TRIGGERS & FUNCTIONS: Auto-updating updated_at timestamps
-- Target DB: Supabase (PostgreSQL)
-- =====================================================

-- 1. Create helper function to update 'updated_at' to current timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Trigger for retail_orders
DROP TRIGGER IF EXISTS set_retail_orders_updated_at ON public.retail_orders;
CREATE TRIGGER set_retail_orders_updated_at
BEFORE UPDATE ON public.retail_orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 3. Trigger for bulk_enquiries
DROP TRIGGER IF EXISTS set_bulk_enquiries_updated_at ON public.bulk_enquiries;
CREATE TRIGGER set_bulk_enquiries_updated_at
BEFORE UPDATE ON public.bulk_enquiries
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 4. Trigger for quotations
DROP TRIGGER IF EXISTS set_quotations_updated_at ON public.quotations;
CREATE TRIGGER set_quotations_updated_at
BEFORE UPDATE ON public.quotations
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 5. Trigger for wholesale_orders
DROP TRIGGER IF EXISTS set_wholesale_orders_updated_at ON public.wholesale_orders;
CREATE TRIGGER set_wholesale_orders_updated_at
BEFORE UPDATE ON public.wholesale_orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
