import React from 'react';

export const EditorialMethodSection: React.FC = () => {
  return (
    <section className="sec py-8 md:py-12">
      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="method grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-11 p-6 md:p-10 rounded-2xl">
          <div>
            <div className="me-ey text-xs">HOW WE DECIDE WHAT IS TRUE</div>
            <div className="me-t text-xl md:text-2xl font-bold mb-3">Every claim is tagged, scored, and traceable to a named text</div>
            <p className="me-p text-xs md:text-sm leading-relaxed mb-4">
              If we cannot name the text a reader could check, we do not make the claim. Where something is your family's custom rather than scripture, we say so. Commerce does not get a vote in this.
            </p>
            <button className="me-c text-xs md:text-sm font-bold">Read our editorial method ›</button>
          </div>
          <div className="dpb flex flex-col gap-3 justify-center">
            <div className="dpb-r d p-3 md:p-4 rounded-xl">
              <div className="dpb-k font-bold text-xs mb-1">DHARMA</div>
              <div className="dpb-v text-xs">Named in a text you could open yourself. Carries a confidence score out of five.</div>
            </div>
            <div className="dpb-r p p-3 md:p-4 rounded-xl">
              <div className="dpb-k font-bold text-xs mb-1">PRATHA</div>
              <div className="dpb-v text-xs">Regional or family custom. Real, valid, worth keeping — but not scripture, and we will not pretend it is.</div>
            </div>
            <div className="dpb-r b p-3 md:p-4 rounded-xl">
              <div className="dpb-k font-bold text-xs mb-1">BHRANTI</div>
              <div className="dpb-v text-xs">A misconception, usually fear-based. Corrected in plain language, every time.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
