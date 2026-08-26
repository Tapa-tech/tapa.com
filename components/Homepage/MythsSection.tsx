import React from 'react';

export const MythsSection: React.FC = () => {
  return (
    <section className="sec py-8 md:py-12">
      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="myths p-6 md:p-10 rounded-2xl">
          <div className="my-ey text-xs">THE PART NOBODY ELSE PUBLISHES</div>
          <div className="my-t text-xl md:text-3xl font-bold mb-2">Corrections, not warnings</div>
          <p className="my-s text-xs md:text-sm max-w-2xl mb-6">
            Every guide ends with the misconceptions attached to that ritual, and what the source text actually says. Selling you a kit does not change what we print here.
          </p>
          <div className="my-grid grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div className="mycard p-4 md:p-5 rounded-xl">
              <div className="my-q flex items-start gap-2 mb-3">
                <span className="my-ic flex-shrink-0 text-red-500 font-bold">✕</span>
                <span className="my-tx text-xs md:text-sm font-semibold">"Only a pandit can perform Ganesh Sthapana."</span>
              </div>
              <div className="my-a flex items-start gap-2">
                <span className="my-ic flex-shrink-0 text-green-600 font-bold">✓</span>
                <span className="my-tx text-xs leading-relaxed">
                  Nothing in the source tradition restricts prana pratishtha to priests. A pandit adds timing precision and convenience — not validity.
                </span>
              </div>
            </div>
            <div className="mycard p-4 md:p-5 rounded-xl">
              <div className="my-q flex items-start gap-2 mb-3">
                <span className="my-ic flex-shrink-0 text-red-500 font-bold">✕</span>
                <span className="my-tx text-xs md:text-sm font-semibold">"Seeing the moon on Chaturthi brings misfortune."</span>
              </div>
              <div className="my-a flex items-start gap-2">
                <span className="my-ic flex-shrink-0 text-green-600 font-bold">✓</span>
                <span className="my-tx text-xs leading-relaxed">
                  The Syamantaka Mani story is a Puranic narrative, not a basis for fear. The traditional response is reciting a verse — nothing lasting is held to follow.
                </span>
              </div>
            </div>
            <div className="mycard p-4 md:p-5 rounded-xl">
              <div className="my-q flex items-start gap-2 mb-3">
                <span className="my-ic flex-shrink-0 text-red-500 font-bold">✕</span>
                <span className="my-tx text-xs md:text-sm font-semibold">"A bought kit is less sincere than one you assemble."</span>
              </div>
              <div className="my-a flex items-start gap-2">
                <span className="my-ic flex-shrink-0 text-green-600 font-bold">✓</span>
                <span className="my-tx text-xs leading-relaxed">
                  No text ranks devotion by where the samagri came from. Equally, no text says you need a kit. Both are conveniences. Neither is the vrat.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
