import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

export default withAuth(
  async function middleware(request: NextRequest) {
    // Check legacy JWT session
    const session = await getSession();
    if (session) {
      // Allow access even without NextAuth token
      return NextResponse.next();
    }
    // Otherwise, let NextAuth handle authorization (based on token)
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Allow if NextAuth token exists
        return !!token;
      },
    },
    pages: {
      signIn: '/manage',
    },
  }
);

// Apply this middleware only to /admin routes
export const config = {
  matcher: ['/admin/:path*'],
};
