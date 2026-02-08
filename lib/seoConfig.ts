/**
 * SEO App Configuration
 * Centralized configuration for all SEO-related metadata across the application
 * Optimized for keywords: Ramadan, flyer, personalised, with my name, AI, free
 */

export const seoConfig = {
  // Site-wide configuration
  site: {
    name: 'Ramadan Bot',
    description: 'Free AI-powered Islamic reflection generator and personalized Ramadan flyer creator with your name featured. Built by Abdallah Nangere.',
    url: 'https://www.ramadanbot.app',
    ogImage: 'https://www.ramadanbot.app/logo.png',
    twitterHandle: '@RamadanBot',
    creatorHandle: '@Abdalla_Nangere',
    email: 'support@ramadanbot.app',
    author: 'Abdallah Nangere'
  },

  // Page-specific configurations
  pages: {
    home: {
      title: 'Ramadan Bot — Free AI Islamic Reflections & Personalized Flyer Generator with Your Name | Abdallah Nangere',
      description: 'Generate authentic daily Islamic reflections powered by advanced AI. Create beautiful, high-resolution personalized Ramadan flyers with your name featured. Completely free forever. Built by Abdallah Nangere.',
      keywords: ['Ramadan flyer generator', 'Islamic reflections AI', 'personalized Ramadan flyers', 'free Islamic app', 'AI reflection generator', 'with your name', 'Abdallah Nangere'],
      canonical: 'https://www.ramadanbot.app',
      ogType: 'website',
      ogTitle: 'Ramadan Bot — Free AI Islamic Reflections & Personalized Flyers',
      ogDescription: 'Create personalized Islamic reflections and beautiful Ramadan flyers with your name. Completely free forever.',
      twitterCard: 'summary_large_image',
      structuredData: 'Organization, WebApplication, Product'
    },
    app: {
      title: 'Ramadan Bot App — Create Personalized Islamic Reflections & Flyers Free | Abdallah Nangere',
      description: 'Launch the Ramadan Bot app to generate authentic Islamic reflections with AI and create beautiful personalized flyers with your name featured. Works offline. Track your spiritual streak.',
      keywords: ['Ramadan app', 'Islamic reflection generator', 'personalized flyer app', 'free Islamic app', 'Ramadan companion'],
      canonical: 'https://www.ramadanbot.app/app',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      structuredData: 'SoftwareApplication, WebApplication'
    },
    privacy: {
      title: 'Privacy Policy — Ramadan Bot | Free Islamic Reflection Generator by Abdallah Nangere',
      description: 'Ramadan Bot privacy policy. Your data is safe and private. We never share your information or track you. Privacy first.',
      keywords: ['privacy', 'security', 'data protection', 'Islamic app'],
      canonical: 'https://www.ramadanbot.app/privacy',
      ogType: 'website',
      structuredData: 'Organization'
    },
    contact: {
      title: 'Contact Ramadan Bot — Support & Feedback | Abdallah Nangere',
      description: 'Get in touch with Ramadan Bot. Send us feedback, report bugs, or ask questions about the free AI Islamic reflection generator.',
      keywords: ['contact', 'support', 'feedback', 'Islamic app support'],
      canonical: 'https://www.ramadanbot.app/contact',
      ogType: 'website',
      structuredData: 'Organization'
    }
  },

  // Image assets with SEO metadata
  images: {
    logo: {
      url: 'https://www.ramadanbot.app/logo.png',
      alt: 'Ramadan Bot - Free AI Islamic Reflections and Personalized Flyer Generator with Your Name',
      title: 'Ramadan Bot Logo - Free Islamic Flyer Generator',
      description: 'Official logo of Ramadan Bot, the free AI-powered tool for creating personalized Islamic reflections and beautiful Ramadan flyers with your name featured',
      width: 512,
      height: 512
    },
    loginDashboard: {
      url: 'https://www.ramadanbot.app/login.png',
      alt: 'Ramadan Bot Dashboard with Pin Login and Spiritual Streak Tracking - Free Islamic Reflection App',
      title: 'Track Your Ramadan Spiritual Streak with Ramadan Bot Dashboard',
      description: 'User dashboard interface showing PIN-based login, daily spiritual streaks, and personalized Islamic reflection statistics. Free forever, no ads.',
      width: 1080,
      height: 1080,
      keywords: ['Ramadan tracker', 'streak app', 'spiritual progress', 'Islamic reflection tracker']
    },
    generateInterface: {
      url: 'https://www.ramadanbot.app/generate.png',
      alt: 'Ramadan Bot AI Generator - Create Personalized Islamic Reflections with Your Name - Free Tool',
      title: 'Generate AI-Powered Islamic Reflections Personalized with Your Name',
      description: 'Interface for generating AI-powered Islamic reflections. Users can select themes, add personal hints, and instantly generate personalized Quranic-based reflections with their name featured. Powered by advanced AI.',
      width: 1080,
      height: 1080,
      keywords: ['AI generator', 'Islamic reflections', 'Quran', 'personalized messages', 'Ramadan flyer creator']
    },
    shareFlyer: {
      url: 'https://www.ramadanbot.app/share.png',
      alt: 'Personalized Ramadan Flyer with Your Name Featured - 1080x1080px High Resolution Beautiful Islamic Design',
      title: 'Beautiful Personalized Ramadan Flyer Creator - Your Name Featured',
      description: 'Beautiful, high-resolution (1080x1080px) personalized Ramadan flyer featuring the user\'s name prominently in elegant Islamic design. Perfect for sharing on WhatsApp, Instagram, Facebook, and other social media. Free forever.',
      width: 1080,
      height: 1080,
      keywords: ['personalized flyer', 'Ramadan design', 'Islamic art', 'shareable content', 'your name featured', 'high resolution']
    }
  },

  // Keywords organized by category
  keywords: {
    primary: [
      'Ramadan flyer generator',
      'Islamic reflections AI',
      'personalized Ramadan flyers',
      'free Islamic app',
      'AI Islamic reflections'
    ],
    secondary: [
      'free Ramadan app',
      'Islamic design generator',
      'Hadith reflections',
      'Quran quote generator',
      'Islamic greeting cards'
    ],
    tertiary: [
      'personalized Islamic messages',
      'Ramadan companion app',
      'daily spiritual reflection',
      'Islamic community app',
      'Muslim wellness app'
    ],
    longTail: [
      'create personalized Ramadan flyers with your name free',
      'AI powered Islamic reflections app free',
      'beautiful Islamic flyers with name generator',
      'track Ramadan spiritual streak free app',
      'free Islamic messenger with personalized content'
    ],
    brand: [
      'Ramadan Bot',
      'RamadanBot',
      'Abdallah Nangere',
      'Abdalla Nangere',
      'ramadanbot.app'
    ],
    geo: [
      'Islamic app',
      'Muslim app',
      'Ramadan app global',
      'Islamic content worldwide'
    ]
  },

  // Social media optimization
  social: {
    twitter: {
      site: '@RamadanBot',
      creator: '@Abdalla_Nangere',
      card: 'summary_large_image'
    },
    tiktok: {
      handle: '@bot_ramadan',
      hashtags: [
        '#RamadanBot',
        '#IslamicReflections',
        '#PersonalizedFlyers',
        '#RamadanApp',
        '#IslamicDesign',
        '#FreeTools',
        '#AIGenerator'
      ]
    },
    instagram: {
      handle: '@ramadan_bot',
      hashtags: [
        '#RamadanBot',
        '#IslamicDesign',
        '#PersonalizedArt',
        '#RamadanContent',
        '#IslamicWisdom',
        '#FreeApp',
        '#AIArt'
      ]
    }
  },

  // Rich snippet configurations
  richSnippets: {
    faq: [
      {
        question: 'What is Ramadan Bot and how does it work?',
        answer: 'Ramadan Bot is a free AI-powered tool that generates authentic Islamic reflections personalized for you. It creates beautiful, high-resolution Ramadan flyers with your name featured, which you can instantly share on social media. The app is built by Abdallah Nangere.'
      },
      {
        question: 'How do I create personalized flyers with my name?',
        answer: 'Simply visit ramadanbot.app/app, enter your name, select a theme, and our AI generator creates a beautiful personalized flyer with your name featured (1080x1080px). No credit card required, completely free.'
      },
      {
        question: 'Is Ramadan Bot truly free with no hidden costs?',
        answer: 'Yes, completely free forever. Generate up to 3 reflections daily, unlimited personalized flyers, share anywhere, and track your spiritual streak. No premium tiers, no ads, no hidden costs.'
      },
      {
        question: 'Can I use Ramadan Bot offline?',
        answer: 'Yes! Ramadan Bot works as a Progressive Web App (PWA) that you can install on your home screen. It also comes as a native Android APK with offline support and Firebase push notifications.'
      },
      {
        question: 'How does the AI generate Islamic reflections?',
        answer: 'Our AI is trained on authentic Islamic knowledge to generate unique, meaningful Quranic-based reflections. Each reflection is personalized based on your input to ensure spiritual relevance.'
      }
    ],
    breadcrumbs: [
      { name: 'Home', url: 'https://www.ramadanbot.app' },
      { name: 'App', url: 'https://www.ramadanbot.app/app' },
      { name: 'Privacy', url: 'https://www.ramadanbot.app/privacy' },
      { name: 'Contact', url: 'https://www.ramadanbot.app/contact' }
    ]
  },

  // Analytics events
  analyticsEvents: {
    app_launch: 'Launch App',
    flyer_generated: 'Generated Flyer',
    flyer_shared: 'Shared Flyer',
    streak_updated: 'Streak Updated',
    feature_viewed: 'Feature Viewed',
    scroll_to_section: 'Scrolled to Section',
    view_faq: 'Viewed FAQ',
    sign_up: 'Sign Up',
    share_social: 'Social Share'
  },

  // Meta tag constants
  metaTags: {
    viewport: 'width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover',
    charset: 'UTF-8',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    googlebot: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    language: 'en-US',
    revisit: '7',
    refreshInterval: '30 days'
  }
};

// Helper function to get page metadata
export const getPageMetadata = (page: keyof typeof seoConfig.pages) => {
  return seoConfig.pages[page] || seoConfig.pages.home;
};

// Helper function to generate full image schema
export const getImageSchema = (imageKey: keyof typeof seoConfig.images) => {
  const image = seoConfig.images[imageKey];
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "url": image.url,
    "name": image.title,
    "description": image.description,
    "width": image.width,
    "height": image.height,
    "creator": {
      "@type": "Organization",
      "name": "Ramadan Bot",
      "url": "https://www.ramadanbot.app"
    },
    ...(image.keywords && { "keywords": image.keywords.join(', ') })
  };
};

// All keywords for reference
export const allKeywords = {
  primary: seoConfig.keywords.primary,
  secondary: seoConfig.keywords.secondary,
  tertiary: seoConfig.keywords.tertiary,
  longTail: seoConfig.keywords.longTail,
  brand: seoConfig.keywords.brand,
  combined: [
    ...seoConfig.keywords.primary,
    ...seoConfig.keywords.secondary,
    ...seoConfig.keywords.tertiary,
    ...seoConfig.keywords.brand
  ]
};

export default seoConfig;
