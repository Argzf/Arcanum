import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET!;
const key = new TextEncoder().encode(secretKey);

async function verifyAdminSession(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, key);
    return true;
  } catch {
    return false;
  }
}

export default withAuth(
  async function middleware(_request: NextRequest) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: async ({ token, req }) => {
        // Valid NextAuth session
        if (token) {
          return true;
        }

        // Valid legacy admin JWT
        const adminSession =
          req.cookies.get('admin_session')?.value;

        if (!adminSession) {
          return false;
        }

        return await verifyAdminSession(adminSession);
      },
    },
    pages: {
      signIn: '/manage',
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
