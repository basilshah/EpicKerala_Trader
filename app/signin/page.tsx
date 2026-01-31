import SignInForm from '@/components/SignInForm';
import { Container } from '@/components/ui/Container';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="min-h-screen py-12 bg-slate-50">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Exporter Sign In</h1>
            <p className="text-slate-600">Access your dashboard to manage products and profile</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <SignInForm />

            <div className="mt-6 text-center text-sm text-slate-600">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Register here
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
