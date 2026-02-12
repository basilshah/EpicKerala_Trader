# User Type Implementation Guide

## Overview

This document explains the 4-user-type system implemented in EpicKeral_v2:

### User Types

1. **EXPORTERS (Sellers)** - Companies who list and sell products
   - Register with full company details
   - Can list products for verification
   - Have full access to view all content
   - Cannot submit RFQs (they receive them)

2. **IMPORTERS (Buyers)** - Users who browse and purchase products

   **Three tiers of importers:**
   - **GUEST** (Not signed in)
     - Can browse product and seller listings
     - **Cannot** view product details
     - **Cannot** view seller/exporter details
     - **Cannot** submit RFQs
   - **FREE** (Signed in with free account)
     - Can view product details
     - Can view seller/exporter details
     - Can submit RFQs
     - Full access to the platform
   - **PREMIUM** (Paid subscription)
     - All FREE features
     - Can be extended with additional benefits like:
       - Priority RFQ responses
       - Advanced search filters
       - Export data
       - Analytics dashboard
       - Direct contact with sellers

## Changes Made

### 1. Database Schema (`prisma/schema.prisma`)

Added `Importer` model for buyers:

```prisma
model Importer {
  id              String   @id @default(cuid())
  name            String
  email           String   @unique
  password        String   // Hashed password

  // Subscription
  subscriptionTier String  @default("FREE") // FREE, PREMIUM

  // Company Info (optional)
  companyName     String?
  country         String?
  phone           String?

  // Meta
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  rfqs            RFQ[]
}
```

Updated RFQ model to link to importers:

```prisma
model RFQ {
  // ... existing fields
  importerId      String?
  importer        Importer? @relation(fields: [importerId], references: [id])
}
```

**Note:** Sellers (Exporters) do NOT have a `subscriptionTier` field - only Importers do.

### 2. Authentication (`lib/auth.ts`)

Updated NextAuth configuration to handle both user types:

- Checks for Importer first, then Seller
- Adds `userType` field ('IMPORTER' or 'EXPORTER')
- Includes `subscriptionTier` for importers
- Includes tier in JWT token and session

### 3. TypeScript Types (`types/next-auth.d.ts`)

Extended NextAuth types to include:

- `userType`: 'IMPORTER' | 'EXPORTER'
- `subscriptionTier`: 'FREE' | 'PREMIUM' (for importers)
- Added to `User`, `Session`, and `JWT` interfaces

### 4. Access Control Library (`lib/access-control.ts`)

Created utility functions to manage access permissions:

```typescript
// Get user type
getUserType(session): 'GUEST' | 'IMPORTER' | 'EXPORTER'

// Get importer tier (only for importers)
getImporterTier(session): 'GUEST' | 'FREE' | 'PREMIUM'

// Get permissions
getAccessControl(session): AccessControl

// Check specific permissions
canViewProductDetails(session): boolean
canViewSellerDetails(session): boolean
canSubmitRFQ(session): boolean

// Check user type
isImporter(session): boolean
isExporter(session): boolean
```

### 5. Registration Routes

Created two separate registration flows:

#### Exporter Registration

- **Page:** `app/register/page.tsx`
- **Component:** `components/RegisterForm.tsx`
- **API:** `app/api/register/route.ts`
- Full company registration with verification

#### Importer Registration

- **Page:** `app/register/importer/page.tsx`
- **Component:** `components/ImporterRegisterForm.tsx`
- **API:** `app/api/register/importer/route.ts`
- Simple registration with name, email, password
- Optional company details

### 6. Sign-In Prompt Component (`components/SignInPrompt.tsx`)

Created a reusable component for guests:

- Displays friendly message
- Sign-in button
- Registration button (links to importer registration)
- Includes return URL for redirect after login

### 6. Protected Pages

Updated the following pages to check authentication:

#### Product Details Page (`app/product/[slug]/page.tsx`)

- Checks if user can view product details
- Shows sign-in prompt if not authenticated
- Redirects back to product after sign-in

#### Seller Details Page (`app/seller/[slug]/page.tsx`)

- Checks if user can view seller details
- Shows sign-in prompt if not authenticated
- Redirects back to seller page after sign-in

## Setup Instructions

### 1. Database Migration

Run the following command to apply the schema changes:

```bash
npx prisma migrate dev --name add_importer_model
```

This will:

- Create the `Importer` table
- Add `importerId` to the `RFQ` table
- Update the database schema

### 2. Test the Implementation

1. **Test as Guest (not signed in)**:
   - Open incognito window or sign out
   - Try to access a product detail page
   - You should see the sign-in prompt
   - Same for seller details page

2. **Test as Importer (FREE tier)**:
   - Go to `/register/importer`
   - Create a new importer account
   - After registration, you'll be auto-signed in
   - You should be able to access all product and seller details
   - You can submit RFQs

3. **Test as Exporter**:
   - Go to `/register`
   - Create a new exporter account (full registration)
   - After approval, exporters can also view all content
   - Exporters receive RFQs but don't submit them

4. **Test Premium (future)**:
   - Update an importer to PREMIUM tier in database
   - Sign in with that account
   - Currently behaves like FREE, ready for enhancements

## User Registration Flows

### For Importers/Buyers

1. Visit `/register/importer`
2. Fill in basic details (name, email, password)
3. Optional: Add company name, country, phone
4. Submit and get auto-signed in
5. Default tier: **FREE** (full access)

### For Exporters/Sellers

1. Visit `/register`
2. Fill in complete company registration
3. Submit for admin verification
4. After approval, can list products
5. Have full viewing access to platform

## Upgrading to Premium (Future)

To upgrade an importer to PREMIUM tier:

**Via Database:**

```sql
UPDATE "Importer"
SET "subscriptionTier" = 'PREMIUM'
WHERE "email" = 'importer@example.com';
```

**Via Prisma Client:**

```typescript
await prisma.importer.update({
  where: { email: 'importer@example.com' },
  data: { subscriptionTier: 'PREMIUM' },
});
```

### Premium Features Ideas

1. **Priority Support**
   - Faster RFQ responses
   - Direct contact with sellers

2. **Advanced Analytics**
   - View RFQ history
   - Track response rates
   - Export data

3. **Enhanced Search**
   - Advanced filters
   - Saved searches
   - Email alerts for new products

4. **Bulk Operations**
   - Bulk RFQ submission
   - Bulk download catalogs
   - Batch product comparison

5. **API Access**
   - REST API for integrations
   - Webhook notifications

### Implementation Steps for Premium Features

1. Create a premium features page showing benefits
2. Add payment integration (Stripe, Razorpay, etc.)
3. Create upgrade flow in dashboard
4. Implement feature flags based on tier
5. Add subscription management page

## Code Examples

### Checking Access in Server Components

```typescript
import { auth } from '@/lib/auth';
import { canViewProductDetails, getUserType } from '@/lib/access-control';

export default async function MyPage() {
  const session = await auth();
  const hasAccess = canViewProductDetails(session);
  const userType = getUserType(session);

  if (!hasAccess) {
    return <SignInPrompt returnUrl="/my-page" />;
  }

  // Show different content based on user type
  if (userType === 'EXPORTER') {
    return <ExporterView />;
  }

  return <ImporterView />;
}
```

### Checking Access in Client Components

```typescript
'use client';
import { useSession } from 'next-auth/react';
import { getUserType, getImporterTier } from '@/lib/access-control';

export default function MyClientComponent() {
  const { data: session } = useSession();
  const userType = getUserType(session);
  const tier = getImporterTier(session);

  if (userType === 'GUEST') {
    return <div>Please sign in</div>;
  }

  if (userType === 'EXPORTER') {
    return <ExporterDashboard />;
  }

  if (tier === 'PREMIUM') {
    return <PremiumImporterDashboard />;
  }

  return <FreeImporterDashboard />;
}
```

### Conditional Features for Importers

```typescript
const userType = getUserType(session);
const tier = getImporterTier(session);

// Only importers can submit RFQs
if (userType === 'IMPORTER' && tier !== 'GUEST') {
  return <RFQForm />;
}

// Premium importers get extra features
if (tier === 'PREMIUM') {
  return <AdvancedSearchFilters />;
}
```

## API Routes Protection

To protect API routes, add authentication checks:

```typescript
import { auth } from '@/lib/auth';
import { canSubmitRFQ } from '@/lib/access-control';

export async function POST(request: Request) {
  const session = await auth();

  if (!canSubmitRFQ(session)) {
    return Response.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Process request
}
```

## Testing Checklist

- [ ] Database migration runs successfully
- [ ] Importer table created with subscriptionTier field
- [ ] RFQ table has importerId field
- [ ] Guest users see sign-in prompt on product details
- [ ] Guest users see sign-in prompt on seller details
- [ ] Importers (FREE) can register at `/register/importer`
- [ ] Importers can access product details after sign-in
- [ ] Importers can access seller details after sign-in
- [ ] Importers can submit RFQs
- [ ] Exporters can register at `/register`
- [ ] Exporters can view all content
- [ ] Exporters do NOT see RFQ submission forms
- [ ] Return URL works correctly after sign-in
- [ ] Session includes userType field ('IMPORTER' or 'EXPORTER')
- [ ] Session includes subscriptionTier for importers
- [ ] TypeScript types are correct
- [ ] Dual authentication works (importer vs exporter)

## User Flow Examples

### Importer Journey

1. Guest visits product listing page ✅ (Can view)
2. Guest clicks on product ❌ (Sign-in prompt)
3. Guest clicks "Create Account" → Goes to `/register/importer`
4. Fills quick registration form (name, email, password)
5. Auto-signed in as FREE importer
6. Can now view all product details
7. Can submit RFQs to exporters

### Exporter Journey

1. Company visits `/register`
2. Fills detailed company registration
3. Submits for verification
4. Admin approves account
5. Can add products for verification
6. Products appear on marketplace
7. Receives RFQs from importers

## Support

For questions or issues with the implementation, refer to:

- NextAuth.js documentation: https://next-auth.js.org
- Prisma documentation: https://www.prisma.io/docs
- Access control patterns: https://nextjs.org/docs/app/building-your-application/authentication
