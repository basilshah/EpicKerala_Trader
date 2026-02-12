import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating exporter account with demo products...');

  // Get some categories to assign products to
  const categories = await prisma.category.findMany({
    where: {
      parentId: { not: null }, // Get subcategories
    },
    take: 3,
  });

  if (categories.length === 0) {
    console.error('No categories found. Please seed categories first.');
    process.exit(1);
  }

  // Check if exporter already exists
  const existingExporter = await prisma.seller.findUnique({
    where: { email: 'demo.exporter@epickerala.com' },
  });

  let exporter;
  if (existingExporter) {
    console.log('Exporter account already exists. Using existing account.');
    exporter = existingExporter;
  } else {
    // Create exporter account
    const hashedPassword = await bcrypt.hash('DemoExporter123', 10);
    exporter = await prisma.seller.create({
      data: {
        companyName: 'Kerala Global Exports',
        slug: 'kerala-global-exports',
        description:
          'Leading exporter of premium Kerala spices and agricultural products. We specialize in sourcing and exporting high-quality organic products from Kerala to markets worldwide.',
        type: 'Merchant Exporter',
        email: 'demo.exporter@epickerala.com',
        password: hashedPassword,
        phone: '+91 9876543210',
        website: 'https://keralaglobalexports.com',
        address: 'Export Trade Centre, MG Road',
        city: 'Kochi',
        state: 'Kerala',
        country: 'India',
        pincode: '682016',
        establishedYear: 2018,
        isVerified: true,
        offersOEM: true,
        contactPersonName: 'Rajesh Kumar',
        contactPersonDesignation: 'Export Manager',
        certifications: 'ISO 9001:2015, FSSAI, Organic Certification',
      },
    });
    console.log('✓ Created exporter account:', exporter.companyName);
  }

  // Create 3 products
  const products = [
    {
      name: 'Premium Kerala Black Pepper',
      slug: 'premium-kerala-black-pepper',
      description:
        'Premium quality black pepper from the Western Ghats of Kerala. Sun-dried and hand-picked for maximum flavor and aroma. Rich in piperine content with bold, spicy taste.',
      categoryId: categories[0].id,
      hsCode: '09041100',
      moq: '500 kg',
      origin: 'Kerala, India',
      shelfLife: '24 months',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1596040033229-a0b0c8c67e4e?w=500',
      ]),
      verificationStatus: 'APPROVED',
      verifiedAt: new Date(),
    },
    {
      name: 'Organic Cardamom Green',
      slug: 'organic-cardamom-green',
      description:
        'Certified organic green cardamom sourced from high-altitude plantations in Idukki district. Known for its intense aroma and superior quality. Perfect for both culinary and medicinal purposes.',
      categoryId: categories[1] ? categories[1].id : categories[0].id,
      hsCode: '09083100',
      moq: '100 kg',
      origin: 'Idukki, Kerala',
      shelfLife: '18 months',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1596040033229-a0b0c8c67e4e?w=500',
      ]),
      verificationStatus: 'APPROVED',
      verifiedAt: new Date(),
    },
    {
      name: 'Kerala Turmeric Powder',
      slug: 'kerala-turmeric-powder',
      description:
        'High curcumin content turmeric powder from Kerala farms. Naturally processed without any chemicals or artificial colors. Rich golden color and earthy aroma.',
      categoryId: categories[2] ? categories[2].id : categories[0].id,
      hsCode: '09103020',
      moq: '1000 kg',
      origin: 'Kerala, India',
      shelfLife: '12 months',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=500',
      ]),
      verificationStatus: 'APPROVED',
      verifiedAt: new Date(),
    },
  ];

  // Check existing products and create new ones
  let createdCount = 0;
  for (const productData of products) {
    const existing = await prisma.product.findUnique({
      where: { slug: productData.slug },
    });

    if (existing) {
      console.log(`- Product "${productData.name}" already exists. Skipping.`);
    } else {
      await prisma.product.create({
        data: {
          ...productData,
          sellerId: exporter.id,
        },
      });
      console.log(`✓ Created product: ${productData.name}`);
      createdCount++;
    }
  }

  console.log(`\n✅ Setup complete!`);
  console.log(`\nExporter Login Credentials:`);
  console.log(`Email: demo.exporter@epickerala.com`);
  console.log(`Password: DemoExporter123`);
  console.log(`\nCreated ${createdCount} new products.`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
