# Admin User Setup Guide

This guide explains how to create and manage admin users for the EPIC LAND platform.

## 📋 Table of Contents

- [Initial Setup](#initial-setup)
- [Create Admin User](#create-admin-user)
- [Reset Admin Password](#reset-admin-password)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Initial Setup

### Method 1: Using Seed Script (Recommended for Development)

The seed script creates sample data **including an admin user**:

```bash
npx prisma db seed
```

**Default Admin Credentials:**

- Email: `admin@epickeral.com`
- Password: `admin123`
- Login URL: `/admin/login`

⚠️ **Important:** Change the default password immediately after first login in production!

---

## 👤 Create Admin User

### Method 2: Standalone Admin Creation Script

If you don't want to seed all data, create just the admin user:

```bash
npx tsx scripts/create-admin.ts
```

**Default credentials created:**

- Email: `admin@epickerala.com`
- Password: `admin123`

### Customize Admin Details

Use environment variables to customize the admin user:

```bash
ADMIN_EMAIL="your@email.com" \
ADMIN_PASSWORD="YourSecurePassword123!" \
ADMIN_NAME="Your Name" \
ADMIN_ROLE="admin" \
npx tsx scripts/create-admin.ts
```

### Add to package.json scripts

Add these commands to your `package.json` for easier access:

```json
{
  "scripts": {
    "admin:create": "tsx scripts/create-admin.ts",
    "admin:reset": "tsx scripts/reset-admin-password.ts"
  }
}
```

Then use:

```bash
npm run admin:create
npm run admin:reset
```

---

## 🔑 Reset Admin Password

If you forget your admin password or need to reset it:

```bash
npx tsx scripts/reset-admin-password.ts
```

**With custom email:**

```bash
ADMIN_EMAIL="your@email.com" NEW_PASSWORD="NewPassword123!" npx tsx scripts/reset-admin-password.ts
```

---

## 🔐 Environment Variables

### For Creating Admin

| Variable         | Description                          | Default                |
| ---------------- | ------------------------------------ | ---------------------- |
| `ADMIN_EMAIL`    | Admin email address                  | `admin@epickerala.com` |
| `ADMIN_PASSWORD` | Admin password                       | `admin123`             |
| `ADMIN_NAME`     | Admin display name                   | `Admin User`           |
| `ADMIN_ROLE`     | Admin role (`admin` or `superadmin`) | `admin`                |

### For Resetting Password

| Variable       | Description             | Default                |
| -------------- | ----------------------- | ---------------------- |
| `ADMIN_EMAIL`  | Email of admin to reset | `admin@epickerala.com` |
| `NEW_PASSWORD` | New password to set     | `admin123`             |

---

## 🛠️ Troubleshooting

### "Admin user already exists"

If you get this error, the admin already exists. Options:

1. **Reset the password** instead:

   ```bash
   npx tsx scripts/reset-admin-password.ts
   ```

2. **Use a different email**:

   ```bash
   ADMIN_EMAIL="another@email.com" npx tsx scripts/create-admin.ts
   ```

3. **Delete existing admin** (be careful!):
   ```sql
   -- In your database
   DELETE FROM "Admin" WHERE email = 'admin@epickerala.com';
   ```

### "Admin user not found"

List all existing admins:

```bash
npx prisma studio
```

Navigate to the `Admin` table to see all admin users.

### Check Database Connection

Ensure your `DATABASE_URL` is set correctly:

```bash
npx prisma db pull
```

### Production Setup

For production, **always use strong passwords**:

```bash
# Example production setup
ADMIN_EMAIL="admin@yourdomain.com" \
ADMIN_PASSWORD="$(openssl rand -base64 32)" \
ADMIN_NAME="Production Admin" \
npx tsx scripts/create-admin.ts
```

---

## 🔒 Security Best Practices

1. **Never use default passwords in production**
2. **Use strong passwords** (min 12 characters, mixed case, numbers, symbols)
3. **Store passwords securely** (use password manager)
4. **Rotate passwords regularly**
5. **Use environment variables** for production credentials
6. **Enable 2FA** if implementing authentication features
7. **Limit admin access** to trusted personnel only
8. **Monitor admin activity** through application logs

---

## 📝 Admin Roles

### `admin`

- Verify/reject products
- Manage sellers
- View dashboard statistics
- Moderate content

### `superadmin` (Future Feature)

- All admin permissions
- Create/delete other admins
- System configuration
- Database management

---

## 🎯 Quick Reference

```bash
# Create admin with defaults
npx tsx scripts/create-admin.ts

# Create custom admin
ADMIN_EMAIL="me@example.com" ADMIN_PASSWORD="SecurePass123!" npx tsx scripts/create-admin.ts

# Reset password
npx tsx scripts/reset-admin-password.ts

# Reset specific admin
ADMIN_EMAIL="admin@example.com" NEW_PASSWORD="NewPass123!" npx tsx scripts/reset-admin-password.ts

# Seed database (includes admin)
npx prisma db seed

# Open database GUI
npx prisma studio
```

---

## 📧 Default Admin Credentials Reference

**Seed Script Creates:**

- Email: `admin@epickeral.com` _(note: typo in seed.ts)_
- Password: `admin123`

**Standalone Script Creates:**

- Email: `admin@epickerala.com`
- Password: `admin123`

⚠️ **Note:** There's a typo in the seed script (`epickeral` vs `epickerala`). Consider fixing this for consistency.

---

## 🔄 Production Deployment Checklist

- [ ] Database is migrated (`npx prisma migrate deploy`)
- [ ] Admin user created with **strong password**
- [ ] Default admin password changed
- [ ] Admin login URL tested: `/admin/login`
- [ ] Environment variables set correctly
- [ ] Database backups configured
- [ ] Admin access documented and secured

---

**Need help?** Check the main [DEPLOYMENT.md](./DEPLOYMENT.md) guide or contact support at contact@epickerala.com
