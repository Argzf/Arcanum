'use server';

import { cookies } from 'next/headers';
import { encrypt } from '@/lib/auth';

export async function login(formData: FormData, redirectTo: string) {
  const password = formData.get('password') as string;
  if (password === process.env.ADMIN_PASSWORD) {
    const token = await encrypt({ authenticated: true });
    const cookieStore = await cookies();
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    return { redirect: redirectTo };
  } else {
    return { error: 'Invalid password' };
  }
}
