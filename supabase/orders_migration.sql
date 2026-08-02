-- ========================================================
-- T.S TRADERS — FULL SETUP (Run this entire file)
-- Supabase SQL Editor
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- 1. CATEGORIES TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================
-- 2. PRODUCTS TABLE
-- =====================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    brand VARCHAR(100) NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    discount_price NUMERIC(10, 2) CHECK (discount_price IS NULL OR discount_price >= 0),
    sku VARCHAR(100) NOT NULL UNIQUE,
    main_image TEXT NOT NULL,
    images TEXT[] DEFAULT '{}'::TEXT[],
    featured BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'draft')),
    sizes JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================
-- 3. PRODUCT SIZES
-- =====================
CREATE TABLE IF NOT EXISTS public.product_sizes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    size INTEGER NOT NULL CHECK (size >= 30 AND size <= 50),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(product_id, size)
);

-- =====================
-- 4. ADMIN PROFILES
-- =====================
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'admin' CHECK (role = 'admin'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================
-- 5. ADMIN ACTIVITY LOGS
-- =====================
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_email VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    product_id VARCHAR(100),
    product_name VARCHAR(255),
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================
-- 6. ORDERS TABLE
-- =====================
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

-- =====================
-- INDEXES
-- =====================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_product_sizes_product ON public.product_sizes(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(customer_email);

-- =====================
-- TRIGGER FUNCTION
-- =====================
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_products_modtime ON public.products;
CREATE TRIGGER update_products_modtime
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

DROP TRIGGER IF EXISTS update_orders_modtime ON public.orders;
CREATE TRIGGER update_orders_modtime
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- =====================
-- ADMIN CHECK FUNCTION
-- =====================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================
-- ROW LEVEL SECURITY
-- =====================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid duplicates
DROP POLICY IF EXISTS "Public categories are viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Categories insertable by admin only" ON public.categories;
DROP POLICY IF EXISTS "Categories updatable by admin only" ON public.categories;
DROP POLICY IF EXISTS "Categories deletable by admin only" ON public.categories;
DROP POLICY IF EXISTS "Published products viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Products insertable by admin only" ON public.products;
DROP POLICY IF EXISTS "Products updatable by admin only" ON public.products;
DROP POLICY IF EXISTS "Products deletable by admin only" ON public.products;
DROP POLICY IF EXISTS "Product sizes viewable by everyone" ON public.product_sizes;
DROP POLICY IF EXISTS "Product sizes manageable by admin only" ON public.product_sizes;
DROP POLICY IF EXISTS "Admin logs readable by admin only" ON public.admin_activity_logs;
DROP POLICY IF EXISTS "Admin logs insertable by admin only" ON public.admin_activity_logs;
DROP POLICY IF EXISTS "Orders insertable by anyone" ON public.orders;
DROP POLICY IF EXISTS "Orders readable by admin only" ON public.orders;
DROP POLICY IF EXISTS "Orders updatable by admin only" ON public.orders;
DROP POLICY IF EXISTS "Orders deletable by admin only" ON public.orders;

-- Categories policies
CREATE POLICY "Public categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Categories insertable by admin only" ON public.categories FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Categories updatable by admin only" ON public.categories FOR UPDATE USING (public.is_admin());
CREATE POLICY "Categories deletable by admin only" ON public.categories FOR DELETE USING (public.is_admin());

-- Products policies
CREATE POLICY "Published products viewable by everyone" ON public.products FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "Products insertable by admin only" ON public.products FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Products updatable by admin only" ON public.products FOR UPDATE USING (public.is_admin());
CREATE POLICY "Products deletable by admin only" ON public.products FOR DELETE USING (public.is_admin());

-- Product sizes policies
CREATE POLICY "Product sizes viewable by everyone" ON public.product_sizes FOR SELECT USING (true);
CREATE POLICY "Product sizes manageable by admin only" ON public.product_sizes FOR ALL USING (public.is_admin());

-- Admin logs policies
CREATE POLICY "Admin logs readable by admin only" ON public.admin_activity_logs FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin logs insertable by admin only" ON public.admin_activity_logs FOR INSERT WITH CHECK (public.is_admin());

-- Orders policies (customers can insert, only admin can read/update/delete)
CREATE POLICY "Orders insertable by anyone" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders readable by admin only" ON public.orders FOR SELECT USING (public.is_admin());
CREATE POLICY "Orders updatable by admin only" ON public.orders FOR UPDATE USING (public.is_admin());
CREATE POLICY "Orders deletable by admin only" ON public.orders FOR DELETE USING (public.is_admin());

-- =====================
-- STORAGE BUCKET
-- =====================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Product images publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Product images uploadable by admin" ON storage.objects;
DROP POLICY IF EXISTS "Product images deletable by admin" ON storage.objects;

CREATE POLICY "Product images publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Product images uploadable by admin" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND public.is_admin());
CREATE POLICY "Product images deletable by admin" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND public.is_admin());
