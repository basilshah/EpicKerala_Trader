import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { uploadFile } from '@/lib/upload/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('Product image upload request received');

    const session = await auth();

    if (!session?.user?.email) {
      console.log('Unauthorized product upload attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.log('No file in product upload request');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('Product file received:', { name: file.name, type: file.type, size: file.size });

    // Validate file type - only images
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      console.log('Invalid product file type:', file.type);
      return NextResponse.json(
        { error: 'Invalid file type. Only images (JPG, PNG, WEBP) are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max for product images)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.log('Product file too large:', file.size);
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const filename = `product_${timestamp}_${Math.random().toString(36).substring(7)}.${extension}`;

    // Upload file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const key = `products/${filename}`;
    const fileUrl = await uploadFile(key, buffer, file.type);

    console.log('Product file uploaded successfully:', fileUrl);

    return NextResponse.json({
      message: 'Image uploaded successfully',
      url: fileUrl,
      filename: file.name,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to upload image';
    console.error('Product image upload error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
