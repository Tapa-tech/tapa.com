'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error internally for debugging without exposing to end-user UI
    console.error('[Application Error Boundary caught error]:', error);
  }, [error]);

  return (
    <div
      className="w-full min-h-[65vh] flex flex-col justify-center items-center px-4 py-12 md:py-20"
      style={{ background: '#F8F5EE' }}
    >
      <div className="max-w-md w-full text-center">
        {/* Warning Icon Badge */}
        <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center text-2xl border border-[#F5E6D3] bg-[#FFFDF9] text-[#DE1B59] shadow-sm">
          ⚠️
        </div>

        {/* Eyebrow */}
        <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#A07800' }}>
          SOMETHING WENT WRONG
        </p>

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif', color: '#111827' }}>
          We encountered an unexpected issue
        </h1>

        {/* User-friendly sanitized error description */}
        <p className="text-sm leading-relaxed mb-8 text-gray-600">
          A temporary error occurred while processing your request. Please try again or return to the homepage.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90 shadow-sm"
            style={{ background: '#DE1B59' }}
          >
            🔄 Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl text-xs font-bold border border-gray-300 text-gray-800 bg-white hover:bg-gray-50 transition-colors"
          >
            ‹ Return to Homepage
          </Link>
        </div>

        {/* Contact Support Link */}
        <div className="mt-8">
          <Link href="/about" className="text-xs font-semibold text-gray-500 hover:text-[#DE1B59] transition-colors">
            Need help? Contact support ›
          </Link>
        </div>
      </div>
    </div>
  );
}
