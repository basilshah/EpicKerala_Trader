import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // Get admin details from environment variables
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME;
    const role = process.env.ADMIN_ROLE;

    if (!email || !password || !name || !role) {
      console.error(
        'Missing required environment variables: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, ADMIN_ROLE'
      );
      process.exit(1);
    }

    console.log('Creating admin user...');
    console.log('Email:', email);

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log('❌ Admin user already exists with this email!');
      console.log('To reset password, delete the existing admin first or use a different email.');
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });

    console.log('✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Name:', name);
    console.log('Role:', role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANT: Change the default password after first login!');
    console.log('🔗 Login at: /admin/login');

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error creating admin:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

createAdmin();
