import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  // Delete all possible NextAuth session cookies
  response.cookies.set('next-auth.session-token', '', { maxAge: -1, path: '/' });
  response.cookies.set('__Secure-next-auth.session-token', '', { maxAge: -1, path: '/' });
  response.cookies.set('next-auth.callback-url', '', { maxAge: -1, path: '/' });
  response.cookies.set('__Secure-next-auth.callback-url', '', { maxAge: -1, path: '/' });
  response.cookies.set('next-auth.csrf-token', '', { maxAge: -1, path: '/' });
  response.cookies.set('__Secure-next-auth.csrf-token', '', { maxAge: -1, path: '/' });
  return response;
}
