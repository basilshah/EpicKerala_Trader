import { Container } from '@/components/ui/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { RegisterForm } from '@/components/RegisterForm';
import { Factory, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="bg-background min-h-screen py-12">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Factory className="w-10 h-10 text-primary" />
              <h1 className="text-4xl font-bold text-primary">Register as Exporter</h1>
            </div>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Join Kerala's premier export platform and connect with global buyers. Get verified
              and showcase your products to international markets.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
              <CheckCircle className="w-8 h-8 text-secondary mx-auto mb-2" />
              <h3 className="font-semibold text-foreground mb-1">Global Reach</h3>
              <p className="text-sm text-muted">Connect with buyers worldwide</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
              <CheckCircle className="w-8 h-8 text-secondary mx-auto mb-2" />
              <h3 className="font-semibold text-foreground mb-1">Verified Badge</h3>
              <p className="text-sm text-muted">Get official verification status</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 text-center">
              <CheckCircle className="w-8 h-8 text-secondary mx-auto mb-2" />
              <h3 className="font-semibold text-foreground mb-1">Free Listing</h3>
              <p className="text-sm text-muted">List unlimited products for free</p>
            </div>
          </div>

          {/* Registration Form */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-2xl">Company Information</CardTitle>
              <p className="text-sm text-muted mt-2">
                Fill in your company details to get started. All fields marked with * are required.
              </p>
            </CardHeader>
            <CardContent>
              <RegisterForm />
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
