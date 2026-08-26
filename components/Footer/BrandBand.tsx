import React from 'react';

export const BrandBand: React.FC = () => {
  return (
    <div className="tf-brand">
      <div className="tf-lot">
        <span className="tf-line"></span>
        <span style={{ color: 'var(--pink)', fontSize: '19px' }}>✽</span>
        <span className="tf-line"></span>
      </div>
      <div className="tf-tag">
        Not fear. <em>Only devotion.</em>
      </div>
      <p className="tf-sub">
        Every ritual explained from a named source — so you know what comes from scripture, what comes from your family, and what is simply a rumour.
      </p>
      <button className="tf-cta">Read our editorial method ›</button>
      <div className="tf-dev devanagari">हर अनुष्ठान, सही विधि से</div>
    </div>
  );
};
