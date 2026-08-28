import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export type RoleName = 'CUSTOMER' | 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN';

export const ROLES: Record<RoleName, RoleName> = {
  CUSTOMER: 'CUSTOMER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

export const DEFAULT_ROLE: RoleName = 'CUSTOMER';

// Hierarchical role rank values for inherited authorization checks
const ROLE_RANKS: Record<RoleName, number> = {
  CUSTOMER: 1,
  EDITOR: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
};

/**
 * Checks if a user role meets or exceeds the required role level based on role hierarchy
 */
export function hasRole(userRole: string | undefined | null, requiredRole: RoleName): boolean {
  const currentRole = (userRole?.toUpperCase() || DEFAULT_ROLE) as RoleName;
  const userRank = ROLE_RANKS[currentRole] || 1;
  const requiredRank = ROLE_RANKS[requiredRole] || 1;

  return userRank >= requiredRank;
}

/**
 * Checks if a user role is included in an array of allowed roles
 */
export function hasAnyRole(userRole: string | undefined | null, allowedRoles: RoleName[]): boolean {
  const currentRole = (userRole?.toUpperCase() || DEFAULT_ROLE) as RoleName;
  return allowedRoles.map((r) => r.toUpperCase()).includes(currentRole);
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
  const userRole = ((session.user as { role?: string }).role || DEFAULT_ROLE) as RoleName;

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

/**
 * Prevents non-ADMIN users from altering user roles or performing self-role escalation
 */
export function validateRoleModification(
  actingUserRole: string | undefined,
  actingUserId: string,
  targetUserId: string,
  requestedNewRole: string
): { allowed: boolean; reason?: string } {
  const actingRole = (actingUserRole?.toUpperCase() || DEFAULT_ROLE) as RoleName;
  const newRole = requestedNewRole.toUpperCase() as RoleName;

  if (actingRole !== 'ADMIN') {
    return {
      allowed: false,
      reason: 'Forbidden: Only ADMIN users can modify user roles.',
    };
  }

  if (actingUserId === targetUserId && newRole !== 'ADMIN') {
    return {
      allowed: false,
      reason: 'Forbidden: Admins cannot demote their own admin role.',
    };
  }

  if (!['USER', 'EDITOR', 'ADMIN'].includes(newRole)) {
    return {
      allowed: false,
      reason: `Invalid role specified: ${requestedNewRole}`,
    };
  }

  return { allowed: true };
}
