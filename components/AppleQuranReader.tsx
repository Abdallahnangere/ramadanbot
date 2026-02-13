'use client';

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Lock,
  CheckCircle2,
  Zap,
  BookOpen,
  AlertCircle,
} from 'lucide-react';
import { User } from '../types';
import {
  getPhasePageRange,
  getPhasePageImages,
  isPhaseLockedStatus,
  calculatePhaseProgress,
  calculateOverallProgress,
  QURAN_CONFIG,
} from '../lib/quranPages';

interface AppleQuranReaderProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  completedPhases: Array<{ day: number; phase: number }>;
  onCompletePhase: (day: number, phase: number) => Promise<boolean>;
  onProgressUpdate?: () => void;
}

const AppleQuranReader: React.FC<AppleQuranReaderProps> = ({
  isOpen,
  onClose,
  user,
  completedPhases,
  onCompletePhase,
  onProgressUpdate,
}) => {
  const [currentDay, setCurrentDay] = useState(user.quran_current_day || 1);
  const [currentPhase, setCurrentPhase] = useState(user.quran_current_phase || 1);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [currentImageLoading, setCurrentImageLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [showCongrats, setShowCongrats] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load page images for current phase
  useEffect(() => {
    if (!mounted) return;
    
    const images = getPhasePageImages(currentDay, currentPhase);
    setPageImages(images);
    setCurrentPageIndex(0);
    setImageErrors(new Set());
    setCurrentImageLoading(true);
  }, [currentDay, currentPhase, mounted]);

  const phaseRange = getPhasePageRange(currentDay, currentPhase);
  const currentAbsolutePage = phaseRange.start + currentPageIndex;
  const isPhaseCompleted = completedPhases.some(
    (p) => p.day === currentDay && p.phase === currentPhase
  );
  const isPhaseLocked = isPhaseLockedStatus(
    currentDay,
    currentPhase,
    completedPhases
  );
  const phaseProgress = calculatePhaseProgress(
    currentDay,
    currentPhase,
    user.quran_total_pages_read || 0
  );
  const overallProgress = calculateOverallProgress(user.quran_total_pages_read || 0);

  const handleNextPage = () => {
    if (currentPageIndex < pageImages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      setCurrentImageLoading(true);
      setImageErrors(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.delete(pageImages[currentPageIndex + 1]);
        return newSet;
      });
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      setCurrentImageLoading(true);
      setImageErrors(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.delete(pageImages[currentPageIndex - 1]);
        return newSet;
      });
    }
  };

  const handleNextPhase = () => {
    if (currentPhase < QURAN_CONFIG.PHASES_PER_DAY) {
      setCurrentPhase(currentPhase + 1);
    } else if (currentDay < QURAN_CONFIG.RAMADAN_DAYS) {
      setCurrentDay(currentDay + 1);
      setCurrentPhase(1);
    }
  };

  const handlePrevPhase = () => {
    if (currentPhase > 1) {
      setCurrentPhase(currentPhase - 1);
    } else if (currentDay > 1) {
      setCurrentDay(currentDay - 1);
      setCurrentPhase(QURAN_CONFIG.PHASES_PER_DAY);
    }
  };

  const handleCompletePhase = async () => {
    setIsSubmitting(true);
    try {
      const success = await onCompletePhase(currentDay, currentPhase);
      if (success) {
        setShowCongrats(true);
        setTimeout(() => {
          setShowCongrats(false);
          if (currentPhase < QURAN_CONFIG.PHASES_PER_DAY) {
            setCurrentPhase(currentPhase + 1);
          } else if (currentDay < QURAN_CONFIG.RAMADAN_DAYS) {
            setCurrentDay(currentDay + 1);
            setCurrentPhase(1);
          }
          onProgressUpdate?.();
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to complete phase:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageLoad = () => {
    setCurrentImageLoading(false);
  };

  const handleImageError = (imageUrl: string) => {
    console.error('Failed to load image:', imageUrl);
    const newErrorSet = new Set(Array.from(imageErrors));
    newErrorSet.add(imageUrl);
    setImageErrors(newErrorSet);
    setCurrentImageLoading(false);
  };

  if (!isOpen || !mounted) return null;

  const currentImageUrl = pageImages[currentPageIndex];

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-black overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
              Quran - Day {currentDay} Phase {currentPhase}
            </h2>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Page {currentAbsolutePage} of {QURAN_CONFIG.TOTAL_PAGES}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/40 dark:hover:bg-black/40 rounded-full transition-colors flex-shrink-0"
        >
          <X className="w-5 h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="flex-shrink-0 bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
            Ramadan Progress
          </span>
          <span className="text-xs md:text-sm font-bold text-indigo-600 dark:text-indigo-400">
            {overallProgress}% Complete
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Main Quran Page Display */}
      <div className="flex-1 overflow-hidden flex flex-col bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950 dark:to-black relative">
        {isPhaseLocked ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-30">
            <div className="text-center">
              <Lock className="w-12 h-12 md:w-16 md:h-16 text-white mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                Phase Locked
              </h3>
              <p className="text-sm md:text-base text-gray-200 max-w-xs mx-auto">
                Complete the previous phase to unlock this one
              </p>
            </div>
          </div>
        ) : null}

        {/* Image Container - Mushaf Style */}
        <div className="flex-1 flex items-center justify-center p-3 md:p-6 overflow-auto">
          {currentImageUrl ? (
            <div className="relative w-full h-full flex items-center justify-center">
              {currentImageLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm z-20">
                  <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin" />
                  <p className="mt-4 text-sm md:text-base text-gray-600 dark:text-gray-400">
                    Loading page {currentAbsolutePage}...
                  </p>
                </div>
              )}

              {imageErrors.has(currentImageUrl) ? (
                <div className="flex flex-col items-center justify-center gap-3 p-8">
                  <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500" />
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                    Failed to load page {currentAbsolutePage}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Check your internet connection and try again
                  </p>
                </div>
              ) : (
                <img
                  key={currentImageUrl}
                  src={currentImageUrl}
                  alt={`Quran Page ${currentAbsolutePage}`}
                  onLoad={handleImageLoad}
                  onError={() => handleImageError(currentImageUrl)}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  draggable={false}
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 p-8">
              <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-yellow-500" />
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                No pages available for this phase
              </p>
            </div>
          )}
        </div>

        {/* Page Thumbnails - Scrollable */}
        <div className="flex-shrink-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 px-3 md:px-4 py-2 md:py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max md:flex-wrap md:min-w-0">
            {pageImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentPageIndex(idx);
                  setCurrentImageLoading(true);
                  const newErrorSet = new Set(Array.from(imageErrors));
                  newErrorSet.delete(pageImages[idx]);
                  setImageErrors(newErrorSet);
                }}
                className={`flex-shrink-0 h-10 md:h-12 px-3 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                  idx === currentPageIndex
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                Pg {phaseRange.start + idx}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex-shrink-0 bg-white dark:bg-slate-950 border-t border-gray-200 dark:border-slate-700 px-4 py-3 md:px-6 md:py-4">
        {showCongrats && (
          <div className="mb-3 p-3 md:p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-300 dark:border-green-700 rounded-lg md:rounded-xl">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              <span className="text-sm md:text-base font-medium">Phase {currentPhase} completed! 🎉</span>
            </div>
          </div>
        )}

        {/* Phase Progress */}
        <div className="mb-3 md:mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-300">
              Phase Progress
            </span>
            <span className="text-xs md:text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {currentPageIndex + 1} of {pageImages.length} pages
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full transition-all duration-300"
              style={{
                width: `${pageImages.length ? ((currentPageIndex + 1) / pageImages.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Navigation and Actions */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 mb-3 md:mb-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPageIndex === 0 || isPhaseLocked}
            className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 font-medium transition-colors flex items-center justify-center gap-1"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline text-xs md:text-sm">Prev</span>
          </button>

          <button
            onClick={handleCompletePhase}
            disabled={isPhaseCompleted || isPhaseLocked || isSubmitting}
            className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold transition-all shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2 text-xs md:text-sm"
          >
            <Zap className="w-4 h-4 md:w-5 md:h-5" />
            {isSubmitting
              ? 'Completing...'
              : isPhaseCompleted
              ? '✓ Complete'
              : 'Complete'}
          </button>

          <button
            onClick={handleNextPage}
            disabled={currentPageIndex === pageImages.length - 1 || isPhaseLocked}
            className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 font-medium transition-colors flex items-center justify-center gap-1"
          >
            <span className="hidden sm:inline text-xs md:text-sm">Next</span>
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Phase Navigation */}
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          <button
            onClick={handlePrevPhase}
            disabled={currentDay === 1 && currentPhase === 1}
            className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 font-medium transition-colors flex items-center justify-center gap-1 text-xs md:text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Phase</span>
          </button>

          <div className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-semibold flex items-center justify-center text-xs md:text-sm">
            Day {currentDay}/{QURAN_CONFIG.RAMADAN_DAYS}
          </div>

          <button
            onClick={handleNextPhase}
            disabled={
              currentDay === QURAN_CONFIG.RAMADAN_DAYS &&
              currentPhase === QURAN_CONFIG.PHASES_PER_DAY
            }
            className="px-3 md:px-4 py-2 md:py-3 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 font-medium transition-colors flex items-center justify-center gap-1 text-xs md:text-sm"
          >
            <span>Phase</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppleQuranReader;
