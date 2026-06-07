'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  // Clear legacy JWT cookie
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  
  // NextAuth session cookies (both possible names)
  cookieStore.delete('next-auth.session-token');
  cookieStore.delete('__Secure-next-auth.session-token');
  
  // Redirect to login page
  redirect('/manage');
}
