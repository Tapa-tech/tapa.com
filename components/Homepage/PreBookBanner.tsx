import React from 'react';

export const PreBookBanner: React.FC = () => {
  return (
    <div className="launch w-full px-4 md:px-10 py-2.5 text-center">
      <p className="text-xs md:text-sm leading-relaxed">
        <span className="lb block sm:inline-block mb-1 sm:mb-0 sm:mr-2">PRE-BOOKING OPEN</span>
        Ritual Kits are open for pre-booking. <b>Order by 10 September</b> for delivery before Ganesh Chaturthi.
      </p>
    </div>
  );
};
