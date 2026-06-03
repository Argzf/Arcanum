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
// Route reservation (auto-detect)
// ------------------------------------------------------------------
function getReservedShortCodes(): string[] {
  try {
    const appDir = join(process.cwd(), 'src', 'app');
    const reserved: string[] = [];
    function walkDir(dir: string, basePath = '') {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          if (entry.name === '[code]' || entry.name === '[legacyCode]') continue;
          if (entry.name === 'api') continue;
          if (entry.name.startsWith('_')) continue;
          const routePart = entry.name;
          let isRoute = false;
          try {
            const children = readdirSync(join(dir, entry.name));
            if (children.includes('page.tsx') || children.includes('route.ts')) isRoute = true;
          } catch {}
          if (isRoute) {
            reserved.push(basePath ? `${basePath}/${routePart}` : routePart);
          }
          walkDir(join(dir, entry.name), basePath ? `${basePath}/${routePart}` : routePart);
        }
      }
    }
    walkDir(appDir);
    const alwaysReserved = ['_next', 'favicon.ico', 'robots.txt', 'static', 'api', 'auth', 'links', 'files'];
    return [...new Set([...reserved, ...alwaysReserved].map(r => r.toLowerCase()))];
  } catch {
    return ['admin', 'manage', 'api', '_next', 'favicon.ico', 'static', 'links', 'files'];
  }
}

const RESERVED = getReservedShortCodes();

function isShortCodeAllowed(code: string) {
  if (!/^[a-zA-Z0-9\-_]+$/.test(code)) return { allowed: false, error: 'Invalid characters' };
  if (RESERVED.includes(code.toLowerCase())) return { allowed: false, error: 'Reserved word' };
  return { allowed: true };
}

// ------------------------------------------------------------------
// Auth helper
// ------------------------------------------------------------------
async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
}

// ------------------------------------------------------------------
// Exported server actions
// ------------------------------------------------------------------
export async function getItems() {
  try {
    await requireAuth();
    return await getAllItems();
  } catch {
    return [];
  }
}

export async function createNewLink(shortCode: string, destination: string) {
  try {
    await requireAuth();
    const check = isShortCodeAllowed(shortCode);
    if (!check.allowed) return { error: check.error };
    new URL(destination);
    const exists = await checkExists(shortCode, 'link');
    if (exists) return { error: 'Short code already used for a link.' };
    await createLink(shortCode, destination);
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function uploadNewFile(formData: FormData) {
  try {
    await requireAuth();
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return { error: 'Blob token missing. Add BLOB_READ_WRITE_TOKEN to env.' };
    }
    const shortCode = formData.get('shortCode') as string;
    const file = formData.get('file') as File;
    if (!shortCode || !file) return { error: 'Missing shortCode or file' };
    const check = isShortCodeAllowed(shortCode);
    if (!check.allowed) return { error: check.error };
    const exists = await checkExists(shortCode, 'file');
    if (exists) return { error: 'Short code already used for a file.' };
    const { url } = await uploadFile(file, shortCode);
    await createFileItem(shortCode, url, file.name, file.size, file.type);
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateExistingItem(id: string, shortCode: string, destination: string) {
  try {
    await requireAuth();
    const check = isShortCodeAllowed(shortCode);
    if (!check.allowed) return { error: check.error };
    await updateItem(id, shortCode, destination);
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteExistingItem(id: string) {
  try {
    await requireAuth();
    await deleteItem(id);
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/manage');
}
