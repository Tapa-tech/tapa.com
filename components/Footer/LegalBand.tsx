import React from 'react';
import { Logo } from '../Header/Logo';

export const LegalBand: React.FC = () => {
  return (
    <div className="tf-w max-w-[1280px] mx-auto px-4 md:px-10">
      <div className="tf-legal py-6 text-left">
        <div className="tf-pol flex flex-wrap gap-2 md:gap-5 pb-3 border-b border-white/10 mb-4 text-xs">
          <span>Terms of Use</span>
          <span>Privacy Policy</span>
          <span>Shipping Policy</span>
          <span>Returns &amp; Refunds</span>
          <span>Cancellation Policy</span>
          <span>Grievance Redressal</span>
          <span>Sitemap</span>
        </div>
        <div>
          <div className="tf-gb text-[10px] font-bold tracking-wider mb-1">GRIEVANCE OFFICER</div>
          <p className="tf-gt text-xs leading-relaxed mb-3">
            <b>[Grievance Officer Name]</b>, Lead Compliance<br />
            grievance@thetapaco.com · +91 124 456 7890<br />
            Response within 48 hours, per Consumer Protection (E-Commerce) Rules, 2020.
          </p>
          <p className="tf-ent text-[11px] leading-relaxed mb-4">
            Tale Scale Networks Private Limited · CIN U74999HR2026PTC123456 · GSTIN 06AAACT1234F1Z2<br />
            Sector 43, Gurgaon, Haryana 122002
          </p>
        </div>
        <div className="tf-copy flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="tf-mark flex items-center">
            <Logo />
            <span className="tf-cl-l text-xs ml-3" style={{ marginLeft: '12px' }}>
              © 2026 <b>Tale Scale Networks Private Limited</b>. All rights reserved.
            </span>
          </div>
          <span className="tf-made text-xs">Made in Gurgaon</span>
        </div>
      </div>
    </div>
  );
};
