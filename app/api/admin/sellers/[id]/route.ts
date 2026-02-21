import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { adminAuth } from '@/lib/admin-auth';
import prismaClient from '@/lib/prisma';
import { CACHE_TAGS } from '@/lib/home/getHomePageData';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await adminAuth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    const seller = await prismaClient.seller.update({
      where: { id },
      data: {
        companyName: data.companyName,
        description: data.description,
        type: data.type,
        phone: data.phone,
        website: data.website || null,
        profileVideoUrl: data.profileVideoUrl || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        country: data.country || 'India',
        pincode: data.pincode || null,
        establishedYear: data.establishedYear || null,
        certifications: data.certifications || null,
        certificationFiles: data.certificationFiles || null,
        catalogs: data.catalogs || null,
        contactPersonName: data.contactPersonName || null,
        contactPersonDesignation: data.contactPersonDesignation || null,
        offersOEM: data.offersOEM ?? false,
      },
    });

    revalidateTag(CACHE_TAGS.sellers, 'max');
    return NextResponse.json({ message: 'Seller updated successfully', seller });
  } catch (error: any) {
    console.error('Admin seller update error:', error);
    return NextResponse.json({ error: 'Failed to update seller' }, { status: 500 });
  }
}
