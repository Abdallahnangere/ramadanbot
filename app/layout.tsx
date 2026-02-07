import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Ramadan Bot — AI-Powered Spiritual Reflections & Flyer Creator',
  description: 'Create beautiful, authentic Ramadan reflections grounded in Quranic teachings. Share stunning flyers with your community and build consistent spiritual practice with daily streaks.',
  metadataBase: new URL('https://www.ramadanbot.app'),
  keywords: ['Ramadan', 'Islamic', 'Flyer Generator', 'Spiritual Reflection', 'Muslim', 'Quranic', 'Islamic Design', 'Daily Reflection', 'Faith Practice'],
  authors: [{ name: 'Abdallah Nangere' }],
  creator: 'Abdallah Nangere',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.ramadanbot.app',
    siteName: 'Ramadan Bot',
    title: 'Ramadan Bot — AI-Powered Spiritual Reflections',
    description: 'Create authentic Ramadan reflections and share them as beautiful flyers.',
    images: [
      {
        url: '/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Ramadan Bot Logo',
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@RamadanBot',
    title: 'Ramadan Bot — Spiritual Reflections for the Modern Muslim',
    description: 'Create and share authentic Ramadan reflections instantly',
    images: ['/icon-512x512.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="canonical" href="https://www.ramadanbot.app" />
      </head>
      <body className="antialiased bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}