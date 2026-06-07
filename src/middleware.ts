// File: src/middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET!;
const key = new TextEncoder().encode(secretKey);

export default withAuth(
  async function middleware(_request: NextRequest) {
    // We just call next(); actual auth logic is in the authorized callback
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: async ({ token, req }) => {
        if (token) {
          // If there is a NextAuth JWT, optionally verify it with Discord
          // (since Discord tokens aren't auto-revoked on deauth, we check here)
          if (token.accessToken) {
            try {
              const res = await fetch('https://discord.com/api/users/@me', {
                headers: { Authorization: `Bearer ${token.accessToken}` },
              });
              if (!res.ok) {
                // Token is invalid (possibly revoked), deny access
                return false;
              }
            } catch (err) {
              return false;
            }
          }
          // Valid NextAuth session
          return true;
        }

        // No NextAuth token; check legacy admin_session JWT cookie
        const adminSession = req.cookies.get('admin_session')?.value;
        if (!adminSession) {
          return false;
        }
        try {
          await jwtVerify(adminSession, key);
          return true;
        } catch {
          return false;
        }
      },
    },
    pages: {
      signIn: '/manage',
    },
  }
);

// Protect the /admin/* routes
export const config = {
  matcher: ['/admin/:path*'],
};
