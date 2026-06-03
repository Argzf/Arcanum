import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  // Log every request to help debug subdomain issues
  console.log(`[Middleware] Host: ${request.headers.get('host')}, Path: ${request.nextUrl.pathname}`);

  if (isAdminRoute && !session) {
    const loginUrl = new URL('/manage', request.url);
    loginUrl.searchParams.set('from', '/admin');
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*', // only run on admin routes, not dynamic ones
};
