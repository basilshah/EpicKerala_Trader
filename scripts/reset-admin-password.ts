import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function resetAdminPassword() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@epickerala.com';
    const newPassword = process.env.NEW_PASSWORD || 'admin123';

    console.log('Resetting admin password...');
    console.log('Email:', email);

    // Check if admin exists
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      console.log('❌ Admin user not found with email:', email);
      console.log('Available admins:');
      const allAdmins = await prisma.admin.findMany({
        select: { email: true, name: true },
      });
      console.table(allAdmins);
      process.exit(1);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.admin.update({
      where: { email },
      data: { password: hashedPassword },
    });

    console.log('✅ Admin password reset successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', email);
    console.log('New Password:', newPassword);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔗 Login at: /admin/login');

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error resetting password:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

resetAdminPassword();
