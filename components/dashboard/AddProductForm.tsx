'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Upload,
  X,
  Image as ImageIcon,
  FileText,
} from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  categoryId: z.string().min(1, 'Please select a category'),
  hsCode: z.string().optional().or(z.literal('')),
  moq: z.string().optional().or(z.literal('')),
  origin: z.string(),
  shelfLife: z.string().optional().or(z.literal('')),
  isPublic: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

interface AddProductFormProps {
  sellerId: string;
  mainCategories: Category[];
  allCategories: Category[];
}

export default function AddProductForm({
  sellerId,
  mainCategories,
  allCategories,
}: AddProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [productImages, setProductImages] = useState<Array<{ url: string; filename: string }>>([]);
  const [uploadingCatalog, setUploadingCatalog] = useState(false);
  const [productCatalogs, setProductCatalogs] = useState<
    Array<{ url: string; filename: string; type: string }>
  >([]);
  const [uploadingCertificate, setUploadingCertificate] = useState(false);
  const [productCertificates, setProductCertificates] = useState<
    Array<{ url: string; filename: string; type: string }>
  >([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      origin: 'India',
      isPublic: true,
    },
  });

  // Watch for main category changes
  useEffect(() => {
    if (selectedMainCategory) {
      // Filter subcategories based on selected main category
      const subs = allCategories.filter((cat) => cat.parentId === selectedMainCategory);
      setSubCategories(subs);

      // If there are no subcategories, use the main category itself
      if (subs.length === 0) {
        setValue('categoryId', selectedMainCategory);
      } else {
        // Reset subcategory selection when main category changes
        setValue('categoryId', '');
      }
    } else {
      setSubCategories([]);
      setValue('categoryId', '');
    }
  }, [selectedMainCategory, allCategories, setValue]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      event.target.value = '';
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload an image file (JPG, PNG, WEBP)');
      event.target.value = '';
      return;
    }

    setUploadingImage(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/product', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload image');
      }

      setProductImages([...productImages, { url: result.url, filename: result.filename }]);
    } catch (err: any) {
      console.error('Product image upload error:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setProductImages(productImages.filter((_, i) => i !== index));
  };

  const handleCatalogUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingCatalog(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/catalog', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload catalog');
      }

      setProductCatalogs([
        ...productCatalogs,
        { url: result.url, filename: result.filename, type: result.type },
      ]);
    } catch (err: any) {
      setError(err.message || 'Failed to upload catalog');
    } finally {
      setUploadingCatalog(false);
      event.target.value = '';
    }
  };

  const removeCatalog = (index: number) => {
    setProductCatalogs(productCatalogs.filter((_, i) => i !== index));
  };

  const handleCertificateUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingCertificate(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/certification', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload certificate');
      }

      setProductCertificates([
        ...productCertificates,
        { url: result.url, filename: result.filename, type: result.type },
      ]);
    } catch (err: any) {
      setError(err.message || 'Failed to upload certificate');
    } finally {
      setUploadingCertificate(false);
      event.target.value = '';
    }
  };

  const removeCertificate = (index: number) => {
    setProductCertificates(productCertificates.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          sellerId,
          images: JSON.stringify(productImages),
          catalogs: JSON.stringify(productCatalogs),
          certificationFiles: JSON.stringify(productCertificates),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create product');
      }

      // Redirect to products list
      router.push('/dashboard/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" {...register('name')} placeholder="e.g., Premium Basmati Rice" />
        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          rows={5}
          placeholder="Describe your product, its features, quality, certifications, and export capabilities..."
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Label>Product Images</Label>
        <div className="mt-2 space-y-3">
          {/* Upload Button */}
          <div>
            <label
              htmlFor="productImageUpload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg cursor-pointer transition-colors border border-emerald-300"
            >
              <Upload className="w-4 h-4" />
              {uploadingImage ? 'Uploading...' : 'Upload Product Image'}
            </label>
            <input
              id="productImageUpload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="hidden"
            />
            <p className="text-xs text-slate-500 mt-1">
              JPG, PNG, or WEBP (max 10MB). Add multiple images for better presentation.
            </p>
          </div>

          {/* Image Previews */}
          {productImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {productImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt={image.filename}
                    className="w-full h-32 object-cover rounded-lg border-2 border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-slate-600 mt-1 truncate">{image.filename}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <Label>Product Catalogs</Label>
        <div className="mt-2 space-y-3">
          {/* Upload Button */}
          <div>
            <label
              htmlFor="catalogUpload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg cursor-pointer transition-colors border border-blue-300"
            >
              <Upload className="w-4 h-4" />
              {uploadingCatalog ? 'Uploading...' : 'Upload Catalog'}
            </label>
            <input
              id="catalogUpload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleCatalogUpload}
              disabled={uploadingCatalog}
              className="hidden"
            />
            <p className="text-xs text-slate-500 mt-1">
              PDF or images (max 10MB). Product specs, brochures, data sheets, etc.
            </p>
          </div>

          {/* Catalog Files List */}
          {productCatalogs.length > 0 && (
            <div className="space-y-2">
              {productCatalogs.map((catalog, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {catalog.type === 'application/pdf' ? (
                      <FileText className="w-5 h-5 text-red-500" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-blue-500" />
                    )}
                    <span className="text-sm text-slate-700">{catalog.filename}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCatalog(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <Label>Product Certifications</Label>
        <div className="mt-2 space-y-3">
          {/* Upload Button */}
          <div>
            <label
              htmlFor="certificateUpload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg cursor-pointer transition-colors border border-purple-300"
            >
              <Upload className="w-4 h-4" />
              {uploadingCertificate ? 'Uploading...' : 'Upload Certificate'}
            </label>
            <input
              id="certificateUpload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleCertificateUpload}
              disabled={uploadingCertificate}
              className="hidden"
            />
            <p className="text-xs text-slate-500 mt-1">
              PDF or images (max 10MB). Quality certificates, test reports, organic certifications,
              etc.
            </p>
          </div>

          {/* Certificate Files List */}
          {productCertificates.length > 0 && (
            <div className="space-y-2">
              {productCertificates.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {cert.type === 'application/pdf' ? (
                      <FileText className="w-5 h-5 text-red-500" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-purple-500" />
                    )}
                    <span className="text-sm text-slate-700">{cert.filename}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCertificate(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="mainCategory">Main Category</Label>
          <select
            id="mainCategory"
            value={selectedMainCategory}
            onChange={(e) => setSelectedMainCategory(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">Select main category</option>
            {mainCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="categoryId">
            Subcategory
            {subCategories.length === 0 && selectedMainCategory && (
              <span className="text-xs text-slate-500 ml-2">(No subcategories available)</span>
            )}
          </Label>
          <select
            id="categoryId"
            {...register('categoryId')}
            disabled={!selectedMainCategory || subCategories.length === 0}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {!selectedMainCategory
                ? 'Select main category first'
                : subCategories.length === 0
                  ? 'No subcategories'
                  : 'Select subcategory'}
            </option>
            {subCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-red-600 text-sm mt-1">{errors.categoryId.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="hsCode">HS Code</Label>
          <Input id="hsCode" {...register('hsCode')} placeholder="e.g., 1006.30" />
          <p className="text-xs text-slate-500 mt-1">Harmonized System Code (optional)</p>
        </div>

        <div>
          <Label htmlFor="moq">Minimum Order Quantity (MOQ)</Label>
          <Input id="moq" {...register('moq')} placeholder="e.g., 500 kg" />
        </div>

        <div>
          <Label htmlFor="origin">Country of Origin</Label>
          <Input id="origin" {...register('origin')} />
        </div>

        <div>
          <Label htmlFor="shelfLife">Shelf Life</Label>
          <Input id="shelfLife" {...register('shelfLife')} placeholder="e.g., 12 months" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublic"
          {...register('isPublic')}
          className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
        />
        <Label htmlFor="isPublic" className="mb-0">
          Publish immediately (make visible to buyers)
        </Label>
      </div>

      <div className="flex gap-4 pt-4 border-t border-slate-200">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Product'
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/dashboard/products')}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
