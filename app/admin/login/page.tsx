'use client';

import React, { useState, useEffect } from 'react';
import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react';

function AdminLoginForm() {
  const { data: session, status } = useSession();

  // Tab State: 'credentials' | 'phone' | 'google'
  const [activeTab, setActiveTab] = useState<'credentials' | 'phone' | 'google'>('credentials');

  // Phone OTP State
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Credentials State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // UI Feedback States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Cooldown Countdown Timer Effect & URL mode handler
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('mode');
      if (mode === 'signup' || mode === 'phone') {
        setActiveTab('phone');
      } else if (mode === 'credentials') {
        setActiveTab('credentials');
      } else if (mode === 'google') {
        setActiveTab('google');
      }
    }
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Handle Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!phone || phone.trim().length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Failed to send OTP.');
        if (data.cooldownRemaining) {
          setCooldown(data.cooldownRemaining);
        }
      } else {
        setOtpSent(true);
        setCooldown(60);
        setSuccess('Verification code sent successfully! Check terminal log for dev OTP.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred sending OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify OTP Login
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!otp || otp.trim().length < 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const res = await signIn('phone-otp', {
        phone,
        otp,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid or expired verification code.');
      } else if (res?.ok) {
        setSuccess('Authentication successful! Redirecting...');
        window.location.href = '/admin/dashboard';
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Credentials Login
  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username || !password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid admin credentials.');
      } else if (res?.ok) {
        setSuccess('Signed in successfully! Redirecting...');
        window.location.href = '/admin/dashboard';
      }
    } catch (err: any) {
      setError(err.message || 'Credentials login error.');
    } finally {
      setLoading(false);
    }
  };

  const userRole = (session?.user as { role?: string })?.role || 'USER';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(24, 18, 12, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 9999,
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '36px',
          width: '100%',
          maxWidth: '460px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          position: 'relative',
          border: '1px solid #EFEAE4',
        }}
      >
        {/* Top Right Close Button */}
        <button
          type="button"
          onClick={() => (window.location.href = '/')}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#F3F4F6',
            border: 'none',
            color: '#6B7280',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
          }}
        >
          ✕
        </button>

        {/* Authenticated State Display */}
        {status === 'authenticated' && session?.user ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59', letterSpacing: '1px', marginBottom: '6px' }}>
              AUTHENTICATED SESSION
            </div>
            <h2 style={{ fontFamily: "Georgia, 'Tiro Devanagari Hindi', serif", fontSize: '24px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
              Pranām, {session.user.name || 'User'}
            </h2>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px' }}>
              Logged in as <strong>{session.user.email || (session.user as any).phone}</strong>
            </p>

            <div style={{ background: '#FDF2F5', border: '1px solid #FCE7F3', borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
              <div style={{ fontSize: '12px', color: '#DE1B59', fontWeight: 700, marginBottom: '6px' }}>
                CURRENT USER ROLE:
              </div>
              <span
                style={{
                  background: '#DE1B59',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  display: 'inline-block',
                }}
              >
                {userRole}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {userRole === 'ADMIN' && (
                <button
                  type="button"
                  onClick={() => (window.location.href = '/admin/dashboard')}
                  style={{
                    width: '100%',
                    background: '#DE1B59',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '13px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  Go to Admin Dashboard →
                </button>
              )}
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                style={{
                  width: '100%',
                  background: '#F3F4F6',
                  color: '#374151',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Unauthenticated Modal Content */
          <div>
            {/* Modal Title & Subtitle */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2
                style={{
                  fontFamily: "Georgia, 'Tiro Devanagari Hindi', serif",
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#111827',
                  margin: '0 0 6px',
                }}
              >
                {activeTab === 'credentials'
                  ? 'Super Admin Portal'
                  : activeTab === 'phone'
                    ? 'Welcome to The Tapa Co.'
                    : 'Google OAuth Authentication'}
              </h2>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, lineHeight: 1.4 }}>
                {activeTab === 'credentials'
                  ? 'Access administrative parameters and configuration logs.'
                  : 'Dharma doesn\'t demand fear — it demands pure devotion.'}
              </p>
            </div>

            {/* Error & Success Alerts */}
            {error && (
              <div
                style={{
                  background: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  color: '#991B1B',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  marginBottom: '16px',
                }}
              >
                {error}
              </div>
            )}

            {success && (
              <div
                style={{
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  color: '#065F46',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  marginBottom: '16px',
                }}
              >
                {success}
              </div>
            )}

            {/* FORM 1: CREDENTIALS (EMAIL + PASSWORD) LOGIN */}
            {activeTab === 'credentials' && (
              <form onSubmit={handleCredentialsLogin}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Admin Email
                  </label>
                  <input
                    type="email"
                    placeholder="admin@tapa.co"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      color: '#111827',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      color: '#111827',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    background: '#DE1B59',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(222, 27, 89, 0.25)',
                    marginBottom: '16px',
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In to Console'}
                </button>

                <div style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab('phone')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#6B7280',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    ← Back to Customer Login
                  </button>
                </div>
              </form>
            )}

            {/* FORM 2: PHONE NUMBER + OTP LOGIN */}
            {activeTab === 'phone' && (
              <div>
                {!otpSent ? (
                  <form onSubmit={handleSendOtp}>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                        Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="+91"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{
                          width: '100%',
                          background: '#FFFFFF',
                          border: '1px solid #D1D5DB',
                          color: '#111827',
                          padding: '12px 14px',
                          borderRadius: '12px',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || cooldown > 0}
                      style={{
                        width: '100%',
                        background: '#DE1B59',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '14px',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '14px',
                        cursor: loading || cooldown > 0 ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 12px rgba(222, 27, 89, 0.25)',
                        marginBottom: '16px',
                      }}
                    >
                      {loading ? 'Sending Code...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Request Verification Code'}
                    </button>

                    <div style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setActiveTab('credentials')}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#6B7280',
                          fontSize: '13px',
                          cursor: 'pointer',
                        }}
                      >
                        Sign in as Administrator
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp}>
                    <div style={{ marginBottom: '12px', fontSize: '13px', color: '#6B7280' }}>
                      Verification code sent to <strong>{phone}</strong>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                        Verification Code
                      </label>
                      <input
                        type="text"
                        placeholder="••••••"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        style={{
                          width: '100%',
                          background: '#FFFFFF',
                          border: '1px solid #D1D5DB',
                          color: '#111827',
                          padding: '12px 14px',
                          borderRadius: '12px',
                          fontSize: '18px',
                          letterSpacing: '4px',
                          textAlign: 'center',
                          boxSizing: 'border-box',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: '100%',
                        background: '#DE1B59',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '14px',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '14px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 12px rgba(222, 27, 89, 0.25)',
                        marginBottom: '12px',
                      }}
                    >
                      {loading ? 'Verifying...' : 'Verify & Sign In'}
                    </button>

                    <div style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#6B7280',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        ← Change phone number
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <SessionProvider>
      <AdminLoginForm />
    </SessionProvider>
  );
}
