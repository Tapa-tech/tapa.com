import React from 'react';
import { useSession, signOut } from 'next-auth/react';

interface AccountMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountMenu: React.FC<AccountMenuProps> = ({ isOpen, onClose }) => {
  const { data: session, status } = useSession();

  if (!isOpen || status !== 'authenticated' || !session?.user) return null;

  const displayName = session.user.name || session.user.email?.split('@')[0] || 'Devotee';
  const email = session.user.email || '';

  return (
    <div className="acct" onMouseLeave={onClose}>
      <div className="acct-h">
        <div className="acct-n">{displayName}</div>
        {email && <div className="acct-e">{email}</div>}
      </div>
      <a className="acct-i" href="/account">
        <span>Saved rituals</span>
      </a>
      <a className="acct-i" href="/account">
        <span>My reminders</span>
      </a>
      <a className="acct-i" href="/account">
        <span>Order history</span>
      </a>
      <a className="acct-i" href="/account">
        <span>The Tapa Circle</span>
      </a>
      <a className="acct-i" href="/account">
        <span>Notification preferences</span>
      </a>
      <div className="acct-o" onClick={() => { signOut({ callbackUrl: '/' }); onClose(); }}>
        Sign out
      </div>
    </div>
  );
};

