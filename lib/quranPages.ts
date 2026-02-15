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
 * FIXED Distribution:
 * - Days 1-20: EXACTLY 4 pages per phase (20 pages/day) = 400 pages total
 * - Days 21-29: Remaining 204 pages distributed across 45 phases (~4-5 pages per phase)
 * 
 * @param day - Ramadan day (1-29)
 * @param phase - Phase within day (1-5)
 * @returns Page range start and end
 */
export function getPhasePageRange(day: number, phase: number): PageRange {
  const { TOTAL_PAGES, PHASES_PER_DAY } = QURAN_CONFIG;

  // Days 1-20: Exactly 4 pages per phase
  if (day <= 20) {
    const firstPageOfDay = (day - 1) * 20 + 1; // Day 1 starts at page 1
    const firstPageOfPhase = firstPageOfDay + (phase - 1) * 4;
    const lastPageOfPhase = firstPageOfPhase + 4 - 1;

    return {
      start: firstPageOfPhase,
      end: lastPageOfPhase,
      count: 4,
    };
  }

  // Days 21-29: Distribute 204 remaining pages across 45 phases (9 days × 5 phases)
  const pagesForDays21to29 = TOTAL_PAGES - 400; // 204 pages
  const totalPhasesIn21to29 = 9 * PHASES_PER_DAY; // 45 phases
  const basePagesPerPhase = Math.floor(pagesForDays21to29 / totalPhasesIn21to29); // 4 pages
  const extraPages = pagesForDays21to29 % totalPhasesIn21to29; // 24 extra pages

  // Calculate which phase this is in the 21-29 range
  const phaseIndexIn21to29 = (day - 21) * PHASES_PER_DAY + (phase - 1);

  // First 24 phases get 5 pages, remaining 21 phases get 4 pages
  const pagesForThisPhase = phaseIndexIn21to29 < extraPages ? basePagesPerPhase + 1 : basePagesPerPhase;

  // Calculate starting page of this phase
  let firstPageOfPhase = 400 + 1; // Start after day 20
  for (let i = 0; i < phaseIndexIn21to29; i++) {
    const pagesInPhaseI = i < extraPages ? basePagesPerPhase + 1 : basePagesPerPhase;
    firstPageOfPhase += pagesInPhaseI;
  }

  const lastPageOfPhase = Math.min(firstPageOfPhase + pagesForThisPhase - 1, TOTAL_PAGES);

  return {
    start: firstPageOfPhase,
    end: lastPageOfPhase,
    count: lastPageOfPhase - firstPageOfPhase + 1,
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
