import React from 'react';
import Link from 'next/link';
import { UtilityBandData, INITIAL_FOOTER_CONFIG } from '@/lib/footer-config';

interface UtilityBandProps {
  data?: UtilityBandData;
}

export const UtilityBand: React.FC<UtilityBandProps> = ({ data = INITIAL_FOOTER_CONFIG.utility }) => {
  return (
    <div className="tf-util">
      <div className="tf-util-in">
        <div className="tf-srch">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8A7A68" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <span className="q">{data.searchPlaceholder}</span>
          <button className="tf-srch-go">Search</button>
        </div>
        <div className="tf-auth">
          <span className="tf-auth-n">{data.authText}</span>
          <Link href="/admin/login">
            <button className="tf-b-g">{data.signInText}</button>
          </Link>
          <Link href="/admin/login?mode=signup">
            <button className="tf-b-s">{data.signUpText}</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
