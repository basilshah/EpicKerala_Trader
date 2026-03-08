'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Loader2, Upload, X } from 'lucide-react';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
}

interface CategoryFormProps {
  category?: Category;
  mainCategories: { id: string; name: string }[];
}

export default function CategoryForm({ category, mainCategories }: CategoryFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(category?.imageUrl || null);

  // Get parent from URL query parameter
  const parentFromUrl = searchParams.get('parent');

  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    imageUrl: category?.imageUrl || '',
    parentId: category?.parentId || parentFromUrl || '',
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: category ? formData.slug : generateSlug(name),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, WEBP)');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/upload/category', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      setImagePreview(data.url);

      // Clear the file input
      e.target.value = '';
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const url = category ? `/api/admin/categories/${category.id}` : '/api/admin/categories';

      const response = await fetch(url, {
        method: category ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          description: formData.description || null,
          imageUrl: formData.imageUrl || null,
          parentId: formData.parentId || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save category');
      }

      router.push('/admin/categories');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <ErrorMessage message={error} className="mb-6" />

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name */}
          <div>
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Fruits & Vegetables"
              required
              disabled={isLoading}
            />
          </div>

          {/* Slug */}
          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g., fruits-vegetables"
              required
              disabled={isLoading}
            />
            <p className="text-xs text-slate-700 mt-1 font-medium">
              URL-friendly identifier (lowercase, hyphens only)
            </p>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this category..."
              rows={4}
              disabled={isLoading}
            />
          </div>

          {/* Parent Category */}
          <div>
            <Label htmlFor="parentId">Parent Category</Label>
            <select
              id="parentId"
              value={formData.parentId}
              onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              disabled={isLoading}
            >
              <option value="">None (Main Category)</option>
              {mainCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-700 mt-1 font-medium">
              Leave empty to create a main category, or select a parent for a subcategory
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <Label htmlFor="image">Category Image</Label>
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-slate-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  disabled={isLoading}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="mt-1">
                <label
                  htmlFor="image"
                  className="flex items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors"
                >
                  {isLoading ? (
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 border-4 border-slate-300 border-t-emerald-600 rounded-full animate-spin"></div>
                      <p className="text-sm text-slate-800 font-medium">Uploading...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                      <p className="text-sm text-slate-800 font-medium">Click to upload image</p>
                      <p className="text-xs text-slate-700 mt-1 font-medium">
                        PNG, JPG, WEBP up to 5MB
                      </p>
                    </div>
                  )}
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isLoading}
                />
              </div>
            )}
            <p className="text-xs text-slate-700 mt-2 font-medium">Or paste image URL below:</p>
            <Input
              value={formData.imageUrl}
              onChange={(e) => {
                setFormData({ ...formData, imageUrl: e.target.value });
                setImagePreview(e.target.value);
              }}
              placeholder="https://example.com/image.jpg"
              disabled={isLoading}
              className="mt-2"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{category ? 'Update Category' : 'Create Category'}</>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/categories')}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
