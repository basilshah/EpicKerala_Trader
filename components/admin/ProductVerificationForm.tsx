'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface ProductVerificationFormProps {
  productId: string;
  currentStatus: string;
  rejectionReason: string | null;
}

export default function ProductVerificationForm({
  productId,
  currentStatus,
  rejectionReason,
}: ProductVerificationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState(rejectionReason || '');
  const [message, setMessage] = useState('');

  const handleVerification = async (status: 'APPROVED' | 'REJECTED') => {
    if (status === 'REJECTED' && !reason.trim()) {
      setMessage('Please provide a reason for rejection');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`/api/admin/products/${productId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verificationStatus: status,
          rejectionReason: status === 'REJECTED' ? reason : null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update verification status');
      }

      setMessage(`Product ${status.toLowerCase()} successfully!`);
      setTimeout(() => {
        router.push('/admin/dashboard');
        router.refresh();
      }, 1500);
    } catch (error: any) {
      setMessage(error.message || 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.includes('successfully')
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}

      {currentStatus === 'PENDING' && (
        <>
          <div>
            <Label htmlFor="rejectionReason">Rejection Reason (if rejecting)</Label>
            <Textarea
              id="rejectionReason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Provide a detailed reason if rejecting..."
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => handleVerification('APPROVED')}
              disabled={isLoading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </>
              )}
            </Button>
            <Button
              onClick={() => handleVerification('REJECTED')}
              disabled={isLoading}
              variant="outline"
              className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </>
              )}
            </Button>
          </div>
        </>
      )}

      {currentStatus === 'APPROVED' && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
          <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <p className="text-emerald-700 font-medium">This product has been approved</p>
        </div>
      )}

      {currentStatus === 'REJECTED' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700 font-medium">This product has been rejected</p>
          </div>
          {rejectionReason && (
            <p className="text-sm text-red-600 mt-2">
              <strong>Reason:</strong> {rejectionReason}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
