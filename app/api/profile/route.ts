import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { auth } from '@/lib/auth';
import prismaClient from '@/lib/prisma';
import { CACHE_TAGS } from '@/lib/home/getHomePageData';

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Find the seller
    const seller = await prismaClient.seller.findUnique({
      where: { email: session.user.email },
    });

    if (!seller) {
      return NextResponse.json({ error: 'Seller not found' }, { status: 404 });
    }

    // Update the seller profile
    const updatedSeller = await prismaClient.seller.update({
      where: { id: seller.id },
      data: {
        companyName: data.companyName,
        phone: data.phone,
        website: data.website || null,
        profileVideoUrl: data.profileVideoUrl || null,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        pincode: data.pincode,
        establishedYear: data.establishedYear || null,
        certifications: data.certifications || null,
        certificationFiles: data.certificationFiles || null,
        catalogs: data.catalogs || null,
        offersOEM: data.offersOEM,
        contactPersonName: data.contactPersonName,
        contactPersonDesignation: data.contactPersonDesignation,
      },
    });

    revalidateTag(CACHE_TAGS.sellers, 'max');
    return NextResponse.json({
      message: 'Profile updated successfully',
      seller: updatedSeller,
    });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
