import 'dotenv/config';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { uploadBufferToR2 } from '../lib/r2-storage';

const prisma = new PrismaClient();

const LOCAL_UPLOAD_PREFIX = '/uploads/';
const keyPrefix = process.env.R2_MIGRATION_PREFIX || 'migrated';

const mimeByExt: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf',
};

type Stats = {
  scanned: number;
  updated: number;
  skippedMissingFile: number;
  failed: number;
};

const stats: Stats = {
  scanned: 0,
  updated: 0,
  skippedMissingFile: 0,
  failed: 0,
};

const uploadCache = new Map<string, string>();

function isLocalUploadUrl(value: string): boolean {
  return value.startsWith(LOCAL_UPLOAD_PREFIX);
}

function guessContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  return mimeByExt[ext] || 'application/octet-stream';
}

async function migrateUrl(url: string): Promise<string | null> {
  if (!isLocalUploadUrl(url)) {
    return null;
  }

  const cached = uploadCache.get(url);
  if (cached) {
    return cached;
  }

  const localPath = path.join(process.cwd(), 'public', url);
  if (!existsSync(localPath)) {
    stats.skippedMissingFile += 1;
    console.warn(`Missing local file, skipping: ${localPath}`);
    return null;
  }

  const body = await readFile(localPath);
  const normalized = url.replace(/^\/+/, '');
  const key = `${keyPrefix}/${normalized}`;
  const contentType = guessContentType(localPath);
  const r2Url = await uploadBufferToR2({
    key,
    body,
    contentType,
  });

  uploadCache.set(url, r2Url);
  return r2Url;
}

async function migrateUnknownValue(value: unknown): Promise<{ value: unknown; changed: boolean }> {
  if (typeof value === 'string') {
    const migrated = await migrateUrl(value);
    if (migrated) {
      return { value: migrated, changed: true };
    }
    return { value, changed: false };
  }

  if (Array.isArray(value)) {
    let changed = false;
    const updated: unknown[] = [];
    for (const item of value) {
      const result = await migrateUnknownValue(item);
      updated.push(result.value);
      if (result.changed) {
        changed = true;
      }
    }
    return { value: updated, changed };
  }

  if (value && typeof value === 'object') {
    let changed = false;
    const entries = Object.entries(value as Record<string, unknown>);
    const updatedEntries: Array<[string, unknown]> = [];
    for (const [key, entryValue] of entries) {
      if (key === 'url' && typeof entryValue === 'string') {
        const migrated = await migrateUrl(entryValue);
        if (migrated) {
          updatedEntries.push([key, migrated]);
          changed = true;
          continue;
        }
      }

      const nested = await migrateUnknownValue(entryValue);
      updatedEntries.push([key, nested.value]);
      if (nested.changed) {
        changed = true;
      }
    }
    return { value: Object.fromEntries(updatedEntries), changed };
  }

  return { value, changed: false };
}

async function migrateJsonString(raw: string | null): Promise<{ value: string | null; changed: boolean }> {
  if (!raw) {
    return { value: raw, changed: false };
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    const migrated = await migrateUnknownValue(parsed);
    if (!migrated.changed) {
      return { value: raw, changed: false };
    }
    return { value: JSON.stringify(migrated.value), changed: true };
  } catch {
    return { value: raw, changed: false };
  }
}

async function run(): Promise<void> {
  console.log('Starting one-time migration from /uploads/... to R2 URLs');

  const categories = await prisma.category.findMany({
    select: { id: true, imageUrl: true },
  });
  for (const category of categories) {
    stats.scanned += 1;
    if (!category.imageUrl || !isLocalUploadUrl(category.imageUrl)) continue;
    try {
      const migrated = await migrateUrl(category.imageUrl);
      if (!migrated) continue;
      await prisma.category.update({
        where: { id: category.id },
        data: { imageUrl: migrated },
      });
      stats.updated += 1;
    } catch (error) {
      stats.failed += 1;
      console.error('Category migration failed:', category.id, error);
    }
  }

  const sellers = await prisma.seller.findMany({
    select: { id: true, logoUrl: true, certificationFiles: true, catalogs: true },
  });
  for (const seller of sellers) {
    stats.scanned += 1;
    try {
      let changed = false;
      const data: Record<string, string | null> = {};

      if (seller.logoUrl && isLocalUploadUrl(seller.logoUrl)) {
        const migratedLogo = await migrateUrl(seller.logoUrl);
        if (migratedLogo) {
          data.logoUrl = migratedLogo;
          changed = true;
        }
      }

      const migratedCerts = await migrateJsonString(seller.certificationFiles);
      if (migratedCerts.changed) {
        data.certificationFiles = migratedCerts.value;
        changed = true;
      }

      const migratedCatalogs = await migrateJsonString(seller.catalogs);
      if (migratedCatalogs.changed) {
        data.catalogs = migratedCatalogs.value;
        changed = true;
      }

      if (changed) {
        await prisma.seller.update({
          where: { id: seller.id },
          data,
        });
        stats.updated += 1;
      }
    } catch (error) {
      stats.failed += 1;
      console.error('Seller migration failed:', seller.id, error);
    }
  }

  const products = await prisma.product.findMany({
    select: { id: true, images: true, catalogs: true, certificationFiles: true },
  });
  for (const product of products) {
    stats.scanned += 1;
    try {
      let changed = false;
      const data: Record<string, string | null> = {};

      const migratedImages = await migrateJsonString(product.images);
      if (migratedImages.changed) {
        data.images = migratedImages.value;
        changed = true;
      }

      const migratedCatalogs = await migrateJsonString(product.catalogs);
      if (migratedCatalogs.changed) {
        data.catalogs = migratedCatalogs.value;
        changed = true;
      }

      const migratedCerts = await migrateJsonString(product.certificationFiles);
      if (migratedCerts.changed) {
        data.certificationFiles = migratedCerts.value;
        changed = true;
      }

      if (changed) {
        await prisma.product.update({
          where: { id: product.id },
          data,
        });
        stats.updated += 1;
      }
    } catch (error) {
      stats.failed += 1;
      console.error('Product migration failed:', product.id, error);
    }
  }

  const uploadedFiles = await (prisma as any).uploadedFile.findMany({
    select: { id: true, fileUrl: true },
  });
  for (const file of uploadedFiles) {
    stats.scanned += 1;
    if (!isLocalUploadUrl(file.fileUrl)) continue;
    try {
      const migrated = await migrateUrl(file.fileUrl);
      if (!migrated) continue;
      await (prisma as any).uploadedFile.update({
        where: { id: file.id },
        data: { fileUrl: migrated },
      });
      stats.updated += 1;
    } catch (error) {
      stats.failed += 1;
      console.error('UploadedFile migration failed:', file.id, error);
    }
  }

  console.log('Migration complete');
  console.log(JSON.stringify(stats, null, 2));
}

run()
  .catch((error) => {
    console.error('Migration script failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
