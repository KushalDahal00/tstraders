-- ========================================================
-- ORDERS TABLE + RLS POLICIES
-- Run this in Supabase SQL Editor
-- ========================================================

CREATE TABLE IF NOT EXISTS public.orders (
    id VARCHAR(30) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    delivery_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    notes TEXT,
    payment_method VARCHAR(30) NOT NULL DEFAULT 'Cash on Delivery',
    items JSONB NOT NULL DEFAULT '[]'::JSONB,
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for querying latest orders
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(customer_email);

-- Auto-update updated_at trigger
DROP TRIGGER IF EXISTS update_orders_modtime ON public.orders;
CREATE TRIGGER update_orders_modtime
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Anyone can INSERT an order (customers placing COD orders)
CREATE POLICY "Orders insertable by anyone" ON public.orders
    FOR INSERT WITH CHECK (true);

-- Only admins can read/update/delete orders
CREATE POLICY "Orders readable by admin only" ON public.orders
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Orders updatable by admin only" ON public.orders
    FOR UPDATE USING (public.is_admin());

CREATE POLICY "Orders deletable by admin only" ON public.orders
    FOR DELETE USING (public.is_admin());
