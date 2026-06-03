// Add this import at the top
import { checkExists } from '@/lib/db';

// Replace the createNewLink function
export async function createNewLink(shortCode: string, destination: string) {
  try {
    await requireAuth();
    const check = isShortCodeAllowed(shortCode);
    if (!check.allowed) return { error: check.error };
    new URL(destination);
    
    // Check if short code already exists as a link
    const exists = await checkExists(shortCode, 'link');
    if (exists) return { error: 'Short code already used for a link.' };
    
    await createLink(shortCode, destination);
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// Replace the uploadNewFile function
export async function uploadNewFile(formData: FormData) {
  try {
    await requireAuth();
    
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return { error: 'Blob storage token missing. Please add BLOB_READ_WRITE_TOKEN to environment variables.' };
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
    console.error(error);
    return { error: error.message };
  }
}
