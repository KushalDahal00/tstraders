'use client';

import React, { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { getCategories, getProductBySlugOrId, saveProduct } from '@/lib/store';
import { Category, Product, ProductSize } from '@/lib/types';
import { ArrowLeft, Trash2, AlertCircle, Upload, Loader2 } from 'lucide-react';

const STANDARD_SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [discountPrice, setDiscountPrice] = useState<number | ''>('');
  const [mainImage, setMainImage] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [sizesState, setSizesState] = useState<ProductSize[]>([]);

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [cats, prod] = await Promise.all([getCategories(), getProductBySlugOrId(productId)]);
      setCategories(cats);

      if (prod) {
        setProduct(prod);
        setName(prod.name);
        setBrand(prod.brand);
        setCategoryId(prod.category_id);
        setSku(prod.sku);
        setDescription(prod.description);
        setPrice(prod.price);
        setDiscountPrice(prod.discount_price ?? '');
        setMainImage(prod.main_image);
        setImages(prod.images || [prod.main_image]);
        setFeatured(prod.featured);
        setStatus(prod.status);
        setSizesState(prod.sizes || []);
      }
      setLoading(false);
    }
    loadData();
  }, [productId]);

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    setImages((prev) => [...prev, imageUrlInput.trim()]);
    if (!mainImage) setMainImage(imageUrlInput.trim());
    setImageUrlInput('');
  };

  const handleRemoveImage = (img: string) => {
    setImages((prev) => prev.filter((i) => i !== img));
    if (mainImage === img) {
      setMainImage(images.find((i) => i !== img) || '');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setErrorMessage(null);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          setErrorMessage(data.error || 'Upload failed');
          break;
        }

        setImages((prev) => {
          const next = [...prev, data.url];
          if (!mainImage) setMainImage(data.url);
          return next;
        });
        if (!mainImage) setMainImage(data.url);
      }
    } catch {
      setErrorMessage('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const toggleSize = (size: number) => {
    const exists = sizesState.find((s) => s.size === size);
    if (exists) {
      setSizesState((prev) => prev.filter((s) => s.size !== size));
    } else {
      setSizesState((prev) => [...prev, { size, stock_quantity: 5 }].sort((a, b) => a.size - b.size));
    }
  };

  const updateSizeStock = (size: number, qty: number) => {
    setSizesState((prev) =>
      prev.map((s) => (s.size === size ? { ...s, stock_quantity: Math.max(0, qty) } : s))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Product name is required');
      return;
    }
    if (!price || Number(price) <= 0) {
      setErrorMessage('Please enter a valid price');
      return;
    }
    if (sizesState.length === 0) {
      setErrorMessage('Select at least one available shoe size');
      return;
    }

    setSaving(true);
    try {
      await saveProduct({
        id: productId,
        name,
        brand,
        category_id: categoryId,
        sku,
        description,
        price: Number(price),
        discount_price: discountPrice ? Number(discountPrice) : null,
        main_image: mainImage,
        images: images.length > 0 ? images : [mainImage],
        featured,
        status,
        sizes: sizesState,
        created_at: product?.created_at,
      });

      router.push('/admin/products');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update product');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 text-white text-xs font-mono uppercase tracking-widest animate-pulse">
        Loading Product Data...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-1 p-8 space-y-4">
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <Link href="/admin/products" className="text-xs text-zinc-400 hover:text-white underline">
          Return to Product List
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 pb-20">
      <AdminHeader
        title={`Edit: ${product.name}`}
        subtitle="Update product details, pricing, sizes, stock quantity, and images"
      />

      <div className="px-8 max-w-5xl space-y-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back To Product Management</span>
        </Link>

        {errorMessage && (
          <div className="p-4 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: BASIC INFORMATION */}
          <div className="bg-[#141417] p-6 border border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-serif border-b border-zinc-800 pb-3">
              1. Basic Product Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                  Brand *
                </label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500 uppercase tracking-wider"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                  SKU Code *
                </label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                Description *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500 leading-relaxed"
              />
            </div>
          </div>

          {/* SECTION 2: PRICING */}
          <div className="bg-[#141417] p-6 border border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-serif border-b border-zinc-800 pb-3">
              2. Pricing & Currency (Rs.)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                  Retail Price (Rs.) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1">
                  Discounted / Sale Price (Rs.) (Optional)
                </label>
                <input
                  type="number"
                  min={0}
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: PRODUCT IMAGES */}
          <div className="bg-[#141417] p-6 border border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-serif border-b border-zinc-800 pb-3">
              3. Product Images
            </h3>

            {/* Upload from device */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Upload from Device
              </label>
              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-2 py-8 border-2 border-dashed border-zinc-700 bg-zinc-900/50 cursor-pointer hover:border-zinc-500 hover:bg-zinc-900 transition-colors ${
                  uploading ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
                    <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-zinc-400" />
                    <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Click to upload image(s)</span>
                    <span className="text-[10px] text-zinc-600">JPEG, PNG, WebP or GIF · Max 5MB each</span>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Or add by URL */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300">
                Or Add by URL
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-white font-bold text-xs uppercase tracking-wider hover:bg-zinc-700"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {images.map((imgUrl, idx) => {
                const isMain = mainImage === imgUrl;
                return (
                  <div
                    key={idx}
                    className={`relative aspect-square bg-zinc-900 border overflow-hidden group ${
                      isMain ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-zinc-800'
                    }`}
                  >
                    <Image src={imgUrl} alt={`Preview ${idx}`} fill sizes="150px" className="object-cover" />

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(imgUrl)}
                        className="self-end p-1 bg-rose-600 text-white rounded-none hover:bg-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setMainImage(imgUrl)}
                        className="w-full py-1 bg-white text-zinc-950 text-[10px] font-bold uppercase tracking-wider"
                      >
                        {isMain ? '★ Main Image' : 'Set as Main'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: SIZE & INVENTORY MANAGEMENT */}
          <div className="bg-[#141417] p-6 border border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-serif border-b border-zinc-800 pb-3">
              4. Available Sizes & Per-Size Stock Inventory
            </h3>

            <div className="flex flex-wrap gap-2">
              {STANDARD_SIZES.map((sz) => {
                const isChecked = sizesState.some((s) => s.size === sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className={`px-4 py-2 text-xs font-mono font-bold border transition-colors ${
                      isChecked
                        ? 'bg-white text-zinc-950 border-white'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    Size {sz} {isChecked && '✓'}
                  </button>
                );
              })}
            </div>

            {sizesState.length > 0 && (
              <div className="pt-4 border-t border-zinc-800/80 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Manage Quantity Per Size
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {sizesState.map((item) => (
                    <div key={item.size} className="p-3 bg-zinc-900 border border-zinc-800 space-y-1">
                      <span className="text-xs font-mono font-bold text-white">Size {item.size}</span>
                      <div className="flex items-center space-x-2">
                        <label className="text-[10px] text-zinc-500 font-mono uppercase">Qty:</label>
                        <input
                          type="number"
                          min={0}
                          value={item.stock_quantity}
                          onChange={(e) => updateSizeStock(item.size, Number(e.target.value))}
                          className="w-full px-2 py-1 bg-zinc-950 border border-zinc-800 text-xs font-mono text-white focus:outline-none focus:border-zinc-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 5: PUBLICATION & SETTINGS */}
          <div className="bg-[#141417] p-6 border border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-serif border-b border-zinc-800 pb-3">
              5. Catalog Display & Settings
            </h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 bg-zinc-900 border-zinc-800 text-white rounded-none"
                />
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Feature on Landing Page Showcase
                </span>
              </label>

              <div className="flex items-center space-x-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Catalog Status:
                </span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                  className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 text-xs text-white uppercase tracking-wider focus:outline-none"
                >
                  <option value="published">Published (Visible to Customers)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4">
            <Link
              href="/admin/products"
              className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-semibold uppercase tracking-wider hover:bg-zinc-800"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-white text-zinc-950 font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {saving ? 'Updating Product...' : 'Save Product Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
