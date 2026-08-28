import React from 'react';
import Link from 'next/link';

export default function EclipsesPage() {
  return (
    <div className="wrap stage max-w-[1280px] mx-auto px-4 md:px-10 w-full overflow-x-hidden" style={{ padding: '40px 0 80px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Link href="/panchang" style={{ color: 'var(--pink)', fontWeight: 600, fontSize: '13px' }}>
          ← Back to Panchang
        </Link>
      </div>

      <div className="sec-ey">ASTRONOMY &amp; SUTAK</div>
      <h1 className="sec-t" style={{ fontSize: '32px', marginBottom: '12px' }}>
        Eclipses (Grahan) 2026
      </h1>
      <p className="sec-s" style={{ marginBottom: '32px' }}>
        Solar and Lunar eclipse dates, geographic visibility, and Sutak period observances.
      </p>

      <div className="kfirst" style={{ marginTop: 0 }}>
        <div>
          <div className="kf-ey">VISIBILITY RULE</div>
          <div className="kf-t">Visibility Decides Everything</div>
          <p className="kf-p">
            Sutak rules apply only in regions where the eclipse is physically visible to the naked eye.
          </p>
        </div>
      </div>
    </div>
  );
}
