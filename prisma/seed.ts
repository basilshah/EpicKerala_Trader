import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // --- Create Admin User ---
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@epickeral.com' },
    update: {},
    create: {
      email: 'admin@epickeral.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    },
  });
  console.log('✓ Admin user created (email: admin@epickeral.com, password: admin123)');

  // --- 1. Agriculture & Food Products ---
  const catAgri = await prisma.category.upsert({
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

  // --- 2. Textiles, Apparel & Fabrics ---
  const catTextile = await prisma.category.upsert({
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

  // --- 3. Handicrafts & Decor ---
  const catCraft = await prisma.category.upsert({
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

  // --- 4. Chemicals & Allied Products ---
  const catChem = await prisma.category.upsert({
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

  // --- 5. Engineering & Industrial ---
  const catEng = await prisma.category.upsert({
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

  // --- 6. Leather & Footwear ---
  const catLeather = await prisma.category.upsert({
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

  // --- Create Dummy Sellers ---
  const seller1 = await prisma.seller.upsert({
    where: { slug: 'kerala-spices-ltd' },
    update: {},
    create: {
      companyName: 'Kerala Spices Ltd',
      slug: 'kerala-spices-ltd',
      password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', // password123
      type: 'Manufacturer',
      city: 'Cochin',
      state: 'Kerala',
      email: 'contact@keralaspices.com',
      isVerified: true,
      certifications: 'ISO 9001, Spices Board',
      offersOEM: true,
      description: 'Leading manufacturer of premium Kerala spices exporting worldwide since 1998.',
    },
  });

  const seller2 = await prisma.seller.upsert({
    where: { slug: 'fashion-trends-exports' },
    update: {},
    create: {
      companyName: 'Fashion Trends Exports',
      slug: 'fashion-trends-exports',
      password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', // password123
      type: 'Merchant Exporter',
      city: 'Tirur',
      state: 'Kerala',
      email: 'sales@fashiontrends.com',
      isVerified: true,
      offersOEM: false,
      description: 'Curators of fine cotton and linen garments for international markets.',
    },
  });

  // --- Create Dummy Products ---

  // Need to fetch a subcategory ID primarily
  const spiceSub = await prisma.category.findFirst({ where: { slug: 'spices-condiments' } });

  if (spiceSub) {
    await prisma.product.upsert({
      where: { slug: 'premium-black-pepper' },
      update: {},
      create: {
        name: 'Premium Malabar Black Pepper',
        slug: 'premium-black-pepper',
        sellerId: seller1.id,
        categoryId: spiceSub.id,
        hsCode: '090411',
        moq: '500 kg',
        shelfLife: '24 Months',
        description: 'High grade bold black pepper sourced directly from Wayanad plantations.',
      },
    });

    await prisma.product.upsert({
      where: { slug: 'organic-turmeric-powder' },
      update: {},
      create: {
        name: 'Organic Turmeric Powder',
        slug: 'organic-turmeric-powder',
        sellerId: seller1.id,
        categoryId: spiceSub.id,
        hsCode: '091030',
        moq: '200 kg',
        shelfLife: '12 Months',
        description: 'Rich curcumin content turmeric powder, steam sterilized.',
      },
    });
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
