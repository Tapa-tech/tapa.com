import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { sendSms } from '@/lib/sms';
import { DEFAULT_ROLE } from '@/lib/rbac';

const OTP_SECRET = process.env.OTP_SECRET || process.env.NEXTAUTH_SECRET || 'default-otp-secret-key';
const OTP_EXPIRY_MINUTES = 5;
const RESEND_COOLDOWN_SECONDS = 60;
const MAX_ATTEMPTS = 3;

/**
 * Normalizes phone numbers to standard E.164 format
 */
export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('+')) return cleaned;
  if (cleaned.length === 10) return `+91${cleaned}`;
  return `+${cleaned}`;
}

/**
 * Generates a cryptographically secure 6-digit OTP
 */
export function generateSecureOtp(): string {
  const num = crypto.randomInt(100000, 1000000);
  return num.toString();
}

/**
 * Hashes OTP using HMAC SHA-256 for secure storage
 */
export function hashOtp(otp: string): string {
  return crypto.createHmac('sha256', OTP_SECRET).update(otp).digest('hex');
}

/**
 * Requests and dispatches an OTP to the given phone number with rate limiting and secure hashing
 */
export async function requestPhoneOtp(rawPhone: string): Promise<{ success: boolean; message: string; cooldownRemaining?: number }> {
  const phone = normalizePhone(rawPhone);

  // Check rate limiting / cooldown
  const existingVerification = await prisma.otpVerification.findUnique({
    where: { phone },
  });

  if (existingVerification) {
    const elapsedSeconds = Math.floor((Date.now() - existingVerification.lastSentAt.getTime()) / 1000);
    if (elapsedSeconds < RESEND_COOLDOWN_SECONDS) {
      const cooldownRemaining = RESEND_COOLDOWN_SECONDS - elapsedSeconds;
      return {
        success: false,
        message: `Please wait ${cooldownRemaining} seconds before requesting a new OTP.`,
        cooldownRemaining,
      };
    }
  }

  // Generate CSPRNG OTP and secure hash
  const otp = generateSecureOtp();
  const hashedOtp = hashOtp(otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // Upsert OTP record
  await prisma.otpVerification.upsert({
    where: { phone },
    create: {
      phone,
      hashedOtp,
      attempts: 0,
      maxAttempts: MAX_ATTEMPTS,
      expiresAt,
      lastSentAt: new Date(),
    },
    update: {
      hashedOtp,
      attempts: 0,
      expiresAt,
      lastSentAt: new Date(),
    },
  });

  // Dispatch SMS
  const smsSent = await sendSms({
    phone,
    message: `Your verification code for The Tapa Co. is ${otp}. It will expire in ${OTP_EXPIRY_MINUTES} minutes.`,
  });

  if (!smsSent) {
    return {
      success: false,
      message: 'Failed to send OTP via SMS. Please try again.',
    };
  }

  // Generic message to prevent phone number enumeration
  return {
    success: true,
    message: 'If the phone number is valid, a verification code has been sent.',
  };
}

/**
 * Verifies OTP, enforces attempt limits, single-use invalidation, and connects to User account
 */
export async function verifyPhoneOtp(rawPhone: string, inputOtp: string) {
  const phone = normalizePhone(rawPhone);

  const verification = await prisma.otpVerification.findUnique({
    where: { phone },
  });

  if (!verification) {
    return { success: false, error: 'OTP request not found or expired. Please request a new code.' };
  }

  // Check expiration
  if (verification.expiresAt < new Date()) {
    await prisma.otpVerification.delete({ where: { phone } });
    return { success: false, error: 'Verification code has expired. Please request a new code.' };
  }

  // Check brute-force attempt limits
  if (verification.attempts >= verification.maxAttempts) {
    await prisma.otpVerification.delete({ where: { phone } });
    return { success: false, error: 'Maximum verification attempts exceeded. Please request a new code.' };
  }

  // Verify hash
  const inputHash = hashOtp(inputOtp);
  const isValid = crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(verification.hashedOtp));

  if (!isValid) {
    // Increment attempts
    const updatedAttempts = verification.attempts + 1;
    if (updatedAttempts >= verification.maxAttempts) {
      await prisma.otpVerification.delete({ where: { phone } });
      return { success: false, error: 'Maximum verification attempts exceeded. Please request a new code.' };
    } else {
      await prisma.otpVerification.update({
        where: { phone },
        data: { attempts: updatedAttempts },
      });
      const remainingAttempts = verification.maxAttempts - updatedAttempts;
      return { success: false, error: `Invalid verification code. ${remainingAttempts} attempt(s) remaining.` };
    }
  }

  // Single-use invalidation: delete verification record immediately
  await prisma.otpVerification.delete({ where: { phone } });

  // Connect/Link user account or create new user
  let user = await prisma.user.findUnique({
    where: { phone },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        phone,
        phoneVerified: new Date(),
        role: DEFAULT_ROLE,
      },
    });
  } else if (!user.phoneVerified) {
    user = await prisma.user.update({
      where: { phone },
      data: { phoneVerified: new Date() },
    });
  }

  return { success: true, user };
}
