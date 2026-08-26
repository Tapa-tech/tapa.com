export type AuditEventType =
  | 'AUTH_LOGIN_SUCCESS'
  | 'AUTH_LOGIN_FAILURE'
  | 'OTP_REQUESTED'
  | 'OTP_VERIFICATION_SUCCESS'
  | 'OTP_VERIFICATION_FAILURE'
  | 'UNAUTHORIZED_ACCESS_ATTEMPT'
  | 'FORBIDDEN_ROLE_ATTEMPT'
  | 'RATE_LIMIT_EXCEEDED';

export interface AuditLogPayload {
  event: AuditEventType;
  userId?: string;
  phone?: string;
  ip?: string;
  details?: string;
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
 * Security Audit Logger - records authentication and security events without exposing secrets or OTPs
 */
export function logSecurityEvent({ event, userId, phone, ip, details }: AuditLogPayload): void {
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

  // Structured security log output
  console.log(`[SECURITY AUDIT] ${timestamp} | ${event} | User: ${logEntry.userId} | Phone: ${logEntry.phone} | IP: ${logEntry.ip} ${details ? '| ' + details : ''}`);
}
