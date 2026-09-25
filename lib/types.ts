export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  description?: string;
  created_at?: string;
}

export interface ProductSize {
  id?: string;
  product_id?: string;
  size: number;
  stock_quantity: number;
}

export type StockStatus = 'In Stock' | 'Limited Availability' | 'Out of Stock';

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category_id: string;
  category_name?: string;
  description: string;
  price: number;
  discount_price?: number | null;
  sku: string;
  main_image: string;
  images: string[];
  featured: boolean;
  status: 'published' | 'draft';
  sizes: ProductSize[];
  stock_status?: StockStatus;
  total_stock?: number;
  created_at: string;
  updated_at: string;
}

export interface FilterState {
  search: string;
  category: string;
  availability: 'all' | 'in_stock' | 'out_of_stock';
  size: number | null;
  sortBy: 'featured' | 'price_low' | 'price_high' | 'newest';
}

export interface CartItem {
  product: Product;
  size: number;
  quantity: number;
}

export interface CustomerOrderDetails {
  fullName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  city: string;
  notes?: string;
  paymentMethod: 'Cash on Delivery';
}

export interface Order {
  id: string;
  userEmail: string;
  customerDetails: CustomerOrderDetails;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'delivered';
  created_at: string;
}

export interface AdminProfile {
  id: string;
  user_id: string;
  email: string;
  role: 'admin';
  created_at: string;
}

export interface AdminActivityLog {
  id: string;
  admin_email: string;
  action: string;
  product_id?: string;
  product_name?: string;
  details: string;
  created_at: string;
}

export interface DashboardStats {
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  totalCategories: number;
  lowStockProducts: number;
}
