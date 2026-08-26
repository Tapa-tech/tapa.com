import React from 'react';

export const CorrectionsBand: React.FC = () => {
  return (
    <div className="tf-w">
      <div className="tf-corr">
        <div className="tf-corr-t">Every article carries a named source.</div>
        <p className="tf-corr-p">
          Where a practice comes from scripture, we cite the text. Where it comes from custom, we say so. Where it is a misconception, we correct it. Find an error and we will fix it, and record the correction.
        </p>
        <a className="tf-corr-a" href="#">Report a correction ›</a>
      </div>
    </div>
  );
};
