import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // --- Create Admin User ---
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@epickerala.com' },
    update: {},
    create: {
      email: 'admin@epickerala.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    },
  });
  console.log('✓ Admin user created (email: admin@epickerala.com, password: admin123)');

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

  // --- Create Demo Sellers with Full Details ---
  const sellerPassword = await bcrypt.hash('password123', 10);

  const seller1 = await prisma.seller.upsert({
    where: { slug: 'kerala-spices-ltd' },
    update: {},
    create: {
      companyName: 'Kerala Spices Ltd',
      slug: 'kerala-spices-ltd',
      password: sellerPassword,
      type: 'Manufacturer',
      city: 'Kochi',
      state: 'Kerala',
      country: 'India',
      email: 'contact@keralaspices.com',
      phone: '+91 484 2345678',
      website: 'https://keralaspices.com',
      address: 'Spice Park, MG Road',
      pincode: '682016',
      isVerified: true,
      certifications: 'ISO 9001:2015, HACCP, Spices Board India',
      establishedYear: 1998,
      offersOEM: true,
      contactPersonName: 'Rajesh Kumar',
      contactPersonDesignation: 'Export Manager',
      description:
        'Leading manufacturer and exporter of premium Kerala spices. We source directly from organic farms in Wayanad and Idukki districts. Trusted by international buyers for over 25 years.',
      profileVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
  });

  const seller2 = await prisma.seller.upsert({
    where: { slug: 'malabar-textiles' },
    update: {},
    create: {
      companyName: 'Malabar Textiles & Garments',
      slug: 'malabar-textiles',
      password: sellerPassword,
      type: 'Manufacturer',
      city: 'Kozhikode',
      state: 'Kerala',
      country: 'India',
      email: 'export@malabartextiles.com',
      phone: '+91 495 2765432',
      website: 'https://malabartextiles.com',
      address: 'Textile Industrial Estate, Beypore',
      pincode: '673015',
      isVerified: true,
      certifications: 'ISO 9001, OEKO-TEX Standard 100, GOTS',
      establishedYear: 2005,
      offersOEM: true,
      contactPersonName: 'Ayesha Beevi',
      contactPersonDesignation: 'Business Development Head',
      description:
        'Premium cotton and handloom textile manufacturer. Specializing in organic fabrics, traditional Kerala sarees, and custom garment manufacturing for international fashion brands.',
      profileVideoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    },
  });

  const seller3 = await prisma.seller.upsert({
    where: { slug: 'craftworks-kerala' },
    update: {},
    create: {
      companyName: 'CraftWorks Kerala',
      slug: 'craftworks-kerala',
      password: sellerPassword,
      type: 'Merchant Exporter',
      city: 'Trivandrum',
      state: 'Kerala',
      country: 'India',
      email: 'info@craftworkskerala.com',
      phone: '+91 471 2887766',
      website: 'https://craftworkskerala.com',
      address: 'Handicrafts Export Zone, Kazhakootam',
      pincode: '695582',
      isVerified: true,
      certifications: 'Export Excellence Award 2023, Handicrafts Mark',
      establishedYear: 2012,
      offersOEM: false,
      contactPersonName: 'Suresh Menon',
      contactPersonDesignation: 'Owner',
      description:
        'Authentic Kerala handicrafts and eco-friendly products. From traditional metal mirrors to handcrafted wooden artifacts, we preserve heritage while promoting sustainable practices.',
      profileVideoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
    },
  });

  const seller4 = await prisma.seller.upsert({
    where: { slug: 'ocean-marine-exports' },
    update: {},
    create: {
      companyName: 'Ocean Marine Exports',
      slug: 'ocean-marine-exports',
      password: sellerPassword,
      type: 'Manufacturer',
      city: 'Kollam',
      state: 'Kerala',
      country: 'India',
      email: 'sales@oceanmarine.in',
      phone: '+91 474 2769900',
      website: 'https://oceanmarine.in',
      address: 'Coastal Industrial Area, Neendakara',
      pincode: '691582',
      isVerified: true,
      certifications: 'FSSAI, EIA, ISO 22000',
      establishedYear: 2001,
      offersOEM: true,
      contactPersonName: 'James Sebastian',
      contactPersonDesignation: 'Managing Director',
      description:
        'Premier seafood processing and export company. Specializing in frozen fish, prawns, and value-added marine products with state-of-the-art cold chain facilities.',
      profileVideoUrl: 'https://www.youtube.com/watch?v=HIcSWuKMwOw',
    },
  });

  const seller5 = await prisma.seller.upsert({
    where: { slug: 'ayur-wellness-exports' },
    update: {},
    create: {
      companyName: 'Ayur Wellness Exports',
      slug: 'ayur-wellness-exports',
      password: sellerPassword,
      type: 'Manufacturer',
      city: 'Thrissur',
      state: 'Kerala',
      country: 'India',
      email: 'export@ayurwellness.com',
      phone: '+91 487 2339988',
      address: 'Ayurveda Industrial Park, Kunnamkulam',
      pincode: '680503',
      isVerified: true,
      certifications: 'GMP, Ayush License, ISO 9001, Organic India',
      establishedYear: 2010,
      offersOEM: true,
      contactPersonName: 'Dr. Priya Nair',
      contactPersonDesignation: 'Quality Control Head',
      description:
        'Authentic Ayurvedic products and herbal extracts. Manufacturing traditional Kerala Ayurveda formulations using organic herbs and modern extraction techniques.',
      profileVideoUrl: 'https://www.youtube.com/watch?v=Me-im0A8elM',
    },
  });

  console.log('✓ Created 5 demo sellers with full details');

  // --- Create Demo Products with Full Details ---

  const spiceSub = await prisma.category.findFirst({ where: { slug: 'whole-spices' } });
  const textileSub = await prisma.category.findFirst({ where: { slug: 'garments' } });
  const handicraftSub = await prisma.category.findFirst({ where: { slug: 'wooden-handicrafts' } });
  const organicFoodSub = await prisma.category.findFirst({
    where: { slug: 'organic-food-products' },
  });
  const fabricTextilesSub = await prisma.category.findFirst({ where: { slug: 'fabric-textiles' } });

  if (spiceSub) {
    await prisma.product.upsert({
      where: { slug: 'premium-malabar-black-pepper' },
      update: {},
      create: {
        name: 'Premium Malabar Black Pepper',
        slug: 'premium-malabar-black-pepper',
        sellerId: seller1.id,
        categoryId: spiceSub.id,
        hsCode: '090411',
        moq: '500 kg',
        origin: 'Wayanad, Kerala, India',
        shelfLife: '24 Months',
        verificationStatus: 'APPROVED',
        description:
          'Superior quality Malabar black pepper with bold size (4.75mm+). Known for high piperine content and strong aroma. Sourced from organic farms in Wayanad hills. Available in whole, crushed, and powder forms.',
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
        origin: 'Erode, Tamil Nadu, India',
        shelfLife: '18 Months',
        verificationStatus: 'APPROVED',
        description:
          'Premium Alleppey turmeric powder with 7-8% curcumin content. Steam sterilized and vacuum packed. Rich golden color, ideal for culinary and pharmaceutical applications. Certified organic by NPOP and USDA.',
      },
    });

    await prisma.product.upsert({
      where: { slug: 'green-cardamom-8mm' },
      update: {},
      create: {
        name: 'Green Cardamom 8mm Bold',
        slug: 'green-cardamom-8mm',
        sellerId: seller1.id,
        categoryId: spiceSub.id,
        hsCode: '090831',
        moq: '100 kg',
        origin: 'Idukki, Kerala, India',
        shelfLife: '12 Months',
        verificationStatus: 'APPROVED',
        description:
          'Premium grade green cardamom pods, 8mm size. Grown at 800-1500m altitude in Idukki hills. Strong aromatic profile with 6-8% volatile oil content. Perfect for tea blending and confectionery.',
      },
    });

    await prisma.product.upsert({
      where: { slug: 'kerala-red-chilli' },
      update: {},
      create: {
        name: 'Kerala Red Chilli - Kanthari',
        slug: 'kerala-red-chilli',
        sellerId: seller1.id,
        categoryId: spiceSub.id,
        hsCode: '090421',
        moq: '300 kg',
        origin: 'Kerala, India',
        shelfLife: '12 Months',
        verificationStatus: 'PENDING',
        description:
          'Fiery Kanthari variety red chilli, known for intense heat (50,000-100,000 SHU). Sun-dried to preserve natural color and pungency. Available whole and crushed.',
      },
    });
  }

  if (organicFoodSub) {
    await prisma.product.upsert({
      where: { slug: 'nilgiri-orthodox-tea' },
      update: {},
      create: {
        name: 'Nilgiri Orthodox Black Tea',
        slug: 'nilgiri-orthodox-tea',
        sellerId: seller1.id,
        categoryId: organicFoodSub.id,
        hsCode: '090240',
        moq: '250 kg',
        origin: 'Nilgiris, Tamil Nadu, India',
        shelfLife: '24 Months',
        verificationStatus: 'APPROVED',
        description:
          'Premium orthodox black tea from Nilgiri hills. Bright liquor with aromatic fragrance and brisk flavor. Perfect for blending. FTGFOP1 grade with golden tips.',
      },
    });
  }

  if (textileSub) {
    await prisma.product.upsert({
      where: { slug: 'organic-cotton-kurta' },
      update: {},
      create: {
        name: 'Organic Cotton Kurta - Mens',
        slug: 'organic-cotton-kurta',
        sellerId: seller2.id,
        categoryId: textileSub.id,
        hsCode: '620342',
        moq: '500 pieces',
        origin: 'Kozhikode, Kerala, India',
        shelfLife: 'N/A',
        verificationStatus: 'APPROVED',
        description:
          '100% organic cotton kurta in traditional Kerala style. Available in S to XXL sizes. GOTS certified fabric with natural dyes. Perfect for ethnic wear and casual office attire.',
      },
    });

    await prisma.product.upsert({
      where: { slug: 'handloom-cotton-saree' },
      update: {},
      create: {
        name: 'Kerala Handloom Cotton Saree',
        slug: 'handloom-cotton-saree',
        sellerId: seller2.id,
        categoryId: textileSub.id,
        hsCode: '520819',
        moq: '100 pieces',
        origin: 'Balaramapuram, Kerala, India',
        shelfLife: 'N/A',
        verificationStatus: 'APPROVED',
        description:
          'Traditional Kerala kasavu saree with golden zari border. Hand-woven by skilled artisans. Pure cotton fabric, perfect for festivals and special occasions. Comes with blouse piece.',
      },
    });
  }

  if (fabricTextilesSub) {
    await prisma.product.upsert({
      where: { slug: 'cotton-bed-sheets-set' },
      update: {},
      create: {
        name: 'Premium Cotton Bed Sheet Set',
        slug: 'cotton-bed-sheets-set',
        sellerId: seller2.id,
        categoryId: fabricTextilesSub.id,
        hsCode: '630221',
        moq: '200 sets',
        origin: 'Kerala, India',
        shelfLife: 'N/A',
        verificationStatus: 'APPROVED',
        description:
          '300 thread count cotton bed sheet set. Includes 1 fitted sheet, 1 flat sheet, and 2 pillowcases. Available in King and Queen sizes. Multiple color options. Machine washable.',
      },
    });
  }

  if (handicraftSub) {
    await prisma.product.upsert({
      where: { slug: 'rosewood-elephant-statue' },
      update: {},
      create: {
        name: 'Rosewood Elephant Statue - 12 inch',
        slug: 'rosewood-elephant-statue',
        sellerId: seller3.id,
        categoryId: handicraftSub.id,
        hsCode: '442090',
        moq: '50 pieces',
        origin: 'Kerala, India',
        shelfLife: 'N/A',
        verificationStatus: 'APPROVED',
        description:
          'Hand-carved rosewood elephant with intricate detailing. Traditional Kerala craftsmanship. Natural wood finish with brass inlay work. Perfect for home decor and corporate gifts. Height: 12 inches.',
      },
    });

    await prisma.product.upsert({
      where: { slug: 'kerala-mural-wall-art' },
      update: {},
      create: {
        name: 'Kerala Mural Painting - Radha Krishna',
        slug: 'kerala-mural-wall-art',
        sellerId: seller3.id,
        categoryId: handicraftSub.id,
        hsCode: '970110',
        moq: '10 pieces',
        origin: 'Guruvayur, Kerala, India',
        shelfLife: 'N/A',
        verificationStatus: 'APPROVED',
        description:
          'Traditional Kerala mural painting on canvas. Hand-painted using natural pigments and traditional techniques. Depicts Radha Krishna in classic Kerala mural style. Size: 24x36 inches. Ready to frame.',
      },
    });
  }

  console.log('✓ Created 10 demo products with full details (9 approved, 1 pending)');
  console.log('');
  console.log('Demo Login Credentials:');
  console.log('Admin: admin@epickeral.com / admin123');
  console.log('Sellers: contact@keralaspices.com / password123 (and 4 more sellers)');

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
