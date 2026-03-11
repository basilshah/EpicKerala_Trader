# Deployment Guide — Hostinger SSH

This guide covers:

1. [One-time server setup](#1-one-time-server-setup) — Node.js, PM2, Nginx, environment variables
2. [First manual deployment](#2-first-manual-deployment) — clone, build, migrate, start
3. [GitHub Actions CI/CD](#3-github-actions-cicd) — automatic deploy on every push to `main`
4. [Domain & SSL](#4-domain--ssl)
5. [Useful commands](#5-useful-commands)
6. [Troubleshooting](#6-troubleshooting)
7. [Production checklist](#7-production-checklist)

---

## 1. One-Time Server Setup

SSH into your Hostinger server:

```bash
ssh your_user@your_server_ip
```

### 1.1 Install Node.js (LTS)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # should print v20.x.x
npm -v
```

### 1.2 Install PM2 (process manager)

```bash
sudo npm install -g pm2
pm2 startup   # follow the printed command to enable PM2 on boot
```

### 1.3 Install Nginx (reverse proxy)

```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl enable nginx
```

### 1.4 Create the app directory

```bash
sudo mkdir -p /var/www/epickeral
sudo chown $USER:$USER /var/www/epickeral
```

### 1.5 Create the production environment file

```bash
nano /var/www/epickeral/.env.production
```

Paste and fill in every value:

```env
# ─── App ─────────────────────────────────────────────────────────────────────
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_strong_random_secret_here

# ─── Database ─────────────────────────────────────────────────────────────────
# Hostinger MySQL/MariaDB example:
DATABASE_URL="mysql://db_user:db_password@localhost:3306/db_name"
# Postgres example (Neon, Supabase, etc.):
# DATABASE_URL="postgresql://user:password@host:5432/db?sslmode=require"

# ─── Cloudflare R2 File Storage ───────────────────────────────────────────────
# Endpoint format: https://\<ACCOUNT_ID\>.r2.cloudflarestorage.com
R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_bucket_name
# Public domain serving R2 objects (Cloudflare R2 public URL or custom domain)
R2_PUBLIC_BASE_URL=https://cdn.yourdomain.com
# Optional — Cloudflare R2 always uses "auto"
# R2_REGION=auto

# ─── Admin Seeding (used only by npm run admin:create) ────────────────────────
# You can remove these after the admin account is created
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=ChooseAStrongPassword!
ADMIN_NAME=Admin
ADMIN_ROLE=admin
```

> ⚠️ **Never commit `.env.production` to Git.** This file lives only on the server.

---

## 2. First Manual Deployment

### 2.1 Clone the repository

```bash
cd /var/www/epickeral
git clone https://github.com/your-username/your-repo.git .
```

### 2.2 Create a symlink to the environment file

```bash
ln -sf /var/www/epickeral/.env.production /var/www/epickeral/.env
```

### 2.3 Install dependencies

```bash
npm ci --omit=dev
```

### 2.4 Generate Prisma client and run migrations

```bash
npx prisma generate
npx prisma migrate deploy
```

### 2.5 Build Next.js

```bash
npm run build
```

### 2.6 Start the app with PM2

```bash
pm2 start npm --name "epickeral" -- start
pm2 save
```

The app now listens on port `3000`. Nginx (configured next) will proxy traffic from port 80/443 to it.

### 2.7 Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/epickeral
```

Paste:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Increase upload limit to match your max file size (catalog PDFs are 10 MB)
    client_max_body_size 15M;

    location / {
        proxy_pass         http://localhost:3000\;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and reload Nginx:

```bash
sudo ln -sf /etc/nginx/sites-available/epickeral /etc/nginx/sites-enabled/
sudo nginx -t          # test config — must say "ok"
sudo systemctl reload nginx
```

### 2.8 Seed initial data

All commands below must be run from `/var/www/epickeral` on the server.

#### Step 1 — Create the admin account

The admin script reads credentials from environment variables so nothing is hardcoded.

```bash
cd /var/www/epickeral

ADMIN_EMAIL="admin@yourdomain.com" \
ADMIN_PASSWORD="ChooseAStrongPassword!" \
ADMIN_NAME="Admin" \
ADMIN_ROLE="admin" \
npm run admin:create
```

Then log in at `https://yourdomain.com/admin/login` and change the password immediately.

#### Step 2 — Seed categories

This creates all product categories (Spices, Fruits & Vegetables, Seafood, etc.) with their subcategories.

```bash
npm run seed:categories
```

You can upload category images afterwards from the admin panel at `/admin/categories`.

#### Step 3 — Create demo sellers / exporters (optional)

This creates one demo exporter account with a few sample products. Useful for testing before real sellers register.

```bash
npm run seed:exporter
```

Demo login:

- **Email:** `demo.exporter@epickerala.com`
- **Password:** `DemoExporter123`

> After testing, you can delete the demo account from the admin dashboard.

#### Step 4 — Add real sellers & products via Admin Panel

Once the above is done, everything else is managed through the UI:

| What to do                         | Where               |
| ---------------------------------- | ------------------- |
| Verify / reject registered sellers | `/admin/sellers`    |
| Add / edit categories              | `/admin/categories` |
| Verify products                    | `/admin/products`   |
| View dashboard stats               | `/admin/dashboard`  |

Sellers register themselves at `/register` and submit products from their dashboard at `/dashboard`. You approve them from the admin panel.

#### Step 5 — Clean up seed dummy data (if needed)

If you ran the demo seeder and want to remove all dummy records before going live:

```bash
npm run clean:images   # deletes all uploaded images from R2
npx tsx scripts/clean-seed-dummy-data.ts  # removes seed DB records
```

---

## 3. GitHub Actions CI/CD

Every push to the `main` branch automatically SSHes into the server, pulls the latest code, installs dependencies, runs migrations, rebuilds, and restarts PM2.

### 3.1 Add GitHub Secrets

In your GitHub repository go to **Settings → Secrets and variables → Actions → New repository secret** and add:

| Secret name       | Value                                                 |
| ----------------- | ----------------------------------------------------- |
| `SSH_HOST`        | Your server IP or hostname                            |
| `SSH_USER`        | SSH username (e.g. `root` or `u123456789`)            |
| `SSH_PRIVATE_KEY` | Full contents of your **private** SSH key (see below) |
| `SSH_PORT`        | SSH port — usually `22`                               |
| `APP_DIR`         | Absolute path on server, e.g. `/var/www/epickeral`    |

#### Generate an SSH key pair for CI/CD (run this once locally)

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/epickeral_deploy -N ""
```

- Copy `~/.ssh/epickeral_deploy` (private key) → paste as the `SSH_PRIVATE_KEY` GitHub secret
- Append `~/.ssh/epickeral_deploy.pub` (public key) to `~/.ssh/authorized_keys` on the server:

```bash
# On the server:
cat >> ~/.ssh/authorized_keys <<'EOF'
<paste the content of epickeral_deploy.pub here>
EOF
chmod 600 ~/.ssh/authorized_keys
```

### 3.2 Create the workflow file

```bash
mkdir -p .github/workflows
```

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  deploy:
    name: SSH Deploy
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: ${{ secrets.SSH_PORT }}
          script: |
            set -e
            cd ${{ secrets.APP_DIR }}

            echo "──── Pulling latest code ────"
            git pull origin main

            echo "──── Installing dependencies ────"
            npm ci --omit=dev

            echo "──── Generating Prisma client ────"
            npx prisma generate

            echo "──── Running database migrations ────"
            npx prisma migrate deploy

            echo "──── Building Next.js ────"
            npm run build

            echo "──── Restarting app ────"
            pm2 restart epickeral --update-env

            echo "──── Done ────"
```

Commit and push this file:

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions deploy workflow"
git push origin main
```

### 3.3 How it works

```
Push to main
     │
     ▼
GitHub Actions runner (ubuntu-latest)
     │
     │  SSH into Hostinger server
     ▼
git pull → npm ci → prisma generate
     → prisma migrate deploy → next build
     → pm2 restart epickeral
```

- PM2 keeps the old process alive until the restart completes.
- If any step fails, the deploy stops and the old version keeps running.
- Deployment logs are visible under the **Actions** tab in GitHub.

### 3.4 Test the pipeline

```bash
git commit --allow-empty -m "ci: trigger deploy test"
git push origin main
```

Open the **Actions** tab in GitHub and watch it run live.

---

## 4. Domain & SSL

### 4.1 Point your domain to the server

In your domain registrar / Hostinger DNS panel add an **A record**:

| Type | Name  | Value            |
| ---- | ----- | ---------------- |
| A    | `@`   | `your_server_ip` |
| A    | `www` | `your_server_ip` |

Wait for DNS to propagate (usually a few minutes with Cloudflare, up to 24 h otherwise).

### 4.2 Install SSL with Let's Encrypt (free, auto-renews)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Certbot edits your Nginx config to add HTTPS and schedules auto-renewal.

### 4.3 Update NEXTAUTH_URL

Edit `/var/www/epickeral/.env.production`:

```env
NEXTAUTH_URL=https://yourdomain.com
```

Restart the app to pick up the change:

```bash
pm2 restart epickeral --update-env
```

---

## 5. Useful Commands

```bash
# ─── PM2 ─────────────────────────────────────────────────────────────────────
pm2 list                           # show all processes and their status
pm2 logs epickeral                 # stream live logs
pm2 logs epickeral --lines 200     # last 200 log lines
pm2 restart epickeral --update-env # restart and reload .env
pm2 stop epickeral
pm2 delete epickeral

# ─── Nginx ───────────────────────────────────────────────────────────────────
sudo nginx -t                      # test config syntax
sudo systemctl reload nginx        # apply config changes without downtime
sudo tail -f /var/log/nginx/error.log

# ─── Database ────────────────────────────────────────────────────────────────
cd /var/www/epickeral
npx prisma migrate deploy          # apply pending migrations
npx prisma db seed                 # (re-)seed data
npx prisma studio                  # open web-based DB browser (dev only)

# ─── Emergency rollback ───────────────────────────────────────────────────────
cd /var/www/epickeral
git revert HEAD                    # creates a revert commit
npm run build
pm2 restart epickeral
```

---

## 6. Troubleshooting

### Build fails during deploy

- Check GitHub Actions logs in the **Actions** tab.
- SSH in manually and run `npm run build` to see the full error.
- Make sure the `.env` symlink points to `.env.production`: `ls -la /var/www/epickeral/.env`

### 502 Bad Gateway from Nginx

The Node process crashed or hasn't started yet.

```bash
pm2 list                  # check status
pm2 restart epickeral     # restart if stopped/errored
ss -tlnp | grep 3000      # confirm app is listening
```

### Database connection errors

- Double-check `DATABASE_URL` in `.env.production`.
- For Hostinger MySQL ensure the DB user has all privileges on the database.
- Test: `npx prisma db execute --stdin <<< "SELECT 1"`

### NextAuth redirect loop or "invalid URL"

- `NEXTAUTH_URL` must match the exact domain including `https://` and no trailing slash.
- Clear browser cookies and retry.
- Confirm `NEXTAUTH_SECRET` is set.

### R2 file uploads not working in production

- Verify all five `R2_*` env vars are present in `.env.production`.
- Confirm the R2 bucket has **Public Access** enabled or a custom domain/Worker is configured.
- Ensure `R2_PUBLIC_BASE_URL` has no trailing slash.

### GitHub Actions "Permission denied (publickey)"

- Verify the private key added as `SSH_PRIVATE_KEY` secret has no extra whitespace.
- Confirm the matching public key is in `~/.ssh/authorized_keys` on the server.
- Test manually: `ssh -i ~/.ssh/epickeral_deploy your_user@your_server_ip`

---

## 7. Production Checklist

Before going live:

- [ ] Node.js v20 + PM2 + Nginx installed on server
- [ ] `/var/www/epickeral/.env.production` filled in with all values
- [ ] `.env` symlink created (`ln -sf .env.production .env`)
- [ ] `prisma migrate deploy` completed without errors
- [ ] Admin account created (`npm run admin:create`)
- [ ] Categories seeded (`npm run seed:categories`)
- [ ] Admin can log in at `/admin/login`
- [ ] Test seller registration at `/register`
- [ ] Test all authentication flows (sign in, admin login)
- [x] File uploads use Cloudflare R2 (configured via `R2_*` env vars)
- [ ] Nginx config tested (`nginx -t`) and reloaded
- [ ] SSL certificate issued (Let's Encrypt via certbot)
- [ ] `NEXTAUTH_URL` updated to `https://yourdomain.com`
- [ ] PM2 startup hook enabled (`pm2 startup && pm2 save`)
- [ ] GitHub Secrets configured (`SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`, `SSH_PORT`, `APP_DIR`)
- [ ] `.github/workflows/deploy.yml` committed and pushed
- [ ] CI/CD pipeline successfully triggered by a test push
- [ ] Domain DNS A records pointing to server IP
- [ ] `client_max_body_size 15M` set in Nginx (for file uploads)
