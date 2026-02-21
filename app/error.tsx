'use client';

import { useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Container>
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-primary mb-2">Something went wrong!</h1>

          <p className="text-slate-600 mb-6">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>

          <div className="space-y-3">
            <Button onClick={reset} className="w-full gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>

            <Button
              variant="outline"
              onClick={() => (window.location.href = '/')}
              className="w-full"
            >
              Go to Homepage
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && error.digest && (
            <div className="mt-6 p-4 bg-slate-100 rounded-lg text-left">
              <p className="text-xs text-slate-600 font-mono break-all">
                Error Digest: {error.digest}
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
