# Database Setup and Troubleshooting Guide

## Handling Empty Database

If your database is empty and the application breaks, follow these steps:

### 1. Check Database Connection

```bash
# Test database connection
npx prisma db pull
```

### 2. Run Migrations

```bash
# Apply all migrations to create tables
npx prisma migrate deploy

# Or for development
npx prisma migrate dev
```

### 3. Seed Initial Data

```bash
# Run the seed script
npx prisma db seed
```

## Common Issues and Solutions

### Issue: "Table does not exist"

**Solution:**

```bash
# Reset database (WARNING: This deletes all data)
npx prisma migrate reset

# Then seed
npx prisma db seed
```

### Issue: "Connection refused" or "ECONNREFUSED"

**Solution:**

1. Check your `DATABASE_URL` in `.env` or `.env.local`
2. Ensure the database server is running
3. Verify network connectivity
4. Check database credentials

### Issue: Application breaks on empty database

**Solution:**
The application now has error handling for empty data. If you still see issues:

1. Check browser console for errors
2. Look at terminal for server errors
3. Run health check:

```bash
# Check if database is accessible
npx prisma db execute --stdin <<< "SELECT 1"
```

## Manual Database Seeding

If the seed script doesn't work, you can manually add data:

### 1. Open Prisma Studio

```bash
npx prisma studio
```

### 2. Add Initial Categories

Go to the Category model and add:

- Spices
- Handicrafts
- Textiles
- Coir Products

### 3. Create an Admin User

Use the register flow or manually add a seller in Prisma Studio.

## Environment Variables Checklist

Ensure these are set:

```env
# .env or .env.local
DATABASE_URL="your_database_url_here"
NEXTAUTH_SECRET="your_secret_here"
NEXTAUTH_URL="http://localhost:3001"
NODE_ENV="development"
```

## Production Database Setup

### For Vercel + Neon:

1. Create Neon database at [neon.tech](https://neon.tech)
2. Copy connection string
3. Add to Vercel environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your vercel domain)
   - `NODE_ENV=production`

4. Run migrations after deployment:

```bash
# Using Vercel CLI
vercel env pull .env.production
DATABASE_URL=<production-url> npx prisma migrate deploy
DATABASE_URL=<production-url> npx prisma db seed
```

### For Vercel + Supabase:

1. Create Supabase project
2. Get Connection String (Transaction mode)
3. Add to Vercel environment variables
4. Run migrations same as above

## Health Check Commands

```bash
# Check database schema
npx prisma db pull

# View current migrations
npx prisma migrate status

# Generate Prisma Client
npx prisma generate

# Open database browser
npx prisma studio

# View database URL being used
echo $DATABASE_URL
```

## Error Monitoring

The application now includes:

- ✅ Error boundaries for React errors
- ✅ Empty state handling for all queries
- ✅ Graceful fallbacks when data is missing
- ✅ Try-catch blocks on all database queries

## Development Workflow

```bash
# 1. Start fresh
npm install

# 2. Set up database
npx prisma migrate dev

# 3. Seed data
npx prisma db seed

# 4. Start development server
npm run dev
```

## Quick Reset (Development Only)

```bash
# WARNING: Deletes all data
npx prisma migrate reset --force
npx prisma db seed
npm run dev
```

## Need Help?

1. Check the error message in browser console
2. Check terminal for server errors
3. Review `app/error.tsx` component output
4. Check Prisma Studio for data: `npx prisma studio`
5. Verify DATABASE_URL is correct

## Database Providers

### Neon (Recommended for Production)

- Free tier: 0.5GB storage
- Serverless PostgreSQL
- Auto-scaling
- No credit card required
- [neon.tech](https://neon.tech)

### Supabase (Best for full solution)

- Free tier: 500MB database + 1GB storage
- Includes file storage (solves upload problem)
- Real-time features
- Dashboard UI
- [supabase.com](https://supabase.com)

### Prisma Data Platform

- Already have an account (based on your DATABASE_URL)
- Good for development
- [db.prisma.io](https://db.prisma.io)

### Vercel Postgres

- Integrated with Vercel
- Easy setup
- Pay-as-you-go
- [vercel.com/storage/postgres](https://vercel.com/storage/postgres)
