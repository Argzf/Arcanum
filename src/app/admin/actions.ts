'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getAllLinks, createLink, updateLink, deleteLink } from '@/lib/db';

async function requireAuth() {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');
}

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
    if (!/^[a-zA-Z0-9\-_]+$/.test(shortCode)) {
      return { error: 'Short code can only contain letters, numbers, hyphens and underscores' };
    }
    new URL(destination); // validates URL
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
    if (!/^[a-zA-Z0-9\-_]+$/.test(shortCode)) {
      return { error: 'Short code can only contain letters, numbers, hyphens and underscores' };
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
