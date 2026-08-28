import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/db';
import { verifyPhoneOtp } from '@/lib/otp';
import { DEFAULT_ROLE } from '@/lib/rbac';
import { logSecurityEvent } from '@/lib/audit-logger';
import { verifyPassword } from '@/lib/password';

const isProduction = process.env.NODE_ENV === 'production';
const useSecureCookies = isProduction && process.env.NEXTAUTH_URL?.startsWith('https://');

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies,
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },

  cookies: {
    sessionToken: {
      name: useSecureCookies ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
      },
    },
    callbackUrl: {
      name: useSecureCookies ? '__Secure-next-auth.callback-url' : 'next-auth.callback-url',
      options: {
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
      },
    },
    csrfToken: {
      name: useSecureCookies ? '__Host-next-auth.csrf-token' : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
      },
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days session expiration
    updateAge: 24 * 60 * 60, // 24 hours refresh window
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      id: 'phone-otp',
      name: 'Phone OTP',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) return null;
        const result = await verifyPhoneOtp(credentials.phone, credentials.otp);
        if (!result.success || !result.user) {
          logSecurityEvent({
            event: 'OTP_VERIFICATION_FAILURE',
            phone: credentials.phone,
            details: result.error || 'Invalid OTP',
          });
          return null;
        }

        logSecurityEvent({
          event: 'OTP_VERIFICATION_SUCCESS',
          userId: result.user.id,
          phone: result.user.phone || undefined,
        });

        return {
          id: result.user.id,
          name: result.user.name || result.user.phone || 'User',
          email: result.user.email,
          image: result.user.image,
          role: result.user.role || DEFAULT_ROLE,
        };
      },
    }),
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        username: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const identifier = credentials.username.trim().toLowerCase();

        // Look up matching user in database by email, phone, or name
        const dbUser = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier },
              { phone: identifier },
              { name: identifier },
            ],
          },
        });

        if (dbUser) {
          // If user has a password in DB, verify it securely
          if (dbUser.password) {
            const isValid = verifyPassword(credentials.password, dbUser.password);
            if (!isValid) {
              logSecurityEvent({
                event: 'AUTH_LOGIN_FAILURE',
                userId: dbUser.id,
                details: 'Invalid password attempt',
              });
              return null; // Invalid password -> reject authentication
            }
          }

          logSecurityEvent({
            event: 'AUTH_LOGIN_SUCCESS',
            userId: dbUser.id,
            details: `Credentials login with role ${dbUser.role}`,
          });

          return {
            id: dbUser.id,
            name: dbUser.name || dbUser.email || identifier,
            email: dbUser.email,
            phone: dbUser.phone,
            role: dbUser.role || DEFAULT_ROLE,
          };
        }

        logSecurityEvent({
          event: 'AUTH_LOGIN_FAILURE',
          details: `User not found: ${identifier}`,
        });

        return null;
      },
    }),

  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || DEFAULT_ROLE;
      } else if (token.id) {
        // Refresh latest role directly from DB if needed
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
        }
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; role?: string }).id = token.id as string;
        (session.user as { id?: string; role?: string }).role = (token.role as string) || DEFAULT_ROLE;
      }
      return session;
    },
  },
};
