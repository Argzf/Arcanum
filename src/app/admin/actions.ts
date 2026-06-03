'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import {
  getAllItems,
  createLink,
  createFileItem,
  updateItem,
  deleteItem,
  checkExists,
} from '@/lib/db';
import { uploadFile } from '@/lib/blob';
import { readdirSync } from 'fs';
import { join } from 'path';

// ------------------------------------------------------------------
// Semi‑automatic route reservation
// ------------------------------------------------------------------
function getReservedShortCodes(): string[] {
  try {
    const appDir = join(process.cwd(), 'src', 'app');
    const reserved: string[] = [];

    function walkDir(dir: string, basePath = '') {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);

        if (entry.isDirectory()) {
          if (entry.name === '[code]') continue;
          if (entry.name === 'api') continue;
          if (entry.name.startsWith('_')) continue;
          if (entry.name.startsWith('.')) continue;

          const routePart = entry.name;
          let isRoute = false;
          try {
            const children = readdirSync(fullPath);
            if (children.includes('page.tsx') || children.includes('route.ts')) {
              isRoute = true;
            }
          } catch {
            // ignore
          }

          if (isRoute) {
            if (basePath) {
              reserved.push(`${basePath}/${routePart}`);
            } else {
              reserved.push(routePart);
            }
          }

          walkDir(fullPath, basePath ? `${basePath}/${routePart}` : routePart);
        }
      }
    }

    walkDir(appDir);

    const alwaysReserved = [
      '_next', 'favicon.ico', 'robots.txt', 'sitemap.xml',
      'static', 'images', 'fonts', 'api', 'auth', 'links', 'files',
    ];

    for (const r of alwaysReserved) {
      if (!reserved.includes(r)) reserved.push(r);
    }

    return [...new Set(reserved.map(r => r.toLowerCase()))];
  } catch (err) {
    console.error('Failed to scan routes for reservation:', err);
    return ['admin', 'manage', 'api', '_next', 'favicon.ico', 'static', 'images', 'fonts', 'links', 'files'];
  }
}

const RESERVED_SHORT_CODES = getReservedShortCodes();

function isShortCodeAllowed(shortCode: string): { allowed: boolean; error?: string } {
  if (!/^[a-zA-Z0-9\-_]+$/.test(shortCode)) {
    return { allowed: false, error: 'Short code can only contain letters, numbers, hyphens and underscores' };
  }

  if (RESERVED_SHORT_CODES.includes(shortCode.toLowerCase())) {
    return { allowed: false, error: `"${shortCode}" is a reserved system path and cannot be used.` };
  }

  return { allowed: true };
}

// ------------------------------------------------------------------
// Authentication helper
// ------------------------------------------------------------------
async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
}

// ------------------------------------------------------------------
// Server Actions
// ------------------------------------------------------------------
export async function getItems() {
  try {
    await requireAuth();
    return await getAllItems();
  } catch (error) {
    console.error('getItems error:', error);
    return [];
  }
}

export async function createNewLink(shortCode: string, destination: string) {
  try {
    await requireAuth();

    const validation = isShortCodeAllowed(shortCode);
    if (!validation.allowed) return { error: validation.error };

    // Validate URL
    new URL(destination);

    // Check if short code already exists as a link
    const exists = await checkExists(shortCode, 'link');
    if (exists) {
      return { error: 'Short code already used for a link. Choose another.' };
    }

    await createLink(shortCode, destination);
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('createNewLink error:', error);
    return { error: error.message || 'Failed to create link' };
  }
}

export async function uploadNewFile(formData: FormData) {
  try {
    await requireAuth();

    // Check for blob token
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return { error: 'Blob storage not configured. Please add BLOB_READ_WRITE_TOKEN to environment variables.' };
    }

    const shortCode = formData.get('shortCode') as string;
    const file = formData.get('file') as File;

    if (!shortCode || !file) {
      return { error: 'Missing shortCode or file' };
    }

    const validation = isShortCodeAllowed(shortCode);
    if (!validation.allowed) return { error: validation.error };

    // Check if short code already exists as a file
    const exists = await checkExists(shortCode, 'file');
    if (exists) {
      return { error: 'Short code already used for a file. Choose another.' };
    }

    // Upload to Vercel Blob
    const { url } = await uploadFile(file, shortCode);

    await createFileItem(shortCode, url, file.name, file.size, file.type);
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('uploadNewFile error:', error);
    return { error: error.message || 'Failed to upload file' };
  }
}

export async function updateExistingItem(id: string, shortCode: string, destination: string) {
  try {
    await requireAuth();

    const validation = isShortCodeAllowed(shortCode);
    if (!validation.allowed) return { error: validation.error };

    // Note: For files, destination is the blob URL – updating it is not allowed here.
    // We simply update the shortCode and destination (for links) or shortCode only for files.
    // To keep it simple, we allow updating both fields; files will ignore destination change.
    await updateItem(id, shortCode, destination);
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('updateExistingItem error:', error);
    return { error: error.message || 'Failed to update item' };
  }
}

export async function deleteExistingItem(id: string) {
  try {
    await requireAuth();
    // TODO: Also delete blob from Vercel Blob if it's a file (optional)
    await deleteItem(id);
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('deleteExistingItem error:', error);
    return { error: error.message || 'Failed to delete item' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/manage');
}
