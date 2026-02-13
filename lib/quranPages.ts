/**
 * Quran Page System
 * Total Pages: 604 (standard Quran mushaf)
 * Total Days: 30 (Ramadan)
 * Pages per Day: ~20
 * Phases per Day: 5
 * Pages per Phase: ~4
 */

export const QURAN_CONFIG = {
  TOTAL_PAGES: 604,
  RAMADAN_DAYS: 30,
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
 * @param day - Ramadan day (1-30)
 * @param phase - Phase within day (1-5)
 * @returns Page range start and end
 */
export function getPhasePageRange(day: number, phase: number): PageRange {
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
 * Get page image URL from our API endpoint
 * @param pageNumber - Page number (1-604)
 * @returns Image URL
 */
export function getPageImageUrl(pageNumber: number): string {
  // Using our own API endpoint that proxies and handles fallbacks
  // Format: /api/quran/page?page=1
  return `/api/quran/page?page=${pageNumber}`;
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
