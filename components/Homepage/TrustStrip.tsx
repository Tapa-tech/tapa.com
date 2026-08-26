import React from 'react';

export const TrustStrip: React.FC = () => {
  return (
    <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10">
      <div className="ctrust grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
        <div className="ct p-4 md:p-6">
          <div className="ct-t font-bold text-sm md:text-base mb-1">Delivered before the date</div>
          <div className="ct-s text-xs text-sub-text">Or your money back. Cut-off dates shown on every kit.</div>
        </div>
        <div className="ct p-4 md:p-6">
          <div className="ct-t font-bold text-sm md:text-base mb-1">Cash on delivery</div>
          <div className="ct-s text-xs text-sub-text">Available on serviceable pincodes across Delhi-NCR.</div>
        </div>
        <div className="ct p-4 md:p-6">
          <div className="ct-t font-bold text-sm md:text-base mb-1">Sourced, not resold</div>
          <div className="ct-s text-xs text-sub-text">Chandni Chowk, Moradabad, Khurja, Haridwar, Varanasi.</div>
        </div>
        <div className="ct p-4 md:p-6">
          <div className="ct-t font-bold text-sm md:text-base mb-1">A booklet in every kit</div>
          <div className="ct-s text-xs text-sub-text">Gyan Patrika — the why, not just the what.</div>
        </div>
      </div>
    </div>
  );
};
