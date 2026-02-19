import React from 'react';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: 'Ramadan Bot: AI Flyer Generator + Qur\'ān Reader - Free Personalized Ramadan Tools',
  description: 'Free AI-powered Ramadan flyer generator with Qur\'ān reader (29-day plan, 604 pages, phase tracking). Create personalized Islamic content, beautiful Quranic flyers, read the full Qur\'ān during Ramadan, and share with your community. Auto-save reading progress, phase completion tracking, and spiritual growth tools.',
  metadataBase: new URL('https://www.ramadanbot.app'),
  keywords: [
    'Ramadan flyer generator',
    'Qur\'ān reader',
    'Ramadan Qur\'ān companion',
    '29-day Qur\'ān plan',
    '5 phases daily',
    'complete Qur\'ān in 29 days',
    'Qur\'ān tracker',
    'Ramadan reading plan',
    'Create flyers with my name',
    'personalised Ramadan',
    'AI Ramadan generator',
    'free Ramadan flyer maker',
    'Islamic reflections',
    'Quranic wisdom',
    'Islamic greeting cards',
    'Ramadan AI app',
    'personalized Islamic content',
    'Ramadan with your name',
    'daily Quranic reflections',
    'free Islamic app',
    'spiritual growth app',
    'Muslim community flyers',
    'Ramadan social media',
    'Dua generator',
    'Hadith reflections',
    'Islamic spirituality',
    'Ramadan journey tracker',
    'authentic Quranic teachings',
    'AI Islamic technology',
    'faith-based app',
    'religious reflections',
    'Ramadan decoration ideas',
    'social sharing Islamic content',
    'personalized spiritual practice',
    'Qur\'ān page viewer',
    'Ramadan page tracking',
    'phase completion tracker',
    'dark mode Qur\'ān reader'
  ],
  authors: [{ name: 'Abdallah Nangere', url: 'https://www.ramadanbot.app/contact' }],
  creator: 'Abdallah Nangere',
  category: 'Productivity & Lifestyle',
  applicationName: 'Ramadan Bot: AI Flyer Generator + Qur\'ān Reader',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Ramadan Bot: Flyers + Reader'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.ramadanbot.app',
    siteName: 'Ramadan Bot',
    title: 'Ramadan Bot: Create Beautiful Ramadan Flyers with your name - Free AI Generator',
    description: 'Create personalized Ramadan flyers with your name using AI-powered Islamic wisdom. Free app, beautiful design, instant sharing.',
    images: [
      {
        url: 'https://www.ramadanbot.app/logo.png',
        width: 512,
        height: 512,
        alt: 'Ramadan Bot Logo - AI Flyer Generator with Your Name',
        type: 'image/png'
      },
      {
        url: 'https://www.ramadanbot.app/login.png',
        width: 540,
        height: 720,
        alt: 'Ramadan Bot Dashboard - Manage Your Reflections and Streaks',
        type: 'image/png'
      },
      {
        url: 'https://www.ramadanbot.app/generate.png',
        width: 540,
        height: 720,
        alt: 'Create Beautiful Ramadan Flyers with AI - Personalized with Your Name',
        type: 'image/png'
      },
      {
        url: 'https://www.ramadanbot.app/share.png',
        width: 540,
        height: 720,
        alt: 'Share Your Personalized Ramadan Flyers - Islamic Content with Your Name',
        type: 'image/png'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@Abdalla_Nangere',
    title: 'Ramadan Bot: Free AI Flyer Creator with Your Name',
    description: 'Create authentic Ramadan flyers featuring your name. Powered by AI, sharing Islamic wisdom daily.',
    images: ['https://www.ramadanbot.app/logo.png', 'https://www.ramadanbot.app/generate.png'],
  },
  verification: {
    google: 'googlef1fbd4c14879f3c3'
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: 'index, follow',
  },
  alternates: {
    canonical: 'https://www.ramadanbot.app'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Ramadan Bot: Create Beautiful Ramadan Flyers with your name",
    "url": "https://www.ramadanbot.app",
    "applicationCategory": "Lifestyle",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "operatingSystem": "Android, iOS, Web",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1500"
    },
    "description": "Free AI-powered Ramadan flyer generator with your name featured. Create personalized Islamic content, beautiful Quranic flyers, and share with your community.",
    "creator": {
      "@type": "Person",
      "name": "Abdallah Nangere",
      "url": "https://www.ramadanbot.app/contact"
    }
  };

  const imageSchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "Ramadan Bot App Screenshots",
    "images": [
      {
        "@type": "ImageObject",
        "url": "https://www.ramadanbot.app/logo.png",
        "name": "Ramadan Bot Logo",
        "description": "Create Beautiful Ramadan Flyers with your name - Free AI Generator"
      },
      {
        "@type": "ImageObject",
        "url": "https://www.ramadanbot.app/login.png",
        "name": "Dashboard Screen",
        "description": "Manage Your Reflections and Streaks - Personalized with Your Name"
      },
      {
        "@type": "ImageObject",
        "url": "https://www.ramadanbot.app/generate.png",
        "name": "Create Flyers Screen",
        "description": "Create Beautiful Ramadan Flyers with AI - Personalized with Your Name"
      },
      {
        "@type": "ImageObject",
        "url": "https://www.ramadanbot.app/share.png",
        "name": "Share Screen",
        "description": "Share Your Personalized Ramadan Flyers - Islamic Content with Your Name"
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="white" />
        <meta name="apple-mobile-web-app-title" content="Ramadan Bot" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href="https://www.ramadanbot.app" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.ramadanbot.app" />
        
        {/* JSON-LD Schema Markup for better SEO and image indexing */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(imageSchema) }}
        />
      </head>
      <body className="antialiased bg-white text-slate-900">
        {children}
        <Analytics />
      </body>
    </html>
  );
}