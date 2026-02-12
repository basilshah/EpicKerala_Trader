# 4-User Type System - Quick Reference

## 🎯 User Types Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    EPICKERALA USER TYPES                     │
└─────────────────────────────────────────────────────────────┘

1. EXPORTERS (Sellers)
   ├─ Full company registration required
   ├─ List and sell products
   ├─ Receive RFQs from importers
   ├─ Full viewing access
   └─ Cannot submit RFQs

2. IMPORTERS (Buyers) - 3 Tiers:

   ┌─ GUEST (Not signed in)
   │  ├─ Browse product listings ✅
   │  ├─ View product details ❌
   │  ├─ View seller details ❌
   │  └─ Submit RFQs ❌
   │
   ┌─ FREE (Free account)
   │  ├─ Browse product listings ✅
   │  ├─ View product details ✅
   │  ├─ View seller details ✅
   │  └─ Submit RFQs ✅
   │
   └─ PREMIUM (Paid subscription)
      ├─ All FREE features ✅
      ├─ Priority support (future)
      ├─ Advanced analytics (future)
      └─ Additional benefits (future)
```

## 📊 Access Matrix

| Feature              | Guest | Free Importer | Premium Importer | Exporter |
| -------------------- | ----- | ------------- | ---------------- | -------- |
| Browse listings      | ✅    | ✅            | ✅               | ✅       |
| View product details | ❌    | ✅            | ✅               | ✅       |
| View seller details  | ❌    | ✅            | ✅               | ✅       |
| Submit RFQs          | ❌    | ✅            | ✅               | ❌       |
| List products        | ❌    | ❌            | ❌               | ✅       |
| Receive RFQs         | ❌    | ❌            | ❌               | ✅       |
| Premium features     | ❌    | ❌            | ✅               | N/A      |

## 🔗 Registration URLs

**Importers/Buyers:** `/register/importer`

- Quick registration (name, email, password)
- Optional company details
- Auto-sign in after registration
- Default tier: FREE

**Exporters/Sellers:** `/register`

- Full company registration
- Admin verification required
- Detailed business information
- Product listing capabilities

## 🗄️ Database Models

### Importer Model

```prisma
model Importer {
  id               String   @id @default(cuid())
  name             String
  email            String   @unique
  password         String
  subscriptionTier String   @default("FREE")  // FREE | PREMIUM
  companyName      String?
  country          String?
  phone            String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  rfqs             RFQ[]
}
```

### Seller Model (Exporter)

```prisma
model Seller {
  id              String   @id @default(cuid())
  companyName     String
  email           String   @unique
  password        String
  // ... full company details
  // NO subscriptionTier field
  products        Product[]
}
```

## 🔐 Authentication Flow

```
User enters email + password
         ↓
Check Importer table
         ↓
    Found? ──Yes──→ Login as IMPORTER
         ↓                (with tier: FREE/PREMIUM)
        No
         ↓
Check Seller table
         ↓
    Found? ──Yes──→ Login as EXPORTER
         ↓                (no tier)
        No
         ↓
    Login failed
```

## 🎨 UI Components

### Sign-In Prompt

Shown to guests trying to access protected content:

- Product detail pages
- Seller detail pages
- RFQ submission

### Registration Links

- From sign-in prompt → `/register/importer`
- From exporter registration → Link to `/register/importer`
- From importer registration → Link to `/register`

## 🚀 Quick Commands

```bash
# Run database migration
npx prisma migrate dev --name add_importer_model

# View database in Prisma Studio
npx prisma studio

# Generate Prisma Client
npx prisma generate

# Upgrade importer to PREMIUM (via Prisma Studio or SQL)
UPDATE "Importer"
SET "subscriptionTier" = 'PREMIUM'
WHERE "email" = 'user@example.com';
```

## 📝 Key Files Modified

- `prisma/schema.prisma` - Added Importer model
- `lib/auth.ts` - Dual user type authentication
- `lib/access-control.ts` - Permission functions
- `types/next-auth.d.ts` - TypeScript definitions
- `components/SignInPrompt.tsx` - Guest blocking
- `app/register/importer/page.tsx` - Importer registration
- `app/api/register/importer/route.ts` - Importer API
- `app/product/[slug]/page.tsx` - Protected product page
- `app/seller/[slug]/page.tsx` - Protected seller page

## 💡 Usage Examples

### Check User Type

```typescript
const userType = getUserType(session);
// Returns: 'GUEST' | 'IMPORTER' | 'EXPORTER'
```

### Check Importer Tier

```typescript
const tier = getImporterTier(session);
// Returns: 'GUEST' | 'FREE' | 'PREMIUM'
```

### Check Permissions

```typescript
const canView = canViewProductDetails(session);
const canSubmit = canSubmitRFQ(session);
```
