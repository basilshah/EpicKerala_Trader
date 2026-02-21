'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Loader2, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { ErrorMessage } from '@/components/atoms/ErrorMessage';

// Complete schema for final submission
const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    countryCode: z.string(),
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .regex(/^\d+$/, 'Phone must contain only numbers'),
    companyName: z.string().min(2, 'Company name must be at least 2 characters'),
    businessType: z.enum(['manufacturer', 'merchant-exporter']),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
    establishedYear: z.string().optional(),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    city: z.string().min(2, 'City name is required'),
    state: z.string().min(2, 'State name is required'),
    country: z.string().min(2, 'Country name is required'),
    pincode: z.string().min(5, 'Pincode must be at least 5 characters'),
    certifications: z.string().optional(),
    offersOEM: z.boolean(),
    contactPersonName: z.string().min(2, 'Contact person name is required'),
    contactPersonDesignation: z.string().min(2, 'Designation is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const STEPS = [
  { id: 1, title: 'Account & Contact' },
  { id: 2, title: 'Company Details' },
  { id: 3, title: 'Address' },
  { id: 4, title: 'Additional Info' },
];

export function RegisterForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      countryCode: '+91',
      phone: '',
      companyName: '',
      businessType: 'manufacturer',
      description: '',
      website: '',
      establishedYear: '',
      address: '',
      city: '',
      state: 'Kerala',
      country: 'India',
      pincode: '',
      certifications: '',
      offersOEM: false,
      contactPersonName: '',
      contactPersonDesignation: '',
    },
  });

  const onSubmit = async (formData: RegisterFormData) => {
    setError('');

    console.log('Submitting form data:', formData);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Response:', response.status, data);

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/seller/${data.slug}`);
      }, 2000);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof RegisterFormData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ['email', 'password', 'confirmPassword', 'countryCode', 'phone'];
        break;
      case 2:
        fieldsToValidate = [
          'companyName',
          'businessType',
          'description',
          'website',
          'establishedYear',
        ];
        break;
      case 3:
        fieldsToValidate = ['address', 'city', 'state', 'country', 'pincode'];
        break;
      case 4:
        fieldsToValidate = [
          'certifications',
          'offersOEM',
          'contactPersonName',
          'contactPersonDesignation',
        ];
        break;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = async () => {
    // Validate all fields before submission
    const allFields: (keyof RegisterFormData)[] = [
      'email',
      'password',
      'confirmPassword',
      'countryCode',
      'phone',
      'companyName',
      'businessType',
      'description',
      'website',
      'establishedYear',
      'address',
      'city',
      'state',
      'country',
      'pincode',
      'certifications',
      'offersOEM',
      'contactPersonName',
      'contactPersonDesignation',
    ];

    const isValid = await trigger(allFields);
    if (isValid) {
      // Manually call submit with form data
      const formData = getValues();
      await onSubmit(formData);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-secondary mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Registration Successful!</h2>
        <p className="text-slate-700 mb-4">
          Your profile has been created. Our team will review and verify your account shortly.
        </p>
        <p className="text-sm text-slate-600">Redirecting to your profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ErrorMessage message={error} />

      {/* Progress Steps Indicator */}
      <div className="mb-8">
        <div className="relative flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 font-semibold transition-colors bg-white ${
                  currentStep >= step.id
                    ? 'border-secondary text-secondary'
                    : 'border-slate-300 text-slate-400'
                }`}
              >
                {currentStep >= step.id ? (
                  <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center text-white">
                    {step.id}
                  </div>
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`hidden md:block text-xs mt-2 font-medium text-center whitespace-nowrap ${
                  currentStep >= step.id ? 'text-secondary' : 'text-slate-500'
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}

          {/* Connecting Lines */}
          <div
            className="absolute left-0 right-0 top-4 md:top-5 flex items-center -z-0"
            style={{ paddingLeft: '16px', paddingRight: '16px' }}
          >
            <div className="flex-1 flex items-center justify-between">
              {[1, 2, 3].map((lineIndex) => (
                <div
                  key={lineIndex}
                  className={`h-0.5 transition-colors ${
                    currentStep > lineIndex ? 'bg-secondary' : 'bg-slate-200'
                  }`}
                  style={{ width: 'calc((100% - 0px) / 3)' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Account & Contact */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Account & Contact Information
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Create your login credentials and provide contact details
              </p>
            </div>

            <div>
              <Label htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="company@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              <p className="text-xs text-slate-600 mt-1">You'll use this email to sign in</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="phone">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <select
                  {...register('countryCode')}
                  className="flex h-10 w-28 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                >
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+966">🇸🇦 +966</option>
                  <option value="+65">🇸🇬 +65</option>
                  <option value="+86">🇨🇳 +86</option>
                  <option value="+81">🇯🇵 +81</option>
                  <option value="+82">🇰🇷 +82</option>
                  <option value="+61">🇦🇺 +61</option>
                </select>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  placeholder="1234567890"
                  className="flex-1"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>
          </div>
        )}

        {/* Step 2: Company Details */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Company Details</h3>
              <p className="text-sm text-slate-600 mt-1">Tell us about your business</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="companyName"
                  {...register('companyName')}
                  placeholder="Your Company Name"
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="businessType">
                  Business Type <span className="text-red-500">*</span>
                </Label>
                <select
                  id="businessType"
                  {...register('businessType')}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                >
                  <option value="manufacturer">Manufacturer</option>
                  <option value="merchant-exporter">Merchant Exporter</option>
                </select>
                {errors.businessType && (
                  <p className="text-red-500 text-sm mt-1">{errors.businessType.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">
                Company Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                {...register('description')}
                rows={4}
                placeholder="Brief description of your company, products, and services..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  type="url"
                  {...register('website')}
                  placeholder="https://www.yourcompany.com"
                />
                {errors.website && (
                  <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="establishedYear">Year Established (Optional)</Label>
                <Input
                  id="establishedYear"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  {...register('establishedYear')}
                  placeholder="2010"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Address Details */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Address Details</h3>
              <p className="text-sm text-slate-600 mt-1">Where is your business located?</p>
            </div>

            <div>
              <Label htmlFor="address">
                Street Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                {...register('address')}
                placeholder="Building name, Street name"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">
                  City <span className="text-red-500">*</span>
                </Label>
                <Input id="city" {...register('city')} placeholder="Kochi" />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
              </div>

              <div>
                <Label htmlFor="state">
                  State <span className="text-red-500">*</span>
                </Label>
                <Input id="state" {...register('state')} placeholder="Kerala" />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="pincode">
                  Pincode <span className="text-red-500">*</span>
                </Label>
                <Input id="pincode" {...register('pincode')} placeholder="682001" />
                {errors.pincode && (
                  <p className="text-red-500 text-sm mt-1">{errors.pincode.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="country">
                Country <span className="text-red-500">*</span>
              </Label>
              <Input id="country" {...register('country')} placeholder="India" />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Additional Information */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>
              <p className="text-sm text-slate-600 mt-1">
                Help buyers know more about your capabilities
              </p>
            </div>

            <div>
              <Label htmlFor="certifications">Certifications (Optional)</Label>
              <Input
                id="certifications"
                {...register('certifications')}
                placeholder="ISO 9001, CE, etc. (comma separated)"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="offersOEM"
                {...register('offersOEM')}
                className="w-4 h-4 rounded border-slate-300 text-secondary focus:ring-secondary"
              />
              <Label htmlFor="offersOEM" className="cursor-pointer">
                We offer OEM/Private Label services
              </Label>
            </div>

            <div className="border-t border-slate-200 pt-4 mt-4">
              <h4 className="font-medium text-foreground mb-4">Contact Person Details</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPersonName">
                    Contact Person Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactPersonName"
                    {...register('contactPersonName')}
                    placeholder="John Doe"
                  />
                  {errors.contactPersonName && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactPersonName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contactPersonDesignation">
                    Designation <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="contactPersonDesignation"
                    {...register('contactPersonDesignation')}
                    placeholder="Export Manager"
                  />
                  {errors.contactPersonDesignation && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contactPersonDesignation.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          {currentStep > 1 ? (
            <Button type="button" variant="outline" onClick={prevStep}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          ) : (
            <div></div>
          )}

          {currentStep < STEPS.length ? (
            <Button type="button" onClick={nextStep}>
              Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button type="button" onClick={handleFinalSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Complete Registration'
              )}
            </Button>
          )}
        </div>

        {currentStep === STEPS.length && (
          <p className="text-xs text-slate-600 text-center mt-4">
            By registering, you agree to our Terms of Service and Privacy Policy. Your information
            will be reviewed by our team for verification.
          </p>
        )}
      </form>
    </div>
  );
}
