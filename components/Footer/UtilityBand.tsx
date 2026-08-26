import React from 'react';

export const UtilityBand: React.FC = () => {
  return (
    <div className="tf-util">
      <div className="tf-util-in">
        <div className="tf-srch">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8A7A68" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <span className="q">Search rituals</span>
          <button className="tf-srch-go">Search</button>
        </div>
        <div className="tf-auth">
          <span className="tf-auth-n">Save rituals, track orders, manage reminders</span>
          <button className="tf-b-g">Sign in</button>
          <button className="tf-b-s">Create account</button>
        </div>
      </div>
    </div>
  );
};
