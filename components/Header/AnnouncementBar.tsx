import React from 'react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="announce px-4 md:px-7 py-1.5 flex items-center justify-center md:justify-between">
      <p className="ann-text text-[10px] md:text-xs text-center md:text-left">
        <strong>Dharma does not demand fear.</strong> It demands devotion.
      </p>
      <div className="ann-links hidden md:flex gap-5">
        <span className="ann-link text-[10px] cursor-pointer" style={{ cursor: 'pointer' }}>Scripture References</span>
        <span className="ann-link text-[10px] cursor-pointer" style={{ cursor: 'pointer' }}>Glossary</span>
        <span className="ann-link text-[10px] cursor-pointer" style={{ cursor: 'pointer' }}>Our Editorial Method</span>
      </div>
    </div>
  );
};
