/**
 * Image Sitemap Generator for Ramadan Bot
 * Use this utility to generate optimized image sitemaps for Google Search
 * 
 * Usage:
 * 1. Run this script: npx ts-node lib/generateImageSitemap.ts
 * 2. Copy output to public/images-sitemap.xml
 * 3. Submit to Google Search Console
 */

export const generateImageSitemap = () => {
  const images = [
    {
      url: 'https://www.ramadanbot.app/logo.png',
      title: 'Ramadan Bot Logo - Free AI Islamic Flyer Generator',
      caption: 'Official branding for Ramadan Bot, the free AI-powered Islamic reflection and personalized Ramadan flyer generator',
      location: 'https://www.ramadanbot.app'
    },
    {
      url: 'https://www.ramadanbot.app/icon-512x512.png',
      title: 'Ramadan Bot App Icon',
      caption: '512x512 app icon for Ramadan Bot Islamic reflection generator with personality',
      location: 'https://www.ramadanbot.app'
    },
    {
      url: 'https://www.ramadanbot.app/login.png',
      title: 'Ramadan Bot Dashboard - Spiritual Streak Tracking',
      caption: 'User dashboard interface showing PIN-based login, daily spiritual streaks, and personalized Islamic reflection statistics. Free forever, no ads, completely private.',
      location: 'https://www.ramadanbot.app/app'
    },
    {
      url: 'https://www.ramadanbot.app/generate.png',
      title: 'Ramadan Bot AI Generator - Create Personalized Islamic Reflections',
      caption: 'Interface for generating AI-powered Islamic reflections personalized with your name. Select themes, add personal hints, and instantly generate Quranic-based reflections powered by advanced AI technology.',
      location: 'https://www.ramadanbot.app/app'
    },
    {
      url: 'https://www.ramadanbot.app/share.png',
      title: 'Personalized Ramadan Flyer with Your Name Featured - High Resolution',
      caption: 'Beautiful, high-resolution (1080x1080px) personalized Ramadan flyer featuring the user\'s name prominently in elegant Islamic design. Perfect for sharing on WhatsApp, Instagram, Facebook, and other social media platforms. Free forever.',
      location: 'https://www.ramadanbot.app/app'
    }
  ];

  return images;
};

export const generateSitemapXML = (): string => {
  const images = generateImageSitemap();
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
  
  <!-- Homepage with all key images -->
  <url>
    <loc>https://www.ramadanbot.app</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <mobile:mobile/>
    
    <!-- Logo Image -->
    <image:image>
      <image:loc>${images[0].url}</image:loc>
      <image:title>${images[0].title}</image:title>
      <image:caption>${images[0].caption}</image:caption>
    </image:image>
    
    <!-- App Icon Image -->
    <image:image>
      <image:loc>${images[1].url}</image:loc>
      <image:title>${images[1].title}</image:title>
      <image:caption>${images[1].caption}</image:caption>
    </image:image>
  </url>
  
  <!-- App Page with feature screenshots -->
  <url>
    <loc>https://www.ramadanbot.app/app</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <mobile:mobile/>
    
    <!-- Dashboard Screenshot -->
    <image:image>
      <image:loc>${images[2].url}</image:loc>
      <image:title>${images[2].title}</image:title>
      <image:caption>${images[2].caption}</image:caption>
    </image:image>
    
    <!-- Generator Screenshot -->
    <image:image>
      <image:loc>${images[3].url}</image:loc>
      <image:title>${images[3].title}</image:title>
      <image:caption>${images[3].caption}</image:caption>
    </image:image>
    
    <!-- Flyer Screenshot -->
    <image:image>
      <image:loc>${images[4].url}</image:loc>
      <image:title>${images[4].title}</image:title>
      <image:caption>${images[4].caption}</image:caption>
    </image:image>
  </url>
  
  <!-- Privacy Page -->
  <url>
    <loc>https://www.ramadanbot.app/privacy</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <mobile:mobile/>
  </url>
  
  <!-- Contact Page -->
  <url>
    <loc>https://www.ramadanbot.app/contact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <mobile:mobile/>
  </url>
</urlset>`;

  return xml;
};

/**
 * Generate Open Graph image metadata
 */
export const generateOGImageMetadata = () => {
  return [
    {
      property: 'og:image',
      content: 'https://www.ramadanbot.app/logo.png',
      description: 'Ramadan Bot Logo'
    },
    {
      property: 'og:image:width',
      content: '512'
    },
    {
      property: 'og:image:height',
      content: '512'
    },
    {
      property: 'og:image:type',
      content: 'image/png'
    },
    {
      property: 'og:image:alt',
      content: 'Ramadan Bot - Free AI Islamic Flyer Generator with Your Name'
    },
    {
      property: 'twitter:image',
      content: 'https://www.ramadanbot.app/logo.png'
    },
    {
      property: 'twitter:image:alt',
      content: 'Ramadan Bot - Free Personalized Islamic Reflections and Flyer Generator'
    }
  ];
};

/**
 * Image optimization checklist
 */
export const imageOptimizationChecklist = {
  logo: {
    filename: 'logo.png',
    size: '512x512px',
    formats: ['PNG', 'WebP', 'SVG'],
    bestPractices: [
      '✅ Named descriptively: logo.png (not image1.png)',
      '✅ Proper size: 512x512px minimum for app icons',
      '✅ Transparent PNG or optimized WebP',
      '✅ Alt text includes brand name and core keywords',
      '✅ Used with priority=true in Next.js Image'
    ]
  },
  screenshots: {
    filename: 'login.png, generate.png, share.png',
    size: '1080x1080px each',
    formats: ['PNG', 'WebP'],
    bestPractices: [
      '✅ Filenames describe content (not screenshot1.png)',
      '✅ Size: 1080x1080px for 1:1 aspect ratio',
      '✅ Compressed without quality loss',
      '✅ Alt texts include primary keywords',
      '✅ Used with figcaption for semantic HTML',
      '✅ WebP format available for better compression'
    ]
  }
};

/**
 * Generate image schema markup
 */
export const generateImageSchema = (title: string, description: string, url: string) => {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "url": url,
    "name": title,
    "description": description,
    "creator": {
      "@type": "Organization",
      "name": "Ramadan Bot",
      "url": "https://www.ramadanbot.app"
    },
    "author": {
      "@type": "Person",
      "name": "Abdallah Nangere"
    },
    "datePublished": new Date().toISOString().split('T')[0],
    "keywords": "Ramadan, flyer, personalized, AI, Islamic, free"
  };
};

/**
 * Image compression recommendations
 */
export const imageCompressionGuide = {
  tools: [
    {
      name: 'TinyPNG/TinyJPG',
      url: 'https://tinypng.com/',
      description: 'Smart lossy compression for PNG and JPG'
    },
    {
      name: 'Squoosh',
      url: 'https://squoosh.app/',
      description: 'Web browser tool with WebP support'
    },
    {
      name: 'ImageOptim',
      url: 'https://imageoptim.com/',
      description: 'Mac application for batch optimization'
    },
    {
      name: 'ImageMagick',
      url: 'https://imagemagick.org/',
      description: 'Command-line image manipulation'
    }
  ],
  targets: {
    logo512: {
      original: '500KB',
      optimized: '50-80KB',
      format: 'PNG + WebP'
    },
    screenshot1080: {
      original: '2-3MB',
      optimized: '200-400KB',
      format: 'PNG + WebP'
    }
  },
  commands: {
    convertToWebP: 'cwebp -q 80 input.png -o output.webp',
    compressPNG: 'pngquant --speed 1 --quality 75-85 input.png -o output.png',
    convertJPEG: 'convert input.jpg -quality 85 output.jpg'
  }
};

/**
 * Next.js Image Configuration
 */
export const nextImageConfig = {
  domains: ['www.ramadanbot.app', 'ramadanbot.app'],
  formats: ['image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60,
  dangerouslyAllowSVG: true
};

// Export for use
if (require.main === module) {
  const xml = generateSitemapXML();
  console.log(xml);
  
  // Save to file
  const fs = require('fs');
  fs.writeFileSync(
    './public/images-sitemap.xml',
    xml,
    'utf8'
  );
  console.log('✅ Image sitemap saved to public/images-sitemap.xml');
}

export default {
  generateImageSitemap,
  generateSitemapXML,
  generateOGImageMetadata,
  imageOptimizationChecklist,
  generateImageSchema,
  imageCompressionGuide,
  nextImageConfig
};
