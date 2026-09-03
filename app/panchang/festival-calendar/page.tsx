import Link from 'next/link';
import { getFestivalsForYear } from '@/lib/festivals-service';

export default async function FestivalCalendarPage() {
  const festivals = await getFestivalsForYear(2026);

  return (
    <div className="wrap stage max-w-[1280px] mx-auto px-4 md:px-10 w-full overflow-x-hidden" style={{ padding: '40px 0 80px', background: '#FBF9F5', minHeight: '100vh', color: '#111827' }}>
      <div style={{ marginBottom: '16px' }}>
        <Link href="/panchang" style={{ color: '#DE1B59', fontWeight: 600, fontSize: '13px' }}>
          ← Back to Panchang
        </Link>
      </div>

      <div style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
        PANCHANG · 2026 CALENDAR
      </div>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: 700, margin: '0 0 12px', color: '#111827' }}>
        Dharmic Festival Calendar 2026
      </h1>
      <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 36px', maxWidth: '640px', lineHeight: 1.6 }}>
        Month-by-month dharmic festival dates, verified muhurat timings, and scriptural celebration guides computed for New Delhi according to Drik Ganita conventions.
      </p>

      {/* Grid of Festivals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {festivals.map((f, idx) => (
          <div
            key={f.id || idx}
            style={{
              background: '#FFFFFF',
              border: '1px solid #EFEAE4',
              borderRadius: '20px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59', background: '#FDF2F5', padding: '4px 10px', borderRadius: '8px' }}>
                  {f.tithi}
                </span>
              </div>

              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, margin: '0 0 6px', color: '#111827' }}>
                {f.name}
              </h3>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#2563EB', marginBottom: '12px' }}>
                📅 {f.date}
              </div>

              <div style={{ background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '10px', padding: '10px 12px', fontSize: '12px', color: '#374151', marginBottom: '16px', fontWeight: 600 }}>
                ⏰ {f.muhurat}
              </div>

              <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.5, margin: '0 0 20px' }}>
                {f.description}
              </p>
            </div>

            <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              {f.guideUrl ? (
                <Link
                  href={f.guideUrl}
                  style={{
                    color: '#DE1B59',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Read Ritual Guide &amp; Vidhi ›
                </Link>
              ) : (
                <span style={{ fontSize: '12px', color: '#9CA3AF', fontStyle: 'italic' }}>
                  Guide details inside Panchang
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
