/**
 * Local filesystem storage for development use only.
 * Files are saved under public/uploads/ so they are served
 * as static assets by Next.js without a custom route.
 */
import fs from 'fs/promises';
import path from 'path';

function localFilePath(key: string): string {
  // Normalise any leading slash so path.join works correctly.
  const normKey = key.replace(/^\/+/, '');
  return path.join(process.cwd(), 'public', 'uploads', normKey);
}

export async function saveFileLocally(
  key: string,
  buffer: Buffer,
  // contentType is unused locally but kept for a consistent signature with R2.
  _contentType: string
): Promise<string> {
  const filePath = localFilePath(key);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, buffer);
  // Return a root-relative URL served directly by Next.js static file handling.
  return `/uploads/${key.replace(/^\/+/, '')}`;
}

export async function deleteFileLocally(key: string): Promise<void> {
  const filePath = localFilePath(key);
  try {
    await fs.unlink(filePath);
  } catch {
    // File may already be gone — silently ignore.
  }
}
