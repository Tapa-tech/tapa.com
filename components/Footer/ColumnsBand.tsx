import React from 'react';
import Link from 'next/link';

export const ColumnsBand: React.FC = () => {
  return (
    <div className="tf-w max-w-[1280px] mx-auto px-4 md:px-10">
      <div className="tf-nav py-8">
        <div className="tf-nav-g grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div>
            <div className="tf-cl font-bold text-xs tracking-wider mb-3">ABOUT</div>
            <Link className="tf-l block py-1 text-xs" href="/about">Why तप्</Link>
            <Link className="tf-l block py-1 text-xs" href="/editorial-method">Our Editorial Method</Link>
            <Link className="tf-l block py-1 text-xs" href="/editorial-method">Scripture References</Link>
            <Link className="tf-l block py-1 text-xs" href="/glossary">Glossary</Link>
            <Link className="tf-l block py-1 text-xs" href="/account">The Tapa Circle <span className="paid text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">₹499/YR</span></Link>
            <Link className="tf-l block py-1 text-xs" href="/about">Join the Purohit Network</Link>
            <a className="tf-l locked block py-1 text-xs opacity-60" href="#">For Retailers</a>
          </div>

          <div>
            <div className="tf-cl font-bold text-xs tracking-wider mb-3">HELP</div>
            <a className="tf-l locked block py-1 text-xs opacity-60" href="#">Track Your Order</a>
            <a className="tf-l locked block py-1 text-xs opacity-60" href="#">Shipping &amp; Delivery</a>
            <a className="tf-l locked block py-1 text-xs opacity-60" href="#">Returns &amp; Refunds</a>
            <a className="tf-l locked block py-1 text-xs opacity-60" href="#">Cancellations</a>
            <a className="tf-l locked block py-1 text-xs opacity-60" href="#">Payment &amp; COD</a>
            <Link className="tf-l block py-1 text-xs" href="/about">FAQs</Link>
            <Link className="tf-l block py-1 text-xs" href="/about">Contact Support</Link>
          </div>

          <div>
            <div className="tf-cl font-bold text-xs tracking-wider mb-3">FOR YOU</div>
            <Link className="tf-l block py-1 text-xs" href="/account">My Account</Link>
            <Link className="tf-l block py-1 text-xs" href="/account">Saved Rituals</Link>
            <a className="tf-l locked block py-1 text-xs opacity-60" href="#">Order History</a>
            <Link className="tf-l block py-1 text-xs" href="/account">My Reminders</Link>
            <Link className="tf-l block py-1 text-xs" href="/account">Notification Preferences</Link>
            <span className="tf-l block py-1 text-xs cursor-pointer" style={{ cursor: 'pointer' }}>English / हिंदी</span>
          </div>

          <div>
            <div className="tf-cl font-bold text-xs tracking-wider mb-3">CONNECT</div>
            <div className="tf-csub text-[10px] font-bold tracking-wider mb-2">GET IN TOUCH</div>
            <a className="tf-reach flex items-start gap-2.5 mb-3" href="#">
              <span className="tf-ri flex-shrink-0 mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 18.15h-.01a8.2 8.2 0 01-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 012.41 5.83c0 4.54-3.7 8.23-8.24 8.23z"/>
                </svg>
              </span>
              <span>
                <span className="tf-rt block text-xs font-bold">Chat on WhatsApp</span>
                <span className="tf-rs block text-[11px]">Support · Mon–Sat, 10am–7pm IST</span>
              </span>
            </a>
            <a className="tf-reach flex items-start gap-2.5 mb-3" href="mailto:hello@thetapaco.com">
              <span className="tf-ri flex-shrink-0 mt-0.5">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="1.8">
                  <rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/>
                  <path d="M3 7l9 6 9-6"/>
                </svg>
              </span>
              <span>
                <span className="tf-rt block text-xs font-bold">Email us</span>
                <span className="tf-rs block text-[11px]">hello@thetapaco.com</span>
              </span>
            </a>
            <a className="tf-reach flex items-start gap-2.5 mb-4" href="#">
              <span className="tf-ri flex-shrink-0 mt-0.5">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="1.8" strokeLinecap="round">
                  <rect x="4" y="3" width="16" height="18" rx="2.5"/>
                  <path d="M8 8h8M8 12h8M8 16h4"/>
                </svg>
              </span>
              <span>
                <span className="tf-rt block text-xs font-bold">Contact form</span>
                <span className="tf-rs block text-[11px]">Partnerships, press, everything else</span>
              </span>
            </a>

            <div className="tf-csub second text-[10px] font-bold tracking-wider mb-2">FOLLOW</div>
            <div className="tf-soc flex items-center gap-2">
              <a className="tf-so text-xs font-bold p-1.5 rounded" href="#">IG</a>
              <a className="tf-so text-xs font-bold p-1.5 rounded" href="#">FB</a>
              <a className="tf-so text-xs font-bold p-1.5 rounded" href="#">LI</a>
              <a className="tf-so text-xs font-bold p-1.5 rounded" href="#">YT</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
