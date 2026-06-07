import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

// This middleware runs for all routes except static assets
export async function middleware(request: NextRequest) {
  // Legacy JWT-based admin protection (password login)
  const session = await getSession();
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  if (isAdminRoute && !session) {
    const loginUrl = new URL('/manage', request.url);
    loginUrl.searchParams.set('from', '/admin');
    return NextResponse.redirect(loginUrl);
  }

  // Let NextAuth handle its own routes
  return NextResponse.next();
}

// Use NextAuth's withAuth for Discord session protection on /admin
// This will run after our custom middleware
export const config = {
  matcher: [
    '/admin/:path*',
    '/manage/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon|robots.txt|links-favicon.svg|files-favicon.svg|central-favicon.svg|banner.png).*)',
  ],
};

// Apply NextAuth's withAuth to protect /admin routes (for Discord users)
export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Allow if either NextAuth token exists (Discord login) or legacy session already passed above
        // We rely on the custom middleware above for legacy JWT; this just prevents unauthenticated access.
        return !!token;
      },
    },
  }
);
