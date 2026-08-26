import React from 'react';

interface AccountMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountMenu: React.FC<AccountMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="acct" onMouseLeave={onClose}>
      <div className="acct-h">
        <div className="acct-n">Komal</div>
        <div className="acct-e">komal@thetapaco.com</div>
      </div>
      <a className="acct-i" href="#">
        <span>Saved rituals</span>
        <span className="n">7</span>
      </a>
      <a className="acct-i" href="#">
        <span>My reminders</span>
        <span className="n">3</span>
      </a>
      <a className="acct-i" href="#">
        <span>Order history</span>
      </a>
      <a className="acct-i" href="#">
        <span>The Tapa Circle</span>
        <span className="n">ACTIVE</span>
      </a>
      <a className="acct-i" href="#">
        <span>Notification preferences</span>
      </a>
      <div className="acct-o" onClick={onClose}>
        Sign out
      </div>
    </div>
  );
};
