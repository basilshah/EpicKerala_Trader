import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { auth } from '@/lib/auth';
import prismaClient from '@/lib/prisma';
import { uploadBufferToR2 } from '@/lib/r2-storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const PDF_MIME_TYPE = 'application/pdf';
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;

interface UploadedFileResult {
  id: string;
  type: 'image' | 'pdf';
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: 'image/webp' | 'application/pdf';
  uploadedAt: Date;
  userId: string;
}

interface FailedFileResult {
  originalName: string;
  reason: string;
  code: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id as string | undefined;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData
      .getAll('file')
      .filter((value): value is File => value instanceof File && value.size > 0);

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploaded: UploadedFileResult[] = [];
    const failed: FailedFileResult[] = [];

    for (const file of files) {
      const isImage = IMAGE_MIME_TYPES.includes(file.type);
      const isPdf = file.type === PDF_MIME_TYPE;

      if (!isImage && !isPdf) {
        failed.push({
          originalName: file.name,
          reason: 'Unsupported file type',
          code: 'UNSUPPORTED_MIME_TYPE',
        });
        continue;
      }

      if (isImage && file.size > MAX_IMAGE_SIZE_BYTES) {
        failed.push({
          originalName: file.name,
          reason: 'Image file size must be less than or equal to 5MB',
          code: 'IMAGE_TOO_LARGE',
        });
        continue;
      }

      if (isPdf && file.size > MAX_PDF_SIZE_BYTES) {
        failed.push({
          originalName: file.name,
          reason: 'PDF file size must be less than or equal to 10MB',
          code: 'PDF_TOO_LARGE',
        });
        continue;
      }

      try {
        const inputBuffer = Buffer.from(await file.arrayBuffer());
        const uuid = randomUUID();
        const type: 'image' | 'pdf' = isImage ? 'image' : 'pdf';
        const key = isImage ? `images/${userId}/${uuid}.webp` : `docs/${userId}/${uuid}.pdf`;
        const mimeType: 'image/webp' | 'application/pdf' = isImage
          ? 'image/webp'
          : 'application/pdf';
        const outputBuffer = isImage
          ? await sharp(inputBuffer).webp({ quality: 85 }).toBuffer()
          : inputBuffer;

        const fileUrl = await uploadBufferToR2({
          key,
          body: outputBuffer,
          contentType: mimeType,
        });
        const fileName = key.split('/').pop() || `${uuid}.${isImage ? 'webp' : 'pdf'}`;

        const created = await (prismaClient as any).uploadedFile.create({
          data: {
            type,
            fileName,
            fileUrl,
            fileSize: outputBuffer.length,
            mimeType,
            uploadedAt: new Date(),
            userId,
          },
        });

        uploaded.push({
          id: created.id,
          type: created.type as 'image' | 'pdf',
          fileName: created.fileName,
          fileUrl: created.fileUrl,
          fileSize: created.fileSize,
          mimeType: created.mimeType as 'image/webp' | 'application/pdf',
          uploadedAt: created.uploadedAt,
          userId: created.userId,
        });
      } catch (fileError) {
        console.error(`Upload failed for file ${file.name}:`, fileError);
        failed.push({
          originalName: file.name,
          reason: 'Failed to process or upload file',
          code: 'UPLOAD_FAILED',
        });
      }
    }

    if (uploaded.length === 0) {
      return NextResponse.json(
        {
          error: 'No files were uploaded successfully',
          uploaded: [],
          failed,
        },
        { status: 400 }
      );
    }

    const responseBody: Record<string, unknown> = {
      message: failed.length > 0 ? 'Upload completed with partial failures' : 'Upload successful',
      uploaded,
      failed,
    };

    // Preserve existing single-file response contract for current clients.
    if (uploaded.length === 1 && failed.length === 0) {
      responseBody.url = uploaded[0].fileUrl;
      responseBody.filename = uploaded[0].fileName;
      responseBody.type = uploaded[0].mimeType;
    }

    if (failed.length > 0) {
      return NextResponse.json(responseBody, { status: 207 });
    }

    return NextResponse.json(responseBody, { status: 201 });
  } catch (error) {
    console.error('Catalog upload error:', error);
    return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 });
  }
}
