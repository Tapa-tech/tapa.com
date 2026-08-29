'use client';

import React, { useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

interface DraftReviewItem {
  id: string;
  title: string;
  type: 'Ritual Guide' | 'Dharmic Concept' | 'Panchang Entry';
  author: string;
  submittedDate: string;
  status: 'Pending Founder Review' | 'Approved' | 'Needs Revision' | 'Rejected';
  notes: string;
}

const INITIAL_QUEUE: DraftReviewItem[] = [
  {
    id: 'rev-1',
    title: 'Ashwin Navratri Ghatasthapana Complete Vidhi',
    type: 'Ritual Guide',
    author: 'Vedic Content Team',
    submittedDate: '28/8/2026',
    status: 'Pending Founder Review',
    notes: 'Includes step-by-step Kalash sthapana, barley sowing, and 9 devi mantras verified against Devi Mahatmya.',
  },
  {
    id: 'rev-2',
    title: 'Understanding the Philosophy of Sandhya Vandanam',
    type: 'Dharmic Concept',
    author: 'Editorial Desk',
    submittedDate: '26/8/2026',
    status: 'Needs Revision',
    notes: 'Requires adding additional scriptural citations for Gayatri Japa time windows.',
  },
  {
    id: 'rev-3',
    title: 'Sharad Purnima Kojagari Lakshmi Puja Guide',
    type: 'Ritual Guide',
    author: 'Vedic Content Team',
    submittedDate: '24/8/2026',
    status: 'Approved',
    notes: 'Fact-checked and approved for publication.',
  },
];

function FounderReviewContent() {
  const { data: session, status } = useSession();
  const [queue, setQueue] = useState<DraftReviewItem[]>(INITIAL_QUEUE);

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#FBF9F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#DE1B59', fontWeight: 600 }}>Loading Founder Review Queue...</div>
      </div>
    );
  }

  const userEmail = session?.user?.email || 'admin@tapa.co';
  const userRole = (session?.user as any)?.role?.toUpperCase() || 'SUPER_ADMIN';

  const handleStatusChange = (id: string, newStatus: DraftReviewItem['status']) => {
    setQueue(
      queue.map((item) => {
        if (item.id === id) {
          return { ...item, status: newStatus };
        }
        return item;
      })
    );
  };

  const pendingCount = queue.filter((q) => q.status === 'Pending Founder Review').length;
  const approvedCount = queue.filter((q) => q.status === 'Approved').length;
  const revisionCount = queue.filter((q) => q.status === 'Needs Revision').length;

  return (
    <div style={{ minHeight: '100vh', background: '#FBF9F5', color: '#111827', display: 'flex', fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <AdminSidebar userEmail={userEmail} userRole={userRole} />

      <main style={{ flex: 1, padding: '36px 40px', maxWidth: '1200px' }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px', marginBottom: '12px' }}>
          DASHBOARD &gt; FOUNDER REVIEW QUEUE
        </div>

        {/* Title Bar */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: '26px', fontWeight: 700, margin: '0 0 6px' }}>
            Founder Review &amp; Editorial Approval Queue
          </h1>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
            Review draft guides, pending scriptural interpretations, and editorial submissions before publishing live on Tapa.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', marginBottom: '6px' }}>PENDING REVIEWS</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#D97706', fontFamily: 'Georgia, serif' }}>{pendingCount}</div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>Drafts awaiting founder signoff</div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', marginBottom: '6px' }}>APPROVED TODAY</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#059669', fontFamily: 'Georgia, serif' }}>{approvedCount}</div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>Verified &amp; ready for production</div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', marginBottom: '6px' }}>NEEDS REVISION</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#DC2626', fontFamily: 'Georgia, serif' }}>{revisionCount}</div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>Feedback returned to editorial team</div>
          </div>
        </div>

        {/* Queue Table */}
        <div style={{ background: '#FFFFFF', border: '1px solid #EFEAE4', borderRadius: '16px', padding: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F3F4F6', color: '#9CA3AF', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '12px' }}>TITLE &amp; SUBMISSION</th>
                <th style={{ padding: '12px' }}>CONTENT TYPE</th>
                <th style={{ padding: '12px' }}>EDITORIAL NOTES</th>
                <th style={{ padding: '12px' }}>STATUS</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>APPROVAL DECISION</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F9FAFB' }}>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontWeight: 700, color: '#111827', fontSize: '14px' }}>{item.title}</div>
                    <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                      By {item.author} · Submitted {item.submittedDate}
                    </div>
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ background: '#FDF2F5', color: '#DE1B59', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                      {item.type}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px', color: '#4B5563', maxWidth: '280px', lineHeight: 1.4 }}>
                    {item.notes}
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <span
                      style={{
                        background:
                          item.status === 'Approved'
                            ? '#ECFDF5'
                            : item.status === 'Needs Revision'
                            ? '#FEF3C7'
                            : item.status === 'Rejected'
                            ? '#FEE2E2'
                            : '#EFF6FF',
                        color:
                          item.status === 'Approved'
                            ? '#059669'
                            : item.status === 'Needs Revision'
                            ? '#D97706'
                            : item.status === 'Rejected'
                            ? '#DC2626'
                            : '#2563EB',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        onClick={() => handleStatusChange(item.id, 'Approved')}
                        style={{ background: '#059669', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(item.id, 'Needs Revision')}
                        style={{ background: '#FFFFFF', border: '1px solid #D97706', color: '#D97706', borderRadius: '6px', padding: '6px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Request Edits
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default function FounderReviewPage() {
  return (
    <SessionProvider>
      <FounderReviewContent />
    </SessionProvider>
  );
}
