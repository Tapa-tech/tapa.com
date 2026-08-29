'use client';

import React, { useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  ipAddress: string;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
  details: string;
}

const INITIAL_LOGS: AuditLog[] = [
  {
    id: 'log-101',
    timestamp: '2026-08-29 19:15:22',
    actor: 'admin@tapa.co',
    role: 'SUPER_ADMIN',
    action: 'USER_ROLE_UPDATED',
    target: 'User: test.subscriber@tapa.co (Role -> CUSTOMER)',
    ipAddress: '103.21.124.52 (Delhi-NCR)',
    severity: 'WARN',
    details: 'Role updated via RBAC Directory Control panel.',
  },
  {
    id: 'log-102',
    timestamp: '2026-08-29 18:42:10',
    actor: 'admin@tapa.co',
    role: 'SUPER_ADMIN',
    action: 'RITUAL_GUIDE_PUBLISHED',
    target: 'Guide: navratri-pujan-vidhi',
    ipAddress: '103.21.124.52 (Delhi-NCR)',
    severity: 'INFO',
    details: 'Ritual Guide status changed to Published.',
  },
  {
    id: 'log-103',
    timestamp: '2026-08-29 17:30:05',
    actor: 'system@tapa.co',
    role: 'SYSTEM',
    action: 'PANCHANG_SYNC_SUCCESS',
    target: 'Batch: 1,095 Panchang Entries',
    ipAddress: 'Internal Automation System',
    severity: 'INFO',
    details: 'Panchang 2025-2027 entries validated & synced for location Delhi-NCR.',
  },
  {
    id: 'log-104',
    timestamp: '2026-08-29 15:10:44',
    actor: 'unknown',
    role: 'ANONYMOUS',
    action: 'LOGIN_FAILURE_LIMIT',
    target: 'Endpoint: /api/auth/callback/credentials',
    ipAddress: '45.12.89.201',
    severity: 'CRITICAL',
    details: '3 consecutive failed authentication attempts detected.',
  },
];

function SecurityAuditContent() {
  const { data: session, status } = useSession();
  const [logs, setLogs] = useState<AuditLog[]>(INITIAL_LOGS);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#DE1B59', fontWeight: 600 }}>Loading Security Audit Console...</div>
      </div>
    );
  }

  const userEmail = session?.user?.email || 'admin@tapa.co';
  const userRole = (session?.user as any)?.role?.toUpperCase() || 'SUPER_ADMIN';

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.actor.toLowerCase().includes(search.toLowerCase()) || log.action.toLowerCase().includes(search.toLowerCase()) || log.target.toLowerCase().includes(search.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || log.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const exportCSV = () => {
    const headers = 'ID,Timestamp,Actor,Role,Action,Target,IP Address,Severity\n';
    const rows = filteredLogs.map((l) => `"${l.id}","${l.timestamp}","${l.actor}","${l.role}","${l.action}","${l.target}","${l.ipAddress}","${l.severity}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tapa_security_audit_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', display: 'flex', fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <AdminSidebar userEmail={userEmail} userRole={userRole} />

      <main style={{ flex: 1, padding: '36px 40px', maxWidth: '1200px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: '12px' }}>
          DASHBOARD &gt; SECURITY AUDIT LOGS
        </div>

        {/* Title Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: '26px', fontWeight: 700, margin: '0 0 6px' }}>
              Security Audit Logs &amp; System Activity
            </h1>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
              Immutable security audit trail logging authentication events, role changes, administrative actions, and system access.
            </p>
          </div>
          <button
            onClick={exportCSV}
            style={{
              background: '#FFFFFF',
              color: '#DE1B59',
              border: '1px solid #DE1B59',
              padding: '10px 18px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            📥 Export CSV
          </button>
        </div>

        {/* Filter Bar */}
        <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="Search audit logs by actor email, action code, or target resource..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: '10px', padding: '9px 14px', fontSize: '13px' }}
          />

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            style={{ border: '1px solid #E5E7EB', borderRadius: '10px', padding: '9px 14px', fontSize: '13px', background: '#FFFFFF' }}
          >
            <option value="ALL">All Severities</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>

        {/* Logs Table */}
        <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F3F4F6', color: '#9CA3AF', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '12px' }}>TIMESTAMP</th>
                <th style={{ padding: '12px' }}>ACTOR / ROLE</th>
                <th style={{ padding: '12px' }}>ACTION EVENT</th>
                <th style={{ padding: '12px' }}>TARGET RESOURCE</th>
                <th style={{ padding: '12px' }}>SEVERITY</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>DETAILS</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #F9FAFB' }}>
                  <td style={{ padding: '14px 12px', color: '#6B7280', fontSize: '11.5px', whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ fontWeight: 700, color: '#111827' }}>{log.actor}</div>
                    <span style={{ fontSize: '9px', fontWeight: 700, background: '#F3F4F6', color: '#374151', padding: '1px 6px', borderRadius: '4px' }}>{log.role}</span>
                  </td>
                  <td style={{ padding: '14px 12px', fontWeight: 700, color: '#DE1B59', fontFamily: 'monospace' }}>{log.action}</td>
                  <td style={{ padding: '14px 12px', color: '#374151' }}>{log.target}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <span
                      style={{
                        fontSize: '9.5px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: log.severity === 'CRITICAL' ? '#FEE2E2' : log.severity === 'WARN' ? '#FEF3C7' : '#EFF6FF',
                        color: log.severity === 'CRITICAL' ? '#DC2626' : log.severity === 'WARN' ? '#D97706' : '#2563EB',
                      }}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedLog(log)}
                      style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 600, cursor: 'pointer', fontSize: '11.5px' }}
                    >
                      View Log →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Log Details Modal */}
        {selectedLog && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '32px', maxWidth: '540px', width: '90%', border: '1px solid #EFEAE4' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, margin: '0 0 16px' }}>Audit Log Payload Details</h2>
              <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '16px' }}>Event ID: {selectedLog.id} · Logged at {selectedLog.timestamp}</div>

              <div style={{ background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '12px', padding: '16px', fontSize: '12px', fontFamily: 'monospace', color: '#1F2937', lineHeight: 1.6, marginBottom: '24px' }}>
                <div><strong>Actor:</strong> {selectedLog.actor} ({selectedLog.role})</div>
                <div><strong>Action:</strong> {selectedLog.action}</div>
                <div><strong>Target:</strong> {selectedLog.target}</div>
                <div><strong>IP Address:</strong> {selectedLog.ipAddress}</div>
                <div><strong>Severity:</strong> {selectedLog.severity}</div>
                <div style={{ marginTop: '8px', borderTop: '1px solid #E5E7EB', paddingTop: '8px' }}><strong>Details:</strong> {selectedLog.details}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setSelectedLog(null)} style={{ background: '#DE1B59', color: '#FFFFFF', border: 'none', padding: '10px 24px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Close Payload</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function SecurityAuditPage() {
  return (
    <SessionProvider>
      <SecurityAuditContent />
    </SessionProvider>
  );
}
