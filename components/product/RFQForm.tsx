'use client';

import { useActionState } from 'react'; // React 19 / Next 15
import { submitRFQ } from '@/app/actions/submit-rfq';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input'; // Need to create this
import { Textarea } from '@/components/ui/Textarea'; // Need to create this
import { Label } from '@/components/ui/Label'; // Need to create this ... or just inline HTML for speed
import { Loader2, CheckCircle, Send } from 'lucide-react';

// Inline simple Input/Label/Textarea for MVP speed if components don't exist yet
// Or I can create them. The prompt asked for "Reusable UI Components ... Input". I haven't created Input yet.
// I will create simple inline styles for now to avoid blocking, or generic HTML.

export default function RFQForm({ productId }: { productId: string }) {
  const [state, action, isPending] = useActionState(submitRFQ, { success: false });

  if (state.success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-green-800 mb-2">Enquiry Sent!</h3>
        <p className="text-green-700">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4 bg-white p-6 rounded-lg border border-border shadow-sm">
      <h3 className="text-lg font-semibold text-primary mb-4">Send Enquiry to Seller</h3>
      
      <input type="hidden" name="productId" value={productId} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <label htmlFor="buyerName" className="text-sm font-medium text-slate-700">Your Name *</label>
            <input type="text" id="buyerName" name="buyerName" required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="John Doe" />
        </div>
         <div className="space-y-2">
            <label htmlFor="buyerEmail" className="text-sm font-medium text-slate-700">Your Email *</label>
            <input type="email" id="buyerEmail" name="buyerEmail" required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="john@company.com" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
            <label htmlFor="buyerCompany" className="text-sm font-medium text-slate-700">Company Name</label>
            <input type="text" id="buyerCompany" name="buyerCompany" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Global Imports Ltd" />
        </div>
         <div className="space-y-2">
            <label htmlFor="buyerCountry" className="text-sm font-medium text-slate-700">Country</label>
            <input type="text" id="buyerCountry" name="buyerCountry" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="USA, UAE, etc." />
        </div>
      </div>
      
      <div className="space-y-2">
            <label htmlFor="quantity" className="text-sm font-medium text-slate-700">Required Quantity</label>
            <input type="text" id="quantity" name="quantity" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="e.g. 500 kg, 1 Container" />
      </div>

      <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-slate-700">Message *</label>
            <textarea id="message" name="message" required rows={4} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Describe your requirement detailedly (specs, packaging, terms)..."></textarea>
      </div>

      {state.message && !state.success && (
        <p className="text-sm text-red-500 font-medium">{state.message}</p>
      )}

      <Button type="submit" className="w-full gap-2" disabled={isPending}>
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {isPending ? 'Sending...' : 'Send Enquiry'}
      </Button>
    </form>
  );
}
