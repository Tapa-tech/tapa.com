import React from 'react';

export default function AccountPage() {
  return (
    <div className="wrap stage max-w-[1280px] mx-auto px-4 md:px-10 w-full overflow-x-hidden" style={{ padding: '40px 0 80px' }}>
      <div className="sec-ey">MY ACCOUNT</div>
      <h1 className="sec-t" style={{ fontSize: '32px', marginBottom: '12px' }}>
        Account Settings
      </h1>
      <p className="sec-s" style={{ marginBottom: '32px' }}>
        Manage your profile, saved rituals, WhatsApp reminders, and Tapa Circle membership.
      </p>

      <div className="acct" style={{ position: 'static', width: '100%', maxWidth: '500px', boxShadow: 'none' }}>
        <div className="acct-h">
          <div className="acct-n">Komal</div>
          <div className="acct-e">komal@thetapaco.com</div>
        </div>
        <div className="acct-i">
          <span>Saved rituals</span>
          <span className="n">7</span>
        </div>
        <div className="acct-i">
          <span>My reminders</span>
          <span className="n">3</span>
        </div>
        <div className="acct-i">
          <span>The Tapa Circle</span>
          <span className="n">ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
