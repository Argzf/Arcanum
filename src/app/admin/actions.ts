'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getAllLinks, createLink, updateLink, deleteLink } from '@/lib/db';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

// ------------------------------------------------------------------
// Semi‑automatic route reservation: scans your app directory for existing routes
// This runs once when the server starts / during build.
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
          // Skip dynamic route folder and special directories
          if (entry.name === '[code]') continue;      // our catch‑all dynamic route
          if (entry.name === 'api') continue;          // API routes are reserved but we won't list them individually
          if (entry.name.startsWith('_')) continue;    // Next.js internal folders
          if (entry.name.startsWith('.')) continue;    // hidden folders
          
          // This folder name becomes a potential route segment
          const routePart = entry.name;
          
          // Check if this folder contains a page.tsx or route.ts – meaning it's a real route
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
          
          // Continue recursion for nested folders
          walkDir(fullPath, basePath ? `${basePath}/${routePart}` : routePart);
        }
      }
    }
    
    walkDir(appDir);
    
    // Also add common static assets and Next.js reserved paths
    const alwaysReserved = [
      '_next', 'favicon.ico', 'robots.txt', 'sitemap.xml',
      'static', 'images', 'fonts', 'api', 'auth',
    ];
    
    for (const r of alwaysReserved) {
      if (!reserved.includes(r)) reserved.push(r);
    }
    
    // Remove duplicates and convert to lowercase for case‑insensitive matching
    return [...new Set(reserved.map(r => r.toLowerCase()))];
  } catch (err) {
    console.error('Failed to scan routes for reservation:', err);
    // Fallback – safe defaults
    return ['admin', 'manage', 'api', '_next', 'favicon.ico', 'static', 'images', 'fonts'];
  }
}

// Compute the reserved list once at module load (build or cold start)
const RESERVED_SHORT_CODES = getReservedShortCodes();

// ------------------------------------------------------------------
// Helper to check if a short code is allowed
// ------------------------------------------------------------------
function isShortCodeAllowed(shortCode: string): { allowed: boolean; error?: string } {
  // Basic format check
  if (!/^[a-zA-Z0-9\-_]+$/.test(shortCode)) {
    return { allowed: false, error: 'Short code can only contain letters, numbers, hyphens and underscores' };
  }
  
  // Check against reserved system routes (auto‑detected + fallback)
  if (RESERVED_SHORT_CODES.includes(shortCode.toLowerCase())) {
    return { allowed: false, error: `"${shortCode}" is a reserved system path and cannot be used.` };
  }
  
  return { allowed: true };
}

// ------------------------------------------------------------------
// Authentication check
// ------------------------------------------------------------------
async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
}

// ------------------------------------------------------------------
// Server Actions for CRUD operations
// ------------------------------------------------------------------
export async function getLinks() {
  try {
    await requireAuth();
    return await getAllLinks();
  } catch (error) {
    console.error('getLinks error:', error);
    return [];
  }
}

export async function createNewLink(shortCode: string, destination: string) {
  try {
    await requireAuth();
    
    // Validate short code
    const validation = isShortCodeAllowed(shortCode);
    if (!validation.allowed) {
      return { error: validation.error };
    }
    
    // Validate URL
    new URL(destination);
    
    // Create in database (unique constraint will catch duplicates)
    await createLink(shortCode, destination);
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('createLink error:', error);
    if (error.message?.includes('UNIQUE constraint failed')) {
      return { error: 'Short code already exists. Please choose another.' };
    }
    return { error: error.message || 'Failed to create link' };
  }
}

export async function updateExistingLink(id: string, shortCode: string, destination: string) {
  try {
    await requireAuth();
    
    const validation = isShortCodeAllowed(shortCode);
    if (!validation.allowed) {
      return { error: validation.error };
    }
    
    new URL(destination);
    await updateLink(id, shortCode, destination);
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('updateLink error:', error);
    if (error.message?.includes('UNIQUE constraint failed')) {
      return { error: 'Short code already in use.' };
    }
    return { error: error.message || 'Failed to update link' };
  }
}

export async function deleteExistingLink(id: string) {
  try {
    await requireAuth();
    await deleteLink(id);
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('deleteLink error:', error);
    return { error: error.message || 'Failed to delete link' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/manage');
}
