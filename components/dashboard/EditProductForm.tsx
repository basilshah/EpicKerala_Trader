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
import { Loader2 } from 'lucide-react';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { FieldError } from '@/components/atoms/FieldError';
import { FileUploadField } from '@/components/molecules/FileUploadField';
import { ImageUploadPreview } from '@/components/molecules/ImageUploadPreview';
import { FileListPreview } from '@/components/molecules/FileListPreview';

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

interface Product {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  hsCode: string | null;
  moq: string | null;
  origin: string | null;
  shelfLife: string | null;
  images: string | null;
  catalogs?: string | null;
  certificationFiles?: string | null;
  isPublic: boolean;
  category: {
    id: string;
    name: string;
    parentId: string | null;
  };
}

interface EditProductFormProps {
  product: Product;
  sellerId: string;
  mainCategories: Category[];
  allCategories: Category[];
}

export default function EditProductForm({
  product,
  sellerId,
  mainCategories,
  allCategories,
}: EditProductFormProps) {
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
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product.name,
      description: product.description || '',
      categoryId: product.categoryId,
      hsCode: product.hsCode || '',
      moq: product.moq || '',
      origin: product.origin || 'India',
      shelfLife: product.shelfLife || '',
      isPublic: product.isPublic,
    },
  });

  // Initialize images and categories on mount
  useEffect(() => {
    // Parse and set existing images
    if (product.images) {
      try {
        const images = JSON.parse(product.images);
        if (Array.isArray(images)) {
          setProductImages(images);
        }
      } catch (e) {
        console.error('Failed to parse product images:', e);
      }
    }

    // Parse and set existing catalogs
    if (product.catalogs) {
      try {
        const catalogs = JSON.parse(product.catalogs);
        if (Array.isArray(catalogs)) {
          setProductCatalogs(catalogs);
        }
      } catch (e) {
        console.error('Failed to parse product catalogs:', e);
      }
    }

    // Parse and set existing certificates
    if (product.certificationFiles) {
      try {
        const certificates = JSON.parse(product.certificationFiles);
        if (Array.isArray(certificates)) {
          setProductCertificates(certificates);
        }
      } catch (e) {
        console.error('Failed to parse product certificates:', e);
      }
    }

    // Determine main category
    const productCategory = allCategories.find((c) => c.id === product.categoryId);
    if (productCategory) {
      if (productCategory.parentId) {
        // If it's a subcategory, set the parent as main category
        setSelectedMainCategory(productCategory.parentId);
      } else {
        // If it's a main category, set it as selected
        setSelectedMainCategory(productCategory.id);
      }
    }
  }, [product, allCategories]);

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
        // If we have subcategories and the current product's category is one of them,
        // keep it selected (this handles the initial load)
        const productCategory = allCategories.find((c) => c.id === product.categoryId);
        if (productCategory && productCategory.parentId === selectedMainCategory) {
          setValue('categoryId', product.categoryId);
        }
      }
    } else {
      setSubCategories([]);
      setValue('categoryId', '');
    }
  }, [selectedMainCategory, allCategories, setValue, product.categoryId]);

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
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
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
        throw new Error(result.error || 'Failed to update product');
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
      <ErrorMessage message={error} />

      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" {...register('name')} placeholder="e.g., Premium Basmati Rice" />
        <FieldError message={errors.name?.message} />
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
          <FileUploadField
            inputId="productImageUpload"
            label="Product Images"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageUpload}
            uploading={uploadingImage}
            idleText="Upload Product Image"
            helperText="JPG, PNG, or WEBP (max 10MB). Add multiple images for better presentation."
            tone="green"
          />
          <ImageUploadPreview images={productImages} onRemove={removeImage} />
        </div>
      </div>

      <div>
        <Label>Product Catalogs</Label>
        <div className="mt-2 space-y-3">
          <FileUploadField
            inputId="catalogUpload"
            label="Product Catalogs"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={handleCatalogUpload}
            uploading={uploadingCatalog}
            idleText="Upload Catalog"
            helperText="PDF or images (max 10MB). Product specs, brochures, data sheets, etc."
            tone="blue"
          />
          <FileListPreview files={productCatalogs} onRemove={removeCatalog} variant="catalog" />
        </div>
      </div>

      <div>
        <Label>Product Certifications</Label>
        <div className="mt-2 space-y-3">
          <FileUploadField
            inputId="certificateUpload"
            label="Product Certifications"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={handleCertificateUpload}
            uploading={uploadingCertificate}
            idleText="Upload Certificate"
            helperText="PDF or images (max 10MB). Quality certificates, test reports, organic certifications, etc."
            tone="purple"
          />
          <FileListPreview
            files={productCertificates}
            onRemove={removeCertificate}
            variant="certificate"
          />
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
          Publish (make visible to buyers)
        </Label>
      </div>

      <div className="flex gap-4 pt-4 border-t border-slate-200">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Product'
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/dashboard/products')}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
