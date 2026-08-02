# T.S Traders — Premium Footwear Retailer

A full-stack, production-ready shoe retail e-commerce website and admin dashboard built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Supabase**.

---

## ✨ Features

### Customer Website
- **Landing Page** — Editorial hero section with "Step Into Your Style" headline, Shop Now CTA, featured products grid, brand values strip
- **Shop Catalog** — Full filtering: search (name, brand, category, SKU), category dropdown, availability toggle, size matrix (EU 36–45), price sorting (low/high), active filter chips with "Clear All"
- **Product Details** — Image gallery with thumbnails, interactive size selection with per-size stock counts, availability badges, product specifications

### Admin Dashboard (`/admin`)
- **Secure Login** — Supabase Auth with admin role verification
- **Dashboard Overview** — Stats cards (total products, in stock, out of stock, categories), recent admin activity audit log
- **Product Management** — Full CRUD table with search, status filter, image preview, inline actions
- **Add / Edit Products** — Multi-section form with: basic info, pricing (Rs.), description, image URL management, size matrix with per-size stock input, status/featured toggles
- **Delete with Confirmation** — Modal dialog prevents accidental deletion
- **Categories** — View all active shoe categories
- **Settings** — Store configuration, security status, Supabase info

### Technical Features
- Real-time dual-mode: Supabase live data OR persistent in-memory fallback (works immediately without Supabase setup)
- Row-Level Security (RLS) policies protecting all admin operations
- Responsive across 320px → 1440px+
- Skeleton loading states, empty states, error handling
- Activity audit log tracking all admin changes
- SEO-friendly product URLs (`/product/nike-air-max-270-supreme`)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Animation | Framer Motion |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Icons | Lucide React |
| Validation | Zod |
| Deployment | Vercel + Supabase |

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- A Supabase project (optional — site works in demo mode without it)

### Installation

```bash
# Clone / navigate to project
cd ts-traders

# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit: **http://localhost:3000**

---

## 🔑 Environment Variables

Create a `.env.local` file (or copy from `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (optional, for server actions)
```

> **Note:** If `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are left empty, the application automatically falls back to a persistent in-memory store seeded with 10 demo shoe products. This allows full local development and testing without a Supabase project.

---

## 🗃 Supabase Database Setup

### 1. Run Schema SQL

In your Supabase dashboard → SQL Editor, paste and run the contents of:

```
supabase/schema.sql
```

This creates all tables (`products`, `categories`, `product_sizes`, `admin_profiles`, `admin_activity_logs`), triggers, indexes, RLS policies, and the `product-images` Storage bucket.

### 2. Seed Demo Products (Optional)

```
supabase/seed.sql
```

Run this to populate the database with 3 sample products and 6 categories.

### 3. Create Admin User

In Supabase Dashboard → Authentication → Users → **Add User**:

| Field | Value |
|-------|-------|
| Email | admin@tstraders.com |
| Password | adminpassword123 |

Then run this SQL to grant admin role:

```sql
INSERT INTO public.admin_profiles (user_id, email, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@tstraders.com'),
  'admin@tstraders.com',
  'admin'
);
```

### 4. Storage Bucket

The `product-images` bucket is created automatically by the schema SQL.
- Go to Supabase → Storage → `product-images`
- Ensure it is set to **Public**

---

## 🗄 Database Schema

```
categories
  id, name, slug, description, created_at

products
  id, name, slug, brand, category_id, description, 
  price, discount_price, sku, main_image, images[], 
  featured, status, sizes (JSONB), created_at, updated_at

product_sizes (normalized)
  id, product_id, size (30-50), stock_quantity, created_at

admin_profiles
  id, user_id, email, role, created_at

admin_activity_logs
  id, admin_email, action, product_id, product_name, details, created_at
```

---

## 🔒 Security

- **Row-Level Security** on all tables — customers can only `SELECT published products`
- Admin operations verified via `is_admin()` function checking `admin_profiles` table
- Supabase middleware checks sessions server-side
- Client-side auth guard redirects unauthenticated users
- Service role key **never** exposed in frontend code
- All credentials stored in `.env.local` (gitignored)

---

## 🚀 Production Deployment (Vercel)

1. Push project to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy!

---

## 📄 Admin Login

| URL | `/admin/login` |
|-----|---------------|
| Demo Email | admin@tstraders.com |
| Demo Password | adminpassword123 |

> In demo mode (no Supabase configured), clicking "Fill Demo Admin Credentials" then "Sign In" grants instant admin access using localStorage session.

---

## 📁 Project Structure

```
ts-traders/
├── app/
│   ├── page.tsx              # Landing page
│   ├── shop/page.tsx         # Shop catalog with filters
│   ├── product/[slug]/       # Product detail page
│   └── admin/
│       ├── login/page.tsx    # Admin login
│       ├── dashboard/page.tsx # Stats & audit log
│       ├── products/         # Product management table
│       ├── products/new/     # Add product form
│       ├── products/[id]/edit/ # Edit product form
│       ├── categories/       # Category browser
│       └── settings/         # Store settings
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── ProductGallery.tsx
│   ├── Filters.tsx
│   └── admin/
│       ├── AdminSidebar.tsx
│       └── AdminHeader.tsx
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   ├── store.ts              # Data layer (Supabase + fallback)
│   ├── supabase/client.ts    # Browser client
│   ├── supabase/server.ts    # Server client (SSR)
│   └── validations/product.ts # Zod schemas
├── middleware.ts             # Admin route protection
├── supabase/
│   ├── schema.sql            # Full DB schema + RLS
│   └── seed.sql              # Demo data
└── .env.local                # Credentials (gitignored)
```
