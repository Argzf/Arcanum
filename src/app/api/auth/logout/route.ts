import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set('admin_session', '', {
    maxAge: 0,
    path: '/',
  });

  response.cookies.set('next-auth.session-token', '', {
    maxAge: 0,
    path: '/',
  });

  response.cookies.set('__Secure-next-auth.session-token', '', {
    maxAge: 0,
    path: '/',
  });

  response.cookies.set('next-auth.callback-url', '', {
    maxAge: 0,
    path: '/',
  });

  response.cookies.set('__Secure-next-auth.callback-url', '', {
    maxAge: 0,
    path: '/',
  });

  response.cookies.set('next-auth.csrf-token', '', {
    maxAge: 0,
    path: '/',
  });

  response.cookies.set('__Secure-next-auth.csrf-token', '', {
    maxAge: 0,
    path: '/',
  });

  return response;
}
