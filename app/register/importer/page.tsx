import { Container } from '@/components/ui/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ImporterRegisterForm } from '@/components/ImporterRegisterForm';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function ImporterRegisterPage() {
  return (
    <div className="bg-background min-h-screen py-8 md:py-12">
      <Container>
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3 md:mb-4">
              Register as Importer/Buyer
            </h1>
            <p className="text-base md:text-lg text-muted max-w-2xl mx-auto">
              Create a free account to access product details, contact exporters, and submit RFQs.
            </p>
          </div>

          {/* Registration Form */}
          <Card className="border-slate-200">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                Create Your Account
              </CardTitle>
              <p className="text-xs md:text-sm text-muted mt-2">
                Quick and easy registration. Fields marked with * are required.
              </p>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <ImporterRegisterForm />
              
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Are you an exporter?{' '}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  Register as Exporter
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
