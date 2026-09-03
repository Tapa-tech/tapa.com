'use client';

import React, { useState, useEffect } from 'react';
import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const GoogleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

const GoogleSignInButton = ({ label = 'Continue with Google', onClick }: { label?: string; onClick: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      style={{
        width: '100%',
        minHeight: '48px',
        background: isActive ? '#F1F5F9' : isHovered ? '#F8FAFC' : '#FFFFFF',
        border: isHovered ? '1px solid #747775' : '1px solid #DADCE0',
        borderRadius: '24px',
        color: '#1F2937',
        padding: '12px 24px',
        fontSize: '15px',
        fontWeight: 600,
        fontFamily: 'inherit',
        letterSpacing: '0.1px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        boxShadow: isHovered
          ? '0 2px 6px rgba(60, 64, 67, 0.15), 0 1px 2px rgba(60, 64, 67, 0.3)'
          : '0 1px 3px rgba(60, 64, 67, 0.08)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        outline: 'none',
        boxSizing: 'border-box',
      }}
    >
      <GoogleLogo />
      <span>{label}</span>
    </button>
  );
};

function AuthModalContent() {
  const { data: session, status } = useSession();

  // Mode/Tab State: 'login' | 'signup' | 'phone' | 'google'
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'phone' | 'google'>('login');

  // Customer Signup State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupConsent, setSignupConsent] = useState(false);
  const [registeredPendingEmail, setRegisteredPendingEmail] = useState<string | null>(null);
  const [devVerificationUrl, setDevVerificationUrl] = useState<string | null>(null);



  // Email/Password Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Phone OTP State
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // UI Feedback States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // URL mode sync & countdown timer
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('mode');
      if (mode === 'signup') {
        setActiveTab('signup');
      } else if (mode === 'phone') {
        setActiveTab('phone');
      } else if (mode === 'google') {
        setActiveTab('google');
      } else if (mode === 'credentials' || mode === 'login') {
        setActiveTab('login');
      }
    }
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Handle Customer Signup
  const handleCustomerSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!signupName || signupName.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!signupEmail || !emailRegex.test(signupEmail.trim())) {
      setError('Please enter a valid email address (e.g. name@example.com).');
      return;
    }

    if (signupPhone.trim() && !/^[+0-9\s-]{10,15}$/.test(signupPhone.trim())) {
      setError('Please enter a valid phone number format (e.g. +919876543210).');
      return;
    }

    if (!signupPassword || signupPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match. Please confirm your password.');
      return;
    }

    if (!signupConsent) {
      setError('You must agree to the platform Terms & Privacy Policy to create an account.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName.trim(),
          email: signupEmail.trim(),
          phone: signupPhone.trim() || undefined,
          password: signupPassword,
          consent: signupConsent,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Registration failed. Please try again.');
      } else {
        setRegisteredPendingEmail(signupEmail.trim());
        if (data.devVerificationUrl) {
          setDevVerificationUrl(data.devVerificationUrl);
        }
        setSuccess('Account created');
      }

    } catch (err: any) {
      setError(err.message || 'Error creating account.');
    } finally {
      setLoading(false);
    }
  };



  // Handle Customer & Admin Login
  const handleEmailPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!loginEmail || !loginPassword) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      const res = await signIn('credentials', {
        username: loginEmail,
        password: loginPassword,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid credentials. Please check your email and password.');
      } else if (res?.ok) {
        setSuccess('Signed in successfully! Redirecting...');
        // Fetch session to determine role-based redirect
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        const role = sessionData?.user?.role?.toUpperCase();

        if (['ADMIN', 'SUPER_USER'].includes(role)) {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/account';
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Send Phone OTP
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
        setSuccess('Verification code sent successfully via SMS.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred sending OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Verify Phone OTP
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
        window.location.href = '/account';
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const userRole = (session?.user as { role?: string })?.role?.toUpperCase() || 'CUSTOMER';

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
        padding: '16px',
        zIndex: 9999,
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '32px 28px',
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          position: 'relative',
          border: '1px solid #EFEAE4',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => (window.location.href = '/')}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
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

        {/* AUTHENTICATED STATE */}
        {status === 'authenticated' && session?.user ? (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#DE1B59', letterSpacing: '1px', marginBottom: '6px' }}>
              AUTHENTICATED SESSION
            </div>
            <h2 style={{ fontFamily: "Georgia, 'Tiro Devanagari Hindi', serif", fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>
              Pranām, {session.user.name || 'Devotee'}
            </h2>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 20px' }}>
              Logged in as <strong>{session.user.email || (session.user as any).phone}</strong>
            </p>

            <div style={{ background: '#FDF2F5', border: '1px solid #FCE7F3', borderRadius: '12px', padding: '14px', marginBottom: '20px', textAlign: 'left' }}>
              <div style={{ fontSize: '11px', color: '#DE1B59', fontWeight: 700, marginBottom: '4px' }}>
                CURRENT ROLE:
              </div>
              <span
                style={{
                  background: '#DE1B59',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  display: 'inline-block',
                }}
              >
                {userRole}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['ADMIN', 'SUPER_USER'].includes(userRole) ? (
                <Link
                  href="/admin/dashboard"
                  style={{
                    background: '#DE1B59',
                    color: '#FFFFFF',
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '13px',
                    textDecoration: 'none',
                    display: 'block',
                  }}
                >
                  Go to Admin Dashboard →
                </Link>
              ) : (
                <Link
                  href="/account"
                  style={{
                    background: '#DE1B59',
                    color: '#FFFFFF',
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '13px',
                    textDecoration: 'none',
                    display: 'block',
                  }}
                >
                  Go to My Account →
                </Link>
              )}

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/' })}
                style={{
                  background: '#F3F4F6',
                  color: '#374151',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* UNAUTHENTICATED CONTENT */
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2
                style={{
                  fontFamily: "Georgia, 'Tiro Devanagari Hindi', serif",
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#111827',
                  margin: '0 0 4px',
                }}
              >
                {activeTab === 'signup'
                  ? 'Create Customer Account'
                  : activeTab === 'phone'
                  ? 'Phone OTP Authentication'
                  : activeTab === 'google'
                  ? 'Google Sign In'
                  : 'Welcome to The Tapa Co.'}
              </h2>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, lineHeight: 1.4 }}>
                {activeTab === 'signup'
                  ? 'Join The Tapa Co. to manage ritual orders and preferences.'
                  : 'Dharma doesn\'t demand fear — it demands pure devotion.'}
              </p>
            </div>

            {/* TAB SELECTOR */}
            <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setError(null); setSuccess(null); }}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: activeTab === 'login' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'login' ? '#111827' : '#6B7280',
                  boxShadow: activeTab === 'login' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('signup'); setError(null); setSuccess(null); }}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: activeTab === 'signup' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'signup' ? '#111827' : '#6B7280',
                  boxShadow: activeTab === 'signup' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('phone'); setError(null); setSuccess(null); }}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: activeTab === 'phone' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'phone' ? '#111827' : '#6B7280',
                  boxShadow: activeTab === 'phone' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                Phone OTP
              </button>
            </div>

            {/* ERROR & SUCCESS ALERTS */}
            {error && (
              <div
                style={{
                  background: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  color: '#991B1B',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  fontSize: '12px',
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
                  padding: '10px 12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  marginBottom: '16px',
                }}
              >
                {success}
              </div>
            )}

            {/* TAB 1: EMAIL + PASSWORD LOGIN */}
            {activeTab === 'login' && (
              <form onSubmit={handleEmailPasswordLogin}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      color: '#111827',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#FFFFFF',
                      border: '1px solid #D1D5DB',
                      color: '#111827',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      fontSize: '13px',
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
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(222, 27, 89, 0.25)',
                    marginBottom: '14px',
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>

                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                  <GoogleSignInButton onClick={() => signIn('google', { callbackUrl: '/account' })} />
                </div>
              </form>
            )}

            {/* TAB 2: CUSTOMER SIGNUP */}
            {activeTab === 'signup' && (
              registeredPendingEmail ? (
                <div style={{ textAlign: 'center', padding: '16px 8px' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>✉️</div>
                  <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
                    Account created
                  </h2>
                  <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.5, margin: '0 0 16px' }}>
                    Please verify your email address to complete your registration.
                  </p>
                  <div style={{ background: '#FFFDF9', border: '1px solid #F5E6D3', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: '#111827', marginBottom: '16px', fontWeight: 600 }}>
                    Registered Email: {registeredPendingEmail}
                  </div>

                  {devVerificationUrl && (
                    <div style={{ marginBottom: '16px', padding: '10px', background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '10px', textAlign: 'center' }}>
                      <p style={{ fontSize: '11px', color: '#92400E', fontWeight: 700, margin: '0 0 6px' }}>⚡ LOCAL DEV TEST LINK:</p>
                      <Link
                        href={devVerificationUrl}
                        target="_blank"
                        style={{
                          display: 'inline-block',
                          background: '#D97706',
                          color: '#FFFFFF',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        Verify Email Now ›
                      </Link>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => { setRegisteredPendingEmail(null); setDevVerificationUrl(null); setActiveTab('login'); setError(null); setSuccess(null); }}
                    style={{
                      width: '100%',
                      background: '#DE1B59',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    ‹ Return to Sign In
                  </button>

                </div>
              ) : (
                <form onSubmit={handleCustomerSignup}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Komal Sharma"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#FFFFFF',
                        border: '1px solid #D1D5DB',
                        color: '#111827',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        boxSizing: 'border-box',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#FFFFFF',
                        border: '1px solid #D1D5DB',
                        color: '#111827',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        boxSizing: 'border-box',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                      Phone Number (Optional Profile Field)
                    </label>
                    <input
                      type="tel"
                      placeholder="+919876543210"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#FFFFFF',
                        border: '1px solid #D1D5DB',
                        color: '#111827',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        boxSizing: 'border-box',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                      Password (min. 6 characters) *
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#FFFFFF',
                        border: '1px solid #D1D5DB',
                        color: '#111827',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        boxSizing: 'border-box',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#FFFFFF',
                        border: '1px solid #D1D5DB',
                        color: '#111827',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        boxSizing: 'border-box',
                        outline: 'none',
                      }}
                    />
                  </div>

                  {/* Consent Checkbox */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '16px' }}>
                    <input
                      type="checkbox"
                      id="signupConsent"
                      checked={signupConsent}
                      onChange={(e) => setSignupConsent(e.target.checked)}
                      style={{ marginTop: '3px', cursor: 'pointer', accentColor: '#DE1B59' }}
                    />
                    <label htmlFor="signupConsent" style={{ fontSize: '11px', color: '#4B5563', lineHeight: 1.4, cursor: 'pointer' }}>
                      I agree that The Tapa Co. may use the information I provide for account management, authentication, security, order processing, and other services required to provide the platform. See our{' '}
                      <Link href="/about" target="_blank" style={{ color: '#DE1B59', fontWeight: 600, textDecoration: 'underline' }}>
                        Terms &amp; Conditions
                      </Link>{' '}
                      and{' '}
                      <Link href="/about" target="_blank" style={{ color: '#DE1B59', fontWeight: 600, textDecoration: 'underline' }}>
                        Privacy Policy
                      </Link>.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      background: '#DE1B59',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 12px rgba(222, 27, 89, 0.25)',
                      marginBottom: '14px',
                      opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <GoogleSignInButton label="Continue with Google" onClick={() => signIn('google', { callbackUrl: '/account' })} />
                  </div>
                </form>
              )
            )}

            {/* TAB 3: PHONE OTP */}
            {activeTab === 'phone' && (
              <div>
                {!otpSent ? (
                  <form onSubmit={handleSendOtp}>
                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                        10-Digit Mobile Number
                      </label>
                      <input
                        type="text"
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{
                          width: '100%',
                          background: '#FFFFFF',
                          border: '1px solid #D1D5DB',
                          color: '#111827',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          fontSize: '13px',
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
                        padding: '12px',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: loading || cooldown > 0 ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 12px rgba(222, 27, 89, 0.25)',
                      }}
                    >
                      {loading ? 'Sending Code...' : cooldown > 0 ? `Resend code in ${cooldown}s` : 'Request Verification Code'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp}>
                    <div style={{ marginBottom: '10px', fontSize: '12px', color: '#6B7280', textAlign: 'center' }}>
                      Verification code sent to <strong>{phone}</strong>
                    </div>

                    <div style={{ marginBottom: '18px' }}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '4px', textAlign: 'center' }}>
                        6-Digit Verification Code
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
                          padding: '10px',
                          borderRadius: '10px',
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
                        padding: '12px',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 12px rgba(222, 27, 89, 0.25)',
                        marginBottom: '10px',
                      }}
                    >
                      {loading ? 'Verifying...' : 'Verify Code & Sign In'}
                    </button>

                    <div style={{ textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#6B7280',
                          fontSize: '11px',
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

            {/* TAB 4: GOOGLE DIRECT SIGN IN */}
            {activeTab === 'google' && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>
                  Sign in securely with your Google account.
                </p>
                <GoogleSignInButton onClick={() => signIn('google', { callbackUrl: '/account' })} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <SessionProvider>
      <AuthModalContent />
    </SessionProvider>
  );
}
