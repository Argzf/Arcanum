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

  if (!token) {
    return null;
  }

  return await decrypt(token);
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
    maxAge: 60 * 60 * 24,
  });

  return response;
}

import { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

const ALLOWED_DISCORD_USER_IDS = [
  '935053416877666304',
];

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      return ALLOWED_DISCORD_USER_IDS.includes(user.id);
    },

    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }

      if (
        token.sub &&
        !ALLOWED_DISCORD_USER_IDS.includes(token.sub)
      ) {
        return {};
      }

      return token;
    },

    async session({ session, token }) {
      if (
        token.sub &&
        ALLOWED_DISCORD_USER_IDS.includes(token.sub)
      ) {
        session.user.id = token.sub;
        session.user.isAdmin = true;
      }

      return session;
    },
  },

  pages: {
    signIn: '/manage',
  },

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: 'jwt',
    maxAge: 60 * 60,
  },
};
