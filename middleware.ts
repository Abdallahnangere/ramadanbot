import { NextRequest, NextResponse } from 'next/server';
import type { NextFetchEvent } from 'next/server';

/**
 * Middleware for optimizing Quran .ai file delivery
 * - Add compression headers
 * - Set aggressive caching (30 days, immutable)
 * - Enable CDN optimization
 * - Add security headers
 */

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const pathname = request.nextUrl.pathname;

  // Check if request is for a Quran page file (001-604)
  const quranFileMatch = pathname.match(/^\/(\d{3})___Hafs39__DM\.ai$/);
  
  if (quranFileMatch) {
    const pageNumber = parseInt(quranFileMatch[1], 10);

    // Validate page number is within valid range
    if (pageNumber >= 1 && pageNumber <= 604) {
      // Create response with optimized headers
      const response = NextResponse.next({
        request,
      });

      // Add compression headers
      response.headers.set('Content-Encoding', 'gzip, deflate, br');
      response.headers.set('Content-Type', 'application/postscript');

      // Set aggressive caching (30 days, immutable - files never change)
      response.headers.set(
        'Cache-Control',
        'public, max-age=2592000, immutable, stale-while-revalidate=2592000'
      );

      // Add CDN optimization headers
      response.headers.set('CDN-Cache-Control', 'max-age=2592000');

      // Add security headers
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');

      // Enable CORS for cross-origin requests
      response.headers.set('Access-Control-Allow-Origin', '*');

      // Add performance headers
      response.headers.set('X-Accel-Buffering', 'yes');

      return response;
    }
  }

  return NextResponse.next({
    request,
  });
}

export const config = {
  matcher: [
    // Match Quran page files only
    '/((?!_next|admin|api|contact|privacy|app|sitemap|robots|manifest|login|generate|snap|whatsapp|share|icon).*\\.ai$)',
  ],
};
