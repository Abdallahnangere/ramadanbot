/**
 * SEO Metadata Generator for Ramadan Bot
 * Use these metadata objects in your pages for optimal search engine visibility
 */

export const pageMetadata = {
  home: {
    title: "Ramadan Bot — Free AI Islamic Reflections & Personalized Flyers by Abdallah Nangere",
    description: "Generate authentic daily Islamic reflections powered by AI. Create beautiful high-resolution Ramadan flyers with your name featured. Track your spiritual streak. Completely free. Built by Abdallah Nangere.",
    keywords: "Ramadan, Islamic reflections, AI generator, personalized flyers, free app, Quran, Hadith, Islamic design, flyer creator, with your name, Abdallah Nangere",
    canonical: "https://www.ramadanbot.app",
    ogTitle: "Ramadan Bot — Free AI Islamic Reflections & Personalized Flyers",
    ogDescription: "Create authentic Islamic reflections and beautiful personalized Ramadan flyers with your name featured. Completely free. Powered by AI.",
    ogImage: "https://www.ramadanbot.app/logo.png",
    twitterCard: "summary_large_image",
    twitterTitle: "Ramadan Bot — Free AI Reflections for Modern Muslims",
    twitterDescription: "Generate authentic Islamic reflections and personalized flyers with your name. Free forever. No ads. Built by Abdallah Nangere.",
    twitterCreator: "@Abdalla_Nangere",
    viewport: "width=device-width, initial-scale=1",
    mobileAlternate: "https://m.ramadanbot.app",
    languageAlternates: [
      { lang: "en-US", href: "https://www.ramadanbot.app" },
      { lang: "ar-SA", href: "https://ar.ramadanbot.app" }
    ]
  },
  app: {
    title: "Ramadan Bot App — Create Islamic Reflections & Personalized Flyers Free",
    description: "Launch the Ramadan Bot app to generate authentic Islamic reflections with AI and create beautiful personalized flyers with your name featured. Works offline. Track your spiritual streak.",
    keywords: "Ramadan app, Islamic reflection generator, personalized flyer app, free Islamic app, Ramadan companion, spiritual streak tracker",
    canonical: "https://www.ramadanbot.app/app",
    ogTitle: "Ramadan Bot App — Your Spiritual Companion",
    ogDescription: "Create personalized Islamic reflections and beautiful Ramadan flyers. Track your spiritual journey.",
    ogImage: "https://www.ramadanbot.app/generate.png"
  },
  privacy: {
    title: "Privacy Policy — Ramadan Bot | Free Islamic Reflection Generator by Abdallah Nangere",
    description: "Ramadan Bot privacy policy. Your data is safe and private. We never share your information or track you.",
    keywords: "privacy, security, Islamic app, data protection, Ramadan Bot",
    canonical: "https://www.ramadanbot.app/privacy",
    ogTitle: "Privacy Policy — Ramadan Bot",
    ogDescription: "Learn how Ramadan Bot protects your privacy. We never share your data."
  },
  contact: {
    title: "Contact Ramadan Bot — Support & Feedback | Abdallah Nangere",
    description: "Get in touch with Ramadan Bot. Send us feedback, report bugs, or ask questions about the free AI Islamic reflection generator.",
    keywords: "contact, support, feedback, Ramadan Bot help, Islamic app support",
    canonical: "https://www.ramadanbot.app/contact",
    ogTitle: "Contact Ramadan Bot",
    ogDescription: "Reach out to us for support, feedback, or questions about Ramadan Bot."
  },
  admin: {
    title: "Admin Dashboard — Ramadan Bot | Manage Reflections & Analytics",
    description: "Admin dashboard for Ramadan Bot management, analytics, and reflection curation.",
    keywords: "admin, dashboard, analytics, Ramadan Bot management",
    canonical: "https://www.ramadanbot.app/admin",
    noindex: true // Prevent search engine indexing of admin pages
  }
};

export const breadcrumbs = {
  home: {
    url: "https://www.ramadanbot.app",
    label: "Home"
  },
  app: {
    url: "https://www.ramadanbot.app/app",
    label: "App"
  },
  privacy: {
    url: "https://www.ramadanbot.app/privacy",
    label: "Privacy Policy"
  },
  contact: {
    url: "https://www.ramadanbot.app/contact",
    label: "Contact"
  }
};

export const socialLinks = {
  twitter: "https://x.com/Abdalla_Nangere",
  tiktok: "https://www.tiktok.com/@bot_ramadan",
  instagram: "https://www.instagram.com/bot_ramadan",
  contact: "support@ramadanbot.app"
};

export const seoKeywords = {
  primary: [
    "Ramadan flyer generator",
    "Islamic reflection generator",
    "personalized Islamic flyers",
    "free AI Islamic app",
    "Ramadan companion"
  ],
  secondary: [
    "Quranic reflection",
    "Islamic greeting cards",
    "free Ramadan tool",
    "spiritual streak tracker",
    "Islamic design generator",
    "Hadith quotes",
    "Islamic wisdom app",
    "Muslim wellness",
    "faith building"
  ],
  long_tail: [
    "free personalized Ramadan flyers with your name",
    "AI powered Islamic reflection generator",
    "create beautiful Islamic flyers free online",
    "Ramadan spiritual companion app",
    "track your Ramadan streak online",
    "Islamic flyer maker with name",
    "authentic Quranic quotes generator",
    "free Islamic content creator"
  ],
  creator_keywords: [
    "Abdallah Nangere",
    "Ramadan Bot creator",
    "Islamic tech developer"
  ]
};

// Image Alt Text Optimization
export const imageAltTexts = {
  logo: "Ramadan Bot Logo - Free AI Islamic Reflection Generator",
  generate: "Screenshot of Ramadan Bot app showing AI-powered Islamic reflection generation with personalized options",
  login: "Dashboard showing Ramadan spiritual streak tracking and user progress in Ramadan Bot",
  share: "Personalized Ramadan flyer example with user's name featured in beautiful Islamic design",
  logo512: "Ramadan Bot Application Icon - 512x512px, perfect for Android and PWA installation"
};

// Rich Snippets and Schema Data
export const richSnippets = {
  aggregateRating: {
    ratingValue: "4.9",
    ratingCount: "1250",
    bestRating: "5",
    worstRating: "1"
  },
  availability: "InStock",
  priceCurrency: "USD",
  price: "0",
  countryOfOrigin: "Global",
  releaseDate: "2024-03-01"
};

// Performance & Core Web Vitals Optimization Tips
export const performanceOptimization = {
  imageOptimization: [
    "Logo: Compress to < 50KB",
    "Screenshots: Lazy load, use WebP format",
    "Use responsive images with srcset",
    "CDN delivery for all images"
  ],
  coreWebVitals: {
    LCP: "< 1.2s (Largest Contentful Paint)",
    FID: "< 100ms (First Input Delay)",
    CLS: "< 0.05 (Cumulative Layout Shift)"
  },
  recommendations: [
    "Minify CSS and JavaScript",
    "Enable GZIP compression",
    "Implement browser caching",
    "Use Content Delivery Network (CDN)",
    "Optimize font loading",
    "Defer non-critical JavaScript"
  ]
};
