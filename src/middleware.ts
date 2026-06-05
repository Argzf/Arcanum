// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  // Optional logging
  console.log(`[Middleware] Host: ${request.headers.get('host')}, Path: ${request.nextUrl.pathname}`);

  // Admin route protection – redirect unauthenticated users
  if (isAdminRoute && !session) {
    const loginUrl = new URL('/manage', request.url);
    loginUrl.searchParams.set('from', '/admin');
    return NextResponse.redirect(loginUrl);
  }

  // For everything else, continue without adding custom headers
  return NextResponse.next();
}

// The matcher remains the same to exclude static assets
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon|robots.txt|links-favicon.svg|files-favicon.svg|central-favicon.svg).*)',
  ],
};
