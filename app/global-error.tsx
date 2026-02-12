'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">Application Error</h1>

            <p className="text-slate-600 mb-6">
              Something went wrong. Please refresh the page or contact support if the problem
              persists.
            </p>

            <button
              onClick={reset}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
