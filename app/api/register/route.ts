import { NextRequest, NextResponse } from 'next/server';
import prismaClient from '@/lib/prisma';
import bcrypt from 'bcryptjs';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      'companyName',
      'password',
      'email',
      'phone',
      'description',
      'businessType',
      'address',
      'city',
      'state',
      'country',
      'pincode',
      'contactPersonName',
      'contactPersonDesignation',
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Check if email already exists
    const existingSeller = await prismaClient.seller.findUnique({
      where: { email: data.email },
    });

    if (existingSeller) {
      return NextResponse.json(
        { error: 'A company with this email is already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Generate unique slug
    let slug = slugify(data.companyName);
    let slugExists = await prismaClient.seller.findUnique({
      where: { slug },
    });

    let counter = 1;
    while (slugExists) {
      slug = `${slugify(data.companyName)}-${counter}`;
      slugExists = await prismaClient.seller.findUnique({
        where: { slug },
      });
      counter++;
    }

    // Combine country code and phone
    const fullPhone = `${data.countryCode}${data.phone}`;

    // Create seller
    const seller = await prismaClient.seller.create({
      data: {
        companyName: data.companyName,
        slug,
        password: hashedPassword,
        email: data.email,
        phone: fullPhone,
        website: data.website || null,
        description: data.description,
        type: data.businessType,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        pincode: data.pincode,
        establishedYear: data.establishedYear ? parseInt(data.establishedYear) : null,
        certifications: data.certifications || null,
        offersOEM: data.offersOEM || false,
        contactPersonName: data.contactPersonName,
        contactPersonDesignation: data.contactPersonDesignation,
        isVerified: false, // Pending verification
      },
    });

    return NextResponse.json({
      success: true,
      slug: seller.slug,
      message: 'Registration successful! Your profile is pending verification.',
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
