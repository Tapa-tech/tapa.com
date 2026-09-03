'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

type VerificationStatus = 'LOADING' | 'SUCCESS' | 'ALREADY_VERIFIED' | 'EXPIRED_TOKEN' | 'INVALID_TOKEN';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<VerificationStatus>('LOADING');
  const [email, setEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        setStatus('INVALID_TOKEN');
        setErrorMessage('No verification token provided in URL.');
        return;
      }

      fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.email) setEmail(data.email);

          if (data.success) {
            if (data.status === 'ALREADY_VERIFIED') {
              setStatus('ALREADY_VERIFIED');
            } else {
              setStatus('SUCCESS');
            }
          } else {
            if (data.status === 'EXPIRED_TOKEN') {
              setStatus('EXPIRED_TOKEN');
            } else {
              setStatus('INVALID_TOKEN');
            }
            setErrorMessage(data.error || 'Verification failed.');
          }
        })
        .catch((err) => {
          setStatus('INVALID_TOKEN');
          setErrorMessage(err.message || 'An error occurred verifying your email.');
        });
    }
  }, []);

  return (
    <div
      className="w-full min-h-[75vh] flex flex-col justify-center items-center px-4 py-16"
      style={{ background: '#F8F5EE' }}
    >
      <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-[#F5E6D3] shadow-md text-center">
        {/* Loading State */}
        {status === 'LOADING' && (
          <div>
            <div className="w-12 h-12 rounded-full border-4 border-t-[#DE1B59] border-gray-200 animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Verifying Your Email...
            </h1>
            <p className="text-xs text-gray-500">Please wait while we confirm your email verification link.</p>
          </div>
        )}

        {/* Success State */}
        {status === 'SUCCESS' && (
          <div>
            <div className="w-14 h-14 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              ✓
            </div>
            <p className="text-xs font-bold tracking-widest text-[#A07800] uppercase mb-1">REGISTRATION COMPLETE</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Email Verified Successfully
            </h1>
            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              Your email address {email ? <b>{email}</b> : ''} has been confirmed. You can now sign in to access your Tapa account.
            </p>
            <Link
              href="/admin/login?mode=login"
              className="inline-block w-full py-3 bg-[#DE1B59] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Proceed to Sign In ›
            </Link>
          </div>
        )}

        {/* Already Verified State */}
        {status === 'ALREADY_VERIFIED' && (
          <div>
            <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              ℹ
            </div>
            <p className="text-xs font-bold tracking-widest text-[#A07800] uppercase mb-1">ACCOUNT STATUS</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Email Already Verified
            </h1>
            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              The email address {email ? <b>{email}</b> : ''} is already confirmed and active. You can log in directly.
            </p>
            <Link
              href="/admin/login?mode=login"
              className="inline-block w-full py-3 bg-[#DE1B59] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Sign In to Your Account ›
            </Link>
          </div>
        )}

        {/* Expired Token State */}
        {status === 'EXPIRED_TOKEN' && (
          <div>
            <div className="w-14 h-14 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              ⏱
            </div>
            <p className="text-xs font-bold tracking-widest text-amber-800 uppercase mb-1">LINK EXPIRED</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Verification Link Expired
            </h1>
            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              This verification link has expired (valid for 24 hours). Please request a new verification link or contact support.
            </p>
            <Link
              href="/admin/login?mode=signup"
              className="inline-block w-full py-3 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Return to Authentication ›
            </Link>
          </div>
        )}

        {/* Invalid Token State */}
        {status === 'INVALID_TOKEN' && (
          <div>
            <div className="w-14 h-14 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              ⚠️
            </div>
            <p className="text-xs font-bold tracking-widest text-red-700 uppercase mb-1">INVALID LINK</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Invalid Verification Link
            </h1>
            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              {errorMessage || 'The verification token provided is invalid or has already been used.'}
            </p>
            <Link
              href="/"
              className="inline-block w-full py-3 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Return to Homepage ›
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
