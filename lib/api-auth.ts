import { NextResponse } from 'next/server';
import { authorizeRequest, RoleName } from '@/lib/rbac';

export type AuthenticatedRouteHandler = (
  req: Request,
  context: {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: RoleName;
    };
    params?: any;
  }
) => Promise<Response> | Response;

/**
 * Reusable server-side wrapper for protecting API Route Handlers with specific role requirements
 */
export function withAuth(handler: AuthenticatedRouteHandler, allowedRoles?: RoleName | RoleName[]) {
  return async (req: Request, context?: any) => {
    const auth = await authorizeRequest(allowedRoles);

    if (!auth.authorized || !auth.user) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.statusCode }
      );
    }

    return handler(req, { ...context, user: auth.user });
  };
}

/**
 * Reusable guard requiring USER, EDITOR, or ADMIN role
 */
export function withUserAuth(handler: AuthenticatedRouteHandler) {
  return withAuth(handler, ['USER', 'EDITOR', 'ADMIN']);
}

/**
 * Reusable guard requiring EDITOR or ADMIN role
 */
export function withEditorAuth(handler: AuthenticatedRouteHandler) {
  return withAuth(handler, ['EDITOR', 'ADMIN']);
}

/**
 * Reusable guard requiring ADMIN role
 */
export function withAdminAuth(handler: AuthenticatedRouteHandler) {
  return withAuth(handler, ['ADMIN']);
}
