import { Container } from '@/components/ui/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { RegisterForm } from '@/components/RegisterForm';
import { Factory, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="bg-background min-h-screen py-8 md:py-12">
      <Container>
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3 md:mb-4">
              Register as Exporter
            </h1>
            <p className="text-base md:text-lg text-muted max-w-2xl mx-auto">
              Join Kerala's premier export platform and connect with global buyers. Get verified and
              showcase your products to international markets.
            </p>
          </div>

          {/* Registration Form */}
          <Card className="border-slate-200">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-xl md:text-2xl">Company Information</CardTitle>
              <p className="text-xs md:text-sm text-muted mt-2">
                Fill in your company details to get started. All fields marked with * are required.
              </p>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <RegisterForm />
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
