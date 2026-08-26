import React from 'react';

export const KnowledgeFirst: React.FC = () => {
  return (
    <section className="sec py-8 md:py-12">
      <div className="wrap max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="kfirst grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-11 p-6 md:p-10 rounded-2xl">
          <div>
            <div className="kf-ey text-xs">BEFORE YOU BUY ANYTHING</div>
            <div className="kf-t text-xl md:text-2xl font-bold mb-3">You do not need a kit to perform any of this</div>
            <p className="kf-p text-xs md:text-sm leading-relaxed mb-4">
              Every ritual guide on this platform is free, complete, and will stay that way. The samagri list is published in full, with substitutions where an item is hard to find. A kit saves you a morning in the market. It does not make the puja more valid, and we will never suggest otherwise.
            </p>
            <button className="kf-c text-xs md:text-sm font-bold">Read a guide instead ›</button>
          </div>
          <div className="kf-list flex flex-col gap-4 justify-center">
            <div className="kf-i flex items-start gap-3">
              <span className="kf-ic text-xl">📋</span>
              <div>
                <div className="kf-it font-bold text-sm">The full samagri list is free</div>
                <div className="kf-is text-xs">Published on every guide, with substitutions.</div>
              </div>
            </div>
            <div className="kf-i flex items-start gap-3">
              <span className="kf-ic text-xl">🪔</span>
              <div>
                <div className="kf-it font-bold text-sm">A sincere substitute is accepted</div>
                <div className="kf-is text-xs">If an item is unavailable where you live, the tradition allows for it.</div>
              </div>
            </div>
            <div className="kf-i flex items-start gap-3">
              <span className="kf-ic text-xl">🙏</span>
              <div>
                <div className="kf-it font-bold text-sm">No pandit required</div>
                <div className="kf-is text-xs">Any devotee can perform household puja. That is Dharma, not our opinion.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
