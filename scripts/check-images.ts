import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking category images in database...\n');

  const categories = await prisma.category.findMany({
    select: {
      name: true,
      imageUrl: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  console.log('Categories with images:');
  categories.forEach((cat) => {
    if (cat.imageUrl) {
      console.log(`✓ ${cat.name}: ${cat.imageUrl}`);
    } else {
      console.log(`  ${cat.name}: [No Image]`);
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
