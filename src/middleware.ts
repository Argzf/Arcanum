import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // Clone headers and set the custom x-pathname header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  const session = await getSession();
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  // Optional logging (keep if you find it useful)
  console.log(`[Middleware] Host: ${request.headers.get('host')}, Path: ${request.nextUrl.pathname}`);

  // Admin route protection
  if (isAdminRoute && !session) {
    const loginUrl = new URL('/manage', request.url);
    loginUrl.searchParams.set('from', '/admin');
    return NextResponse.redirect(loginUrl);
  }

  // Continue with the modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Expand matcher to cover all routes except static assets, API, and special files
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API routes (/api/*)
     * - Next.js internal assets (_next/static, _next/image)
     * - favicon and other static icons
     * - robots.txt, sitemap.xml
     * - static SVG favicons in public
     */
    '/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon|robots.txt|links-favicon.svg|files-favicon.svg|central-favicon.svg).*)',
  ],
};
