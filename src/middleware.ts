// src/middleware.ts – your existing code is fine
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  console.log(`[Middleware] Host: ${request.headers.get('host')}, Path: ${request.nextUrl.pathname}`);

  if (isAdminRoute && !session) {
    const loginUrl = new URL('/manage', request.url);
    loginUrl.searchParams.set('from', '/admin');
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon|robots.txt|links-favicon.svg|files-favicon.svg|central-favicon.svg).*)',
  ],
};
