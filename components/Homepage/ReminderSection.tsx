'use client';

import React, { useState } from 'react';

export const ReminderSection: React.FC = () => {
  const [phoneOrEmail, setPhoneOrEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneOrEmail) {
      alert(`Reminder requested for ${phoneOrEmail}! (Static Stub)`);
      setPhoneOrEmail('');
    }
  };

  return (
    <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10 mt-[36px]">
      <div className="remind flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 p-6 md:p-8 rounded-2xl">
        <div className="rm-i flex-shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#1F9D52">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15h-.01a8.2 8.2 0 01-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23z"/>
          </svg>
        </div>
        <div className="flex-1">
          <div className="rm-t font-bold text-base md:text-lg mb-1">Never Miss a Vrat or Tithi Cut-off</div>
          <div className="rm-s text-xs md:text-sm">
            Receive clean, spam-free WhatsApp alerts 2 days before every major vrat with exact tithi timings and parana rules.
          </div>
        </div>
        <form className="rm-f flex flex-col sm:flex-row gap-2 w-full md:w-auto ml-0" onSubmit={handleSubmit}>
          <input
            className="rm-in text-xs md:text-sm px-4 py-2.5 rounded-lg border w-full sm:w-64"
            type="text"
            placeholder="WhatsApp number or email"
            value={phoneOrEmail}
            onChange={(e) => setPhoneOrEmail(e.target.value)}
          />
          <button type="submit" className="rm-b text-xs md:text-sm font-bold px-5 py-2.5 rounded-lg w-full sm:w-auto whitespace-nowrap">
            Get free reminders ›
          </button>
        </form>
      </div>
    </div>
  );
};
