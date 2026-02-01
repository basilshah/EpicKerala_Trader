'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitRFQ } from '@/app/actions/submit-rfq';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Loader2, CheckCircle, Send } from 'lucide-react';

const rfqSchema = z.object({
  buyerName: z.string().min(2, 'Name must be at least 2 characters'),
  buyerEmail: z.string().email('Please enter a valid email address'),
  buyerCompany: z.string().optional(),
  buyerCountry: z.string().optional(),
  quantity: z.string().optional(),
  message: z
    .string()
    .min(20, 'Message must be at least 20 characters')
    .max(2000, 'Message must not exceed 2000 characters'),
  website: z.string().optional().default(''), // Honeypot
});

type RFQFormData = z.infer<typeof rfqSchema>;

export default function RFQForm({ productId }: { productId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<{ success: boolean; message?: string }>({
    success: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RFQFormData>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      website: '', // Honeypot
    },
  });

  const onSubmit = async (data: RFQFormData) => {
    setIsSubmitting(true);
    setSubmitState({ success: false });

    // Create FormData
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('buyerName', data.buyerName);
    formData.append('buyerEmail', data.buyerEmail);
    formData.append('buyerCompany', data.buyerCompany || '');
    formData.append('buyerCountry', data.buyerCountry || '');
    formData.append('quantity', data.quantity || '');
    formData.append('message', data.message);
    formData.append('website', data.website || ''); // Honeypot

    try {
      const result = await submitRFQ({ success: false }, formData);
      setSubmitState(result);

      if (result.success) {
        reset(); // Reset form on success
      }
    } catch (error) {
      setSubmitState({
        success: false,
        message: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitState.success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-green-800 mb-2">Enquiry Sent!</h3>
        <p className="text-green-700">{submitState.message}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-white p-6 rounded-lg border border-border shadow-sm"
    >
      <h3 className="text-lg font-semibold text-primary mb-4">Send Enquiry to Seller</h3>

      {/* Honeypot field - hidden from humans, visible to bots */}
      <div className="hidden" aria-hidden="true">
        <Label htmlFor="website">Website</Label>
        <Input type="text" id="website" {...register('website')} tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="buyerName">Your Name *</Label>
          <Input id="buyerName" {...register('buyerName')} placeholder="John Doe" />
          {errors.buyerName && <p className="text-sm text-red-600">{errors.buyerName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="buyerEmail">Your Email *</Label>
          <Input
            type="email"
            id="buyerEmail"
            {...register('buyerEmail')}
            placeholder="john@company.com"
          />
          {errors.buyerEmail && <p className="text-sm text-red-600">{errors.buyerEmail.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="buyerCompany">Company Name</Label>
          <Input id="buyerCompany" {...register('buyerCompany')} placeholder="Global Imports Ltd" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="buyerCountry">Country</Label>
          <Input id="buyerCountry" {...register('buyerCountry')} placeholder="USA, UAE, etc." />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Required Quantity</Label>
        <Input id="quantity" {...register('quantity')} placeholder="e.g. 500 kg, 1 Container" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          {...register('message')}
          rows={4}
          placeholder="Describe your requirement in detail (min 20 characters)..."
        />
        {errors.message && <p className="text-sm text-red-600">{errors.message.message}</p>}
        <p className="text-xs text-slate-500">Minimum 20 characters, maximum 2000 characters</p>
      </div>

      {submitState.message && !submitState.success && (
        <p className="text-sm text-red-500 font-medium">{submitState.message}</p>
      )}

      <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {isSubmitting ? 'Sending...' : 'Send Enquiry'}
      </Button>
    </form>
  );
}
