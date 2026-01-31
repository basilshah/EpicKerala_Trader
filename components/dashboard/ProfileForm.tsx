'use client';

import { useState } from 'react';
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
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

const profileSchema = z.object({
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  profileVideoUrl: z.string().url('Please enter a valid video URL').optional().or(z.literal('')),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  country: z.string().min(2, 'Country is required'),
  pincode: z.string().min(5, 'Pincode is required'),
  establishedYear: z.number().min(1800).max(new Date().getFullYear()).optional(),
  certifications: z.string().optional(),
  offersOEM: z.boolean(),
  contactPersonName: z.string().min(2, 'Contact person name is required'),
  contactPersonDesignation: z.string().min(2, 'Designation is required'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  seller: any;
}

export default function ProfileForm({ seller }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [certificationFiles, setCertificationFiles] = useState<
    Array<{ url: string; filename: string }>
  >(seller.certificationFiles ? JSON.parse(seller.certificationFiles) : []);
  const [uploadingCatalog, setUploadingCatalog] = useState(false);
  const [catalogs, setCatalogs] = useState<Array<{ url: string; filename: string; type: string }>>(
    seller.catalogs ? JSON.parse(seller.catalogs) : []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      companyName: seller.companyName || '',
      email: seller.email || '',
      phone: seller.phone || '',
      website: seller.website || '',
      profileVideoUrl: seller.profileVideoUrl || '',
      description: seller.description || '',
      address: seller.address || '',
      city: seller.city || '',
      state: seller.state || '',
      country: seller.country || 'India',
      pincode: seller.pincode || '',
      establishedYear: seller.establishedYear || undefined,
      certifications: seller.certifications || '',
      offersOEM: seller.offersOEM || false,
      contactPersonName: seller.contactPersonName || '',
      contactPersonDesignation: seller.contactPersonDesignation || '',
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
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
        throw new Error(result.error || 'Failed to upload file');
      }

      setCertificationFiles([
        ...certificationFiles,
        { url: result.url, filename: result.filename },
      ]);
      setSuccess('File uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setUploadingFile(false);
      event.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    setCertificationFiles(certificationFiles.filter((_, i) => i !== index));
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

      setCatalogs([...catalogs, { url: result.url, filename: result.filename, type: result.type }]);
      setSuccess('Catalog uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload catalog');
    } finally {
      setUploadingCatalog(false);
      event.target.value = '';
    }
  };

  const removeCatalog = (index: number) => {
    setCatalogs(catalogs.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          certificationFiles: JSON.stringify(certificationFiles),
          catalogs: JSON.stringify(catalogs),
          profileVideoUrl: data.profileVideoUrl || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully!');
      router.refresh();

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {success && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="companyName">Company Name</Label>
          <Input id="companyName" {...register('companyName')} />
          {errors.companyName && (
            <p className="text-red-600 text-sm mt-1">{errors.companyName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} disabled />
          <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register('phone')} />
          {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <Label htmlFor="website">Website</Label>
          <Input id="website" type="url" {...register('website')} placeholder="https://" />
          {errors.website && <p className="text-red-600 text-sm mt-1">{errors.website.message}</p>}
        </div>

        <div>
          <Label htmlFor="profileVideoUrl">Profile Video URL</Label>
          <Input
            id="profileVideoUrl"
            type="url"
            {...register('profileVideoUrl')}
            placeholder="https://youtube.com/... or https://vimeo.com/..."
          />
          <p className="text-xs text-slate-500 mt-1">Add a YouTube or Vimeo link</p>
          {errors.profileVideoUrl && (
            <p className="text-red-600 text-sm mt-1">{errors.profileVideoUrl.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label>Certification Files</Label>
        <div className="mt-2 space-y-3">
          {/* Upload Button */}
          <div>
            <label
              htmlFor="certificationUpload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors border border-slate-300"
            >
              <Upload className="w-4 h-4" />
              {uploadingFile ? 'Uploading...' : 'Upload Certification'}
            </label>
            <input
              id="certificationUpload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={handleFileUpload}
              disabled={uploadingFile}
              className="hidden"
            />
            <p className="text-xs text-slate-500 mt-1">
              PDF or images (max 5MB). Supports: PDF, JPG, PNG, WEBP
            </p>
          </div>

          {/* Uploaded Files List */}
          {certificationFiles.length > 0 && (
            <div className="space-y-2">
              {certificationFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {file.url.endsWith('.pdf') ? (
                      <FileText className="w-5 h-5 text-red-500" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-blue-500" />
                    )}
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-slate-700 hover:text-emerald-600 hover:underline"
                    >
                      {file.filename}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
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
        <Label>Company Catalogs</Label>
        <div className="mt-2 space-y-3">
          {/* Upload Button */}
          <div>
            <label
              htmlFor="catalogUpload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg cursor-pointer transition-colors border border-emerald-300"
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
              PDF or images (max 10MB). Product catalogs, brochures, price lists, etc.
            </p>
          </div>

          {/* Uploaded Catalogs List */}
          {catalogs.length > 0 && (
            <div className="space-y-2">
              {catalogs.map((catalog, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    {catalog.type === 'application/pdf' ? (
                      <FileText className="w-5 h-5 text-red-500" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-blue-500" />
                    )}
                    <a
                      href={catalog.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-slate-700 hover:text-emerald-600 hover:underline"
                    >
                      {catalog.filename}
                    </a>
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
        <Label htmlFor="description">Company Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          rows={4}
          placeholder="Describe your company, products, and export capabilities..."
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="contactPersonName">Contact Person Name</Label>
          <Input id="contactPersonName" {...register('contactPersonName')} />
          {errors.contactPersonName && (
            <p className="text-red-600 text-sm mt-1">{errors.contactPersonName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="contactPersonDesignation">Designation</Label>
          <Input id="contactPersonDesignation" {...register('contactPersonDesignation')} />
          {errors.contactPersonDesignation && (
            <p className="text-red-600 text-sm mt-1">{errors.contactPersonDesignation.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" {...register('address')} />
        {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register('city')} />
          {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>}
        </div>

        <div>
          <Label htmlFor="state">State</Label>
          <Input id="state" {...register('state')} />
          {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>}
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Input id="country" {...register('country')} />
          {errors.country && <p className="text-red-600 text-sm mt-1">{errors.country.message}</p>}
        </div>

        <div>
          <Label htmlFor="pincode">Pincode</Label>
          <Input id="pincode" {...register('pincode')} />
          {errors.pincode && <p className="text-red-600 text-sm mt-1">{errors.pincode.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="establishedYear">Established Year</Label>
          <Input
            id="establishedYear"
            type="number"
            {...register('establishedYear', { valueAsNumber: true })}
          />
          {errors.establishedYear && (
            <p className="text-red-600 text-sm mt-1">{errors.establishedYear.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="certifications">Certifications</Label>
          <Input
            id="certifications"
            {...register('certifications')}
            placeholder="ISO 9001, HACCP, etc."
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="offersOEM"
          {...register('offersOEM')}
          className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
        />
        <Label htmlFor="offersOEM" className="mb-0">
          Offers OEM/Private Label Services
        </Label>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push('/dashboard')}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
