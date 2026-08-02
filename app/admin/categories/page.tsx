'use client';

import React, { useEffect, useState } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { getCategories, saveCategory, deleteCategory } from '@/lib/store';
import { Category } from '@/lib/types';
import {
  FolderTree,
  Plus,
  Tag,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Save,
  ChevronDown,
} from 'lucide-react';

interface CategoryForm {
  id?: string;
  name: string;
  slug: string;
  description: string;
}

const emptyForm: CategoryForm = { name: '', slug: '', description: '' };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    const cats = await getCategories();
    setCategories(cats);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleNameChange = (name: string) => {
    const autoSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setForm((prev) => ({
      ...prev,
      name,
      slug: editingId ? prev.slug : autoSlug,
    }));
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormError(null);
    setShowForm(true);
  };

  const openEditForm = (cat: Category) => {
    setForm({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
    });
    setEditingId(cat.id);
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.name.trim()) {
      setFormError('Category name is required.');
      return;
    }
    if (!form.slug.trim()) {
      setFormError('Slug is required.');
      return;
    }
    // Check duplicate name (excluding self on edit)
    const duplicate = categories.find(
      (c) => c.name.toLowerCase() === form.name.toLowerCase().trim() && c.id !== editingId
    );
    if (duplicate) {
      setFormError('A category with this name already exists.');
      return;
    }

    setSaving(true);
    try {
      await saveCategory({
        id: editingId || undefined,
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
      });
      await loadData();
      closeForm();
      showToast(`Category "${form.name.trim()}" ${editingId ? 'updated' : 'created'} successfully.`);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    const target = categories.find((c) => c.id === deletingId);
    await deleteCategory(deletingId);
    await loadData();
    setIsDeleting(false);
    setDeletingId(null);
    showToast(`Category "${target?.name}" deleted.`);
  };

  return (
    <div className="flex-1 space-y-8 pb-16">
      <AdminHeader
        title="Category Management"
        subtitle="Create, edit, and manage product categories and footwear collections"
      />

      <div className="px-8 space-y-6">
        {/* Toast */}
        {toast && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-xl">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toast}</span>
            </div>
            <button onClick={() => setToast(null)}>
              <X className="w-4 h-4 hover:text-white" />
            </button>
          </div>
        )}

        {/* Header Bar */}
        <div className="flex items-center justify-between bg-[#141417] p-4 border border-zinc-800">
          <div className="flex items-center space-x-2 text-zinc-300">
            <FolderTree className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white font-serif">
              Active Store Categories ({categories.length})
            </h2>
          </div>
          <button
            onClick={openAddForm}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white text-zinc-950 font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div className="bg-[#141417] border border-zinc-700 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-serif">
                {editingId ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={closeForm}>
                <X className="w-4 h-4 text-zinc-400 hover:text-white" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Sneakers"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Slug (URL) *
                </label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                  placeholder="e.g. sneakers"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white font-mono focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Short description of this category"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="md:col-span-2 flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-semibold uppercase tracking-wider hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center space-x-2 px-6 py-2 bg-white text-zinc-950 font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-[#141417] border border-zinc-800 animate-pulse" />
            ))
          ) : categories.length === 0 ? (
            <div className="col-span-3 py-16 text-center text-zinc-500 bg-[#141417] border border-zinc-800">
              <FolderTree className="w-8 h-8 mx-auto mb-3 text-zinc-700" />
              <p className="text-sm">No categories yet. Add your first one above.</p>
            </div>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} className="p-6 bg-[#141417] border border-zinc-800 space-y-3 group hover:border-zinc-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 min-w-0">
                    <Tag className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                    <h3 className="text-base font-bold text-white uppercase tracking-wider font-serif truncate">
                      {cat.name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 flex-shrink-0">
                    /{cat.slug}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                  {cat.description || 'No description provided.'}
                </p>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-1 border-t border-zinc-800/60">
                  <button
                    onClick={() => openEditForm(cat)}
                    className="flex-1 inline-flex items-center justify-center space-x-1.5 py-1.5 bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeletingId(cat.id)}
                    className="flex-1 inline-flex items-center justify-center space-x-1.5 py-1.5 bg-rose-950/30 border border-rose-900/40 text-xs text-rose-400 hover:bg-rose-900/50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141417] border border-zinc-800 p-6 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center space-x-3 text-rose-400">
              <div className="p-2 bg-rose-950/80 border border-rose-800 rounded-full">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-white uppercase tracking-wider">
                Confirm Deletion
              </h3>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Are you sure you want to delete{' '}
              <strong className="text-white">
                &quot;{categories.find((c) => c.id === deletingId)?.name}&quot;
              </strong>
              ? Products in this category will not be deleted but will become uncategorized.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                disabled={isDeleting}
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-semibold uppercase tracking-wider hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="px-5 py-2 bg-rose-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-500 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
