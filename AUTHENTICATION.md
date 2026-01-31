# Epic Kerala - Exporter Authentication & Dashboard

## Authentication System

This application uses **NextAuth.js v5** for authentication with credentials-based login.

### Features Implemented

✅ **Sign In Page** (`/signin`)
- Email and password login
- Form validation with Zod
- Error handling with user feedback
- Automatic redirect to dashboard after login

✅ **Registration** (`/register`)
- Multi-step registration form (4 steps)
- Email + password authentication
- Password hashing with bcryptjs
- Unique email validation

✅ **Exporter Dashboard** (`/dashboard`)
- Protected route (requires authentication)
- Overview stats (total products, active listings, etc.)
- Quick actions (Add Product, Edit Profile, View Public Profile)
- Recent products list

✅ **Profile Management** (`/dashboard/profile`)
- Edit company information
- Update contact details
- Manage certifications and OEM offerings
- Real-time validation

✅ **Product Management**
- List all products (`/dashboard/products`)
- Add new products (`/dashboard/products/add`)
- Category selection
- HS Code, MOQ, shelf life fields
- Public/draft status toggle

## Routes

### Public Routes
- `/` - Home page
- `/signin` - Sign in page
- `/register` - Registration page
- `/products` - Browse products
- `/sellers` - Browse exporters
- `/categories` - Browse categories

### Protected Routes (Authentication Required)
- `/dashboard` - Exporter dashboard
- `/dashboard/profile` - Profile management
- `/dashboard/products` - Product list
- `/dashboard/products/add` - Add new product

## API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth API routes
- `POST /api/register` - New exporter registration

### Protected APIs (Require Authentication)
- `PUT /api/profile` - Update exporter profile
- `POST /api/products` - Create new product

## Testing the Authentication

### Test Account
Use the seeded data to test:
- **Email:** test@example.com
- **Password:** password123

### Registration Flow
1. Go to `/register`
2. Fill out all 4 steps:
   - Step 1: Account & Contact Info
   - Step 2: Company Details
   - Step 3: Address
   - Step 4: Additional Information
3. Click "Complete Registration"
4. Automatically redirected to sign-in page

### Sign In Flow
1. Go to `/signin`
2. Enter email and password
3. Click "Sign In"
4. Redirected to `/dashboard`

## Technology Stack

- **Framework:** Next.js 16.1.6 (App Router)
- **Authentication:** NextAuth.js v5
- **Database:** Prisma ORM with SQLite
- **Forms:** React Hook Form + Zod validation
- **Password:** bcryptjs for hashing
- **UI:** Tailwind CSS + Custom components

## Session Management

- **Strategy:** JWT-based sessions
- **Storage:** Secure HTTP-only cookies
- **Duration:** Sessions persist until browser is closed
- **Logout:** Available in dashboard navigation

## Security Features

✅ Password hashing with bcrypt (10 rounds)
✅ Protected routes with middleware
✅ Email uniqueness validation
✅ Server-side authentication checks
✅ CSRF protection (built into NextAuth)
✅ HTTP-only cookie sessions

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run database migrations
npx prisma migrate dev

# Seed database with test data
npx prisma db seed
```

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

Generate a secret:
```bash
openssl rand -base64 32
```

## Next Steps

- [ ] Add forgot password functionality
- [ ] Email verification
- [ ] OAuth providers (Google, LinkedIn)
- [ ] Role-based access control
- [ ] Product image uploads
- [ ] Dashboard analytics
- [ ] Export/import data features
