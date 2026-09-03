import React from 'react';
import { CorrectionsBandData, INITIAL_FOOTER_CONFIG } from '@/lib/footer-config';

interface CorrectionsBandProps {
  data?: CorrectionsBandData;
}

export const CorrectionsBand: React.FC<CorrectionsBandProps> = ({ data = INITIAL_FOOTER_CONFIG.corrections }) => {
  return (
    <div className="tf-w">
      <div className="tf-corr">
        <div className="tf-corr-t">{data.heading}</div>
        <p className="tf-corr-p">{data.paragraph}</p>
        <a className="tf-corr-a" href={data.reportCtaHref || '#'}>
          {data.reportCtaText}
        </a>
      </div>
    </div>
  );
};
