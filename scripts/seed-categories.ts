import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function seedCategories() {
  console.log('Seeding categories and subcategories...');

  try {
    // --- 1. Fruits & Vegetables ---
    await prisma.category.upsert({
      where: { slug: 'fruits-vegetables' },
      update: {},
      create: {
        name: 'Fruits & Vegetables',
        slug: 'fruits-vegetables',
        children: {
          create: [
            { name: 'Fresh Fruits', slug: 'fresh-fruits' },
            { name: 'Fresh Vegetables', slug: 'fresh-vegetables' },
            { name: 'Frozen Fruits', slug: 'frozen-fruits' },
            { name: 'Frozen Vegetables', slug: 'frozen-vegetables' },
            { name: 'Dehydrated Fruits & Veg', slug: 'dehydrated-fruits-veg' },
          ],
        },
      },
    });
    console.log('✓ Fruits & Vegetables');

    // --- 2. Spices & Masala ---
    await prisma.category.upsert({
      where: { slug: 'spices-masala' },
      update: {},
      create: {
        name: 'Spices & Masala',
        slug: 'spices-masala',
        children: {
          create: [
            { name: 'Whole Spices', slug: 'whole-spices' },
            { name: 'Spice Powder', slug: 'spice-powder' },
            { name: 'Blended Masala', slug: 'blended-masala' },
            { name: 'Organic Spices', slug: 'organic-spices' },
            { name: 'Spice Oils & Extracts', slug: 'spice-oils-extracts' },
          ],
        },
      },
    });
    console.log('✓ Spices & Masala');

    // --- 3. Ready to Eat Snacks ---
    await prisma.category.upsert({
      where: { slug: 'ready-to-eat-snacks' },
      update: {},
      create: {
        name: 'Ready to Eat Snacks',
        slug: 'ready-to-eat-snacks',
        children: {
          create: [
            { name: 'Chips & Crisps', slug: 'chips-crisps' },
            { name: 'Traditional Snacks', slug: 'traditional-snacks' },
            { name: 'Bakery Snacks', slug: 'bakery-snacks' },
            { name: 'Ready-to-Eat Meals', slug: 'ready-to-eat-meals' },
            { name: 'Instant Mix Products', slug: 'instant-mix-products' },
          ],
        },
      },
    });
    console.log('✓ Ready to Eat Snacks');

    // --- 4. Rice, Grains & Pulses ---
    await prisma.category.upsert({
      where: { slug: 'rice-grains-pulses' },
      update: {},
      create: {
        name: 'Rice, Grains & Pulses',
        slug: 'rice-grains-pulses',
        children: {
          create: [
            { name: 'Basmati Rice', slug: 'basmati-rice' },
            { name: 'Non-Basmati Rice', slug: 'non-basmati-rice' },
            { name: 'Millets', slug: 'millets' },
            { name: 'Lentils & Pulses', slug: 'lentils-pulses' },
            { name: 'Flour Products', slug: 'flour-products' },
          ],
        },
      },
    });
    console.log('✓ Rice, Grains & Pulses');

    // --- 5. Pickles, Sauces & Condiments ---
    await prisma.category.upsert({
      where: { slug: 'pickles-sauces-condiments' },
      update: {},
      create: {
        name: 'Pickles, Sauces & Condiments',
        slug: 'pickles-sauces-condiments',
        children: {
          create: [
            { name: 'Pickles', slug: 'pickles' },
            { name: 'Sauces', slug: 'sauces' },
            { name: 'Chutneys', slug: 'chutneys' },
            { name: 'Curry Pastes', slug: 'curry-pastes' },
          ],
        },
      },
    });
    console.log('✓ Pickles, Sauces & Condiments');

    // --- 6. Coconut Products ---
    await prisma.category.upsert({
      where: { slug: 'coconut-products' },
      update: {},
      create: {
        name: 'Coconut Products',
        slug: 'coconut-products',
        children: {
          create: [
            { name: 'Coconut Oil', slug: 'coconut-oil' },
            { name: 'Desiccated Coconut', slug: 'desiccated-coconut' },
            { name: 'Coconut Milk', slug: 'coconut-milk' },
            { name: 'Coconut Powder', slug: 'coconut-powder' },
          ],
        },
      },
    });
    console.log('✓ Coconut Products');

    // --- 7. Natural & Organic Products ---
    await prisma.category.upsert({
      where: { slug: 'natural-organic-products' },
      update: {},
      create: {
        name: 'Natural & Organic Products',
        slug: 'natural-organic-products',
        children: {
          create: [
            { name: 'Honey', slug: 'honey' },
            { name: 'Herbal Products', slug: 'herbal-products' },
            { name: 'Organic Food Products', slug: 'organic-food-products' },
            { name: 'Natural Sweeteners', slug: 'natural-sweeteners' },
          ],
        },
      },
    });
    console.log('✓ Natural & Organic Products');

    // --- 8. Chemicals & Allied ---
    await prisma.category.upsert({
      where: { slug: 'chemicals-allied' },
      update: {},
      create: {
        name: 'Chemicals & Allied',
        slug: 'chemicals-allied',
        children: {
          create: [
            { name: 'Industrial Chemicals', slug: 'industrial-chemicals' },
            { name: 'Cleaning Chemicals', slug: 'cleaning-chemicals' },
            { name: 'Agricultural Chemicals', slug: 'agricultural-chemicals' },
            { name: 'Cosmetic Chemicals', slug: 'cosmetic-chemicals' },
          ],
        },
      },
    });
    console.log('✓ Chemicals & Allied');

    // --- 9. Engineering & Industrial ---
    await prisma.category.upsert({
      where: { slug: 'engineering-industrial' },
      update: {},
      create: {
        name: 'Engineering & Industrial',
        slug: 'engineering-industrial',
        children: {
          create: [
            { name: 'Machinery', slug: 'machinery' },
            { name: 'Industrial Equipment', slug: 'industrial-equipment' },
            { name: 'Tools & Hardware', slug: 'tools-hardware' },
            { name: 'Spare Parts', slug: 'spare-parts' },
          ],
        },
      },
    });
    console.log('✓ Engineering & Industrial');

    // --- 10. Handicrafts & Home Decor ---
    await prisma.category.upsert({
      where: { slug: 'handicrafts-home-decor' },
      update: {},
      create: {
        name: 'Handicrafts & Home Decor',
        slug: 'handicrafts-home-decor',
        children: {
          create: [
            { name: 'Wooden Handicrafts', slug: 'wooden-handicrafts' },
            { name: 'Metal Crafts', slug: 'metal-crafts' },
            { name: 'Home Decor Items', slug: 'home-decor-items' },
            { name: 'Gift Articles', slug: 'gift-articles' },
          ],
        },
      },
    });
    console.log('✓ Handicrafts & Home Decor');

    // --- 11. Leather & Footwear ---
    await prisma.category.upsert({
      where: { slug: 'leather-footwear' },
      update: {},
      create: {
        name: 'Leather & Footwear',
        slug: 'leather-footwear',
        children: {
          create: [
            { name: 'Leather Products', slug: 'leather-products' },
            { name: 'Leather Bags', slug: 'leather-bags' },
            { name: 'Shoes & Sandals', slug: 'shoes-sandals' },
            { name: 'Leather Accessories', slug: 'leather-accessories' },
          ],
        },
      },
    });
    console.log('✓ Leather & Footwear');

    // --- 12. Textiles & Apparel ---
    await prisma.category.upsert({
      where: { slug: 'textiles-apparel' },
      update: {},
      create: {
        name: 'Textiles & Apparel',
        slug: 'textiles-apparel',
        children: {
          create: [
            { name: 'Garments', slug: 'garments' },
            { name: 'Fabric & Textiles', slug: 'fabric-textiles' },
            { name: 'Handloom Products', slug: 'handloom-products' },
            { name: 'Uniforms & Workwear', slug: 'uniforms-workwear' },
          ],
        },
      },
    });
    console.log('✓ Textiles & Apparel');

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
