import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function seedCategories() {
  console.log('Seeding categories and subcategories...');

  try {
    // --- 1. Agriculture & Food Products ---
    await prisma.category.upsert({
      where: { slug: 'agriculture-food' },
      update: {},
      create: {
        name: 'Agriculture & Food Products',
        slug: 'agriculture-food',
        children: {
          create: [
            { name: 'Spices & Condiments', slug: 'spices-condiments' },
            { name: 'Cereals & Grains', slug: 'cereals-grains' },
            { name: 'Fresh Produce', slug: 'fresh-produce' },
            { name: 'Processed Foods', slug: 'processed-foods' },
            { name: 'Tea & Coffee', slug: 'tea-coffee' },
            { name: 'Oil Seeds & Nuts', slug: 'oil-seeds-nuts' },
          ],
        },
      },
    });
    console.log('✓ Agriculture & Food Products');

    // --- 2. Textiles, Apparel & Fabrics ---
    await prisma.category.upsert({
      where: { slug: 'textiles-apparel' },
      update: {},
      create: {
        name: 'Textiles, Apparel & Fabrics',
        slug: 'textiles-apparel',
        children: {
          create: [
            { name: 'Readymade Garments', slug: 'readymade-garments' },
            { name: 'Fabrics & Yarns', slug: 'fabrics-yarns' },
            { name: 'Home Textiles', slug: 'home-textiles' },
            { name: 'Natural Fibers', slug: 'natural-fibers' },
          ],
        },
      },
    });
    console.log('✓ Textiles, Apparel & Fabrics');

    // --- 3. Handicrafts & Decor ---
    await prisma.category.upsert({
      where: { slug: 'handicrafts-decor' },
      update: {},
      create: {
        name: 'Handicrafts & Decor',
        slug: 'handicrafts-decor',
        children: {
          create: [
            { name: 'Wooden Handicrafts', slug: 'wooden-handicrafts' },
            { name: 'Metal Artware', slug: 'metal-artware' },
            { name: 'Eco-Friendly / Sustainable', slug: 'eco-friendly-sustainable' },
            { name: 'Fashion Accessories', slug: 'fashion-accessories' },
          ],
        },
      },
    });
    console.log('✓ Handicrafts & Decor');

    // --- 4. Chemicals & Allied Products ---
    await prisma.category.upsert({
      where: { slug: 'chemicals-allied' },
      update: {},
      create: {
        name: 'Chemicals & Allied Products',
        slug: 'chemicals-allied',
        children: {
          create: [
            { name: 'Pharmaceuticals', slug: 'pharmaceuticals' },
            { name: 'Dyes & Pigments', slug: 'dyes-pigments' },
            { name: 'Agro-Chemicals', slug: 'agro-chemicals' },
            { name: 'Personal Care', slug: 'personal-care' },
          ],
        },
      },
    });
    console.log('✓ Chemicals & Allied Products');

    // --- 5. Engineering & Industrial ---
    await prisma.category.upsert({
      where: { slug: 'engineering-industrial' },
      update: {},
      create: {
        name: 'Engineering & Industrial',
        slug: 'engineering-industrial',
        children: {
          create: [
            { name: 'Machinery & Parts', slug: 'machinery-parts' },
            { name: 'Automotive Components', slug: 'automotive-components' },
            { name: 'Construction Materials', slug: 'construction-materials' },
            { name: 'Electricals', slug: 'electricals' },
          ],
        },
      },
    });
    console.log('✓ Engineering & Industrial');

    // --- 6. Leather & Footwear ---
    await prisma.category.upsert({
      where: { slug: 'leather-footwear' },
      update: {},
      create: {
        name: 'Leather & Footwear',
        slug: 'leather-footwear',
        children: {
          create: [
            { name: 'Leather Goods', slug: 'leather-goods' },
            { name: 'Footwear', slug: 'footwear' },
            { name: 'Finished Leather', slug: 'finished-leather' },
          ],
        },
      },
    });
    console.log('✓ Leather & Footwear');

    console.log('');
    console.log('✅ Categories seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Count and display results
    const categoryCount = await prisma.category.count({ where: { parentId: null } });
    const subcategoryCount = await prisma.category.count({ where: { parentId: { not: null } } });

    console.log(`📊 Total Categories: ${categoryCount}`);
    console.log(`📊 Total Subcategories: ${subcategoryCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error seeding categories:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

seedCategories();
