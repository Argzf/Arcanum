import { put } from '@vercel/blob';

export async function uploadFile(file: File, shortCode: string): Promise<{ url: string }> {
  const blob = await put(`uploads/${shortCode}-${file.name}`, file, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return { url: blob.url };
}
