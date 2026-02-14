/**
 * Quran Page System - Production Distribution
 * Total Pages: 604 (standard Quran mushaf)
 * Total Days: 29 (Ramadan, starting from day 1 of Ramadan)
 * 
 * Distribution:
 * - Days 1-20: 4 pages per phase (20 pages/day) = 400 pages
 * - Days 21-29: ~22-23 pages/day × 9 days = 204 pages
 * 
 * Phases per Day: 5 (aligned with 5 daily prayers)
 */

export const QURAN_CONFIG = {
  TOTAL_PAGES: 604,
  RAMADAN_DAYS: 29,
  PHASES_PER_DAY: 5,
} as const;

export interface PageRange {
  start: number; // inclusive
  end: number; // inclusive
  count: number;
}

export interface DayPhaseInfo {
  day: number;
  phase: number;
  pages: PageRange;
  totalPhasesInDay: number;
  isLocked: boolean;
  isCompleted: boolean;
  progress: number; // 0-100
}

/**
 * Calculate page range for a specific day and phase
 * Days 1-20: 4 pages per phase (20 pages/day)
 * Days 21-29: approximately 4.5 pages per phase (~22-23 pages/day)
 * @param day - Ramadan day (1-29)
 * @param phase - Phase within day (1-5)
 * @returns Page range start and end
 */
export function getPhasePageRange(day: number, phase: number): PageRange {
  const { TOTAL_PAGES, PHASES_PER_DAY } = QURAN_CONFIG;

  let pagesPerDay: number;
  let firstPageOfDay: number;

  // Days 1-20: 20 pages/day (4 per phase)
  if (day <= 20) {
    pagesPerDay = 20;
    firstPageOfDay = (day - 1) * 20 + 1;
  } else {
    // Days 21-29: distribute remaining pages (604 - 400 = 204 pages for 9 days)
    const remainingPages = TOTAL_PAGES - 400; // 204 pages
    pagesPerDay = Math.ceil(remainingPages / 9); // ~22-23 pages per day
    firstPageOfDay = 400 + (day - 21) * pagesPerDay + 1;
  }

  const pagesPerPhase = Math.ceil(pagesPerDay / PHASES_PER_DAY);
  const firstPageOfPhase = firstPageOfDay + (phase - 1) * pagesPerPhase;
  const lastPageOfPhase = Math.min(firstPageOfPhase + pagesPerPhase - 1, TOTAL_PAGES);

  return {
    start: Math.max(1, firstPageOfPhase),
    end: Math.min(lastPageOfPhase, TOTAL_PAGES),
    count: Math.min(lastPageOfPhase, TOTAL_PAGES) - Math.max(1, firstPageOfPhase) + 1,
  };
}

/**
 * Get page image URL from local .ai files
 * @param pageNumber - Page number (1-604)
 * @returns Direct path to local file in public folder
 */
export function getPageImageUrl(pageNumber: number): string {
  // Files stored as: public/001___Hafs39__DM.ai through public/604___Hafs39__DM.ai
  // Serve directly as static assets from public folder
  const paddedPage = String(pageNumber).padStart(3, '0');
  return `/${paddedPage}___Hafs39__DM.ai`;
}

/**
 * Get all page images for a phase
 */
export function getPhasePageImages(day: number, phase: number): string[] {
  const { start, end } = getPhasePageRange(day, phase);
  const images: string[] = [];

  for (let page = start; page <= end; page++) {
    images.push(getPageImageUrl(page));
  }

  return images;
}

/**
 * Determine if a specific day/phase is locked based on completion history
 */
export function isPhaseLockedStatus(
  day: number,
  phase: number,
  completedPhases: Array<{ day: number; phase: number }>
): boolean {
  // Day 1, Phase 1 is always unlocked
  if (day === 1 && phase === 1) return false;

  // Check if previous phase in same day is completed
  if (phase > 1) {
    const prevPhaseCompleted = completedPhases.some(
      (p) => p.day === day && p.phase === phase - 1
    );
    if (!prevPhaseCompleted) return true;
  }

  // Check if all phases of previous day are completed
  if (day > 1) {
    const { PHASES_PER_DAY } = QURAN_CONFIG;
    const allPrevDayCompleted = Array.from({ length: PHASES_PER_DAY }, (_, i) =>
      completedPhases.some((p) => p.day === day - 1 && p.phase === i + 1)
    ).every(Boolean);
    if (!allPrevDayCompleted) return true;
  }

  return false;
}

/**
 * Calculate progress for a phase
 */
export function calculatePhaseProgress(
  day: number,
  phase: number,
  totalPagesRead: number
): number {
  const { start, end, count } = getPhasePageRange(day, phase);

  // Count how many pages from this phase have been read
  const pagesReadInPhase = Math.max(
    0,
    Math.min(totalPagesRead, end) - start + 1
  );

  return Math.round((pagesReadInPhase / count) * 100);
}

/**
 * Get overall Ramadan progress
 */
export function calculateOverallProgress(totalPagesRead: number): number {
  const { TOTAL_PAGES } = QURAN_CONFIG;
  return Math.round((totalPagesRead / TOTAL_PAGES) * 100);
}

/**
 * Get current reading position details
 */
export function getCurrentPosition(totalPagesRead: number) {
  const { RAMADAN_DAYS, PHASES_PER_DAY } = QURAN_CONFIG;

  // Find which day we're on
  let currentPage = totalPagesRead + 1;
  let currentDay = 1;
  let currentPhase = 1;

  for (let d = 1; d <= RAMADAN_DAYS; d++) {
    for (let p = 1; p <= PHASES_PER_DAY; p++) {
      const { start, end } = getPhasePageRange(d, p);
      if (currentPage >= start && currentPage <= end) {
        currentDay = d;
        currentPhase = p;
        break;
      }
    }
  }

  return { currentDay, currentPhase, currentPage };
}

/**
 * Validate day and phase numbers
 */
export function validateDayPhase(day: number, phase: number): boolean {
  const { RAMADAN_DAYS, PHASES_PER_DAY } = QURAN_CONFIG;
  return day >= 1 && day <= RAMADAN_DAYS && phase >= 1 && phase <= PHASES_PER_DAY;
}
