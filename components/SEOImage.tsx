/**
 * Image SEO Component
 * Provides SEO-optimized images with structured data and rich snippets
 * Specifically optimized for Ramadan Bot app screenshots and product images
 */

'use client';

import Image from 'next/image';
import { FC, useState } from 'react';

interface SEOImageProps {
  src: string;
  alt: string;
  title: string;
  description: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * SEO-Optimized Image Component with Rich Snippets
 * Automatically adds structured data markup for search engines
 */
export const SEOImage: FC<SEOImageProps> = ({
  src,
  alt,
  title,
  description,
  width = 600,
  height = 600,
  priority = false,
  className = '',
  onClick
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate Image schema for structured data
  const imageSchema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "url": src,
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
    "datePublished": new Date().toISOString().split('T')[0]
  };

  return (
    <>
      {/* Structured Data Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageSchema) }}
      />

      {/* SEO-Optimized Image */}
      <figure className={`relative ${className}`}>
        <Image
          src={src}
          alt={alt}
          title={title}
          width={width}
          height={height}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          onClick={onClick}
          onLoadingComplete={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Figcaption for SEO */}
        <figcaption className="text-sm text-slate-600 mt-2 text-center">
          {description}
        </figcaption>
      </figure>
    </>
  );
};

/**
 * Product Gallery with SEO optimization
 * Displays multiple images with rich snippet support
 */
export const SEOProductGallery: FC<{
  images: Array<{ url: string; title: string; alt: string; description: string }>;
  productName: string;
}> = ({ images, productName }) => {
  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": productName,
    "associatedMedia": images.map(img => ({
      "@type": "ImageObject",
      "url": img.url,
      "name": img.title,
      "description": img.alt
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }}
      />
      <div className="space-y-6">
        {images.map((image, idx) => (
          <SEOImage
            key={idx}
            src={image.url}
            alt={image.alt}
            title={image.title}
            description={image.description}
            priority={idx === 0}
          />
        ))}
      </div>
    </>
  );
};

/**
 * Optimized screenshot component for app showcase
 */
export const AppScreenshot: FC<{
  screenshotPath: string;
  title: string;
  alt: string;
  description: string;
  featureList?: string[];
}> = ({ screenshotPath, title, alt, description, featureList = [] }) => {
  const screenshotSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": title,
    "description": description,
    "screenshot": {
      "@type": "ImageObject",
      "url": screenshotPath,
      "name": alt
    },
    "applicationCategory": "LifestyleApplication",
    "url": "https://www.ramadanbot.app/app",
    "creator": {
      "@type": "Person",
      "name": "Abdallah Nangere"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(screenshotSchema) }}
      />

      <div className="flex flex-col items-center space-y-4">
        <figure className="w-full">
          <Image
            src={screenshotPath}
            alt={alt}
            title={title}
            width={600}
            height={600}
            loading="lazy"
            className="rounded-lg shadow-lg"
          />
          <figcaption className="text-center mt-4">
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-sm text-slate-600">{description}</p>
          </figcaption>
        </figure>

        {featureList.length > 0 && (
          <ul className="space-y-2 text-sm text-slate-600">
            {featureList.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default SEOImage;
