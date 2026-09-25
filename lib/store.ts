import { Product, Category, AdminActivityLog, DashboardStats, StockStatus, ProductSize } from './types';
import { createClient as createBrowserClient } from './supabase/client';

// ====================================================
// STORAGE KEYS FOR LOCALSTORAGE PERSISTENCE
// ====================================================
const LS_PRODUCTS_KEY = 'ts_traders_products';
const LS_CATEGORIES_KEY = 'ts_traders_categories';
const LS_LOGS_KEY = 'ts_traders_logs';
const LS_SETTINGS_KEY = 'ts_traders_settings';

export const CATEGORY_IMAGE_MAP: Record<string, string> = {
  sneakers: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
  running: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
  casual: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
  formal: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
  sports: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=800&q=80',
  boots: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
};

export function getCategoryImage(cat: { slug?: string; name?: string; image_url?: string }): string {
  if (cat.image_url && cat.image_url.trim()) return cat.image_url;
  const key = `${cat.slug || ''} ${cat.name || ''}`.toLowerCase();
  for (const [k, url] of Object.entries(CATEGORY_IMAGE_MAP)) {
    if (key.includes(k)) return url;
  }
  return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80';
}

// ====================================================
// DEFAULT SEED DATA
// ====================================================
export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Sneakers',
    slug: 'sneakers',
    description: 'Modern lifestyle and streetwear sneakers',
    image_url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-2',
    name: 'Running',
    slug: 'running',
    description: 'High performance running and training shoes',
    image_url: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-3',
    name: 'Casual',
    slug: 'casual',
    description: 'Everyday comfortable slip-ons and loafers',
    image_url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-4',
    name: 'Formal',
    slug: 'formal',
    description: 'Handcrafted leather oxfords and derby shoes',
    image_url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-5',
    name: 'Sports',
    slug: 'sports',
    description: 'Athletic footwear for court and field',
    image_url: 'https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'cat-6',
    name: 'Boots',
    slug: 'boots',
    description: 'Durable leather and tactical boots',
    image_url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Nike Air Max 270 Supreme',
    slug: 'nike-air-max-270-supreme',
    brand: 'Nike',
    category_id: 'cat-1',
    category_name: 'Sneakers',
    description: 'The Nike Air Max 270 Supreme features Nike big Air unit for a super-soft ride that feels as impossible as it looks. Clean mesh upper with durable synthetic overlays for lightweight comfort.',
    price: 14999,
    discount_price: 13499,
    sku: 'NK-AM270-BLK',
    main_image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80'
    ],
    featured: true,
    status: 'published',
    sizes: [
      { size: 39, stock_quantity: 4 },
      { size: 40, stock_quantity: 2 },
      { size: 41, stock_quantity: 5 },
      { size: 42, stock_quantity: 0 },
      { size: 43, stock_quantity: 3 },
      { size: 44, stock_quantity: 1 },
    ],
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Adidas Ultraboost Light Edition',
    slug: 'adidas-ultraboost-light-edition',
    brand: 'Adidas',
    category_id: 'cat-2',
    category_name: 'Running',
    description: 'Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever. The secret lies in the Light BOOST material, a new generation of Adidas BOOST.',
    price: 18500,
    discount_price: null,
    sku: 'AD-UB-LGT',
    main_image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80'
    ],
    featured: true,
    status: 'published',
    sizes: [
      { size: 40, stock_quantity: 6 },
      { size: 41, stock_quantity: 8 },
      { size: 42, stock_quantity: 4 },
      { size: 43, stock_quantity: 7 },
      { size: 44, stock_quantity: 3 },
    ],
    created_at: new Date(Date.now() - 86400000 * 9).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'prod-3',
    name: 'Puma RS-X Triple Stealth',
    slug: 'puma-rs-x-triple-stealth',
    brand: 'Puma',
    category_id: 'cat-1',
    category_name: 'Sneakers',
    description: 'RS-X returns for a new generation of consumers who live to express their individuality. Mesh and textile upper with suede overlays and signature RS cushion tech.',
    price: 11999,
    discount_price: 9999,
    sku: 'PM-RSX-BLK',
    main_image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80'
    ],
    featured: false,
    status: 'published',
    sizes: [
      { size: 38, stock_quantity: 2 },
      { size: 39, stock_quantity: 5 },
      { size: 40, stock_quantity: 3 },
      { size: 41, stock_quantity: 0 },
      { size: 42, stock_quantity: 0 },
    ],
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'prod-4',
    name: 'Heritage Handcrafted Leather Oxford',
    slug: 'heritage-handcrafted-leather-oxford',
    brand: 'T.S Traders Signature',
    category_id: 'cat-4',
    category_name: 'Formal',
    description: 'Hand-burnished Italian calfskin leather oxford featuring Goodyear welt construction, full leather lining, and stacked heel for distinguished corporate elegance.',
    price: 24500,
    discount_price: null,
    sku: 'TS-OXF-BRN',
    main_image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=80'
    ],
    featured: true,
    status: 'published',
    sizes: [
      { size: 39, stock_quantity: 3 },
      { size: 40, stock_quantity: 4 },
      { size: 41, stock_quantity: 6 },
      { size: 42, stock_quantity: 5 },
      { size: 43, stock_quantity: 2 },
    ],
    created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'prod-5',
    name: 'New Balance 9060 Prism White',
    slug: 'new-balance-9060-prism-white',
    brand: 'New Balance',
    category_id: 'cat-1',
    category_name: 'Sneakers',
    description: 'The 9060 is a new expression of the refined style and innovation-led design that has made the 99X series home to some of the most iconic models in New Balance history.',
    price: 16999,
    discount_price: null,
    sku: 'NB-9060-WHT',
    main_image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80'
    ],
    featured: true,
    status: 'published',
    sizes: [
      { size: 40, stock_quantity: 3 },
      { size: 41, stock_quantity: 4 },
      { size: 42, stock_quantity: 6 },
      { size: 43, stock_quantity: 2 },
    ],
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'prod-6',
    name: 'Chelsea Amber Suede Boot',
    slug: 'chelsea-amber-suede-boot',
    brand: 'T.S Traders Signature',
    category_id: 'cat-6',
    category_name: 'Boots',
    description: 'Timeless Chelsea boot crafted from premium water-resistant amber suede. Elastic side goring with double pull tabs for effortless entry and supreme ankle comfort.',
    price: 19999,
    discount_price: 17999,
    sku: 'TS-CHS-AMB',
    main_image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=80'
    ],
    featured: false,
    status: 'published',
    sizes: [
      { size: 39, stock_quantity: 2 },
      { size: 40, stock_quantity: 3 },
      { size: 41, stock_quantity: 0 },
      { size: 42, stock_quantity: 4 },
      { size: 43, stock_quantity: 1 },
    ],
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'prod-7',
    name: 'Vans Old Skool Monochrome',
    slug: 'vans-old-skool-monochrome',
    brand: 'Vans',
    category_id: 'cat-3',
    category_name: 'Casual',
    description: 'The Old Skool, Vans classic skate shoe and the first to bare the iconic side stripe, has a low-top lace-up silhouette with durable suede and canvas uppers.',
    price: 7499,
    discount_price: null,
    sku: 'VN-OS-MONO',
    main_image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=80'
    ],
    featured: false,
    status: 'published',
    sizes: [
      { size: 37, stock_quantity: 5 },
      { size: 38, stock_quantity: 6 },
      { size: 39, stock_quantity: 7 },
      { size: 40, stock_quantity: 8 },
      { size: 41, stock_quantity: 9 },
      { size: 42, stock_quantity: 4 },
    ],
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'prod-8',
    name: 'Jordan 1 Retro High OG',
    slug: 'jordan-1-retro-high-og',
    brand: 'Jordan',
    category_id: 'cat-5',
    category_name: 'Sports',
    description: 'The Air Jordan 1 Retro High OG remakes the classic sneaker, giving you a fresh look with a familiar feel. Premium leather in the upper, responsive Air cushioning in the sole.',
    price: 22999,
    discount_price: 20999,
    sku: 'JD-J1-RET',
    main_image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80'
    ],
    featured: true,
    status: 'published',
    sizes: [
      { size: 40, stock_quantity: 0 },
      { size: 41, stock_quantity: 0 },
      { size: 42, stock_quantity: 0 },
      { size: 43, stock_quantity: 0 },
    ],
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'prod-9',
    name: 'Asics GEL-Kayano 30 Stability',
    slug: 'asics-gel-kayano-30-stability',
    brand: 'Asics',
    category_id: 'cat-2',
    category_name: 'Running',
    description: 'From 5Ks to full marathons, the GEL-KAYANO 30 shoe is designed to provide advanced stability and softer cushioning properties. The new 4D GUIDANCE SYSTEM helps provide adaptive stability.',
    price: 17999,
    discount_price: null,
    sku: 'AS-GK30-STB',
    main_image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=80'
    ],
    featured: false,
    status: 'published',
    sizes: [
      { size: 39, stock_quantity: 3 },
      { size: 40, stock_quantity: 5 },
      { size: 41, stock_quantity: 4 },
      { size: 42, stock_quantity: 2 },
    ],
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'prod-10',
    name: 'T.S Leather Monk Strap Derby',
    slug: 'ts-leather-monk-strap-derby',
    brand: 'T.S Traders Signature',
    category_id: 'cat-4',
    category_name: 'Formal',
    description: 'Distinctive double monk strap shoes in deep obsidian black leather with polished silver hardware. Handcrafted welted sole engineered for all-day formal comfort.',
    price: 21500,
    discount_price: 19500,
    sku: 'TS-MNK-BLK',
    main_image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=80'
    ],
    featured: false,
    status: 'published',
    sizes: [
      { size: 40, stock_quantity: 4 },
      { size: 41, stock_quantity: 5 },
      { size: 42, stock_quantity: 3 },
      { size: 43, stock_quantity: 2 },
    ],
    created_at: new Date(Date.now() - 86400000 * 11).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  }
];

export const INITIAL_LOGS: AdminActivityLog[] = [
  {
    id: 'log-1',
    admin_email: 'admin@tstraders.com',
    action: 'PRICE_UPDATE',
    product_name: 'Nike Air Max 270 Supreme',
    details: 'Price changed from Rs. 14,999 to Rs. 13,499 (Discount Applied)',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'log-2',
    admin_email: 'admin@tstraders.com',
    action: 'STOCK_RESTOCK',
    product_name: 'Adidas Ultraboost Light Edition',
    details: 'Restocked size 41 (+5 units)',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'log-3',
    admin_email: 'admin@tstraders.com',
    action: 'PRODUCT_CREATE',
    product_name: 'Heritage Handcrafted Leather Oxford',
    details: 'Created new signature product with 5 sizes',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  }
];

// ====================================================
// LOCALSTORAGE HELPERS (safe for SSR / server components)
// ====================================================
function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function lsSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded — silently ignore
  }
}

// ====================================================
// IN-MEMORY CACHE (populated from localStorage on first use)
// ====================================================
let _products: Product[] | null = null;
let _categories: Category[] | null = null;
let _logs: AdminActivityLog[] | null = null;

function getMemoryProducts(): Product[] {
  if (_products === null) {
    _products = lsGet<Product[]>(LS_PRODUCTS_KEY, [...INITIAL_PRODUCTS]);
  }
  return _products;
}

function setMemoryProducts(products: Product[]): void {
  _products = products;
  lsSet(LS_PRODUCTS_KEY, products);
}

function getMemoryCategories(): Category[] {
  if (_categories === null) {
    const raw = lsGet<Category[]>(LS_CATEGORIES_KEY, [...INITIAL_CATEGORIES]);
    _categories = raw.map((c) => ({
      ...c,
      image_url: c.image_url || getCategoryImage(c),
    }));
  }
  return _categories;
}

function setMemoryCategories(categories: Category[]): void {
  _categories = categories;
  lsSet(LS_CATEGORIES_KEY, categories);
}

function getMemoryLogs(): AdminActivityLog[] {
  if (_logs === null) {
    _logs = lsGet<AdminActivityLog[]>(LS_LOGS_KEY, [...INITIAL_LOGS]);
  }
  return _logs;
}

function setMemoryLogs(logs: AdminActivityLog[]): void {
  _logs = logs;
  lsSet(LS_LOGS_KEY, logs);
}

// ====================================================
// STORE SETTINGS
// ====================================================
export interface StoreSettings {
  storeName: string;
  currency: string;
  heroTagline: string;
  heroSubtitle: string;
  contactEmail: string;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'T.S Traders',
  currency: 'NPR (Rs.)',
  heroTagline: 'Step Into Your Style.',
  heroSubtitle: 'Quality footwear. Timeless style. Everyday comfort.',
  contactEmail: 'admin@tstraders.com',
};

export function getStoreSettings(): StoreSettings {
  return lsGet<StoreSettings>(LS_SETTINGS_KEY, { ...DEFAULT_SETTINGS });
}

export function saveStoreSettings(settings: StoreSettings): void {
  lsSet(LS_SETTINGS_KEY, settings);
  // Dispatch a custom event so other tabs/components can react
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ts_settings_updated', { detail: settings }));
  }
}

// ====================================================
// UTILITY FUNCTIONS
// ====================================================
export function computeStockStatus(sizes: ProductSize[]): { status: StockStatus; totalStock: number } {
  if (!sizes || sizes.length === 0) {
    return { status: 'Out of Stock', totalStock: 0 };
  }

  const totalStock = sizes.reduce((acc, curr) => acc + curr.stock_quantity, 0);

  if (totalStock === 0) {
    return { status: 'Out of Stock', totalStock: 0 };
  }

  const hasZeroSizeStock = sizes.some((s) => s.stock_quantity === 0);
  if (hasZeroSizeStock) {
    return { status: 'Limited Availability', totalStock };
  }

  return { status: 'In Stock', totalStock };
}

function processProductWithStock(prod: Product): Product {
  const { status, totalStock } = computeStockStatus(prod.sizes);
  return {
    ...prod,
    stock_status: status,
    total_stock: totalStock,
  };
}

// ====================================================
// PRODUCTS
// ====================================================
export async function getProducts(filters?: Partial<Record<string, unknown>>): Promise<Product[]> {
  const supabase = createBrowserClient();

  if (supabase) {
    try {
      let query = supabase.from('products').select('*, categories(name)');
      if (filters?.status) {
        query = query.eq('status', filters.status as string);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const products = data.map((item: any) =>
          processProductWithStock({
            ...item,
            category_name: item.categories?.name || 'Footwear',
            sizes: item.sizes || [],
          })
        );
        // Sync supabase data back to localStorage
        setMemoryProducts(products);
        return products;
      }
    } catch (e) {
      console.warn('Using local fallback for products store:', e);
    }
  }

  return getMemoryProducts().map(processProductWithStock);
}

export async function getProductBySlugOrId(identifier: string): Promise<Product | null> {
  const supabase = createBrowserClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .or(`slug.eq.${identifier},id.eq.${identifier}`)
        .single();

      if (!error && data) {
        return processProductWithStock({
          ...data,
          category_name: data.categories?.name || 'Footwear',
          sizes: data.sizes || [],
        });
      }
    } catch (e) {
      console.warn('Fallback product lookup:', e);
    }
  }

  const memProducts = getMemoryProducts();
  const found = memProducts.find(
    (p) => p.slug === identifier || p.id === identifier
  );
  return found ? processProductWithStock(found) : null;
}

export async function saveProduct(productData: Partial<Product>): Promise<Product> {
  const supabase = createBrowserClient();
  const isEdit = Boolean(productData.id);
  const now = new Date().toISOString();

  const slug =
    productData.slug ||
    (productData.name
      ? productData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      : `product-${Date.now()}`);

  const memCategories = getMemoryCategories();
  const categoryObj = memCategories.find((c) => c.id === productData.category_id);
  const categoryName = categoryObj?.name || 'Footwear';

  const fullProduct: Product = {
    id: productData.id || `prod-${Date.now()}`,
    name: productData.name || 'New Shoe',
    slug,
    brand: productData.brand || 'T.S Traders',
    category_id: productData.category_id || 'cat-1',
    category_name: categoryName,
    description: productData.description || '',
    price: productData.price || 0,
    discount_price: productData.discount_price ?? null,
    sku: productData.sku || `SKU-${Date.now().toString().slice(-5)}`,
    main_image: productData.main_image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    images: productData.images || [productData.main_image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'],
    featured: productData.featured ?? false,
    status: productData.status || 'published',
    sizes: productData.sizes || [],
    created_at: productData.created_at || now,
    updated_at: now,
  };

  const processed = processProductWithStock(fullProduct);

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .upsert({
          id: processed.id,
          name: processed.name,
          slug: processed.slug,
          brand: processed.brand,
          category_id: processed.category_id,
          description: processed.description,
          price: processed.price,
          discount_price: processed.discount_price,
          sku: processed.sku,
          main_image: processed.main_image,
          images: processed.images,
          featured: processed.featured,
          status: processed.status,
          sizes: processed.sizes,
          updated_at: now,
        })
        .select()
        .single();

      if (!error && data) {
        await logActivity(
          isEdit ? 'PRODUCT_UPDATE' : 'PRODUCT_CREATE',
          processed.name,
          processed.id,
          `${isEdit ? 'Updated' : 'Created'} product details (Price: Rs. ${processed.price.toLocaleString()})`
        );
        const savedProduct = processProductWithStock(data);
        // Also save to localStorage
        _updateLocalProduct(savedProduct, isEdit);
        return savedProduct;
      }
    } catch (e) {
      console.warn('Supabase save failed, falling back to local state:', e);
    }
  }

  // Save to localStorage fallback
  _updateLocalProduct(processed, isEdit);

  await logActivity(
    isEdit ? 'PRODUCT_UPDATE' : 'PRODUCT_CREATE',
    processed.name,
    processed.id,
    `${isEdit ? 'Updated' : 'Created'} product details (Price: Rs. ${processed.price.toLocaleString()})`
  );

  return processed;
}

function _updateLocalProduct(processed: Product, isEdit: boolean): void {
  const memProducts = getMemoryProducts();
  if (isEdit) {
    const idx = memProducts.findIndex((p) => p.id === processed.id);
    if (idx !== -1) {
      memProducts[idx] = processed;
    } else {
      memProducts.unshift(processed);
    }
  } else {
    memProducts.unshift(processed);
  }
  setMemoryProducts(memProducts);
}

export async function deleteProduct(productId: string): Promise<boolean> {
  const memProducts = getMemoryProducts();
  const target = memProducts.find((p) => p.id === productId);
  const productName = target?.name || 'Product';

  const supabase = createBrowserClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (!error) {
        await logActivity('PRODUCT_DELETE', productName, productId, 'Product removed from catalog');
        setMemoryProducts(memProducts.filter((p) => p.id !== productId));
        return true;
      }
    } catch (e) {
      console.warn('Supabase delete failed, using local store:', e);
    }
  }

  setMemoryProducts(memProducts.filter((p) => p.id !== productId));
  await logActivity('PRODUCT_DELETE', productName, productId, 'Product removed from catalog');
  return true;
}

// ====================================================
// CATEGORIES
// ====================================================
export async function getCategories(): Promise<Category[]> {
  const supabase = createBrowserClient();

  if (supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('*');
      if (!error && data && data.length > 0) {
        const enriched = data.map((c) => ({
          ...c,
          image_url: c.image_url || getCategoryImage(c),
        }));
        setMemoryCategories(enriched);
        return enriched;
      }
    } catch (e) {
      console.warn('Fallback categories lookup:', e);
    }
  }

  return getMemoryCategories().map((c) => ({
    ...c,
    image_url: c.image_url || getCategoryImage(c),
  }));
}

export async function saveCategory(categoryData: Partial<Category>): Promise<Category> {
  const isEdit = Boolean(categoryData.id);
  const now = new Date().toISOString();

  const slug =
    categoryData.slug ||
    (categoryData.name
      ? categoryData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      : `cat-${Date.now()}`);

  const fullCategory: Category = {
    id: categoryData.id || `cat-${Date.now()}`,
    name: categoryData.name || 'New Category',
    slug,
    description: categoryData.description || '',
    image_url: categoryData.image_url || getCategoryImage({ slug, name: categoryData.name }),
    created_at: categoryData.created_at || now,
  };

  const supabase = createBrowserClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .upsert({
          id: fullCategory.id,
          name: fullCategory.name,
          slug: fullCategory.slug,
          description: fullCategory.description,
          image_url: fullCategory.image_url,
        })
        .select()
        .single();

      if (!error && data) {
        const enriched = { ...data, image_url: data.image_url || fullCategory.image_url };
        _updateLocalCategory(enriched, isEdit);
        return enriched;
      }
    } catch (e) {
      console.warn('Supabase category save failed, using local store:', e);
    }
  }

  _updateLocalCategory(fullCategory, isEdit);
  return fullCategory;
}

function _updateLocalCategory(cat: Category, isEdit: boolean): void {
  const memCategories = getMemoryCategories();
  if (isEdit) {
    const idx = memCategories.findIndex((c) => c.id === cat.id);
    if (idx !== -1) {
      memCategories[idx] = cat;
    } else {
      memCategories.push(cat);
    }
  } else {
    memCategories.push(cat);
  }
  setMemoryCategories(memCategories);
  // Invalidate the in-memory cache so next read re-loads from localStorage
  _categories = null;
  _categories = getMemoryCategories();
}

export async function deleteCategory(categoryId: string): Promise<boolean> {
  const supabase = createBrowserClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', categoryId);
      if (!error) {
        setMemoryCategories(getMemoryCategories().filter((c) => c.id !== categoryId));
        return true;
      }
    } catch (e) {
      console.warn('Supabase category delete failed, using local store:', e);
    }
  }

  setMemoryCategories(getMemoryCategories().filter((c) => c.id !== categoryId));
  return true;
}

// ====================================================
// ACTIVITY LOGS
// ====================================================
export async function logActivity(
  action: string,
  productName: string,
  productId?: string,
  details?: string
): Promise<void> {
  const newLog: AdminActivityLog = {
    id: `log-${Date.now()}`,
    admin_email: (typeof window !== 'undefined' ? localStorage.getItem('ts_admin_email') : null) || 'admin@tstraders.com',
    action,
    product_name: productName,
    product_id: productId,
    details: details || '',
    created_at: new Date().toISOString(),
  };

  const supabase = createBrowserClient();
  if (supabase) {
    try {
      await supabase.from('admin_activity_logs').insert(newLog);
    } catch (e) {
      console.warn('Activity log error:', e);
    }
  }

  const memLogs = getMemoryLogs();
  memLogs.unshift(newLog);
  setMemoryLogs(memLogs.slice(0, 50)); // Keep only latest 50 logs
}

export async function getActivityLogs(): Promise<AdminActivityLog[]> {
  const supabase = createBrowserClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('admin_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Log query error:', e);
    }
  }
  return getMemoryLogs();
}

// ====================================================
// DASHBOARD STATS
// ====================================================
export async function getDashboardStats(): Promise<DashboardStats> {
  const products = await getProducts();
  const categories = await getCategories();

  let inStock = 0;
  let outOfStock = 0;
  let lowStock = 0;

  products.forEach((p) => {
    if (p.stock_status === 'Out of Stock') {
      outOfStock++;
    } else {
      inStock++;
      if (p.stock_status === 'Limited Availability') {
        lowStock++;
      }
    }
  });

  return {
    totalProducts: products.length,
    inStockProducts: inStock,
    outOfStockProducts: outOfStock,
    totalCategories: categories.length,
    lowStockProducts: lowStock,
  };
}
