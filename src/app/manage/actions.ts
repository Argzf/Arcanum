'use server';

import { cookies } from 'next/headers';
import { encrypt } from '@/lib/auth';

export async function login(formData: FormData, redirectTo: string) {
  try {
    const password = formData.get('password') as string;
    console.log('Login attempt, redirectTo:', redirectTo);
    if (password === process.env.ADMIN_PASSWORD) {
      console.log('Password correct, generating token');
      const token = await encrypt({ authenticated: true });
      const cookieStore = await cookies();
      cookieStore.set('admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      });
      console.log('Token set, redirecting');
      return { redirect: redirectTo };
    } else {
      console.log('Invalid password');
      return { error: 'Invalid password' };
    }
  } catch (err) {
    console.error('Login error:', err);
    return { error: 'Server error. Please try again.' };
  }
}
