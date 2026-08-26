import React from 'react';
import type { Metadata } from 'next';
import LayoutContent from './LayoutContent';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Tapa Co. — Every ritual, the right way',
  description: 'Authentic Dharmic knowledge, scripture-sourced ritual guides, city-precise Panchang, and complete puja kits.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
