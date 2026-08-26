import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { checkRateLimit } from '@/lib/rate-limit';
import { logSecurityEvent } from '@/lib/audit-logger';

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const ip = req.ip || req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

  // 1. Apply Rate Limiting to Sensitive Auth Action Endpoints
  if (path.startsWith('/api/auth/callback') || path.startsWith('/api/auth/signin') || path.startsWith('/api/auth/otp')) {
    const rateLimit = checkRateLimit(`auth:${ip}`, 15, 60); // Max 15 auth attempts per minute per IP
    if (!rateLimit.success) {
      logSecurityEvent({
        event: 'RATE_LIMIT_EXCEEDED',
        ip,
        details: `Path: ${path} | Reset in ${rateLimit.resetSeconds}s`,
      });

      const response = NextResponse.json(
        { success: false, error: 'Too many authentication requests. Please wait and try again.' },
        { status: 429 }
      );
      response.headers.set('Retry-After', rateLimit.resetSeconds.toString());
      return applySecurityHeaders(response);
    }
  }


  // 2. Protect Admin Dashboard Frontend Routes (/admin/dashboard)
  if (path.startsWith('/admin/dashboard')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      logSecurityEvent({
        event: 'UNAUTHORIZED_ACCESS_ATTEMPT',
        ip,
        details: `Attempted unauthenticated access to ${path}`,
      });
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(loginUrl);
    }

    const userRole = (token.role as string)?.toUpperCase() || 'USER';

    if (path.startsWith('/admin/dashboard/dharmic-concepts')) {
      if (!['EDITOR', 'ADMIN'].includes(userRole)) {
        logSecurityEvent({
          event: 'FORBIDDEN_ROLE_ATTEMPT',
          userId: token.id as string,
          ip,
          details: `Role ${userRole} attempted access to Dharmic Concepts CMS ${path}`,
        });
        const loginUrl = new URL('/admin/login', req.url);
        loginUrl.searchParams.set('error', 'forbidden');
        return NextResponse.redirect(loginUrl);
      }
    } else if (userRole !== 'ADMIN') {
      logSecurityEvent({
        event: 'FORBIDDEN_ROLE_ATTEMPT',
        userId: token.id as string,
        ip,
        details: `Role ${userRole} attempted access to ADMIN dashboard ${path}`,
      });
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('error', 'forbidden');
      return NextResponse.redirect(loginUrl);
    }
  }


  // 3. Protect Backend API Routes & Role Authorization
  if (path.startsWith('/api/admin') || path.startsWith('/api/editor') || path.startsWith('/api/user')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Authentication Check (401)
    if (!token) {
      logSecurityEvent({
        event: 'UNAUTHORIZED_ACCESS_ATTEMPT',
        ip,
        details: `Attempted access to ${path}`,
      });

      return applySecurityHeaders(
        NextResponse.json(
          { success: false, error: 'Unauthorized: Authentication required.' },
          { status: 401 }
        )
      );
    }

    const userRole = (token.role as string)?.toUpperCase() || 'USER';

    // Admin Route Protection (403 for non-ADMINs)
    if (path.startsWith('/api/admin')) {
      if (userRole !== 'ADMIN') {
        logSecurityEvent({
          event: 'FORBIDDEN_ROLE_ATTEMPT',
          userId: token.id as string,
          ip,
          details: `Role ${userRole} attempted access to ADMIN route ${path}`,
        });

        return applySecurityHeaders(
          NextResponse.json(
            { success: false, error: 'Forbidden: Access requires ADMIN role.' },
            { status: 403 }
          )
        );
      }
    }

    // Editor Route Protection (403 for non-EDITOR and non-ADMIN)
    if (path.startsWith('/api/editor')) {
      if (!['EDITOR', 'ADMIN'].includes(userRole)) {
        logSecurityEvent({
          event: 'FORBIDDEN_ROLE_ATTEMPT',
          userId: token.id as string,
          ip,
          details: `Role ${userRole} attempted access to EDITOR route ${path}`,
        });

        return applySecurityHeaders(
          NextResponse.json(
            { success: false, error: 'Forbidden: Access requires EDITOR or ADMIN role.' },
            { status: 403 }
          )
        );
      }
    }
  }

  const response = NextResponse.next();
  return applySecurityHeaders(response);
}

/**
 * Attaches production-grade security headers to HTTP responses
 */
function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  return response;
}

export const config = {
  matcher: ['/admin/dashboard/:path*', '/api/auth/:path*', '/api/admin/:path*', '/api/editor/:path*', '/api/user/:path*'],
};
