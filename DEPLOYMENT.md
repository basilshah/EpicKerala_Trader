# Deployment Guide for Vercel

## Prerequisites
- ✅ GitHub account
- ✅ Vercel account
- ✅ All code committed to GitHub

## Step-by-Step Deployment

### 1. Prepare Database

#### Option A: Vercel Postgres (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** → **Create Database** → **Postgres**
3. Copy the `DATABASE_URL` connection string

#### Option B: Neon (Free Tier)
1. Visit [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

### 2. Push to GitHub
```bash
git add .
git commit -m "Ready for production"
git push origin main
```

### 3. Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `prisma generate && prisma migrate deploy && next build`
   - **Output Directory:** .next

### 4. Add Environment Variables in Vercel

Go to **Settings** → **Environment Variables** and add:

```env
# Database
DATABASE_URL=your_production_database_url_here

# NextAuth
NEXTAUTH_SECRET=CsjBSpHcwPrAjAnd5mYmCZseW/jiUGkC8SInDqUwr1I=
NEXTAUTH_URL=https://your-app-name.vercel.app

# Environment
NODE_ENV=production
```

### 5. Deploy
Click **Deploy** button in Vercel

### 6. Run Database Migration

After first deployment, run migrations:

**Using Vercel CLI:**
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# The build command already includes: prisma migrate deploy
# But if you need to run manually:
vercel env pull .env.production
DATABASE_URL=<your-production-url> npx prisma migrate deploy
```

**Or manually:**
```bash
# In your local terminal
DATABASE_URL="your_production_database_url" npx prisma migrate deploy
```

### 7. Seed Production Data (Optional)
```bash
DATABASE_URL="your_production_database_url" npx prisma db seed
```

### 8. Verify Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Test key features:
   - ✅ Homepage loads
   - ✅ Products page shows data
   - ✅ Categories load
   - ✅ Sign in works
   - ✅ Registration works

### 9. Configure Custom Domain (Optional)

1. In Vercel Dashboard → **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` environment variable to your custom domain

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify `postinstall` script runs `prisma generate`

### Database Connection Issues
- Verify `DATABASE_URL` is correctly set in Vercel
- Check database allows connections from Vercel IPs
- Ensure connection string includes `?sslmode=require` for production

### NextAuth Issues
- Verify `NEXTAUTH_URL` matches your deployed domain
- Check `NEXTAUTH_SECRET` is set
- Clear browser cookies and try again

### Static Files Not Loading
- Ensure public folder is included in deployment
- Check file paths are correct
- Verify uploads are stored in persistent storage (consider Vercel Blob or S3)

## Important Notes

⚠️ **File Uploads:** Vercel's free tier has serverless functions that are stateless. Uploaded files in `/public/uploads` won't persist across deployments. Consider:
- **Vercel Blob Storage** (recommended)
- **AWS S3**
- **Cloudinary**
- **UploadThing**

⚠️ **Environment Variables:** Never commit `.env.local` to GitHub. Always set them in Vercel Dashboard.

⚠️ **Database Migrations:** Always run migrations after schema changes:
```bash
npx prisma migrate deploy
```

## Continuous Deployment

Once set up, every push to your main branch will automatically deploy to Vercel.

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main
# Vercel automatically deploys
```

## Useful Commands

```bash
# View deployment logs
vercel logs

# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback

# Check environment variables
vercel env ls
```

## Production Checklist

Before going live:
- [ ] All environment variables set in Vercel
- [ ] Database migrated successfully
- [ ] Admin user created
- [ ] Test all authentication flows
- [ ] Verify file uploads work (or migrate to cloud storage)
- [ ] Set up custom domain
- [ ] Configure error monitoring (Sentry, LogRocket, etc.)
- [ ] Set up analytics (Vercel Analytics, Google Analytics)
- [ ] Test on mobile devices
- [ ] Check SEO meta tags
- [ ] Enable HTTPS (automatic with Vercel)
