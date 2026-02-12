import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function cleanupExtraCategories() {
  console.log('Removing extra categories from database...');

  try {
    const categoriesToRemove = [
      'coir-products',
      'marine-products',
      'rubber-products',
      'cashew-products',
    ];

    for (const slug of categoriesToRemove) {
      const category = await prisma.category.findUnique({
        where: { slug },
        include: { children: true },
      });

      if (category) {
        // First delete all subcategories
        if (category.children.length > 0) {
          await prisma.category.deleteMany({
            where: { parentId: category.id },
          });
          console.log(`  ✓ Deleted ${category.children.length} subcategories of ${category.name}`);
        }

        // Then delete the main category
        await prisma.category.delete({
          where: { slug },
        });
        console.log(`  ✓ Deleted category: ${category.name}`);
      }
    }

    console.log('');
    console.log('✅ Cleanup completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Count remaining categories
    const categoryCount = await prisma.category.count({ where: { parentId: null } });
    const subcategoryCount = await prisma.category.count({ where: { parentId: { not: null } } });

    console.log(`📊 Remaining Categories: ${categoryCount}`);
    console.log(`📊 Remaining Subcategories: ${subcategoryCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error during cleanup:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

cleanupExtraCategories();
