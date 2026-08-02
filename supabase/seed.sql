-- ========================================================
-- T.S TRADERS - SEED DATA FOR DEMO & TESTING
-- ========================================================

-- SEED CATEGORIES
INSERT INTO public.categories (id, name, slug, description) VALUES
('c1111111-1111-1111-1111-111111111111', 'Sneakers', 'sneakers', 'Modern lifestyle and streetwear sneakers'),
('c2222222-2222-2222-2222-222222222222', 'Running', 'running', 'High performance running and training shoes'),
('c3333333-3333-3333-3333-333333333333', 'Casual', 'casual', 'Everyday comfortable slip-ons and loafers'),
('c4444444-4444-4444-4444-444444444444', 'Formal', 'formal', 'Handcrafted leather oxfords and derby shoes'),
('c5555555-5555-5555-5555-555555555555', 'Sports', 'sports', 'Athletic footwear for court and field'),
('c6666666-6666-6666-6666-666666666666', 'Boots', 'boots', 'Durable leather and tactical boots')
ON CONFLICT (id) DO NOTHING;

-- SEED PRODUCTS
INSERT INTO public.products (id, name, slug, brand, category_id, description, price, discount_price, sku, main_image, images, featured, status, sizes) VALUES
(
  'p1111111-1111-1111-1111-111111111111',
  'Nike Air Max 270 Supreme',
  'nike-air-max-270-supreme',
  'Nike',
  'c1111111-1111-1111-1111-111111111111',
  'The Nike Air Max 270 Supreme features Nike big Air unit for a super-soft ride that feels as impossible as it looks.',
  14999.00,
  13499.00,
  'NK-AM270-BLK',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
  ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80'],
  true,
  'published',
  '[{"size": 39, "stock_quantity": 4}, {"size": 40, "stock_quantity": 2}, {"size": 41, "stock_quantity": 5}, {"size": 42, "stock_quantity": 0}, {"size": 43, "stock_quantity": 3}]'::jsonb
),
(
  'p2222222-2222-2222-2222-222222222222',
  'Adidas Ultraboost Light Edition',
  'adidas-ultraboost-light-edition',
  'Adidas',
  'c2222222-2222-2222-2222-222222222222',
  'Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever made for high mileage.',
  18500.00,
  NULL,
  'AD-UB-LGT',
  'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80',
  ARRAY['https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80'],
  true,
  'published',
  '[{"size": 40, "stock_quantity": 6}, {"size": 41, "stock_quantity": 8}, {"size": 42, "stock_quantity": 4}, {"size": 43, "stock_quantity": 7}]'::jsonb
),
(
  'p3333333-3333-3333-3333-333333333333',
  'Heritage Handcrafted Leather Oxford',
  'heritage-handcrafted-leather-oxford',
  'T.S Traders Signature',
  'c4444444-4444-4444-4444-444444444444',
  'Hand-burnished Italian calfskin leather oxford featuring Goodyear welt construction, full leather lining, and stacked heel.',
  24500.00,
  NULL,
  'TS-OXF-BRN',
  'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=80',
  ARRAY['https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=80'],
  true,
  'published',
  '[{"size": 39, "stock_quantity": 3}, {"size": 40, "stock_quantity": 4}, {"size": 41, "stock_quantity": 6}, {"size": 42, "stock_quantity": 5}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
