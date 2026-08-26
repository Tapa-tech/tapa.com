import React from 'react';
import Link from 'next/link';

export default function FestivalCalendarPage() {
  return (
    <div className="wrap stage" style={{ padding: '40px 0 80px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Link href="/panchang" style={{ color: 'var(--pink)', fontWeight: 600, fontSize: '13px' }}>
          ← Back to Panchang
        </Link>
      </div>

      <div className="sec-ey">CALENDAR</div>
      <h1 className="sec-t" style={{ fontSize: '32px', marginBottom: '12px' }}>
        Festival Calendar 2026
      </h1>
      <p className="sec-s" style={{ marginBottom: '32px' }}>
        Month-by-month dharmic festival dates, mahurat timings, and celebration guides.
      </p>

      <div className="kfirst" style={{ marginTop: 0 }}>
        <div>
          <div className="kf-ey">FESTIVE SEASON</div>
          <div className="kf-t">Ganesh Chaturthi, Navratri, Diwali 2026</div>
          <p className="kf-p">
            Verified shubh mahurat timings computed according to Surya Siddhanta and Drik Ganita.
          </p>
        </div>
      </div>
    </div>
  );
}
