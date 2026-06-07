import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';

export default withAuth(
  async function middleware(request: NextRequest) {
    // Check legacy JWT session (password login)
    const session = await getSession();
    if (session) {
      return NextResponse.next();
    }
    // Otherwise, let NextAuth handle authorization (based on token)
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: { signIn: '/manage' },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
