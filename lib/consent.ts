import { logSecurityEvent } from '@/lib/audit-logger';

export interface ConsentPayload {
  userId?: string;
  email: string;
  phone?: string;
  consentGiven: boolean;
  version?: string;
  ip?: string;
}

/**
 * Record user consent for account management & platform terms
 */
export function recordUserConsent(payload: ConsentPayload): {
  success: boolean;
  timestamp: string;
  version: string;
} {
  const timestamp = new Date().toISOString();
  const version = payload.version || 'v1.0';

  if (!payload.consentGiven) {
    throw new Error('User consent must be explicitly granted.');
  }

  logSecurityEvent({
    event: 'USER_PROFILE_UPDATED_BY_ADMIN',
    userId: payload.userId || 'pending_signup',
    phone: payload.phone,
    ip: payload.ip,
    details: `Consent ${version} recorded for ${payload.email} at ${timestamp}`,
  });

  return {
    success: true,
    timestamp,
    version,
  };
}
