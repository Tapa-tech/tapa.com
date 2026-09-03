import { NextResponse } from 'next/server';
import { authorizeRequest } from '@/lib/rbac';

export async function GET(req: Request) {
  const auth = await authorizeRequest(['ADMIN', 'SUPER_USER']);

  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.statusCode });
  }

  return NextResponse.json(
    {
      success: true,
      message: 'Access granted to protected RBAC resource.',
      user: auth.user,
    },
    { status: 200 }
  );
}
