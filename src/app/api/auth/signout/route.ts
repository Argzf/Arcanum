// File: src/app/api/auth/signout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  // Delete NextAuth session cookies (all possible variants)
  response.cookies.set('next-auth.session-token', '', {
    path: '/',
    maxAge: -1,
  });
  response.cookies.set('__Secure-next-auth.session-token', '', {
    path: '/',
    maxAge: -1,
  });
  response.cookies.set('next-auth.callback-url', '', {
    path: '/',
    maxAge: -1,
  });
  response.cookies.set('__Secure-next-auth.callback-url', '', {
    path: '/',
    maxAge: -1,
  });
  response.cookies.set('next-auth.csrf-token', '', {
    path: '/',
    maxAge: -1,
  });
  response.cookies.set('__Secure-next-auth.csrf-token', '', {
    path: '/',
    maxAge: -1,
  });
  response.cookies.set('admin_session', '', {
    path: '/',
    maxAge: -1,
  });
  return response;
}
