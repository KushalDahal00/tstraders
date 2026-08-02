import { z } from 'zod';

export const productSizeSchema = z.object({
  size: z.number().min(30, 'Invalid size').max(50, 'Invalid size'),
  stock_quantity: z.number().min(0, 'Stock cannot be negative'),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  brand: z.string().min(1, 'Brand is required'),
  category_id: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be greater than 0'),
  discount_price: z.number().nonnegative('Discount price cannot be negative').nullable().optional(),
  sku: z.string().min(3, 'SKU must be at least 3 characters'),
  main_image: z.string().min(1, 'Main image URL is required'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  featured: z.boolean().default(false),
  status: z.enum(['published', 'draft']).default('published'),
  sizes: z.array(productSizeSchema).min(1, 'Select at least one available size'),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
