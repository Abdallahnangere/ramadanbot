import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Ramadan Bot — Free AI Islamic Reflections & Personalized Quranic Flyer Generator',
  description: 'Generate authentic daily Islamic reflections with your name featured for free. Create beautiful high-resolution Ramadan flyers powered by advanced AI. Track your spiritual streak. Free native Android app & PWA. Built by Abdallah Nangere.',
  metadataBase: new URL('https://www.ramadanbot.app'),
  keywords: [
    'Ramadan flyer generator',
    'free AI Islamic reflections',
    'personalized Islamic flyers',
    'Quranic reflection app',
    'Ramadan companion',
    'Islamic flyer creator',
    'Ramadan meditation',
    'daily spiritual reflection',
    'Quran quote generator',
    'Islamic greeting cards',
    'free Islamic app',
    'Ramadan bot',
    'personalized Ramadan messages',
    'Islamic design generator',
    'free Islamic content',
    'Ramadan AI helper',
    'spiritual streak tracker',
    'Islamic community app',
    'free Ramadan tool',
    'AI-powered religious content',
    'Hadith reflections',
    'Islamic wisdom',
    'Muslim wellness app',
    'faith building app'
  ],
  authors: [{ name: 'Abdallah Nangere', url: 'https://www.ramadanbot.app' }],
  creator: 'Abdallah Nangere',
  publisher: 'Abdallah Nangere',
  category: 'Religion & Spirituality',
  applicationName: 'Ramadan Bot',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ramadan Bot'
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.ramadanbot.app',
    siteName: 'Ramadan Bot - Free AI Islamic Reflections',
    title: 'Ramadan Bot — Free AI Islamic Reflections & Personalized Flyers by Abdallah Nangere',
    description: 'Create authentic daily Islamic reflections with your name featured. Generate beautiful Ramadan flyers for free. Share with your community. Track your spiritual streak.',
    countryName: 'Global',
    images: [
      {
        url: 'https://www.ramadanbot.app/logo.png',
        width: 512,
        height: 512,
        alt: 'Ramadan Bot Logo - Free AI Islamic Flyer Generator with Your Name',
        type: 'image/png'
      },
      {
        url: 'https://www.ramadanbot.app/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Ramadan Bot - Free Personalized Islamic Reflections & Flyers',
        type: 'image/png'
      },
      {
        url: 'https://www.ramadanbot.app/generate.png',
        width: 1080,
        height: 1080,
        alt: 'Generate authentic Islamic reflections powered by AI',
        type: 'image/png'
      },
      {
        url: 'https://www.ramadanbot.app/login.png',
        width: 1080,
        height: 1080,
        alt: 'Track your Ramadan spiritual streak and progress',
        type: 'image/png'
      },
      {
        url: 'https://www.ramadanbot.app/share.png',
        width: 1080,
        height: 1080,
        alt: 'Share beautiful personalized flyers with your name featured',
        type: 'image/png'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@Abdalla_Nangere',
    site: '@RamadanBot',
    title: 'Ramadan Bot — Free AI Spiritual Reflections for Modern Muslims by Abdallah Nangere',
    description: 'Create and share authentic Islamic reflections instantly with personalized high-res flyers. Completely free. Your name featured. No ads.',
    images: [
      'https://www.ramadanbot.app/logo.png',
      'https://www.ramadanbot.app/generate.png',
      'https://www.ramadanbot.app/share.png'
    ],
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    noimageindex: false,
    nosnippet: false
  },
  alternates: {
    canonical: 'https://www.ramadanbot.app',
    languages: {
      'en-US': 'https://www.ramadanbot.app',
      'ar-SA': 'https://www.ramadanbot.app'
    }
  },
  verification: {
    google: 'googlef1fbd4c14879f3c3'
  },
  manifest: '/manifest.json'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Comprehensive JSON-LD Schema Markup for SEO
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://www.ramadanbot.app/#localbusiness",
        "name": "Ramadan Bot - Free AI Islamic Reflection Generator and Personalized Flyer Creator",
        "url": "https://www.ramadanbot.app",
        "description": "Create authentic Islamic reflections with your name featured. Generate beautiful, high-resolution personalized Ramadan flyers powered by advanced AI. Completely free. Built by Abdallah Nangere.",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.ramadanbot.app/logo.png",
          "width": 512,
          "height": 512,
          "name": "Ramadan Bot Logo - Free AI Islamic Flyer Generator"
        },
        "image": [
          {
            "@type": "ImageObject",
            "url": "https://www.ramadanbot.app/logo.png",
            "name": "Ramadan Bot Logo with Emerald Teal Design",
            "description": "Official logo for Ramadan Bot, the free AI-powered Islamic reflection and flyer generator"
          },
          {
            "@type": "ImageObject",
            "url": "https://www.ramadanbot.app/icon-512x512.png",
            "name": "Ramadan Bot App Icon",
            "description": "512x512 app icon for Ramadan Bot Islamic reflection generator"
          },
          {
            "@type": "ImageObject",
            "url": "https://www.ramadanbot.app/generate.png",
            "name": "Ramadan Bot Generate Islamic Reflections Interface",
            "description": "Screenshot showing the personalized Islamic reflection generation interface with AI-powered content"
          },
          {
            "@type": "ImageObject",
            "url": "https://www.ramadanbot.app/login.png",
            "name": "Ramadan Bot Dashboard with Streak Tracking",
            "description": "User dashboard displaying spiritual streak tracking and progress management"
          },
          {
            "@type": "ImageObject",
            "url": "https://www.ramadanbot.app/share.png",
            "name": "Ramadan Bot Personalized Flyer with Your Name",
            "description": "Beautiful high-resolution Ramadan flyer with personalized name featured for sharing"
          }
        ]
      },
      {
        "@type": "Organization",
        "@id": "https://www.ramadanbot.app/#organization",
        "name": "Ramadan Bot",
        "alternateName": "RamadanBot | Free AI Islamic Flyer Generator | Personalized Reflections",
        "url": "https://www.ramadanbot.app",
        "logo": "https://www.ramadanbot.app/logo.png",
        "description": "Free AI-powered Islamic reflection generator and personalized Ramadan flyer creator with your name featured",
        "foundingDate": "2024",
        "founder": {
          "@type": "Person",
          "name": "Abdallah Nangere",
          "url": "https://www.ramadanbot.app",
          "sameAs": [
            "https://x.com/Abdalla_Nangere"
          ]
        },
        "sameAs": [
          "https://x.com/Abdalla_Nangere",
          "https://www.tiktok.com/@bot_ramadan",
          "https://www.ramadanbot.app/app"
        ],
        "image": [
          "https://www.ramadanbot.app/logo.png",
          "https://www.ramadanbot.app/icon-512x512.png",
          "https://www.ramadanbot.app/generate.png",
          "https://www.ramadanbot.app/login.png",
          "https://www.ramadanbot.app/share.png"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "Customer Support",
          "url": "https://www.ramadanbot.app/contact",
          "email": "support@ramadanbot.app",
          "telephone": "+1-contact-us"
        }
      },
      {
        "@type": "WebApplication",
        "@id": "https://www.ramadanbot.app/#webapp",
        "name": "Ramadan Bot - Free AI Islamic Reflections & Personalized Ramadan Flyer Generator with Your Name",
        "alternateName": "RamadanBot App | Personalized Islamic Flyers | Ramadan Companion",
        "description": "Generate authentic daily Islamic reflections powered by AI with your name featured. Create beautiful, high-resolution personalized Ramadan flyers instantly. Share with your community. Track your spiritual streak. Completely free forever. Build by Abdallah Nangere.",
        "url": "https://www.ramadanbot.app/app",
        "applicationCategory": "LifestyleApplication",
        "isAccessibleForFree": true,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/OnlineOnly"
        },
        "screenshot": [
          {
            "@type": "ImageObject",
            "url": "https://www.ramadanbot.app/login.png",
            "name": "Ramadan Bot Dashboard - Track Your Spiritual Streak",
            "description": "PIN-based login interface to access your personalized Islamic reflection dashboard and streak tracking system"
          },
          {
            "@type": "ImageObject",
            "url": "https://www.ramadanbot.app/generate.png",
            "name": "Generate AI-Powered Islamic Reflections - Personalized For You",
            "description": "Create authentic daily Islamic reflections powered by advanced AI technology, personalized with your name"
          },
          {
            "@type": "ImageObject",
            "url": "https://www.ramadanbot.app/share.png",
            "name": "Share Personalized Ramadan Flyers - High Resolution 1080x1080",
            "description": "Beautiful, shareable high-resolution Ramadan flyers with your name professionally featured"
          }
        ],
        "image": [
          "https://www.ramadanbot.app/logo.png",
          "https://www.ramadanbot.app/generate.png",
          "https://www.ramadanbot.app/login.png",
          "https://www.ramadanbot.app/share.png"
        ],
        "operatingSystem": [
          "Web",
          "Android 11+",
          "iOS 12+"
        ],
        "browserRequirements": "Requires modern browser with JavaScript support",
        "creator": {
          "@type": "Person",
          "name": "Abdallah Nangere",
          "url": "https://www.ramadanbot.app"
        },
        "author": {
          "@type": "Person",
          "name": "Abdallah Nangere"
        },
        "keywords": "Ramadan, Islamic reflections, AI generator, personalized flyers, free app, Quran, Hadith, Islamic design, flyer generator, with your name, free islamic app, ramadan companion, spiritual growth, Abdallah Nangere",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "1250",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://www.ramadanbot.app/#website",
        "name": "Ramadan Bot",
        "url": "https://www.ramadanbot.app",
        "isPartOf": {
          "@id": "https://www.ramadanbot.app/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://www.ramadanbot.app/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.ramadanbot.app/#softwareapp",
        "name": "Ramadan Bot - Free AI Islamic Reflection Generator with Personalized Flyers",
        "alternateName": "RamadanBot | AI Powered Islamic Reflections | Free Flyer Creator with Your Name",
        "description": "Free AI-powered app to generate authentic Islamic reflections and create beautiful personalized high-resolution Ramadan flyers with your name featured. Built with care by Abdallah Nangere. Works offline.",
        "url": "https://www.ramadanbot.app/app",
        "image": [
          "https://www.ramadanbot.app/logo.png",
          "https://www.ramadanbot.app/generate.png",
          "https://www.ramadanbot.app/share.png",
          "https://www.ramadanbot.app/login.png"
        ],
        "applicationCategory": "LifestyleApplication",
        "downloadUrl": "https://www.ramadanbot.app/app",
        "inLanguage": [
          "en",
          "ar"
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "1250",
          "bestRating": "5",
          "worstRating": "1"
        },
        "releaseNotes": "Free AI-powered Islamic reflection generator with personalized flyers. Create beautiful Ramadan content instantly.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/OnlineOnly"
        },
        "operatingSystem": [
          "Android 11+",
          "iOS 12+",
          "Web"
        ],
        "sameAs": [
          "https://www.ramadanbot.app",
          "https://x.com/Abdalla_Nangere",
          "https://www.tiktok.com/@bot_ramadan"
        ],
        "author": {
          "@type": "Person",
          "name": "Abdallah Nangere"
        },
        "creator": {
          "@type": "Person",
          "name": "Abdallah Nangere"
        },
        "keywords": "Ramadan flyer generator, Islamic reflections, AI generator, personalized flyers, free app, Quran, Hadith, Islamic design, with your name, free Islamic app, Ramadan companion, spiritual growth, ai powered islamic content, personalized ramadan messages, Abdul Nangere"
      },
      {
        "@type": "Product",
        "@id": "https://www.ramadanbot.app/#product",
        "name": "Ramadan Bot - Free Personalized Islamic Flyer Generator Powered by AI",
        "alternateName": "RamadanBot | AI Islamic Reflections | Free Flyers with Your Name",
        "description": "Create authentic Islamic reflections and beautiful high-resolution Ramadan flyers with your name featured. Powered by advanced AI. Completely free. No ads. No hidden costs. Built by Abdallah Nangere for the global Muslim community.",
        "url": "https://www.ramadanbot.app",
        "image": [
          "https://www.ramadanbot.app/logo.png",
          "https://www.ramadanbot.app/generate.png",
          "https://www.ramadanbot.app/login.png",
          "https://www.ramadanbot.app/share.png",
          "https://www.ramadanbot.app/icon-512x512.png"
        ],
        "brand": {
          "@type": "Brand",
          "name": "Ramadan Bot"
        },
        "category": "Software Application, Lifestyle App",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": "1250"
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "USD",
          "lowPrice": "0",
          "highPrice": "0",
          "offerCount": "1",
          "availability": "https://schema.org/OnlineOnly"
        },
        "creator": {
          "@type": "Person",
          "name": "Abdallah Nangere"
        },
        "keywords": "Ramadan flyer, AI generator, Islamic reflections, personalized flyers, free islamic app, with your name, Quran, Hadith, Islamic design, Ramadan companion, spiritual streak, free islamic content, personalized ramadan messages, Abdallah Nangere"
      },
    ]
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ramadan Bot" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/logo.png" as="image" />
        <link rel="preload" href="/generate.png" as="image" />
        <link rel="preload" href="/login.png" as="image" />
        <link rel="preload" href="/share.png" as="image" />
        
        {/* Icons */}
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="shortcut icon" href="/icon.png" type="image/png" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Canonical - critical for SEO */}
        <link rel="canonical" href="https://www.ramadanbot.app" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://firebaseapp.com" />
        
        {/* JSON-LD Structured Data for Search Engines */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
        
        {/* Open Search / Search Engine Discovery */}
        <link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" title="Ramadan Bot Search" />
        
        {/* Social Media Meta Tags */}
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="ar_SA" />
        <meta name="twitter:site" content="@RamadanBot" />
        <meta name="twitter:creator" content="@Abdalla_Nangere" />
        
        {/* Additional SEO meta tags */}
        <meta name="google-site-verification" content="googlef1fbd4c14879f3c3" />
        <meta name="msvalidate.01" content="your-bing-verification-code" />
      </head>
      <body className="antialiased bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}