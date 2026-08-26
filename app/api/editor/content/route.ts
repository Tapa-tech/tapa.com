import { NextResponse } from 'next/server';
import { withEditorAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';

export const GET = withEditorAuth(async (req, { user }) => {
  const guides = await prisma.ritualGuide.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({
    success: true,
    message: 'Editor content access granted.',
    editorUser: { id: user.id, role: user.role },
    data: guides,
  });
});
