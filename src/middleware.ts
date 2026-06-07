import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

// Custom middleware to check legacy JWT session (password login)
async function checkLegacySession(request: NextRequest) {
  const session = await getSession();
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  
  if (isAdminRoute && !session) {
    // No legacy session, let NextAuth handle it via withAuth
    return null;
  }
  // User has legacy session, allow
  return NextResponse.next();
}

// Export the combined middleware
export default withAuth(
  async function middleware(request: NextRequest) {
    // First, check legacy JWT session
    const legacyCheck = await checkLegacySession(request);
    if (legacyCheck) return legacyCheck;
    
    // Otherwise, let NextAuth handle the request (it will redirect if no token)
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Allow if NextAuth token exists (Discord login)
        return !!token;
      },
    },
    pages: {
      signIn: '/manage',
    },
  }
);

// Match all routes except static assets and API routes
export const config = {
  matcher: [
    '/admin/:path*',
    '/manage/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon|robots.txt|links-favicon.svg|files-favicon.svg|central-favicon.svg|banner.png).*)',
  ],
};
