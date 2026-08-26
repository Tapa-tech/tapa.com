interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodically clean up expired rate limit entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((record, key) => {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

/**
 * In-memory sliding window rate limiter
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowSeconds: number = 60
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const key = `${identifier}:${windowSeconds}`;

  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, newRecord);

    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetSeconds: windowSeconds,
    };
  }

  if (record.count >= limit) {
    const resetSeconds = Math.ceil((record.resetTime - now) / 1000);
    return {
      success: false,
      limit,
      remaining: 0,
      resetSeconds,
    };
  }

  record.count += 1;
  const remaining = Math.max(0, limit - record.count);
  const resetSeconds = Math.ceil((record.resetTime - now) / 1000);

  return {
    success: true,
    limit,
    remaining,
    resetSeconds,
  };
}

/**
 * Rate limit helper for general authentication/login attempts
 */
export function limitAuthAttempts(ip: string): RateLimitResult {
  return checkRateLimit(`auth:${ip}`, 5, 60); // 5 attempts per 60 seconds
}

/**
 * Rate limit helper for OTP requests
 */
export function limitOtpRequests(identifier: string): RateLimitResult {
  return checkRateLimit(`otp:${identifier}`, 3, 300); // 3 OTP requests per 5 minutes
}
