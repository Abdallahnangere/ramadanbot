/**
 * Quran Pages Manager - Handles local .ai files from public folder
 * 
 * Files: 604 x Adobe Illustrator files (.ai)
 * Location: /public/001___Hafs39__DM.ai through /public/604___Hafs39__DM.ai
 * Size: ~748MB total (1-1.4MB per file)
 * Format: Adobe Illustrator (Hafs reading, page 39 style)
 * 
 * Strategy:
 * 1. Serve .ai files directly as static assets
 * 2. Use compression middleware for efficient delivery
 * 3. Implement aggressive caching (24h+)
 * 4. Lazy load pages per request
 */

import { QURAN_CONFIG } from './quranPages';

/**
 * Generate URL for a specific Quran page
 * Files are stored in public folder as: NNN___Hafs39__DM.ai
 * 
 * @param pageNumber - Page number 1-604
 * @returns URL path to serve the file
 */
export function getLocalPageUrl(pageNumber: number): string {
  // Ensure page number is zero-padded to 3 digits
  const paddedPage = String(pageNumber).padStart(3, '0');
  
  // Direct reference to public file
  // Next.js automatically serves public folder as static assets
  return `/${paddedPage}___Hafs39__DM.ai`;
}

/**
 * Get all page URLs for a day/phase combination
 */
export function getLocalPhasePageUrls(day: number, phase: number): string[] {
  const { start, end } = getPhasePageRange(day, phase);
  const urls: string[] = [];
  
  for (let page = start; page <= end; page++) {
    urls.push(getLocalPageUrl(page));
  }
  
  return urls;
}

/**
 * Calculate which pages are in a phase
 * @param day - Day number (1-30)
 * @param phase - Phase number (1-5)
 * @returns Object with start and end page numbers
 */
function getPhasePageRange(day: number, phase: number) {
  const { TOTAL_PAGES, RAMADAN_DAYS, PHASES_PER_DAY } = QURAN_CONFIG;

  // Calculate pages per day (distribute 604 pages across 30 days)
  const pagesPerDay = Math.ceil(TOTAL_PAGES / RAMADAN_DAYS); // 21 pages per day
  const pagesPerPhase = Math.ceil(pagesPerDay / PHASES_PER_DAY); // 5 pages per phase

  // Calculate completed days and phases
  const completedDays = (day - 1) * pagesPerDay;
  const completedPhasesInDay = (phase - 1) * pagesPerPhase;

  const startPage = completedDays + completedPhasesInDay + 1;
  const endPage = Math.min(startPage + pagesPerPhase - 1, TOTAL_PAGES);

  return {
    start: startPage,
    end: endPage,
    count: endPage - startPage + 1,
  };
}

/**
 * Validate that a page file exists
 * @param pageNumber - Page number to validate
 * @returns true if page is valid (1-604)
 */
export function isValidPageNumber(pageNumber: number): boolean {
  return pageNumber >= 1 && pageNumber <= QURAN_CONFIG.TOTAL_PAGES;
}

/**
 * Get page metadata
 */
export interface PageMetadata {
  pageNumber: number;
  fileName: string;
  url: string;
  isValid: boolean;
}

export function getPageMetadata(pageNumber: number): PageMetadata {
  const isValid = isValidPageNumber(pageNumber);
  const fileName = `${String(pageNumber).padStart(3, '0')}___Hafs39__DM.ai`;
  
  return {
    pageNumber,
    fileName,
    url: isValid ? getLocalPageUrl(pageNumber) : '',
    isValid,
  };
}

/**
 * Get batch metadata for multiple pages
 */
export function getPagesBatchMetadata(startPage: number, endPage: number): PageMetadata[] {
  const pages: PageMetadata[] = [];
  
  for (let page = startPage; page <= endPage; page++) {
    if (isValidPageNumber(page)) {
      pages.push(getPageMetadata(page));
    }
  }
  
  return pages;
}
