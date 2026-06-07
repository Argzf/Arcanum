'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  const cookieStore = await cookies();

  cookieStore.delete('admin_session');

  cookieStore.delete('next-auth.session-token');
  cookieStore.delete('__Secure-next-auth.session-token');

  cookieStore.delete('next-auth.callback-url');
  cookieStore.delete('__Secure-next-auth.callback-url');

  cookieStore.delete('next-auth.csrf-token');
  cookieStore.delete('__Secure-next-auth.csrf-token');

  redirect('/manage');
}
