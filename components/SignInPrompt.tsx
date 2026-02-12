import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Lock, UserPlus } from 'lucide-react';

interface SignInPromptProps {
  title?: string;
  message?: string;
  returnUrl?: string;
}

export function SignInPrompt({
  title = 'Sign In Required',
  message = 'You need to sign in to view this content.',
  returnUrl,
}: SignInPromptProps) {
  const signInUrl = returnUrl ? `/signin?callbackUrl=${encodeURIComponent(returnUrl)}` : '/signin';

  const registerUrl = returnUrl
    ? `/register/importer?callbackUrl=${encodeURIComponent(returnUrl)}`
    : '/register/importer';

  return (
    <Container className="py-20">
      <div className="max-w-md mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-100 p-4 rounded-full">
                <Lock className="h-10 w-10 text-blue-600" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>

            <p className="text-gray-600 mb-8">{message}</p>

            <div className="space-y-3">
              <Link href={signInUrl} className="block">
                <Button className="w-full" size="lg">
                  Sign In
                </Button>
              </Link>

              <Link href={registerUrl} className="block">
                <Button variant="outline" className="w-full" size="lg">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Account
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              Create a free account to access product details, seller information, and submit RFQs.
            </p>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
