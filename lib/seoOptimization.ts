/**
 * SEO Optimization Module for Ramadan Bot
 * Comprehensive SEO utilities and structured data generators
 * Optimized for keywords: Ramadan, flyer, personalised, with my name, AI, free, Islamic reflections
 */

export const SEO_KEYWORDS = {
  primary: [
    'Ramadan flyer generator',
    'Islamic reflections AI',
    'personalized Ramadan flyers',
    'free Islamic app',
    'Quran generator',
    'Islamic flyer creator with your name',
    'Ramadan companion',
    'daily spiritual reflection',
    'AI Islamic content',
    'personalized Islamic messages'
  ],
  secondary: [
    'free Ramadan app',
    'Islamic design generator',
    'Hadith reflections',
    'Quran quote generator',
    'Islamic greeting cards',
    'Ramadan reminder app',
    'spiritual streak tracker',
    'Islamic community app',
    'Islamic wellness app',
    'Muslim reflection app'
  ],
  longTail: [
    'create personalized Ramadan flyers with your name free',
    'AI powered Islamic reflections app',
    'free Islamic flyer generator online',
    'Ramadan spiritual reflection app by Abdallah Nangere',
    'high resolution Ramadan flyers with name featured',
    'free Islamic reflection generator',
    'personalized Quranic messages with your name',
    'beautiful Islamic design generator',
    'track your Ramadan streak free app',
    'share Islamic wisdom with personalized flyers'
  ],
  brandKeywords: [
    'Ramadan Bot',
    'RamadanBot',
    'Abdallah Nangere',
    'Abdalla Nangere',
    'ramadanbot.app'
  ]
};

export const generateOGTags = (page: 'home' | 'app' | 'custom') => {
  const tags = {
    home: {
      title: 'Ramadan Bot — Free AI Islamic Reflections & Personalized Flyer Generator with Your Name | Abdallah Nangere',
      description: 'Generate authentic daily Islamic reflections powered by AI. Create beautiful, high-resolution personalized Ramadan flyers with your name featured. Completely free forever. Built by Abdallah Nangere.',
      image: 'https://www.ramadanbot.app/og-image-home.png',
      url: 'https://www.ramadanbot.app'
    },
    app: {
      title: 'Ramadan Bot App — Create Personalized Islamic Reflections & Flyers Free | Abdallah Nangere',
      description: 'Launch the Ramadan Bot app to generate authentic Islamic reflections with AI and create beautiful personalized flyers with your name featured. Works offline. Track your spiritual streak free.',
      image: 'https://www.ramadanbot.app/og-image-app.png',
      url: 'https://www.ramadanbot.app/app'
    },
    custom: {
      title: 'Ramadan Bot — Free AI Religious Content Creator | Personalized Flyers',
      description: 'Experience the power of AI-generated Islamic wisdom. Create and share personalized Ramadan flyers with your name. Free forever. No ads. Privacy first.',
      image: 'https://www.ramadanbot.app/og-image.png',
      url: 'https://www.ramadanbot.app'
    }
  };

  return tags[page];
};

export const generateTwitterTags = (page: 'home' | 'app' | 'custom') => {
  const tags = {
    home: {
      card: 'summary_large_image',
      title: 'Ramadan Bot — Free AI Islamic Reflections & Personalized Flyers',
      description: 'Create authentic Islamic reflections with your name featured. Generate beautiful Ramadan flyers. Completely free forever. No ads.',
      image: 'https://www.ramadanbot.app/twitter-image-home.png',
      creator: '@Abdalla_Nangere',
      site: '@RamadanBot'
    },
    app: {
      card: 'summary_large_image',
      title: 'Ramadan Bot App — Personalized Islamic Reflections & Flyers',
      description: 'Generate authentic Islamic wisdom. Create beautiful flyers with your name. Track your spiritual journey. All free.',
      image: 'https://www.ramadanbot.app/twitter-image-app.png',
      creator: '@Abdalla_Nangere',
      site: '@RamadanBot'
    },
    custom: {
      card: 'summary_large_image',
      title: 'Experience AI-Powered Islamic Reflections | Ramadan Bot',
      description: 'Free personalized Islamic content generator. Create and share beautiful Ramadan flyers instantly.',
      image: 'https://www.ramadanbot.app/twitter-image.png',
      creator: '@Abdalla_Nangere',
      site: '@RamadanBot'
    }
  };

  return tags[page];
};

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

export const generateImageSchema = (imageUrl: string, title: string, description: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "url": imageUrl,
    "name": title,
    "description": description,
    "creator": {
      "@type": "Organization",
      "name": "Ramadan Bot",
      "url": "https://www.ramadanbot.app"
    }
  };
};

export const generateArticleSchema = (article: {
  title: string;
  description: string;
  image: string;
  author: string;
  publishDate: string;
  modifyDate?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": article.image,
    "datePublished": article.publishDate,
    ...(article.modifyDate && { "dateModified": article.modifyDate }),
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ramadan Bot",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.ramadanbot.app/logo.png"
      }
    }
  };
};

export const generateVideoSchema = (video: {
  title: string;
  description: string;
  thumbnail: string;
  uploadDate: string;
  duration: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.title,
    "description": video.description,
    "thumbnailUrl": video.thumbnail,
    "uploadDate": video.uploadDate,
    "duration": video.duration
  };
};

export const optimizedMetaTags = {
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover',
  charset: 'utf-8',
  language: 'en-US',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  googlebot: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  bingbot: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
};

export const imageOptimizationGuide = {
  logo: {
    formats: ['PNG', 'WebP', 'SVG'],
    sizes: {
      small: '48x48',
      medium: '192x192',
      large: '512x512',
      xlarge: '1024x1024'
    },
    description: 'Ramadan Bot Logo - Free AI Islamic Flyer Generator with Your Name',
    altText: 'Ramadan Bot - Free personalized Islamic reflections and flyer generator powered by AI'
  },
  appScreenshots: {
    formats: ['PNG', 'WebP'],
    size: '1080x1080',
    descriptions: {
      login: 'Ramadan Bot Dashboard with Streak Tracking and User Statistics',
      generate: 'Generate AI-Powered Islamic Reflections Personalized with Your Name',
      share: 'Beautiful High-Resolution Ramadan Flyers with Your Name Featured - 1080x1080px'
    }
  },
  socialImages: {
    ogImage: {
      size: '1200x630',
      format: 'PNG or WebP',
      description: 'Ramadan Bot Open Graph Image showing the app interface and key features'
    },
    twitterImage: {
      size: '1200x675',
      format: 'PNG or WebP',
      description: 'Ramadan Bot Twitter Card Image for social media sharing'
    }
  }
};

export const seoCheckList = {
  onPage: [
    '✅ Title tag contains primary keywords and brand name',
    '✅ Meta description includes call-to-action and key features',
    '✅ H1 tag focuses on main benefit (personalized flyers with your name)',
    '✅ Alt text on all images mentions keywords: Ramadan, flyer, AI, personalized, free',
    '✅ URL structure is clean and keyword-rich',
    '✅ Internal linking strategy established',
    '✅ Mobile-friendly responsive design',
    '✅ Fast page load times (<2 seconds)',
    '✅ Structured data (Schema.org) implemented'
  ],
  technical: [
    '✅ XML sitemap created and submitted',
    '✅ Robots.txt configured correctly',
    '✅ HTTPS enabled across all pages',
    '✅ Canonical tags implemented',
    '✅ Open Graph tags populated',
    '✅ Twitter Card tags configured',
    '✅ Mobile-first indexing optimized',
    '✅ Core Web Vitals optimized',
    '✅ Image compression implemented'
  ],
  content: [
    '✅ Keywords naturally integrated throughout content',
    '✅ Long-tail keywords targeted in sections',
    '✅ Fresh content updates regular',
    '✅ User-generated content encouraged',
    '✅ FAQ section optimized for featured snippets',
    '✅ Call-to-action buttons relevant and prominent',
    '✅ Content length optimized for user intent',
    '✅ External links to authoritative sources',
    '✅ Internal linking strategy followed'
  ],
  linkBuilding: [
    '✅ Social media presence established (@RamadanBot, @Abdalla_Nangere)',
    '✅ Guest posting opportunities identified',
    '✅ Press releases prepared for major features',
    '✅ Backlink analysis and monitoring in place',
    '✅ Directory submissions (Google Business Profile)',
    '✅ Local SEO optimized',
    '✅ Mobile app store optimization (ASO) ready'
  ]
};

export const seoTipsForRamadanBot = {
  keywordOptimization: {
    title: 'Keyword Optimization Strategy',
    tips: [
      'Primary: "Ramadan flyer generator", "Islamic reflections AI", "personalized Ramadan flyers"',
      'Secondary: "free Islamic app", "AI Islamic content", "Quran generator"',
      'Long-tail: "create personalized Ramadan flyers with your name free"',
      'Brand: "Ramadan Bot", "Abdallah Nangere", "RamadanBot app"',
      'Always mention "free" and "personalized" and "with your name" in content'
    ]
  },
  contentStrategy: {
    title: 'Content Strategy for Maximum Visibility',
    tips: [
      'Create blog posts about Ramadan tips and Islamic reflections',
      'Feature customer testimonials with before/after flyer examples',
      'Publish weekly Hadith and Quranic quotes with beautiful designs',
      'Create video tutorials showing how to generate and share flyers',
      'Share user-generated content (flyers created with their names)',
      'Optimize for featured snippets with clear FAQ structure'
    ]
  },
  imageOptimization: {
    title: 'Image SEO Best Practices',
    tips: [
      'Use descriptive filenames: ramadan-flyer-with-name-generation.png',
      'Compress images without losing quality (use WebP format)',
      'Add comprehensive alt text with keywords: "Ramadan Bot personalized flyer with your name featured"',
      'Create sitemap for images at /images-sitemap.xml',
      'Add structured data markup for all product images',
      'Implement lazy loading for below-the-fold images',
      'Use responsive images with srcset attribute'
    ]
  },
  socialSignals: {
    title: 'Social Media & Community Building',
    tips: [
      'Share generated flyers on social media with hashtags: #RamadanBot #IslamicReflections',
      'Create viral-worthy content templates using the app',
      'Engage with Islamic and Ramadan communities on TikTok, Instagram, Twitter',
      'Encourage user-generated content sharing with brand hashtag',
      'Collaborate with Islamic influencers and content creators',
      'Post regular spiritual insights and beautiful designs',
      'Build community around shared values of spirituality and free content'
    ]
  }
};

export const trackingAndMonitoring = {
  googleAnalytics: [
    'Track user flow from landing page to app launch',
    'Monitor conversion metrics: flyer generations, shares, streak completions',
    'Set goals for signup, app install, and daily active users',
    'Track custom events for feature usage',
    'Monitor bounce rate and time on site'
  ],
  googleSearchConsole: [
    'Monitor search queries and impressions',
    'Track click-through rate (target: >5%)',
    'Monitor average position for target keywords',
    'Submit sitemaps and monitor indexation',
    'Fix crawl errors and warnings',
    'Monitor mobile usability'
  ],
  seoTools: [
    'Use Ahrefs/SEMrush for competitor analysis',
    'Monitor backlink profile regularly',
    'Track keyword rankings monthly',
    'Monitor Core Web Vitals in PageSpeed Insights',
    'Use Lighthouse for SEO audits',
    'Monitor social media mentions and share of voice'
  ]
};
