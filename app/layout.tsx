import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Ramadan Bot — AI Spiritual Reflections & Personalized Quranic Flyer Generator',
  description: 'Create authentic daily Islamic reflections powered by AI. Generate beautiful high-resolution flyers with your name featured. Share Quranic wisdom with your community. Track streaks. Free PWA app.',
  metadataBase: new URL('https://www.ramadanbot.app'),
  keywords: [
    'Ramadan',
    'Islamic reflections',
    'Quran',
    'AI generator',
    'Flyer creator',
    'Spiritual practice',
    'Muslim app',
    'Islamic design',
    'Daily reflection',
    'Quranic wisdom',
    'Ramadan journey',
    'Islamic community',
    'PWA app',
    'Streak tracker',
    'Faith practice',
    'Islamic technology',
    'Dua',
    'Islamic greeting cards',
    'Islamic content',
    'Ramadan decoration',
    'Religious app',
    'Spiritual growth'
  ],
  authors: [{ name: 'Abdallah Nangere', url: 'https://www.ramadanbot.app' }],
  creator: 'Abdallah Nangere',
  category: 'Productivity & Religion',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.ramadanbot.app',
    siteName: 'Ramadan Bot',
    title: 'Ramadan Bot — AI-Powered Spiritual Reflections with Personalized Flyers',
    description: 'Generate authentic Islamic reflections and create beautiful shareable flyers with your name featured.',
    images: [
      {
        url: 'https://www.ramadanbot.app/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Ramadan Bot Logo - Islamic Spiritual Reflections',
        type: 'image/png'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@RamadanBot',
    title: 'Ramadan Bot — AI Spiritual Reflections for Modern Muslims',
    description: 'Create and share authentic Islamic reflections instantly with personalized high-res flyers.',
    images: ['https://www.ramadanbot.app/icon-512x512.png'],
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1
  },
  alternates: {
    canonical: 'https://www.ramadanbot.app'
  }
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