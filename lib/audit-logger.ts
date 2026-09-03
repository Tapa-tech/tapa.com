export type AuditEventType =
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILURE'
  | 'OTP_REQUESTED'
  | 'OTP_VERIFICATION_SUCCESS'
  | 'OTP_VERIFICATION_FAILURE'
  | 'UNAUTHORIZED_ACCESS_ATTEMPT'
  | 'FORBIDDEN_ROLE_ATTEMPT'
  | 'RATE_LIMIT_EXCEEDED'
  | 'CONCURRENT_SUPER_USER_SESSION_REJECTED'
  | 'USER_CREATED_BY_ADMIN'
  | 'USER_PROFILE_UPDATED_BY_ADMIN'
  | 'USER_ROLE_CHANGED_BY_ADMIN'
  | 'USER_ACTIVATION_TOGGLED'
  | 'USER_DELETED_BY_ADMIN';

export interface AuditLogPayload {
  event: AuditEventType;
  userId?: string;
  phone?: string;
  ip?: string;
  details?: string;
  severity?: 'INFO' | 'WARN' | 'CRITICAL';
}

/**
 * Sanitizes phone numbers for audit logging (+91******1234)
 */
function sanitizePhoneForLog(phone?: string): string | undefined {
  if (!phone) return undefined;
  if (phone.length <= 4) return '****';
  return phone.slice(0, 3) + '******' + phone.slice(-4);
}

/**
 * Security Audit Logger - records authentication and security events without exposing secrets or OTPs.
 * Safe for both Edge Middleware and Node.js Server Runtimes.
 */
export function logSecurityEvent({ event, userId, phone, ip, details, severity = 'INFO' }: AuditLogPayload): void {
  const timestamp = new Date().toISOString();
  const safePhone = sanitizePhoneForLog(phone);

  const logEntry = {
    timestamp,
    event,
    userId: userId || 'anonymous',
    phone: safePhone,
    ip: ip || 'unknown',
    details: details || '',
  };

  // Structured security log output (safe for all runtimes)
  console.log(`[SECURITY AUDIT] ${timestamp} | ${event} | User: ${logEntry.userId} | Phone: ${logEntry.phone} | IP: ${logEntry.ip} ${details ? '| ' + details : ''}`);

  // Skip Prisma DB insertion in Edge Runtime (Middleware) to prevent Edge PrismaClient errors
  if (process.env.NEXT_RUNTIME === 'edge' || typeof (globalThis as any).EdgeRuntime === 'string') {
    return;
  }

  // DB insertion if PostgreSQL is connected (Node.js runtime only)
  if (process.env.DATABASE_URL?.startsWith('postgres')) {
    import('@/lib/db')
      .then(({ prisma }) => {
        return prisma.auditLog.create({
          data: {
            event,
            actor: userId || 'anonymous',
            role: 'USER',
            target: phone ? safePhone : userId || 'system',
            ipAddress: ip || 'unknown',
            severity,
            details: details || null,
            userId: userId || null,
          },
        });
      })
      .catch((err) => {
        console.error('[SECURITY AUDIT DB LOG ERROR]', err?.message || err);
      });
  }
}
