import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/db';

const INITIAL_LOGS = [
  {
    id: 'log-101',
    event: 'USER_ROLE_UPDATED',
    actor: 'admin@tapa.co',
    role: 'SUPER_ADMIN',
    target: 'User: test.subscriber@tapa.co (Role -> CUSTOMER)',
    ipAddress: '103.21.124.52 (Delhi-NCR)',
    severity: 'WARN',
    details: 'Role updated via RBAC Directory Control panel.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'log-102',
    event: 'RITUAL_GUIDE_PUBLISHED',
    actor: 'admin@tapa.co',
    role: 'SUPER_ADMIN',
    target: 'Guide: navratri-pujan-vidhi',
    ipAddress: '103.21.124.52 (Delhi-NCR)',
    severity: 'INFO',
    details: 'Ritual Guide status changed to Published.',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'log-103',
    event: 'PANCHANG_SYNC_SUCCESS',
    actor: 'system@tapa.co',
    role: 'SYSTEM',
    target: 'Batch: 1,095 Panchang Entries',
    ipAddress: 'Internal Automation System',
    severity: 'INFO',
    details: 'Panchang 2025-2027 entries validated & synced for location Delhi-NCR.',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 'log-104',
    event: 'LOGIN_FAILURE_LIMIT',
    actor: 'unknown',
    role: 'ANONYMOUS',
    target: 'Endpoint: /api/auth/callback/credentials',
    ipAddress: '45.12.89.201',
    severity: 'CRITICAL',
    details: '3 consecutive failed authentication attempts detected.',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
];

export const GET = withAdminAuth(async () => {
  try {
    if (process.env.DATABASE_URL) {
      let logs = await prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
      });

      if (logs.length === 0) {
        // Auto-seed initial audit logs if table is empty
        await prisma.auditLog.createMany({
          data: INITIAL_LOGS.map((log) => ({
            id: log.id,
            event: log.event,
            actor: log.actor,
            role: log.role,
            target: log.target,
            ipAddress: log.ipAddress,
            severity: log.severity,
            details: log.details,
          })),
          skipDuplicates: true,
        });

        logs = await prisma.auditLog.findMany({
          orderBy: { createdAt: 'desc' },
          take: 100,
        });
      }

      return NextResponse.json({ success: true, logs });
    }

    return NextResponse.json({ success: true, logs: INITIAL_LOGS });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch security audit logs' },
      { status: 500 }
    );
  }
});
