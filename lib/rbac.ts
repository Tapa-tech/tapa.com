import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export type RoleName = 'CUSTOMER' | 'ADMIN' | 'SUPER_USER';

export const ROLES: Record<RoleName, RoleName> = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
  SUPER_USER: 'SUPER_USER',
};

export const DEFAULT_ROLE: RoleName = 'CUSTOMER';

/**
 * Safe normalization for role strings & legacy role mappings:
 * - SUPER_ADMIN -> SUPER_USER
 * - EDITOR -> ADMIN
 * - ADMIN -> ADMIN
 * - CUSTOMER -> CUSTOMER
 */
export function normalizeRole(role: string | undefined | null): RoleName {
  if (!role) return DEFAULT_ROLE;
  const upper = role.toUpperCase();
  if (upper === 'SUPER_ADMIN' || upper === 'SUPERUSER' || upper === 'SUPER_USER') {
    return 'SUPER_USER';
  }
  if (upper === 'EDITOR' || upper === 'ADMIN') {
    return 'ADMIN';
  }
  return 'CUSTOMER';
}

// Hierarchical role rank values for inherited authorization checks
const ROLE_RANKS: Record<RoleName, number> = {
  CUSTOMER: 1,
  ADMIN: 2,
  SUPER_USER: 3,
};

/**
 * Checks if a user role meets or exceeds the required role level based on role hierarchy
 */
export function hasRole(userRole: string | undefined | null, requiredRole: RoleName): boolean {
  const currentRole = normalizeRole(userRole);
  const userRank = ROLE_RANKS[currentRole] || 1;
  const requiredRank = ROLE_RANKS[normalizeRole(requiredRole)] || 1;

  return userRank >= requiredRank;
}

/**
 * Checks if a user role is included in an array of allowed roles
 */
export function hasAnyRole(userRole: string | undefined | null, allowedRoles: RoleName[]): boolean {
  const currentRole = normalizeRole(userRole);
  const normalizedAllowed = allowedRoles.map((r) => normalizeRole(r));
  return normalizedAllowed.includes(currentRole);
}

/**
 * Explicit check: Can the acting user delete other users?
 * ONLY SUPER_USER can delete users. ADMIN and CUSTOMER cannot.
 */
export function canDeleteUser(actingUserRole: string | undefined | null): boolean {
  const role = normalizeRole(actingUserRole);
  return role === 'SUPER_USER';
}

/**
 * Explicit check: Can the acting user promote a target user to SUPER_USER?
 * ONLY SUPER_USER can promote anyone to SUPER_USER.
 */
export function canPromoteToSuperUser(actingUserRole: string | undefined | null): boolean {
  const role = normalizeRole(actingUserRole);
  return role === 'SUPER_USER';
}

/**
 * Explicit check: Can the acting user modify another user's role?
 * Rules:
 * 1. SUPER_USER can modify any user's role.
 * 2. ADMIN cannot delete users, cannot promote anyone to SUPER_USER, cannot change its own role, cannot grant itself additional privileges.
 * 3. CUSTOMER cannot modify any user's role.
 */
export function canModifyRole(
  actingUserRole: string | undefined | null,
  actingUserId: string,
  targetUserId: string,
  targetNewRole: string
): { allowed: boolean; reason?: string } {
  const actingRole = normalizeRole(actingUserRole);
  const newRole = normalizeRole(targetNewRole);

  if (actingRole === 'CUSTOMER') {
    return {
      allowed: false,
      reason: 'Forbidden: Customers cannot modify user roles.',
    };
  }

  if (actingRole === 'ADMIN') {
    // ADMIN cannot change its own role
    if (actingUserId === targetUserId) {
      return {
        allowed: false,
        reason: 'Forbidden: Admins cannot modify their own role or escalate their privileges.',
      };
    }

    // ADMIN cannot promote anyone to SUPER_USER
    if (newRole === 'SUPER_USER') {
      return {
        allowed: false,
        reason: 'Forbidden: Admins cannot promote users to SUPER_USER.',
      };
    }
  }

  return { allowed: true };
}

/**
 * Secure server-side helper to retrieve the authenticated session from NextAuth
 */
export async function getAuthenticatedServerSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return null;
  }
  return session;
}

export interface AuthorizeResult {
  authorized: boolean;
  statusCode: 200 | 401 | 403;
  error?: string;
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: RoleName;
  };
}

/**
 * Server-side guard to verify authentication and role authorization for API routes and server actions
 */
export async function authorizeRequest(allowedRoles?: RoleName | RoleName[]): Promise<AuthorizeResult> {
  const session = await getAuthenticatedServerSession();

  if (!session || !session.user) {
    return {
      authorized: false,
      statusCode: 401,
      error: 'Unauthorized: Authentication required.',
    };
  }

  const userId = (session.user as { id?: string }).id;
  const rawRole = (session.user as { role?: string }).role;
  const userRole = normalizeRole(rawRole);

  if (!userId) {
    return {
      authorized: false,
      statusCode: 401,
      error: 'Unauthorized: Invalid user session.',
    };
  }

  if (allowedRoles) {
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const isAllowed = hasAnyRole(userRole, rolesArray) || rolesArray.some((r) => hasRole(userRole, r));

    if (!isAllowed) {
      return {
        authorized: false,
        statusCode: 403,
        error: `Forbidden: Access requires one of the following roles: ${rolesArray.join(', ')}.`,
      };
    }
  }

  return {
    authorized: true,
    statusCode: 200,
    user: {
      id: userId,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      role: userRole,
    },
  };
}
