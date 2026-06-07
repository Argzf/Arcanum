// File: src/lib/auth.ts
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const secretKey = process.env.JWT_SECRET!;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(key);
}

export async function decrypt(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  return token ? await decrypt(token) : null;
}

export async function setSessionCookie(
  response: NextResponse,
  session: any
) {
  const token = await encrypt(session);

  response.cookies.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });

  return response;
}

// ------------------------------------------------------------------
// NextAuth configuration for Discord login
// ------------------------------------------------------------------
import { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

const ALLOWED_DISCORD_USER_IDS = ['935053416877666304'];

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      // Only allow the specified Discord user ID
      return ALLOWED_DISCORD_USER_IDS.includes(user.id);
    },
    async jwt({ token, account }) {
      // On first sign-in, store the Discord access token and refresh token in the JWT
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }) {
      // If the user is allowed, mark them as admin
      if (token.sub && ALLOWED_DISCORD_USER_IDS.includes(token.sub)) {
        session.user.id = token.sub;
        session.user.isAdmin = true;
      }
      // Expose the Discord access token on the session for potential use
      session.user.accessToken = token.accessToken as string;
      return session;
    },
  },

  pages: {
    signIn: '/manage',
  },

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: 'jwt',
  },
};
