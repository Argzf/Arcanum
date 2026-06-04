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
// Helper: generate random alphanumeric code (no lookalikes)
// ------------------------------------------------------------------
function generateRandomCode(length = 6): string {
  const chars = 'abcdefghijkmnopqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ------------------------------------------------------------------
// Route reservation (synchronous – runs at module load)
// ------------------------------------------------------------------
function getReservedShortCodesSync(): string[] {
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

const RESERVED_CODES = getReservedShortCodesSync();

function isShortCodeAllowed(code: string) {
  if (!/^[a-zA-Z0-9\-_]+$/.test(code)) return { allowed: false, error: 'Invalid characters' };
  if (RESERVED_CODES.includes(code.toLowerCase())) return { allowed: false, error: 'Reserved word' };
  return { allowed: true };
}

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
    let finalCode = shortCode.trim();
    if (!finalCode) {
      // Generate random code
      for (let i = 0; i < 10; i++) {
        const candidate = generateRandomCode(6);
        if (!RESERVED_CODES.includes(candidate) && !(await checkExists(candidate, 'link'))) {
          finalCode = candidate;
          break;
        }
      }
      if (!finalCode) return { error: 'Could not generate a unique short code. Please try again.' };
    }
    const check = isShortCodeAllowed(finalCode);
    if (!check.allowed) return { error: check.error };
    new URL(destination);
    const exists = await checkExists(finalCode, 'link');
    if (exists) return { error: 'Short code already used for a link.' };
    await createLink(finalCode, destination);
    revalidatePath('/admin');
    return { success: true, code: finalCode };
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
    let shortCode = (formData.get('shortCode') as string) || '';
    const file = formData.get('file') as File;
    if (!file) return { error: 'Missing file' };
    if (!shortCode) {
      // Generate random code
      for (let i = 0; i < 10; i++) {
        const candidate = generateRandomCode(6);
        if (!RESERVED_CODES.includes(candidate) && !(await checkExists(candidate, 'file'))) {
          shortCode = candidate;
          break;
        }
      }
      if (!shortCode) return { error: 'Could not generate a unique short code. Please try again.' };
    }
    const check = isShortCodeAllowed(shortCode);
    if (!check.allowed) return { error: check.error };
    const exists = await checkExists(shortCode, 'file');
    if (exists) return { error: 'Short code already used for a file.' };
    const { url } = await uploadFile(file, shortCode);
    await createFileItem(shortCode, url, file.name, file.size, file.type);
    revalidatePath('/admin');
    return { success: true, code: shortCode };
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
