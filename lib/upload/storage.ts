/**
 * Unified file storage abstraction.
 *
 * - Development   → local filesystem under public/uploads/
 * - Production    → Cloudflare R2 via S3-compatible API
 *
 * All upload routes should import from here instead of
 * importing r2-storage directly, so that dev works without
 * any R2 credentials and production uses R2 transparently.
 */
import { uploadBufferToR2, deleteFromR2 } from '@/lib/r2-storage';
import { saveFileLocally, deleteFileLocally } from './local-storage';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Upload a file buffer and return its stored path.
 *
 * @param key         Storage object key, e.g. "products/product_123.jpg"
 * @param buffer      File bytes
 * @param contentType MIME type, e.g. "image/webp"
 * @returns           Root-relative path (e.g. /uploads/products/product_123.jpg)
 */
export async function uploadFile(
  key: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  if (isProduction) {
    return uploadBufferToR2({ key, body: buffer, contentType });
  }
  return saveFileLocally(key, buffer, contentType);
}

/**
 * Delete a previously uploaded file by its storage key.
 * Silently ignores missing files.
 */
export async function deleteFile(key: string): Promise<void> {
  if (isProduction) {
    await deleteFromR2(key);
  } else {
    await deleteFileLocally(key);
  }
}

/**
 * Convert a stored file reference back to its raw storage key so it can be
 * passed to deleteFile().
 *
 * Handles both:
 *   - Root-relative path: /uploads/products/file.jpg  → products/file.jpg
 *   - Legacy R2 URL:      https://cdn.example.com/products/file.jpg → products/file.jpg
 *
 * Returns null when the reference cannot be mapped (e.g. external third-party URLs).
 */
export function urlToKey(url: string | null | undefined): string | null {
  if (!url) return null;

  // Path format produced by both local and R2 upload adapters.
  if (url.startsWith('/uploads/')) {
    return url.slice('/uploads/'.length);
  }

  // Production R2 URL.
  const r2Base = process.env.R2_PUBLIC_BASE_URL?.replace(/\/+$/, '');
  if (r2Base && url.startsWith(r2Base + '/')) {
    return url.slice(r2Base.length + 1);
  }

  return null;
}
