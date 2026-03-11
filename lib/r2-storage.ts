import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

let r2Client: S3Client | null = null;

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function trimSlashes(value: string): string {
  return value.replace(/^\/+|\/+$/g, '');
}

export function getR2Client(): S3Client {
  if (r2Client) {
    return r2Client;
  }

  const endpoint = getEnv('R2_ENDPOINT');
  const accessKeyId = getEnv('R2_ACCESS_KEY_ID');
  const secretAccessKey = getEnv('R2_SECRET_ACCESS_KEY');
  const region = process.env.R2_REGION || 'auto';

  r2Client = new S3Client({
    region,
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  });

  return r2Client;
}

export interface UploadBufferToR2Input {
  key: string;
  body: Buffer;
  contentType: string;
}

export async function uploadBufferToR2({
  key,
  body,
  contentType,
}: UploadBufferToR2Input): Promise<string> {
  const client = getR2Client();
  const bucket = getEnv('R2_BUCKET_NAME');

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: trimSlashes(key),
      Body: body,
      ContentType: contentType,
    })
  );

  return `/uploads/${trimSlashes(key)}`;
}

export async function deleteFromR2(key: string): Promise<void> {
  const client = getR2Client();
  const bucket = getEnv('R2_BUCKET_NAME');
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: trimSlashes(key),
    })
  );
}
