import { NextRequest, NextResponse } from 'next/server';

// Multiple sources for Quran page images with fallbacks
const QURAN_IMAGE_SOURCES = [
  // Primary: QuranAPI endpoints
  (page: string) => `https://qurancdn-images.s3.amazonaws.com/pages/${String(page).padStart(3, '0')}.png`,
  (page: string) => `https://cdn.qurancdn.com/images/pages/page${String(page).padStart(3, '0')}.png`,
  (page: string) => `https://images.quran.pages/page/${page}.png`,
  
  // Secondary: GitHub hosted alternatives with raw CDN
  (page: string) => `https://raw.githubusercontent.com/quran/quran-images/master/pages/${page}/1.png`,
  (page: string) => `https://cdn.jsdelivr.net/gh/quran/quran-images@master/pages/${page}.png`,
  
  // Fallback: Direct URLs
  (page: string) => `https://quran.pages.dev/page${String(page).padStart(3, '0')}.png`,
  (page: string) => `https://pages.quran.world/${page}.png`,
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');

    if (!page || !page.match(/^\d+$/)) {
      return NextResponse.json(
        { error: 'Valid page number required (1-604)' },
        { status: 400 }
      );
    }

    const pageNum = parseInt(page, 10);
    if (pageNum < 1 || pageNum > 604) {
      return NextResponse.json(
        { error: 'Page number must be between 1 and 604' },
        { status: 400 }
      );
    }

    // Try each image source with a timeout
    for (let i = 0; i < QURAN_IMAGE_SOURCES.length; i++) {
      try {
        const sourceFunc = QURAN_IMAGE_SOURCES[i];
        const imageUrl = sourceFunc(page);
        
        // Set a timeout for the fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(imageUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; RamadanBot/1.0)',
            'Referer': 'https://ramadanbot.app/',
            'Accept': 'image/*',
          },
          signal: controller.signal,
          redirect: 'follow',
          next: { revalidate: 86400 }, // Cache for 24 hours
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const contentType = response.headers.get('content-type') || 'image/png';
          if (contentType.includes('image') || imageUrl.startsWith('data:')) {
            const imageBuffer = await response.arrayBuffer();
            
            return new NextResponse(imageBuffer, {
              headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, must-revalidate',
                'Access-Control-Allow-Origin': '*',
                'X-Content-Type-Options': 'nosniff',
              },
            });
          }
        }
      } catch (error) {
        // Continue to next source
        if (error instanceof Error) {
          console.log(`Image source ${i} failed for page ${page}:`, error.message);
        }
        continue;
      }
    }

    // All sources failed - return a simple SVG placeholder
    const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
      <rect fill="#f9fafb" width="400" height="600"/>
      <rect fill="#e5e7eb" x="10" y="10" width="380" height="580" rx="8"/>
      <text x="200" y="200" font-size="20" fill="#6b7280" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold">Quran Page ${pageNum}</text>
      <text x="200" y="240" font-size="14" fill="#9ca3af" text-anchor="middle" font-family="Arial, sans-serif">Loading image...</text>
      <text x="200" y="280" font-size="12" fill="#d1d5db" text-anchor="middle" font-family="Arial, sans-serif">Check connection</text>
    </svg>`;

    return new NextResponse(placeholderSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error in Quran page API:', error);
    
    // Even on error, return a valid image response
    const errorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
      <rect fill="#fef2f2" width="400" height="600"/>
      <rect fill="#fee2e2" x="10" y="10" width="380" height="580" rx="8"/>
      <text x="200" y="250" font-size="18" fill="#991b1b" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold">Unable to Load</text>
      <text x="200" y="290" font-size="12" fill="#b91c1c" text-anchor="middle" font-family="Arial, sans-serif">Please refresh or try again</text>
    </svg>`;
    
    return new NextResponse(errorSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

/**
 * Options handler for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
