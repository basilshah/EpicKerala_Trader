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
      certificationFiles: JSON.stringify([
        {
          url: '/uploads/certifications/iso-9001-certificate.pdf',
          filename: 'ISO-9001-Certificate.pdf',
          type: 'application/pdf',
        },
        {
          url: '/uploads/certifications/spices-board-license.pdf',
          filename: 'Spices-Board-License.pdf',
          type: 'application/pdf',
        },
      ]),
      establishedYear: 1998,
      offersOEM: true,
      contactPersonName: 'Rajesh Kumar',
      contactPersonDesignation: 'Export Manager',
      description:
        'Leading manufacturer and exporter of premium Kerala spices. We source directly from organic farms in Wayanad and Idukki districts. Trusted by international buyers for over 25 years.',
      profileVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      catalogs: JSON.stringify([
        {
          url: '/uploads/catalogs/kerala-spices-catalog-2024.pdf',
          filename: 'Kerala-Spices-Product-Catalog-2024.pdf',
          type: 'application/pdf',
        },
        {
          url: '/uploads/catalogs/spice-export-guide.pdf',
          filename: 'Export-Guidelines.pdf',
          type: 'application/pdf',
        },
      ]),
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
      certificationFiles: JSON.stringify([
        {
          url: '/uploads/certifications/gots-certificate.pdf',
          filename: 'GOTS-Certification.pdf',
          type: 'application/pdf',
        },
        {
          url: '/uploads/certifications/oeko-tex-certificate.jpg',
          filename: 'OEKO-TEX-Certificate.jpg',
          type: 'image/jpeg',
        },
      ]),
      establishedYear: 2005,
      offersOEM: true,
      contactPersonName: 'Ayesha Beevi',
      contactPersonDesignation: 'Business Development Head',
      description:
        'Premium cotton and handloom textile manufacturer. Specializing in organic fabrics, traditional Kerala sarees, and custom garment manufacturing for international fashion brands.',
      profileVideoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
      catalogs: JSON.stringify([
        {
          url: '/uploads/catalogs/textile-collection-2024.pdf',
          filename: 'Textile-Collection-2024.pdf',
          type: 'application/pdf',
        },
        {
          url: '/uploads/catalogs/fabric-swatches.jpg',
          filename: 'Fabric-Swatches.jpg',
          type: 'image/jpeg',
        },
      ]),
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
      certificationFiles: JSON.stringify([
        {
          url: '/uploads/certifications/export-excellence-award.jpg',
          filename: 'Export-Excellence-Award-2023.jpg',
          type: 'image/jpeg',
        },
      ]),
      establishedYear: 2012,
      offersOEM: false,
      contactPersonName: 'Suresh Menon',
      contactPersonDesignation: 'Owner',
      description:
        'Authentic Kerala handicrafts and eco-friendly products. From traditional metal mirrors to handcrafted wooden artifacts, we preserve heritage while promoting sustainable practices.',
      profileVideoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      catalogs: JSON.stringify([
        {
          url: '/uploads/catalogs/handicrafts-catalog.pdf',
          filename: 'Handicrafts-Catalog.pdf',
          type: 'application/pdf',
        },
        {
          url: '/uploads/catalogs/product-showcase.jpg',
          filename: 'Product-Showcase.jpg',
          type: 'image/jpeg',
        },
      ]),
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
      certificationFiles: JSON.stringify([
        {
          url: '/uploads/certifications/fssai-license.pdf',
          filename: 'FSSAI-License.pdf',
          type: 'application/pdf',
        },
        {
          url: '/uploads/certifications/iso-22000.pdf',
          filename: 'ISO-22000-Certificate.pdf',
          type: 'application/pdf',
        },
      ]),
      establishedYear: 2001,
      offersOEM: true,
      contactPersonName: 'James Sebastian',
      contactPersonDesignation: 'Managing Director',
      description:
        'Premier seafood processing and export company. Specializing in frozen fish, prawns, and value-added marine products with state-of-the-art cold chain facilities.',
      profileVideoUrl: 'https://www.youtube.com/watch?v=HIcSWuKMwOw',
      catalogs: JSON.stringify([
        {
          url: '/uploads/catalogs/seafood-products.pdf',
          filename: 'Seafood-Products-Catalog.pdf',
          type: 'application/pdf',
        },
      ]),
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
      certificationFiles: JSON.stringify([
        {
          url: '/uploads/certifications/gmp-certificate.pdf',
          filename: 'GMP-Certificate.pdf',
          type: 'application/pdf',
        },
        {
          url: '/uploads/certifications/ayush-license.pdf',
          filename: 'Ayush-License.pdf',
          type: 'application/pdf',
        },
        {
          url: '/uploads/certifications/organic-india-cert.jpg',
          filename: 'Organic-India-Certificate.jpg',
          type: 'image/jpeg',
        },
      ]),
      establishedYear: 2010,
      offersOEM: true,
      contactPersonName: 'Dr. Priya Nair',
      contactPersonDesignation: 'Quality Control Head',
      description:
        'Authentic Ayurvedic products and herbal extracts. Manufacturing traditional Kerala Ayurveda formulations using organic herbs and modern extraction techniques.',
      profileVideoUrl: 'https://www.youtube.com/watch?v=Me-im0A8elM',
      catalogs: JSON.stringify([
        {
          url: '/uploads/catalogs/ayurveda-product-range.pdf',
          filename: 'Ayurveda-Product-Range.pdf',
          type: 'application/pdf',
        },
        {
          url: '/uploads/catalogs/herbal-extracts-catalog.pdf',
          filename: 'Herbal-Extracts.pdf',
          type: 'application/pdf',
        },
      ]),
    },
  });

  console.log('✓ Created 5 demo sellers with full details');

  // --- Create Demo Products with Full Details ---

  const spiceSub = await prisma.category.findFirst({ where: { slug: 'spices-condiments' } });
  const textileSub = await prisma.category.findFirst({ where: { slug: 'readymade-garments' } });
  const handicraftSub = await prisma.category.findFirst({ where: { slug: 'wooden-handicrafts' } });
  const teaCoffeeSub = await prisma.category.findFirst({ where: { slug: 'tea-coffee' } });
  const homeTextileSub = await prisma.category.findFirst({ where: { slug: 'home-textiles' } });

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
        images: JSON.stringify([
          {
            url: 'https://images.unsplash.com/photo-1599909533378-37ca3f85d42a?w=500',
            filename: 'black-pepper-1.jpg',
          },
          {
            url: 'https://images.unsplash.com/photo-1596040033229-a0b53a1ddb1f?w=500',
            filename: 'black-pepper-2.jpg',
          },
          {
            url: 'https://images.unsplash.com/photo-1587143672785-0c1e6dbbfb80?w=500',
            filename: 'black-pepper-3.jpg',
          },
        ]),
        catalogs: JSON.stringify([
          {
            url: '/uploads/catalogs/black-pepper-specifications.pdf',
            filename: 'Black-Pepper-Technical-Specs.pdf',
            type: 'application/pdf',
          },
        ]),
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
        images: JSON.stringify([
          {
            url: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=500',
            filename: 'turmeric-1.jpg',
          },
          {
            url: 'https://images.unsplash.com/photo-1615485736896-d8d06d69e35f?w=500',
            filename: 'turmeric-2.jpg',
          },
        ]),
        catalogs: JSON.stringify([
          {
            url: '/uploads/catalogs/turmeric-analysis-report.pdf',
            filename: 'Turmeric-Lab-Analysis.pdf',
            type: 'application/pdf',
          },
        ]),
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
        images: JSON.stringify([
          {
            url: 'https://images.unsplash.com/photo-1596040033229-a0b53a1ddb1f?w=500',
            filename: 'cardamom-1.jpg',
          },
          {
            url: 'https://images.unsplash.com/photo-1599909533378-37ca3f85d42a?w=500',
            filename: 'cardamom-2.jpg',
          },
        ]),
        catalogs: JSON.stringify([
          {
            url: '/uploads/catalogs/cardamom-grading-chart.jpg',
            filename: 'Cardamom-Grading.jpg',
            type: 'image/jpeg',
          },
        ]),
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
        images: JSON.stringify([
          {
            url: 'https://images.unsplash.com/photo-1583454155184-870a1f63aecd?w=500',
            filename: 'red-chilli-1.jpg',
          },
        ]),
      },
    });
  }

  if (teaCoffeeSub) {
    await prisma.product.upsert({
      where: { slug: 'nilgiri-orthodox-tea' },
      update: {},
      create: {
        name: 'Nilgiri Orthodox Black Tea',
        slug: 'nilgiri-orthodox-tea',
        sellerId: seller1.id,
        categoryId: teaCoffeeSub.id,
        hsCode: '090240',
        moq: '250 kg',
        origin: 'Nilgiris, Tamil Nadu, India',
        shelfLife: '24 Months',
        verificationStatus: 'APPROVED',
        description:
          'Premium orthodox black tea from Nilgiri hills. Bright liquor with aromatic fragrance and brisk flavor. Perfect for blending. FTGFOP1 grade with golden tips.',
        images: JSON.stringify([
          {
            url: 'https://images.unsplash.com/photo-1597318114064-1bea136a757c?w=500',
            filename: 'black-tea-1.jpg',
          },
          {
            url: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=500',
            filename: 'black-tea-2.jpg',
          },
        ]),
        catalogs: JSON.stringify([
          {
            url: '/uploads/catalogs/tea-tasting-notes.pdf',
            filename: 'Tea-Tasting-Notes.pdf',
            type: 'application/pdf',
          },
        ]),
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
        images: JSON.stringify([
          {
            url: 'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=500',
            filename: 'kurta-1.jpg',
          },
          {
            url: 'https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=500',
            filename: 'kurta-2.jpg',
          },
          {
            url: 'https://images.unsplash.com/photo-1603252109360-909baaf261c7?w=500',
            filename: 'kurta-3.jpg',
          },
        ]),
        catalogs: JSON.stringify([
          {
            url: '/uploads/catalogs/kurta-size-chart.jpg',
            filename: 'Kurta-Size-Chart.jpg',
            type: 'image/jpeg',
          },
          {
            url: '/uploads/catalogs/garment-care-guide.pdf',
            filename: 'Care-Instructions.pdf',
            type: 'application/pdf',
          },
        ]),
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
        images: JSON.stringify([
          {
            url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500',
            filename: 'saree-1.jpg',
          },
          {
            url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500',
            filename: 'saree-2.jpg',
          },
        ]),
        catalogs: JSON.stringify([
          {
            url: '/uploads/catalogs/saree-draping-guide.pdf',
            filename: 'Saree-Draping-Guide.pdf',
            type: 'application/pdf',
          },
        ]),
      },
    });
  }

  if (homeTextileSub) {
    await prisma.product.upsert({
      where: { slug: 'cotton-bed-sheets-set' },
      update: {},
      create: {
        name: 'Premium Cotton Bed Sheet Set',
        slug: 'cotton-bed-sheets-set',
        sellerId: seller2.id,
        categoryId: homeTextileSub.id,
        hsCode: '630221',
        moq: '200 sets',
        origin: 'Kerala, India',
        shelfLife: 'N/A',
        verificationStatus: 'APPROVED',
        description:
          '300 thread count cotton bed sheet set. Includes 1 fitted sheet, 1 flat sheet, and 2 pillowcases. Available in King and Queen sizes. Multiple color options. Machine washable.',
        images: JSON.stringify([
          {
            url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500',
            filename: 'bedsheet-1.jpg',
          },
          {
            url: 'https://images.unsplash.com/photo-1616627547584-bf28cfeefa0e?w=500',
            filename: 'bedsheet-2.jpg',
          },
        ]),
        catalogs: JSON.stringify([
          {
            url: '/uploads/catalogs/home-textiles-catalog.pdf',
            filename: 'Home-Textiles-Range.pdf',
            type: 'application/pdf',
          },
        ]),
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
        images: JSON.stringify([
          {
            url: 'https://images.unsplash.com/photo-1582485046652-36b4bc3b1911?w=500',
            filename: 'elephant-statue-1.jpg',
          },
          {
            url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=500',
            filename: 'elephant-statue-2.jpg',
          },
        ]),
        catalogs: JSON.stringify([
          {
            url: '/uploads/catalogs/wooden-handicrafts-collection.pdf',
            filename: 'Wood-Crafts-Collection.pdf',
            type: 'application/pdf',
          },
        ]),
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
        images: JSON.stringify([
          {
            url: 'https://images.unsplash.com/photo-1578926078968-2e3b8edbd1e8?w=500',
            filename: 'mural-1.jpg',
          },
          {
            url: 'https://images.unsplash.com/photo-1580479960648-bd56c1e52638?w=500',
            filename: 'mural-2.jpg',
          },
        ]),
        catalogs: JSON.stringify([
          {
            url: '/uploads/catalogs/mural-art-designs.jpg',
            filename: 'Mural-Designs.jpg',
            type: 'image/jpeg',
          },
        ]),
      },
    });
  }

  console.log('✓ Created 11 demo products with full details (10 approved, 1 pending)');
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
