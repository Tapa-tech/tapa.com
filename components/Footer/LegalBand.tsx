import React from 'react';
import { Logo } from '../Header/Logo';
import { LegalBandData, INITIAL_FOOTER_CONFIG } from '@/lib/footer-config';

interface LegalBandProps {
  data?: LegalBandData;
}

export const LegalBand: React.FC<LegalBandProps> = ({ data = INITIAL_FOOTER_CONFIG.legal }) => {
  return (
    <div className="tf-w max-w-[1280px] mx-auto px-4 md:px-10">
      <div className="tf-legal py-6 text-left">
        <div className="tf-pol flex flex-wrap gap-2 md:gap-5 pb-3 border-b border-white/10 mb-4 text-xs">
          {data.policyLinks.map((link, idx) => (
            <span key={idx}>{link.label}</span>
          ))}
        </div>
        <div>
          <div className="tf-gb text-[10px] font-bold tracking-wider mb-1">{data.grievanceHeading}</div>
          <p className="tf-gt text-xs leading-relaxed mb-3">
            <b>{data.grievanceOfficerName}</b>, {data.grievanceOfficerTitle}<br />
            {data.grievanceEmail} · {data.grievancePhone}<br />
            {data.grievanceNotice}
          </p>
          <p className="tf-ent text-[11px] leading-relaxed mb-4">
            {data.companyEntityText}<br />
            {data.companyAddress}
          </p>
        </div>
        <div className="tf-copy flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="tf-mark flex items-center">
            <Logo />
            <span className="tf-cl-l text-xs ml-3" style={{ marginLeft: '12px' }}>
              {data.copyrightText}
            </span>
          </div>
          <span className="tf-made text-xs">{data.locationTag}</span>
        </div>
      </div>
    </div>
  );
};
