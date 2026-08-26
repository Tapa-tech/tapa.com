import crypto from 'crypto';

/**
 * Hashes a plain-text password using PBKDF2 with SHA-512 and a random salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies a candidate plain-text password against a stored hashed password
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(':')) {
    return false;
  }

  const [salt, originalHash] = storedHash.split(':');
  if (!salt || !originalHash) return false;

  const candidateHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(candidateHash, 'hex'),
      Buffer.from(originalHash, 'hex')
    );
  } catch (err) {
    return false;
  }
}
