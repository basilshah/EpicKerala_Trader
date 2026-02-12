import { NextRequest, NextResponse } from 'next/server';
import prismaClient from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'password', 'country', 'city', 'countryCode', 'phone'];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Check if email already exists
    const existingImporter = await prismaClient.importer.findUnique({
      where: { email: data.email },
    });

    if (existingImporter) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Also check if email exists as seller
    const existingSeller = await prismaClient.seller.findUnique({
      where: { email: data.email },
    });

    if (existingSeller) {
      return NextResponse.json(
        { error: 'This email is already registered as an exporter' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Combine country code and phone
    const fullPhone = `${data.countryCode}${data.phone}`;

    // Create importer with FREE tier by default
    const importer = await prismaClient.importer.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        companyName: data.companyName || null,
        country: data.country,
        phone: fullPhone,
        subscriptionTier: 'FREE', // Default tier
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      importer: {
        id: importer.id,
        name: importer.name,
        email: importer.email,
        subscriptionTier: importer.subscriptionTier,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create account' },
      { status: 500 }
    );
  }
}
