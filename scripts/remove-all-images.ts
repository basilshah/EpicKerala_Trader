import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Removing all images from database...\n');

  try {
    // Remove all category images
    const categoriesUpdated = await prisma.category.updateMany({
      data: {
        imageUrl: null,
      },
    });
    console.log(`✓ Removed images from ${categoriesUpdated.count} categories`);

    // Remove all product images
    const productsUpdated = await prisma.product.updateMany({
      data: {
        images: null,
      },
    });
    console.log(`✓ Removed images from ${productsUpdated.count} products`);

    console.log('\n✅ All images removed successfully!');
  } catch (error) {
    console.error('Error removing images:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
