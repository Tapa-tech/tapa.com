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

export function withUserAuth(handler: AuthenticatedRouteHandler) {
  return withAuth(handler, ['CUSTOMER', 'ADMIN', 'SUPER_USER']);
}

export function withEditorAuth(handler: AuthenticatedRouteHandler) {
  return withAuth(handler, ['ADMIN', 'SUPER_USER']);
}

export function withAdminAuth(handler: AuthenticatedRouteHandler) {
  return withAuth(handler, ['ADMIN', 'SUPER_USER']);
}
