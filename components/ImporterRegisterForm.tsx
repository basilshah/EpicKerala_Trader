'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { countries } from '@/lib/countries';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';
import { SuccessMessage } from '@/components/atoms/SuccessMessage';
import { FieldError } from '@/components/atoms/FieldError';

const importerRegisterSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    companyName: z.string().optional(),
    country: z.string().min(1, 'Country is required'),
    city: z.string().min(2, 'City is required'),
    countryCode: z.string().min(1, 'Country code is required'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ImporterRegisterFormData = z.infer<typeof importerRegisterSchema>;

export function ImporterRegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ImporterRegisterFormData>({
    resolver: zodResolver(importerRegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      companyName: '',
      country: 'India',
      city: '',
      countryCode: '+91',
      phone: '',
    },
  });

  const onSubmit = async (formData: ImporterRegisterFormData) => {
    setError('');

    try {
      const response = await fetch('/api/register/importer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      setSuccess(true);

      // Auto sign in after registration
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError('Registration successful, but auto sign-in failed. Please sign in manually.');
        setTimeout(() => router.push('/signin'), 2000);
      } else {
        setTimeout(() => router.push(callbackUrl), 1000);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <SuccessMessage message="Registration successful! Redirecting you..." className="mb-4" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ErrorMessage message={error} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            {...register('name')}
            className={errors.name ? 'border-red-500' : ''}
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div>
          <Label htmlFor="email">
            Email Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <Label htmlFor="password">
            Password <span className="text-red-500">*</span>
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            className={errors.password ? 'border-red-500' : ''}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword">
            Confirm Password <span className="text-red-500">*</span>
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            className={errors.confirmPassword ? 'border-red-500' : ''}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="country">
            Country <span className="text-red-500">*</span>
          </Label>
          <select
            id="country"
            {...register('country')}
            className={`w-full h-10 px-3 rounded-md border ${
              errors.country ? 'border-red-500' : 'border-input'
            } bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary`}
          >
            {countries.map((country) => (
              <option key={country.code} value={country.name}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
          {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
        </div>

        <div>
          <Label htmlFor="city">
            City <span className="text-red-500">*</span>
          </Label>
          <Input
            id="city"
            type="text"
            placeholder="e.g., Mumbai, Delhi, Bangalore"
            {...register('city')}
            className={errors.city ? 'border-red-500' : ''}
          />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
        </div>

        <div>
          <Label htmlFor="phone">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-2">
            <select
              id="countryCode"
              {...register('countryCode')}
              className={`w-20 h-10 px-1 rounded-md border ${
                errors.countryCode ? 'border-red-500' : 'border-input'
              } bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary`}
            >
              {countries.map((country) => (
                <option key={country.code} value={country.dialCode}>
                  {country.flag} {country.dialCode}
                </option>
              ))}
            </select>
            <Input
              id="phone"
              type="tel"
              placeholder="9876543210"
              {...register('phone')}
              className={errors.phone ? 'border-red-500 flex-1' : 'flex-1'}
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          {errors.countryCode && (
            <p className="text-red-500 text-xs mt-1">{errors.countryCode.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            type="text"
            placeholder="Your Company Ltd."
            {...register('companyName')}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          'Create Free Account'
        )}
      </Button>

      <div className="text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link href="/signin" className="text-primary hover:underline font-medium">
          Sign In
        </Link>
      </div>
    </form>
  );
}
