import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  // Delete both possible NextAuth session cookies (development and production)
  response.cookies.set('next-auth.session-token', '', { maxAge: -1, path: '/' });
  response.cookies.set('__Secure-next-auth.session-token', '', { maxAge: -1, path: '/' });
  return response;
}
